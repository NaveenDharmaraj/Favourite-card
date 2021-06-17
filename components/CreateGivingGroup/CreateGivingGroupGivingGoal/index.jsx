import React, { Fragment, useEffect, useState } from 'react';
import {
    Container,
    Header,
    Button,
    Form,
    Image,
    Icon,
    Select,
    Dimmer,
    Loader,
} from 'semantic-ui-react';
import {
    PropTypes,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import _replace from 'lodash/replace';
import _every from 'lodash/every';
import _find from 'lodash/find';
import _cloneDeep from 'lodash/cloneDeep';
import { useDispatch, useSelector } from 'react-redux';

import { withTranslation } from '../../../i18n';
import { createGivingGroupBreadCrum, CreateGivingGroupFlowSteps, intializeCreateGivingGroup, ValidateCreateGivingGroup } from '../../../helpers/createGrouputils';
import { Router } from '../../../routes';
import '../../../static/less/create_manage_group.less';
import { formatAmount, formatCurrency } from '../../../helpers/give/utils';
import { validateGivingGoal } from '../../../helpers/users/utils';
import groupImg from '../../../static/images/no-data-avatar-giving-group-profile.png';
import { actionTypes, createGivingGroupApiCall, editGivingGroupApiCall, getCharityBasedOnSearchQuery, updateCreateGivingGroupObj } from '../../../actions/createGivingGroup';
import { isFalsy } from '../../../helpers/utils';
import GivingGoal from '../../shared/GivingGoal';
import EditGivingGoal from '../EditGivingGoal';
import CreateGivingGroupHeader from '../CreateGivingGroupHeader';

const currentActiveStepCompleted = [1, 2, 3, 4];
const intializeValidity = {
    doesAmountExist: true,
    isAmountLessThanOneBillion: true,
    isAmountMoreThanOneDollor: true,
    isValidPositiveNumber: true,
    isValidGiveAmount: true,
    isEndDateGreaterThanStartDate: true,
};
let timeout = '';
let loadOnce = true;
const CreateGivingGroupGivingGoal = ({ createGivingGroupStoreFlowObject, editGivingGroupStoreFlowObject, fromCreate, groupId, showCharity, showGivingGoal, t }) => {
    const editGivingGroupStoreFlowObjectClone = _cloneDeep(editGivingGroupStoreFlowObject);
    const initalizeObject = _isEmpty(createGivingGroupStoreFlowObject) ? intializeCreateGivingGroup : createGivingGroupStoreFlowObject;
    const givingGroupObject = fromCreate ? initalizeObject : editGivingGroupStoreFlowObjectClone;
    const formatMessage = t;
    const breakCrumArray = createGivingGroupBreadCrum(formatMessage);
    const disableValue = fromCreate ? false : true;

    const [createGivingGroupObject, setCreateGivingGroupObject] = useState(givingGroupObject);
    const [validity, setValidity] = useState(intializeValidity);
    const [showCharityDropdown, setShowCharityDropdown] = useState(false);
    const [disableContinueButton, setDisableContinueButton] = useState(disableValue);
    const [createGivingButtonLoader, setCreateGivingButtonLoader] = useState(false);
    const [showLoader, setshowLoader] = useState(false);

    const dispatch = useDispatch();

    const [charitySearchQuery, setCharitySearchQuery] = useState('');
    const charitiesQueryBasedOptions = useSelector(state => state.createGivingGroup.charitiesQueryBasedOptions || []);
    const charitiesSearchQueryBasedLoader = useSelector(state => state.createGivingGroup.charitiesSearchQueryBasedLoader || null);

    useEffect(() => {
        if (loadOnce) {
            window.scrollTo(0, 0);
            loadOnce = false;
        }
        if (!fromCreate) {
            editGivingGroupStoreFlowObject && setCreateGivingGroupObject(editGivingGroupStoreFlowObjectClone)
        }
    }, [
        editGivingGroupStoreFlowObject,
    ]);
    let {
        attributes: {
            fundraisingGoal,
            fundraisingDate,
            fundraisingDaysRemaining,
            fundraisingCreated,
            fundraisingPercentage,
            goalAmountRaised,
            name,
            short,
        },
        beneficiaryItems,
    } = createGivingGroupObject;

    const validationCreateGivingGroup = () => {
        let givingGoalValidity = true;
        let dateCheck = true;
        if (fundraisingGoal !== '') {
            givingGoalValidity = _every(validateGivingGoal(parseFloat(fundraisingGoal.replace(/,/g, '')), validity));
        }
        if (fundraisingDate) {
            dateCheck = fundraisingDate > fundraisingCreated;
        }
        return (
            givingGoalValidity && name !== '' && short !== '' && dateCheck
        );
    }
    const handleCreateGroup = () => {
        setDisableContinueButton(true);
        setCreateGivingButtonLoader(true);
        if (validationCreateGivingGroup()) {
            if (!fromCreate) {
                dispatch(editGivingGroupApiCall({
                    attributes: {
                        fundraisingGoal,
                        fundraisingCreated,
                        fundraisingDate,
                    }
                }, groupId))
                    .then(() => {
                        setCreateGivingButtonLoader(false)
                    })
                    .catch(() => {
                        //handle error
                        setCreateGivingButtonLoader(false)
                    })
            } else {
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
                        setCreateGivingButtonLoader(false);
                    })
            }
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
        setDisableContinueButton(false);
        setValidity(ValidateCreateGivingGroup(validity, name, value));
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
            inputValue = _replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
            setCreateGivingGroupObject({
                ...createGivingGroupObject,
                attributes: {
                    ...createGivingGroupObject.attributes,
                    fundraisingGoal: inputValue,
                },
            });
        }
        setValidity(ValidateCreateGivingGroup(validity, name, value));
    };
    const handleOnDateChange = (date, name) => {
        if (name === 'fundraisingCreated' && fundraisingDate && (new Date(fundraisingDate) <= new Date(date))) {
            validity.isEndDateGreaterThanStartDate = false;
        } else if (name === 'fundraisingDate' && fundraisingCreated && (new Date(date) <= new Date(fundraisingCreated))) {
            validity.isEndDateGreaterThanStartDate = false;
        } else {
            validity.isEndDateGreaterThanStartDate = true;
        }
        setValidity({
            ...validity
        });
        setDisableContinueButton(false);
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
        if (_isEmpty(beneficiaryItems) || (beneficiaryItems && beneficiaryItems.length < 5)) {
            const newvalue = _find(options, { value }) || {};
            const beneficiaryItem = {
                avatar: newvalue.avatar,
                id: newvalue.id,
                name: newvalue.text,
            };
            let uniqueBeneficiaryCharity = [];
            if (beneficiaryItems) {
                uniqueBeneficiaryCharity = new Set([...beneficiaryItems, beneficiaryItem]);
            } else {
                uniqueBeneficiaryCharity.push(beneficiaryItem);
            }
            setShowCharityDropdown(true);
            setDisableContinueButton(false);
            if (fromCreate) {
                setCreateGivingGroupObject({
                    ...createGivingGroupObject,
                    beneficiaryItems: [...uniqueBeneficiaryCharity]
                });
            } else {
                const beneficiaryIds = [];
                const uniqueBeneficiaryCharityArr = [...uniqueBeneficiaryCharity];
                uniqueBeneficiaryCharityArr && uniqueBeneficiaryCharityArr.map(({ id }) => {
                    beneficiaryIds.push(id);
                });
                setshowLoader(true);
                dispatch(editGivingGroupApiCall({
                    attributes: {},
                    beneficiaryIds: [...beneficiaryIds],
                }, groupId)).finally(() => {
                    setshowLoader(false);
                });
            }
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
            if (selectedId === Number(item.id)) {
                index = i;
                return;
            }
        });
        setDisableContinueButton(false);
        beneficiaryItems.splice(index, 1);
        if (fromCreate) {
            setCreateGivingGroupObject({
                ...createGivingGroupObject,
                beneficiaryItems: [...beneficiaryItems],
            });
        } else {
            let beneficiaryIds = [];
            beneficiaryItems && beneficiaryItems.map(({id})=>{
                beneficiaryIds.push(id);
            });
            dispatch(editGivingGroupApiCall({
                attributes: {},
                beneficiaryIds:[...beneficiaryIds]
            }, groupId));
        }
    };
    const renderSelectedCharities = () => beneficiaryItems.map((item) => {
        return (
            <div className="charity">
                <Icon className="remove" onClick={() => handleRemoveCharity(item.id)} />
                <Image src={item.avatar || groupImg} />
                <Header>{item.name}</Header>
            </div>
        );
    });
    const renderEditModalContentComponent = () => {
        return (
            <EditGivingGoal
                formatMessage={formatMessage}
                fundraisingCreated={fundraisingCreated}
                fundraisingDate={fundraisingDate}
                fundraisingGoal={fundraisingGoal}
                handleInputChange={handleInputChange}
                handleInputOnBlurGivingGoal={handleInputOnBlurGivingGoal}
                handleOnDateChange={handleOnDateChange}
                validity={validity}
                fromCreate={fromCreate}
            />
        );
    };
    return (
        <Container>
            <div className={fromCreate ? 'createNewGroupWrap' : 'manageGroupWrap createNewGroupWrap'}>
                {fromCreate
                && (
                    <CreateGivingGroupHeader
                        breakCrumArray={breakCrumArray}
                        currentActiveStepCompleted={currentActiveStepCompleted}
                        header={formatMessage('createGivingGroupHeader')}
                    />
                )
                }
                <div className="mainContent">
                    <div>
                        {fromCreate
                        && (
                            <Header className="titleHeader">
                                {formatMessage('createGivingGroupGivingGoal.givingGoalHeader')}
                            </Header>
                        )}
                        <div className="Charities_goal_width">
                        <Form>
                            {showGivingGoal
                            && (
                                <Fragment>
                                    {fromCreate || Number(editGivingGroupStoreFlowObject.attributes.fundraisingGoal) <= 0 ? (
                                        <div className={`createnewSec ${fromCreate ? 'bottom_space' : ''}`}>
                                            <Header className="sectionHeader">
                                                {formatMessage('createGivingGroupGivingGoal.givingGoalTitle')}
                                                <span className="optional">&nbsp;{formatMessage('optional')}</span>
                                            </Header>
                                            {renderEditModalContentComponent()}
                                        </div>
                                    )
                                        : (
                                            <div className="createnewSec">
                                                <GivingGoal
                                                    createGivingButtonLoader={createGivingButtonLoader}
                                                    createGivingGroupObject={createGivingGroupObject}
                                                    dispatch={dispatch}
                                                    fundraisingGoal={fundraisingGoal}
                                                    fundraisingDate={fundraisingDate}
                                                    fundraisingDaysRemaining={fundraisingDaysRemaining}
                                                    fundraisingCreated={fundraisingCreated}
                                                    fundraisingPercentage={fundraisingPercentage}
                                                    goalAmountRaised={goalAmountRaised}
                                                    groupId={groupId}
                                                    handleCreateGroup={handleCreateGroup}
                                                    modalContent={renderEditModalContentComponent()}
                                                    validity={validity}
                                                    setCreateGivingGroupObject={setCreateGivingGroupObject}
                                                />
                                            </div>
                                        )
                                    }
                                </Fragment>
                            )}
                            {showCharity
                            && (
                                <div className="createnewSec">
                                    <Header className="sectionHeader">
                                        {formatMessage('createGivingGroupGivingGoal.charitiesToSupport')}
                                        <span className="optional">&nbsp;{formatMessage('optional')}</span>
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
                                            disabled={!_isEmpty(beneficiaryItems) && beneficiaryItems.length > 5}
                                            open={showCharityDropdown}
                                            className="searchInput"
                                            style={{ minHeight: 'auto' }}
                                            id="beneficiaryItems"
                                            name="beneficiaryItems"
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
                                                    && setShowCharityDropdown(true);
                                            }}
                                            onClose={() => { setShowCharityDropdown(false); }}
                                        />
                                        <div className="charityWrap">
                                            {!showLoader
                                                ? (
                                                    !_isEmpty(beneficiaryItems) && renderSelectedCharities()
                                                ) : (
                                                    <Dimmer className="charity_support_loader" active inverted>
                                                        <Loader />
                                                    </Dimmer>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            )
                            }
                            {!showLoader
                            && (
                                <div className="buttonsWrap">
                                {fromCreate
                                && (
                                    <Button
                                        className="blue-bordr-btn-round-def"
                                        onClick={() => {
                                            dispatch(updateCreateGivingGroupObj(createGivingGroupObject));
                                            Router.pushRoute(CreateGivingGroupFlowSteps.stepThree);
                                        }}
                                        disabled={disableContinueButton}
                                    >
                                        {formatMessage('backButton')}
                                    </Button>
                                )
                                }
                                {(fromCreate
                                || ((Number(editGivingGroupStoreFlowObject.attributes.fundraisingGoal) <= 0) && showGivingGoal))
                                && (
                                    <Button
                                        className="blue-btn-rounded-def"
                                        onClick={handleCreateGroup}
                                        disabled={
                                            disableContinueButton || !validationCreateGivingGroup()
                                            || !validity.isEndDateGreaterThanStartDate
                                        }
                                        loading={createGivingButtonLoader}
                                    >
                                        {fromCreate ? formatMessage('createGivingGroupGivingGoal.createGivingGroupButton') : 'Save'}
                                    </Button>
                                )
                                }
                            </div>
                            )
                            }
                        </Form>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

CreateGivingGroupGivingGoal.defaultProps = {
    createGivingGroupStoreFlowObject: intializeCreateGivingGroup,
    dispatch: () => { },
    editGivingGroupStoreFlowObject: intializeCreateGivingGroup,
    fromCreate: true,
    groupId: '',
    showCharity: true,
    showGivingGoal: true,
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
        groupPurposeDescriptions: PropTypes.array,
        beneficiaryItems: PropTypes.array,
        galleryImages: PropTypes.array,
    }),
    dispatch: PropTypes.func,
    groupId: PropTypes.bool,
    fromCreate: PropTypes.bool,
};
export default withTranslation('givingGroup')(CreateGivingGroupGivingGoal);
