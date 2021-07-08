import React, {
    Fragment, useEffect, useState,
} from 'react';
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
    Search,
    Label,
} from 'semantic-ui-react';
import {
    PropTypes,
} from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import _replace from 'lodash/replace';
import _every from 'lodash/every';
import _find from 'lodash/find';
import _cloneDeep from 'lodash/cloneDeep';
import {
    useDispatch, useSelector,
} from 'react-redux';

import { withTranslation } from '../../../i18n';
import {
    createGivingGroupBreadCrum, createGivingGroupFlowSteps, intializeCreateGivingGroup, validateCreateGivingGroup,
} from '../../../helpers/createGrouputils';
import { Router } from '../../../routes';
import '../../../static/less/create_manage_group.less';
import {
    formatAmount, formatCurrency,
} from '../../../helpers/give/utils';
import { validateGivingGoal } from '../../../helpers/users/utils';
import groupImg from '../../../static/images/no-data-avatar-charity-profile.png';
import {
    actionTypes, createGivingGroupApiCall, editGivingGroupApiCall, getCharityBasedOnSearchQuery, updateCreateGivingGroupObj,
} from '../../../actions/createGivingGroup';
import { isFalsy } from '../../../helpers/utils';
import GivingGoal from '../../shared/GivingGoal';
import EditGivingGoal from '../EditGivingGoal';
import CreateGivingGroupHeader from '../CreateGivingGroupHeader';

