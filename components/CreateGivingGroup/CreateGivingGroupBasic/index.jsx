import React, {
    useState,
    useEffect,
} from 'react';
import _isEmpty from 'lodash/isEmpty';
import {
    Container,
    Header,
    Button,
    Dropdown,
    Input,
    Form,
    Select,
    Icon,
    Checkbox,
} from 'semantic-ui-react';
import {
    useDispatch,
    useSelector,
} from 'react-redux';
import {
    PropTypes,
} from 'prop-types';

import {
    createGivingGroupBreadCrum,
    CreateGivingGroupFlowSteps,
    intializeCreateGivingGroup,
    intializeValidity,
    ValidateCreateGivingGroup,
} from '../../../helpers/createGrouputils';
import { Router } from '../../../routes';
import '../../../static/less/create_manage_group.less';
import {
    actionTypes,
    editGivingGroupApiCall,
    getUniqueCities,
    getProvincesList,
    updateCreateGivingGroupObj,
} from '../../../actions/createGivingGroup';
import { withTranslation } from '../../../i18n';
import CreateGivingGroupHeader from '../CreateGivingGroupHeader';

const CreateGivingGroupBasic = ({
    createGivingGroupStoreFlowObject,
    editGivingGroupStoreFlowObject,
    fromCreate,
    groupId,
    showBasic,
    showButton,
    showMonthly,
    t,
}) => {
    const formatMessage = t;
    const breakCrumArray = createGivingGroupBreadCrum(formatMessage);
    const currentActiveStepCompleted = [1];
    const whoCanSeeOptions = [
        {
            key: 'CreateGivingGroupBasic.whoCanSeeDropdownPublic',
            text: (
                <span className="text">
                    <Icon className="globe" />
                    {formatMessage('createGivingGroupBasic.whoCanSeeDropdownPublic')}
                </span>),
            value: 'Public',
        },
        {
            key: 'CreateGivingGroupBasic.whoCanSeeDropdownPrivate',
            text: (
                <span className="text">
                    <Icon className="lock" />
                    {formatMessage('createGivingGroupBasic.whoCanSeeDropdownPrivate')}
                </span>),
            value: 'Private',
        },
    ];
    const dispatch = useDispatch();
    const createGivingGroupStoreFlowObjectValues = fromCreate
        ? createGivingGroupStoreFlowObject : editGivingGroupStoreFlowObject;
    const provinceOptions = useSelector((state) => state.createGivingGroup.provinceOptions || []);
    const provincesListLoader = useSelector(
        (state) => state.createGivingGroup.provincesListLoader || false,
    );
    const uniqueCities = useSelector((state) => state.createGivingGroup.uniqueCities || []);
    const uniqueCitiesLoader = useSelector(
        (state) => state.createGivingGroup.uniqueCitiesLoader || false,
    );
    const [
        createGivingGroupObject,
        setCreateGivingGroupObject,
    ] = useState(createGivingGroupStoreFlowObjectValues);
    const [
        validity,
        setValidity,
    ] = useState(intializeValidity);
    const [
        showCitiesDropdown,
        setShowCitiesDropdown,
    ] = useState(false);
    const [
        disableContinue,
        setDisableContinue,
    ] = useState(_isEmpty(createGivingGroupObject.attributes.name));
    const [
        enableCitySearchOption,
        setEnableCitySearchOption,
    ] = useState(false);

    const {
        attributes: {
            city,
            name,
            prefersInviteOnly,
            prefersRecurringEnabled,
            province,
        },
    } = createGivingGroupObject;

    useEffect(() => {
        // scrollTo(0, 0);
        _isEmpty(provinceOptions) && dispatch(getProvincesList(1, 50));
        if (city !== '') {
            dispatch({
                payload: [
                    {
                        key: city,
                        text: city,
                        value: city,
                    },
                ],
                type: actionTypes.GET_UNIQUE_CITIES,
            });
        }
    }, []);

    const handleOnChange = (event, data) => {
        let {
            checked,
            name,
            value,
        } = data || event.target;
        switch (name) {
            case 'prefersInviteOnly':
                value = (value === 'Public') ? '0' : '1';
                break;
            case 'prefersRecurringEnabled':
                value = checked ? '1' : '0';
                break;
            case 'name':
                setDisableContinue(false);
                break;
            case 'province':
                if (value === 'defaultProvince') {
                    value = '';
                    createGivingGroupObject.attributes.city = '';
                } else {
                    dispatch(getUniqueCities(1, 50, value));
                }
                createGivingGroupObject.attributes.city = '';
                break;
            case 'city':
                setShowCitiesDropdown(false);
                setEnableCitySearchOption(false);
                break;
            default: break;
        }
        setCreateGivingGroupObject({
            ...createGivingGroupObject,
            attributes: {
                ...createGivingGroupObject.attributes,
                [name]: value,
            },
        });
        setValidity(ValidateCreateGivingGroup(validity, name, value));
        !fromCreate && setDisableContinue(false);
    };

    const handleOnBlur = (event, data) => {
        const {
            name,
            value,
        } = data || event.target;
        setValidity(ValidateCreateGivingGroup(validity, name, value))
    };

    const handleContinue = () => {
        setDisableContinue(true);
        if (name !== '') {
            //handle continue from create giving group
            dispatch(updateCreateGivingGroupObj(createGivingGroupObject));
            Router.pushRoute(CreateGivingGroupFlowSteps.stepTwo);
        }
    };

    const handleEditSave = (event, data) => {
        //handle Save from manage giving group
        let {
            name,
            value,
            checked,
        } = data || event.target;
        if (name === 'prefersRecurringEnabled') {
            value = checked ? "1" : "0";
            dispatch(editGivingGroupApiCall({
                attributes: {
                    prefersRecurringEnabled: value,
                },
            }, groupId))
                .then(() => {
                    setCreateGivingGroupObject({
                        ...createGivingGroupObject,
                        attributes: {
                            ...createGivingGroupObject.attributes,
                            [name]: value,
                        },
                    });
                })
                .catch(() => {
                    //handle error
                });
            return;
        }
        dispatch(editGivingGroupApiCall({
            attributes: {
                city: createGivingGroupObject.attributes.city,
                name: createGivingGroupObject.attributes.name,
                prefersInviteOnly: createGivingGroupObject.attributes.prefersInviteOnly !== '0',
                province: createGivingGroupObject.attributes.province,
            },
        }, groupId))
            .then(() => {
                setDisableContinue(true);
            })
            .catch(() => {
                // handle error
            });
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
                    <div className="basicsettings">
                        {showBasic
                        && (
                            <Header className="titleHeader">
                                {formatMessage('createGivingGroupBasic.basicHeader')}
                            </Header>
                        )
                        }
                        <Form>
                            {showBasic
                            && (
                                <div className={`createnewSec ${fromCreate ? 'bottom_space' : 'no_border'}`}>
                                    <div className="requiredfield field">
                                        <Form.Field
                                            id="form-input-control-group-name"
                                            name="name"
                                            control={Input}
                                            label={formatMessage('createGivingGroupBasic.groupLabel')}
                                            placeholder={formatMessage('createGivingGroupBasic.groupNamePlaceholder')}
                                            value={name}
                                            onChange={handleOnChange}
                                            onBlur={handleOnBlur}
                                            error={!validity.doesNameExist}
                                        />
                                        {!validity.doesNameExist
                                        && (
                                            <p className="error-message">
                                                <Icon name="exclamation circle" />
                                                The field is required
                                            </p>
                                        )
                                        }
                                    </div>
                                    <Form.Group widths='equal'>
                                        <Form.Field
                                            className={provincesListLoader ? '' : 'dropdownWithArrowParent'}
                                            control={Select}
                                            loading={provincesListLoader}
                                            options={provinceOptions.length > 1 ? [{
                                                key: formatMessage('createGivingGroupBasic.provincePlaceholder'),
                                                text: formatMessage('createGivingGroupBasic.provincePlaceholder'),
                                                value: "defaultProvince",
                                            }].concat(provinceOptions) : []}
                                            name='province'
                                            label={{ children: `${formatMessage('createGivingGroupBasic.provinveLabel')}`, htmlFor: 'form-select-control-province' }}
                                            placeholder={formatMessage('createGivingGroupBasic.provincePlaceholder')}
                                            searchInput={{ id: 'form-select-control-province' }}
                                            onChange={handleOnChange}
                                            value={province}
                                        />
                                        <Form.Field
                                            open={showCitiesDropdown && !_isEmpty(uniqueCities)}
                                            className={uniqueCitiesLoader ? '' : 'dropdownWithArrowParent'}
                                            name='city'
                                            loading={uniqueCitiesLoader}
                                            control={Select}
                                            search={enableCitySearchOption && !_isEmpty(uniqueCities)}
                                            label={{ children: `${formatMessage('createGivingGroupBasic.cityLabel')}`, htmlFor: 'form-select-control-city' }}
                                            placeholder={formatMessage('createGivingGroupBasic.cityPlaceholder')}
                                            {...(uniqueCities.length > 0 && {
                                                options: [{
                                                    key: formatMessage('createGivingGroupBasic.cityPlaceholder'),
                                                    text: formatMessage('createGivingGroupBasic.cityPlaceholder'),
                                                    value: "",
                                                }].concat(uniqueCities),
                                            })}
                                            value={city}
                                            onChange={handleOnChange}
                                            selectOnBlur={false}
                                            selectOnNavigation={false}
                                            onClick={() => {
                                                setEnableCitySearchOption(true)
                                                setShowCitiesDropdown(true)
                                            }}
                                            onBlur={() => setShowCitiesDropdown(false)}
                                        />
                                    </Form.Group>
                                    <div className='field'>
                                        <label>{formatMessage('createGivingGroupBasic.whoCanSeeHeader')}</label>
                                        <Dropdown
                                            inline
                                            options={whoCanSeeOptions}
                                            value={whoCanSeeOptions[prefersInviteOnly].value}
                                            icon='chevron down'
                                            className='whocanseeDropdown'
                                            name='prefersInviteOnly'
                                            onChange={handleOnChange}
                                        />
                                    </div>
                                    {/* {showButton
                                        && (
                                            <div className="buttonsWrap">
                                                <Button
                                                    className="blue-btn-rounded-def"
                                                    disabled={disableContinue || !validity.doesNameExist}
                                                    onClick={
                                                        (event, data) => (
                                                            fromCreate ? handleContinue() : handleEditSave(event, data)
                                                        )}
                                                >
                                                    {fromCreate ? formatMessage('continueButton') : 'Save'}
                                                </Button>
                                            </div>
                                        )
                                    } */}
                                </div>
                            )
                            }
                            {showMonthly
                            && (
                                <div className="createnewSec">
                                    <Header className="sectionHeader">{formatMessage('createGivingGroupBasic.monthlyGiftsHeader')}</Header>
                                    <p>{formatMessage('createGivingGroupBasic.monthlyGiftsDescription')}</p>
                                    <Checkbox
                                        checked={prefersRecurringEnabled === '1'}
                                        toggle
                                        className="c-chkBox left"
                                        id="discoverability"
                                        name="prefersRecurringEnabled"
                                        label={formatMessage('createGivingGroupBasic.monthlyGiftsLabel')}
                                        onChange={
                                            (event, data) => (fromCreate ? handleOnChange(event, data) : handleEditSave(event, data))
                                        }
                                    />
                                </div>
                            )
                            }
                            {showButton
                                        && (
                                            <div className={`buttonsWrap ${fromCreate ? '' : 'buttons_space'}`}>
                                                <Button
                                                    className="blue-btn-rounded-def"
                                                    disabled={disableContinue || !validity.doesNameExist}
                                                    onClick={
                                                        (event, data) => (
                                                            fromCreate ? handleContinue() : handleEditSave(event, data)
                                                        )}
                                                >
                                                    {fromCreate ? formatMessage('continueButton') : 'Save'}
                                                </Button>
                                            </div>
                                        )
                            }
                        </Form>
                    </div>
                </div>
            </div>
        </Container>
    );
};

CreateGivingGroupBasic.defaultProps = {
    createGivingGroupStoreFlowObject: { ...intializeCreateGivingGroup },
    editGivingGroupStoreFlowObject: { ...intializeCreateGivingGroup },
    fromCreate: true,
    groupId: '',
    showBasic: true,
    showButton: true,
    showMonthly: true,
};

CreateGivingGroupBasic.prototype = {
    createGivingGroupStoreFlowObject: PropTypes.shape({
        attributes: PropTypes.shape({
            city: PropTypes.string,
            fundraisingCreated: PropTypes.string,
            fundraisingDate: PropTypes.string,
            fundraisingGoal: PropTypes.string,
            logo: PropTypes.string,
            name: PropTypes.string.isRequired,
            prefersInviteOnly: PropTypes.string,
            prefersRecurringEnabled: PropTypes.string,
            province: PropTypes.string,
            short: PropTypes.string.isRequired,
            videoUrl: PropTypes.string,
        }),
        beneficiaryItems: PropTypes.array,
        galleryImages: PropTypes.array,
        groupPurposeDescriptions: PropTypes.array,
        type: PropTypes.string,
    }),
};

export default withTranslation('givingGroup')(CreateGivingGroupBasic);
