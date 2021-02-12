import { useEffect, useState } from 'react';
import {
    Container,
    Header,
    Button,
    Form,
    Image,
    Icon,
    Select,
} from 'semantic-ui-react';
import {
    PropTypes,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import _replace from 'lodash/replace';
import _every from 'lodash/every';
import _find from 'lodash/find';
import { useSelector, useDispatch } from 'react-redux';

import { withTranslation } from '../../../i18n';
import { createGivingGroupBreadCrum, CreateGivingGroupFlowSteps, generateBreadCrum, intializeCreateGivingGroup, ValidateCreateGivingGroup } from '../../../helpers/createGrouputils';
import { Router } from '../../../routes';
import '../../../static/less/create_manage_group.less';
import ModalContent from '../../Give/Tools/modalContent';
import ChimpDatePicker from '../../shared/DatePicker';
import { formatAmount, formatCurrency } from '../../../helpers/give/utils';
import { validateGivingGoal } from '../../../helpers/users/utils';
import groupImg from '../../../static/images/no-data-avatar-giving-group-profile.png';
import { actionTypes, createGivingGroupApiCall, getCharityBasedOnSearchQuery, updateCreateGivingGroupObj } from '../../../actions/createGivingGroup';
import { isFalsy } from '../../../helpers/utils';

const currentActiveStepCompleted = [1, 2, 3, 4];
const intializeValidity = {
    doesAmountExist: true,
    isAmountLessThanOneBillion: true,
    isAmountMoreThanOneDollor: true,
    isValidPositiveNumber: true,
    isValidGiveAmount: true,
    isEndDateGreaterThanStartDate: true,
};
let timeout = ''
const CreateGivingGroupGivingGoal = ({ createGivingGroupStoreFlowObject, t }) => {
    const initalizeObject = _isEmpty(createGivingGroupStoreFlowObject) ? intializeCreateGivingGroup : createGivingGroupStoreFlowObject;
    const [createGivingGroupObject, setCreateGivingGroupObject] = useState(initalizeObject);
    const formatMessage = t;
    const breakCrumArray = createGivingGroupBreadCrum(formatMessage);
    const [validity, setValidity] = useState(intializeValidity);
    const dispatch = useDispatch();

    const [charitySearchQuery, setCharitySearchQuery] = useState('');
    const charitiesQueryBasedOptions = useSelector(state => state.createGivingGroup.charitiesQueryBasedOptions || []);
    const charitiesSearchQueryBasedLoader = useSelector(state => state.createGivingGroup.charitiesSearchQueryBasedLoader || null);
    const [showCharityDropdown, setShowCharityDropdown] = useState(false);
    const [disableContinueButton, setDisableContinueButton] = useState(false);
    useEffect(() => {
        return () => {
            !Object.values(CreateGivingGroupFlowSteps).includes(Router.router.asPath) &&
                dispatch(updateCreateGivingGroupObj(intializeCreateGivingGroup));
        }
    }, [])
    let {
        attributes: {
            fundraisingGoal,
            fundraisingDate,
            fundraisingCreated,
            name,
            short,
        },
        beneficiaryIds,
        beneficiaryItems,
    } = createGivingGroupObject;

    const validationCreateGivingGroup = () => {
        let givingGoalValidity = true;
        if (fundraisingGoal !== '') {
            givingGoalValidity = _every(validateGivingGoal(fundraisingGoal, validity))
        }
        return (
            givingGoalValidity && name !== '' && short !== '' && (fundraisingDate > fundraisingCreated)
        );
    }
    const handleCreateGroup = () => {
        setDisableContinueButton(true);
        if (validationCreateGivingGroup()) {
            dispatch(createGivingGroupApiCall(createGivingGroupObject))
                .then(({ data }) => {
                    dispatch({
                        type: actionTypes.UPDATE_CREATE_GIVING_GROUP_OBJECT,
                        payload: intializeCreateGivingGroup,
                    });
                    Router.pushRoute(`/${data.type}/${data.attributes.slug}`);
                    const statusMessageProps = {
                        message: 'Group created',
                        type: 'success',
                    };
                    dispatch({
                        payload: {
                            errors: [
                                statusMessageProps,
                            ],
                        },
                        type: 'TRIGGER_UX_CRITICAL_ERROR',
                    });
                })
                .catch((err) => {
                    //handle error
                    setDisableContinueButton(false);
                })
        }
    };
    const handleInputChange = (event, data) => {
        let {
            name,
            value,
        } = data || event.target;
        createGivingGroupObject.attributes.fundraisingGoal = value;
        setCreateGivingGroupObject({
            ...createGivingGroupObject,
            attributes: {
                ...createGivingGroupObject.attributes,
                fundraisingGoal: value,
            },
        });
        setValidity(ValidateCreateGivingGroup(validity, name, value))
    };
    const handleInputOnBlurGivingGoal = (event, data) => {
        const {
            name,
            value,
        } = !_isEmpty(data) ? data : event.target;
        let inputValue = value;
        const isNumber = /^(?:[0-9]+,)*[0-9]+(?:\.[0-9]+)?$/;
        if (!_isEmpty(value) && value.match(isNumber)) {
            inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
            inputValue = _replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');;
            setCreateGivingGroupObject({
                ...createGivingGroupObject,
                attributes: {
                    ...createGivingGroupObject.attributes,
                    fundraisingGoal: inputValue,
                },
            });
        }
        setValidity(ValidateCreateGivingGroup(validity, name, inputValue))

    };
    const handleOnDateChange = (date, name) => {
        if (name === 'fundraisingCreated' && fundraisingDate && (new Date(fundraisingDate) <= new Date(date))) {
            validity.isEndDateGreaterThanStartDate = false;
            setValidity({
                ...validity
            });
            return;
        }
        if (name === 'fundraisingDate' && fundraisingCreated && (new Date(date) <= new Date(fundraisingCreated))) {
            validity.isEndDateGreaterThanStartDate = false;
            setValidity({
                ...validity
            });
            return;
        };
        validity.isEndDateGreaterThanStartDate = true;
        setValidity({
            ...validity
        });
        setCreateGivingGroupObject({
            ...createGivingGroupObject,
            attributes: {
                ...createGivingGroupObject.attributes,
                [name]: isFalsy(date) ? '' : new Date(date),
            },
        });
    };
    const handleCharityChange = (event, data) => {
        const {
            options,
            value,
        } = data;
        if (beneficiaryItems.length < 5) {
            const newvalue = _find(options, { value }) || {};
            const uniqueBeneficiaryIds = new Set([...beneficiaryIds, newvalue.id]);
            const uniqueBeneficiaryCharity = new Set([...beneficiaryItems, newvalue]);
            setShowCharityDropdown(true);
            setCreateGivingGroupObject({
                ...createGivingGroupObject,
                beneficiaryIds: [...uniqueBeneficiaryIds],
                beneficiaryItems: [...uniqueBeneficiaryCharity],
            });
        }
    };
    const debounceFunction = ({ dispatch, searchValue }, delay) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            dispatch(getCharityBasedOnSearchQuery(searchValue, 1, 50))
                .then(({ data }) => {
                    data.length > 0 && setShowCharityDropdown(true);
                })
                .catch(() => {
                    //handle error
                })
        }, delay);
    };
    const handleCharitySearchWordChange = (event, data) => {
        const {
            searchQuery,
        } = data;
        if (searchQuery.length >= 2) {
            const params = { dispatch, searchValue: searchQuery };
            debounceFunction(params, 300)

        }
        if (searchQuery.length === 0) {
            dispatch({
                type: actionTypes.GET_CHARITY_BASED_ON_SERACH_QUERY,
                payload: [],
            });
        }
        setCharitySearchQuery(searchQuery);
    };

    const handleRemoveCharity = (selectedId) => {
        let index;
        beneficiaryItems.find((item, i) => {
            if (selectedId === item.id) {
                index = i;
                return;
            }
        });
        beneficiaryItems.splice(index, 1);
        beneficiaryIds.splice(index, 1);

        setCreateGivingGroupObject({
            ...createGivingGroupObject,
            beneficiaryIds: [...beneficiaryIds],
            beneficiaryItems: [...beneficiaryItems],
        });
    };
    const renderSelectedCharities = () => beneficiaryItems.map(({ avatar, text, id }) => {
        return (
            <div className="charity">
                <Icon className='remove' onClick={() => handleRemoveCharity(id)} />
                <Image src={avatar || groupImg} />
                <Header>{text}</Header>
            </div>
        )
    });
    return (
        <Container>
            <div className='createNewGroupWrap'>
                <div className='createNewGrpheader'>
                    <Header as='h2'>{formatMessage('createGivingGroupHeader')}</Header>
                    {generateBreadCrum(breakCrumArray, currentActiveStepCompleted)}
                </div>
                <div className='mainContent'>
                    <div className='givingGoal'>
                        <Header className='titleHeader'>{formatMessage('createGivingGroupGivingGoal.givingGoalHeader')}</Header>
                        <Form>
                            <div className='createnewSec'>
                                <Header className='sectionHeader'>
                                    {formatMessage('createGivingGroupGivingGoal.givingGoalTitle')}
                                    <span className='optional'>$&nbsp;{formatMessage('optional')}</span>
                                </Header>
                                <div className='givingGoalForm'>
                                    <div className="field">
                                        <label>{formatMessage('createGivingGroupGivingGoal.givingGoalAmount')}</label>
                                        <ModalContent
                                            showDollarIcon={true}
                                            showLabel={false}
                                            handleInputChange={handleInputChange}
                                            handleInputOnBlurGivingGoal={handleInputOnBlurGivingGoal}
                                            givingGoal={fundraisingGoal}
                                            validity={validity}
                                            currentYear={''}
                                            placeholder={formatMessage('createGivingGroupGivingGoal.modalContentGivingGoalPlaceholder')}
                                        />
                                    </div>
                                    <div className='field'>
                                        <label>{formatMessage('createGivingGroupGivingGoal.goalStartDate')}</label>
                                        <p className='label-info'>
                                            {formatMessage('createGivingGroupGivingGoal.goalStartDateDescription')}
                                        </p>
                                        <ChimpDatePicker
                                            dateValue={fundraisingCreated}
                                            handleonDateChange={handleOnDateChange}
                                            name="fundraisingCreated"
                                        />
                                    </div>
                                    <div className='field'>
                                        <label>{formatMessage('createGivingGroupGivingGoal.goalEndDate')}</label>
                                        <ChimpDatePicker
                                            dateValue={fundraisingDate}
                                            handleonDateChange={handleOnDateChange}
                                            name="fundraisingDate"
                                        />
                                        {
                                            !validity.isEndDateGreaterThanStartDate &&
                                            <p className="error-message">
                                                <Icon name="exclamation circle" />
                                                End date should be greater than start date
                                            </p>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='createnewSec'>
                                <Header className='sectionHeader'>
                                    {formatMessage('createGivingGroupGivingGoal.charitiesToSupport')}
                                    <span className='optional'>&nbsp;{formatMessage('optional')}</span>
                                </Header>
                                <p>
                                {formatMessage('createGivingGroupGivingGoal.charitiesToSupportDesc1')}
                                    <span>
                                    {formatMessage('createGivingGroupGivingGoal.charitiesToSupportDesc2')}
                                    </span>
                                </p>
                                <div className="searchBox charitysearch">
                                    <Form.Field
                                        single
                                        control={Select}
                                        open={showCharityDropdown}
                                        className="searchInput"
                                        style={{ minHeight: 'auto' }}
                                        id="beneficiaryIds"
                                        name="beneficiaryIds"
                                        onChange={handleCharityChange}
                                        onSearchChange={handleCharitySearchWordChange}
                                        options={charitiesQueryBasedOptions}
                                        search={(options) => options}
                                        selection
                                        searchQuery={charitySearchQuery}
                                        placeholder={formatMessage('createGivingGroupGivingGoal.chairtiesToSupportPlaceholder')}
                                        loading={charitiesSearchQueryBasedLoader}
                                        onClick={() => {
                                            charitiesQueryBasedOptions.length > 0
                                                && setShowCharityDropdown(true)
                                        }}
                                        onClose={() => { setShowCharityDropdown(false) }}
                                    />
                                </div>
                                <div className='charityWrap'>
                                    {beneficiaryItems.length > 0 &&
                                        renderSelectedCharities()
                                    }
                                </div>
                            </div>
                        </Form>
                        <div className='buttonsWrap'>
                            <Button
                                className='blue-bordr-btn-round-def'
                                onClick={() => {
                                    dispatch(updateCreateGivingGroupObj(createGivingGroupObject));
                                    Router.pushRoute(CreateGivingGroupFlowSteps.stepThree)
                                }}
                                disabled={disableContinueButton}
                            >
                                {formatMessage('backButton')}
                                </Button>
                            <Button
                                className='blue-btn-rounded-def'
                                onClick={handleCreateGroup}
                                disabled={
                                    disableContinueButton || !validationCreateGivingGroup()
                                    || !validity.isEndDateGreaterThanStartDate
                                }
                                loading={disableContinueButton}
                            >
                                {formatMessage('createGivingGroupGivingGoal.createGivingGroupButton')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Container >
    );
};

CreateGivingGroupGivingGoal.defaultProps = {
    createGivingGroupStoreFlowObject: intializeCreateGivingGroup,
    dispatch: () => { },
};

CreateGivingGroupGivingGoal.prototype = {
    createGivingGroupStoreFlowObject: PropTypes.shape({
        type: PropTypes.string,
        attributes: PropTypes.shape({
            name: PropTypes.string.isRequired,
            prefersInviteOnly: PropTypes.string,
            prefersRecurringEnabled: PropTypes.string,
            city: PropTypes.string,
            province: PropTypes.string,
            short: PropTypes.string.isRequired,
            fundraisingGoal: PropTypes.string,
            fundraisingDate: PropTypes.string,
            fundraisingCreated: PropTypes.string,
            logo: PropTypes.string,
            videoUrl: PropTypes.string,
        }),
        groupDescriptions: PropTypes.array,
        beneficiaryIds: PropTypes.array,
        beneficiaryIds: PropTypes.array,
        galleryImages: PropTypes.array,
    }),
    dispatch: PropTypes.func
};
export default withTranslation('givingGroup')(CreateGivingGroupGivingGoal);