const currentActiveStepCompleted = [
    1,
    2,
    3,
    4,
];
const intializeValidity = {
    doesAmountExist: true,
    isAmountLessThanOneBillion: true,
    isAmountMoreThanOneDollor: true,
    isValidPositiveNumber: true,
    isValidGiveAmount: true,
    isEndDateGreaterThanStartDate: true,
    isNotSameStartEndData: true,
};
let timeout = '';
let loadOnce = true;
const CreateGivingGroupGivingGoal = ({
    createGivingGroupStoreFlowObject, editGivingGroupStoreFlowObject, fromCreate, groupId, showCharity, showGivingGoal, t,
}) => {
    const editGivingGroupStoreFlowObjectClone = _cloneDeep(editGivingGroupStoreFlowObject);
    const initalizeObject = _isEmpty(createGivingGroupStoreFlowObject) ? intializeCreateGivingGroup : createGivingGroupStoreFlowObject;
    const givingGroupObject = fromCreate ? initalizeObject : editGivingGroupStoreFlowObjectClone;
    const formatMessage = t;
    const breakCrumArray = createGivingGroupBreadCrum(formatMessage);
    const disableValue = !fromCreate;

    const [
        createGivingGroupObject,
        setCreateGivingGroupObject,
    ] = useState(givingGroupObject);
    const [
        validity,
        setValidity,
    ] = useState(intializeValidity);
    const [
        disableContinueButton,
        setDisableContinueButton,
    ] = useState(disableValue);
    const [
        createGivingButtonLoader,
        setCreateGivingButtonLoader,
    ] = useState(false);
    const [
        showLoader,
        setshowLoader,
    ] = useState(false);
    const [
        isEditModified,
        setisEditModified,
    ] = useState(false);

    const dispatch = useDispatch();

    const [
        charitySearchQuery,
        setCharitySearchQuery,
    ] = useState('');
    const charitiesQueryBasedOptions = useSelector((state) => state.createGivingGroup.charitiesQueryBasedOptions || []);
    const charitiesSearchQueryBasedLoader = useSelector((state) => state.createGivingGroup.charitiesSearchQueryBasedLoader || null);
    const isFromCampaignObj = useSelector((state) => state.createGivingGroup.isFromCampaignObj || {});
    let hasFeaturedCharities = false;
    let isCampaignLocked = false;
    const groupDetails = useSelector((state) => state.group.groupDetails);
    if (fromCreate && !_isEmpty(isFromCampaignObj)) {
        hasFeaturedCharities = (!_isEmpty(isFromCampaignObj.featuredCharities));
        isCampaignLocked = ((isFromCampaignObj.isLocked));
    } else {
        isCampaignLocked = (!_isEmpty(groupDetails) && (groupDetails.attributes.moneyManage === 'Campaign Admin'));
    }
    useEffect(() => {
        if (loadOnce) {
            window.scrollTo(0, 0);
            loadOnce = false;
        }
        if (!fromCreate) {
            editGivingGroupStoreFlowObject && setCreateGivingGroupObject(editGivingGroupStoreFlowObjectClone);
        }
        if (!_isEmpty(editGivingGroupStoreFlowObject.beneficiaryItems) && editGivingGroupStoreFlowObject.beneficiaryItems.length >= 5) {
            setCharitySearchQuery('');
        }
    }, [
        editGivingGroupStoreFlowObject,
    ]);

    useEffect(() => {
        if (showCharity) {
            dispatch({
                payload: [],
                type: 'GET_CHARITY_BASED_ON_SERACH_QUERY',
            });
        }
    }, []);

    const {
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
        if (!_isEmpty(fundraisingGoal)) {
            givingGoalValidity = _every(validateGivingGoal(parseFloat(fundraisingGoal.replace(/,/g, '')), validity));
        }
        if (!_isEmpty(fundraisingDate)) {
            dateCheck = new Date(fundraisingDate) > new Date(fundraisingCreated);
        }
        return (
            givingGoalValidity && name !== '' && short !== '' && dateCheck
        );
    };

    const handleResetValidity = () => {
        setValidity({
            doesAmountExist: true,
            isAmountLessThanOneBillion: true,
            isAmountMoreThanOneDollor: true,
            isEndDateGreaterThanStartDate: true,
            isNotSameStartEndData: true,
            isValidGiveAmount: true,
            isValidPositiveNumber: true,
        });
    };

    const handleCreateGroup = () => {
        setDisableContinueButton(true);
        setCreateGivingButtonLoader(true);
        const tempArr = [];
        const formattedGoal = parseFloat(fundraisingGoal.replace(/,/g, ''));
        if (validationCreateGivingGroup()) {
            handleResetValidity();
            if (!fromCreate) {
                const goalStartDate = ((formattedGoal !== 0) && fundraisingCreated) ? fundraisingCreated.toString() : null;
                const goalEndDate = ((formattedGoal !== 0) && fundraisingDate) ? fundraisingDate.toString() : null;
                dispatch(editGivingGroupApiCall({
                    attributes: {
                        fundraisingCreated: goalStartDate,
                        fundraisingDate: goalEndDate,
                        fundraisingGoal: (formattedGoal !== 0) ? formattedGoal : '',
                    },
                }, groupId))
                    .then(() => {
                        setCreateGivingButtonLoader(false);
                        setCreateGivingGroupObject({
                            ...createGivingGroupObject,
                            attributes: {
                                ...createGivingGroupObject.attributes,
                                fundraisingCreated: null,
                                fundraisingDate: null,
                                fundraisingGoal: '',
                            },
                        });
                    })
                    .catch(() => {
                        // handle error
                        setCreateGivingButtonLoader(false);
                    });
            } else {
                if (!_isEmpty(createGivingGroupObject.groupPurposeDescriptions)) {
                    createGivingGroupObject.groupPurposeDescriptions.map((desc) => {
                        const tempObj = {};
                        tempObj.description = desc.description;
                        tempObj.purpose = desc.purpose;
                        tempArr.push(tempObj);
                    });
                    createGivingGroupObject.groupPurposeDescriptions = tempArr;
                }
                if (formattedGoal === 0) {
                    createGivingGroupObject.attributes.fundraisingGoal = '';
                    createGivingGroupObject.attributes.fundraisingCreated = null;
                    createGivingGroupObject.attributes.fundraisingDate = null;
                }
                if (!_isEmpty(isFromCampaignObj) && isFromCampaignObj.isFromCampaign) {
                    createGivingGroupObject.attributes.campaignId = isFromCampaignObj.campaignId;
                }
                dispatch(createGivingGroupApiCall(createGivingGroupObject, isCampaignLocked))
                    .then(({ data }) => {
                        dispatch({
                            payload: {
                                isFromCampaign: false,
                            },
                            type: 'SET_GROUP_FROM_CAMPAIGN',
                        });
                        dispatch({
                            payload: {
                                fromCampaignObj: {},
                            },
                            type: 'SET_GROUP_FROM_CAMPAIGN_OBJECT',
                        });
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
                        // handle error
                        setCreateGivingButtonLoader(false);
                        setDisableContinueButton(false);
                    });
            }
        }
    };
    const handleInputChange = (event, data) => {
        const {
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
        setisEditModified(true);
        setDisableContinueButton(_isEmpty(value));
        setValidity(validateCreateGivingGroup(validity, name, value));
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
        setValidity(validateCreateGivingGroup(validity, name, value));
    };
    const handleOnDateChange = (date, name) => {
        if (name === 'fundraisingCreated' && fundraisingDate && (new Date(fundraisingDate).setHours(0, 0, 0, 0) <= new Date(date).setHours(0, 0, 0, 0))) {
            validity.isEndDateGreaterThanStartDate = false;
        } else if (name === 'fundraisingDate' && date && fundraisingCreated && (new Date(date).setHours(0, 0, 0, 0) < new Date(fundraisingCreated).setHours(0, 0, 0, 0))) {
            validity.isEndDateGreaterThanStartDate = false;
        } else if (name === 'fundraisingCreated' && !date && fundraisingDate) {
            validity.isEndDateGreaterThanStartDate = true;
        } else if (name === 'fundraisingDate' && !date) {
            validity.isEndDateGreaterThanStartDate = true;
        } else {
            validity.isEndDateGreaterThanStartDate = true;
        }
        if (name === 'fundraisingDate' && fundraisingCreated && date
            && ((new Date(fundraisingCreated).setHours(0, 0, 0, 0) === new Date(date).setHours(0, 0, 0, 0))
            || (new Date(date).setHours(0, 0, 0, 0) <= new Date(fundraisingCreated).setHours(0, 0, 0, 0)))) {
            validity.isNotSameStartEndData = false;
            setisEditModified(false);
        } else if (name === 'fundraisingCreated' && fundraisingDate && new Date(fundraisingDate).setHours(0, 0, 0, 0) <= new Date(date).setHours(0, 0, 0, 0)) {
            validity.isNotSameStartEndData = false;
            setisEditModified(false);
        } else {
            setisEditModified(true);
            validity.isNotSameStartEndData = true;
        }
        setValidity({
            ...validity,
        });
        if (!_isEmpty(createGivingGroupObject.attributes.fundraisingGoal)) {
            setDisableContinueButton(false);
        }
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
            result,
        } = data;
        let isSelected = false;
        if (!_isEmpty(beneficiaryItems)) {
            isSelected = beneficiaryItems.filter((obj) => obj.name.includes(result.title));
            isSelected = (!_isEmpty(isSelected));
        }
        if ((_isEmpty(beneficiaryItems) || (beneficiaryItems && beneficiaryItems.length < 5)) && !isSelected) {
            const newvalue = result;
            const beneficiaryItem = {
                avatar: newvalue.avatar,
                id: newvalue.id,
                name: newvalue.title,
            };
            let uniqueBeneficiaryCharity = [];
            if (beneficiaryItems) {
                uniqueBeneficiaryCharity = new Set([
                    ...beneficiaryItems,
                    beneficiaryItem,
                ]);
            } else {
                uniqueBeneficiaryCharity.push(beneficiaryItem);
            }
            setDisableContinueButton(false);
            if (fromCreate) {
                setCreateGivingGroupObject({
                    ...createGivingGroupObject,
                    beneficiaryItems: [
                        ...uniqueBeneficiaryCharity,
                    ],
                });
            } else {
                const beneficiaryIds = [];
                const uniqueBeneficiaryCharityArr = [
                    ...uniqueBeneficiaryCharity,
                ];
                uniqueBeneficiaryCharityArr && uniqueBeneficiaryCharityArr.map(({ id }) => {
                    beneficiaryIds.push(id);
                });
                setshowLoader(true);
                dispatch(editGivingGroupApiCall({
                    attributes: {},
                    beneficiaryIds: [
                        ...beneficiaryIds,
                    ],
                }, groupId)).finally(() => {
                    setshowLoader(false);
                });
            }
        }
    };
    const debounceFunction = ({
        dispatch, searchValue,
    }, delay) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            dispatch(getCharityBasedOnSearchQuery(searchValue, 1, 50));
        }, delay);
    };
    const handleCharitySearchWordChange = (event, data) => {
        const {
            currentTarget: {
                value,
            },
        } = event;
        if (value.length >= 2) {
            const params = {
                dispatch,
                searchValue: value,
            };
            debounceFunction(params, 300);
        }
        if (value.length === 0) {
            dispatch({
                type: actionTypes.GET_CHARITY_BASED_ON_SERACH_QUERY,
                payload: [],
            });
        }
        setCharitySearchQuery(value);
    };

    const handleRemoveCharity = (selectedId) => {
        let index;
        beneficiaryItems.find((item, i) => {
            if (selectedId === Number(item.id)) {
                index = i;
            }
        });
        setDisableContinueButton(false);
        beneficiaryItems.splice(index, 1);
        if (fromCreate) {
            setCreateGivingGroupObject({
                ...createGivingGroupObject,
                beneficiaryItems: [
                    ...beneficiaryItems,
                ],
            });
        } else {
            setshowLoader(true);
            const beneficiaryIds = [];
            beneficiaryItems && beneficiaryItems.map(({ id }) => {
                beneficiaryIds.push(id);
            });
            dispatch(editGivingGroupApiCall({
                attributes: {},
                beneficiaryIds: [
                    ...beneficiaryIds,
                ],
            }, groupId)).finally(() => {
                setshowLoader(false);
            });
        }
    };
    const renderSelectedCharities = () => beneficiaryItems.map((item) => (
        <div className="charity">
            {!isCampaignLocked
            && (
                <Icon className="remove" onClick={() => handleRemoveCharity(item.id)} />
            )}
            <Image src={item.avatar || groupImg} />
            <Header>{item.name}</Header>
        </div>
    ));

    const renderEditModalContentComponent = () => (
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

    const resultRenderer = (event, data) => {
        let isSelected = false;
        if (!_isEmpty(data)) {
            isSelected = data.filter((obj) => obj.name.includes(event.title));
        }
        return <Label className={`charities_label ${!_isEmpty(isSelected) ? 'disabled' : ''}`} content={event.title} />;
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
                        <div className={`${fromCreate ? 'Charities_goal_width' : ''}`}>
                            <Form>
                                {showGivingGoal
                                && (
                                    <Fragment>
                                        {fromCreate || Number(editGivingGroupStoreFlowObject.attributes.fundraisingGoal) <= 0 ? (
                                            <div className={`createnewSec ${fromCreate ? 'bottom_space' : 'no_border'}`}>
                                                <Header className="sectionHeader">
                                                    {formatMessage('createGivingGroupGivingGoal.givingGoalTitle')}
                                                </Header>
                                                {fromCreate
                                                && (
                                                    <p className="label-info">
                                                        Consider setting a giving goal for your group.
                                                    </p>
                                                )}
                                                {renderEditModalContentComponent()}
                                            </div>
                                        )
                                            : (
                                                <div className={`createnewSec ${!fromCreate ? 'no_border' : ''}`}>
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
                                                        isEditModified={isEditModified}
                                                        setisEditModified={setisEditModified}
                                                        handleResetValidity={handleResetValidity}
                                                    />
                                                </div>
                                            )
                                        }
                                    </Fragment>
                                )}
                                {showCharity
                                && (
                                    <div className={`createnewSec ${!fromCreate ? 'no_border' : ''}`}>
                                        <Header className={`sectionHeader ${!fromCreate ? 'gifts_bottom_border' : ''}`}>
                                            {formatMessage('createGivingGroupGivingGoal.charitiesToSupport')}
                                        </Header>
                                        <Fragment>
                                            {hasFeaturedCharities
                                                ? (
                                                    <Fragment>
                                                        {!isCampaignLocked
                                                        && (
                                                            <p>
                                                            These charities will be displayed on your group to show visitors whom you plan to support.
                                                            Don't worry, you can change these at any time.
                                                            </p>
                                                        )}
                                                    </Fragment>
                                                )
                                                : (
                                                    <Fragment>
                                                        {!isCampaignLocked
                                                        && (
                                                            <Fragment>
                                                                <p>
                                                                Let your supporters know which charities you plan to support.
                                                                    <span>
                                                                        {formatMessage('createGivingGroupGivingGoal.charitiesToSupportDesc2')}
                                                                    </span>
                                                                    <a
                                                                        href="https://help.charitableimpact.com/article/147-what-is-a-giving-group"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                    Learn more
                                                                    </a>
                                                                    &nbsp; about where money raised from groups can go.
                                                                </p>
                                                                {(!_isEmpty(beneficiaryItems) && beneficiaryItems.length >= 5)
                                                                    && (
                                                                        <div className="manage_charities_max">
                                                                            <p>Groups can support up to 5 charities at a time. </p>
                                                                            <p>To add another charity, remove one of the charities listed below.</p>
                                                                        </div>
                                                                    )}
                                                            </Fragment>
                                                        )}
                                                    </Fragment>
                                                )}
                                        </Fragment>
                                        <div className="searchBox charitysearch">
                                            {(!isCampaignLocked)
                                            && (
                                                <Fragment>
                                                    {(_isEmpty(beneficiaryItems) || (!_isEmpty(beneficiaryItems) && beneficiaryItems.length < 5))
                                                        && (
                                                            <Search
                                                                fluid
                                                                className="searchInput search_charity_wrapper"
                                                                placeholder={formatMessage('createGivingGroupGivingGoal.chairtiesToSupportPlaceholder')}
                                                                loading={charitiesSearchQueryBasedLoader}
                                                                minCharacters={4}
                                                                id="beneficiaryItems"
                                                                name="beneficiaryItems"
                                                                onResultSelect={handleCharityChange}
                                                                onSearchChange={handleCharitySearchWordChange}
                                                                disabled={(!_isEmpty(beneficiaryItems) && beneficiaryItems.length >= 5) || showLoader}
                                                                resultRenderer={(event) => resultRenderer(event, beneficiaryItems)}
                                                                results={charitiesQueryBasedOptions}
                                                                value={charitySearchQuery}
                                                                icon={(
                                                                    <Icon
                                                                        name="search"
                                                                        className={`${!charitiesSearchQueryBasedLoader ? 'manage_charity_search' : ''} `}
                                                                    />
                                                                )}
                                                            />
                                                        )}
                                                </Fragment>
                                            )}
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
                                    <div className={`buttonsWrap ${!fromCreate ? 'btn_wrap_width' : ''}`}>
                                        {fromCreate
                                        && (
                                            <Button
                                                className="blue-bordr-btn-round-def"
                                                onClick={() => {
                                                    dispatch(updateCreateGivingGroupObj(createGivingGroupObject));
                                                    Router.pushRoute(createGivingGroupFlowSteps.stepThree);
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
                                                disabled={disableContinueButton || !validationCreateGivingGroup()}
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
