import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
import { CreateGivingGroupFlowSteps, generateBreadCrum, intializeCreateGivingGroup, intializeValidity, ValidateCreateGivingGroup } from '../../../helpers/createGrouputils';
import {
    PropTypes,
} from 'prop-types';
import { useSelector } from 'react-redux'

import { Router } from '../../../routes';
import '../../../static/less/create_manage_group.less';
import { getUniqueCities, updateCreateGivingGroupObj } from '../../../actions/createGivingGroup';
import { canadaProvinceOptions } from '../../../helpers/constants';

const provinceOptions = canadaProvinceOptions;
const whoCanSeeOptions = [
    {
        key: 'Public',
        text: <span className='text'><Icon className='globe' />This group is public, anyone can see it.</span>,
        value: 'Public',
    },
    {
        key: 'Private',
        text: <span className='text'><Icon className='lock' />This group is private, only those who are invited to the Giving Group can join</span>,
        value: 'Private',
    },
];

const CreateGivingGroupBasic = ({ createGivingGroupStoreFlowObject }) => {
    const breakCrumArray = ['Basic settings', 'About the group', 'Pics & video', 'Charities and goal'];
    const currentActiveStepCompleted = [1];

    const dispatch = useDispatch();
    const [createGivingGroupObject, setCreateGivingGroupObject] = useState(createGivingGroupStoreFlowObject);
    const [validity, setValidity] = useState(intializeValidity);
    const uniqueCities = useSelector(state => state.createGivingGroup.uniqueCities);
    const uniqueCitiesLoader = useSelector(state => state.createGivingGroup.uniqueCitiesLoader || false);
    const [disableContinue, setDisableContinue] = useState(_isEmpty(createGivingGroupObject.attributes.name));
    const {
        attributes: {
            city,
            name,
            prefersInviteOnly,
            prefersRecurringEnabled,
            province,
        }
    } = createGivingGroupObject;
    useEffect(() => {
        scrollTo(0, 0);
        _isEmpty(uniqueCities) && dispatch(getUniqueCities(1, 50));
        return () => {
            !Object.values(CreateGivingGroupFlowSteps).includes(Router.router.asPath) &&
                dispatch(updateCreateGivingGroupObj(intializeCreateGivingGroup));
        }
    }, []);
    const handleOnChange = (event, data) => {
        let {
            name,
            value,
            checked,
        } = data || event.target;
        if (name === 'prefersInviteOnly') {
            value = value === 'Public' ? "0" : "1"
        } else if (name === 'prefersRecurringEnabled') {
            value = checked ? "1" : "0";
        } else if (name === 'name') {
            setDisableContinue(false);
        }
        setCreateGivingGroupObject({
            ...createGivingGroupObject,
            attributes: {
                ...createGivingGroupObject.attributes,
                [name]: value
            },
        });
        setValidity(ValidateCreateGivingGroup(validity, name, value))
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
            dispatch(updateCreateGivingGroupObj(createGivingGroupObject));
            Router.pushRoute(CreateGivingGroupFlowSteps.stepTwo);
        }
    };
    return (
        <Container>
            <div className='createNewGroupWrap'>
                <div className='createNewGrpheader'>
                    <Header as='h2'>Create a new Giving Group</Header>
                    {generateBreadCrum(breakCrumArray, currentActiveStepCompleted)}
                </div>
                <div className='mainContent'>
                    <div className='basicsettings'>
                        <Header className='titleHeader'>Basic settings</Header>
                        <Form>
                            <div className='createnewSec'>
                                <div className="requiredfield field">
                                    <Form.Field
                                        id='form-input-control-group-name'
                                        name="name"
                                        control={Input}
                                        label='Group name'
                                        placeholder='Your group name'
                                        value={name}
                                        onChange={handleOnChange}
                                        onBlur={handleOnBlur}
                                        error={!validity.doesNameExist}
                                    />
                                    {!validity.doesNameExist &&
                                        <p className="error-message"><Icon name="exclamation circle" />The field is required</p>
                                    }
                                </div>
                                <Form.Group widths='equal'>
                                    <Form.Field
                                        className='dropdownWithArrowParent'
                                        control={Select}
                                        options={provinceOptions}
                                        name='province'
                                        label={{ children: 'Province (optional)', htmlFor: 'form-select-control-province' }}
                                        placeholder='Select a province'
                                        searchInput={{ id: 'form-select-control-province' }}
                                        onChange={handleOnChange}
                                        value={province}
                                    />
                                    <Form.Field
                                        className='dropdownWithArrowParent'
                                        name='city'
                                        control={Select}
                                        loading={true}
                                        options={uniqueCities}
                                        label={{ children: 'City (optional)', htmlFor: 'form-select-control-city' }}
                                        placeholder='Select a city'
                                        searchInput={{ id: 'form-select-control-city' }}
                                        value={city}
                                        onChange={handleOnChange}
                                        loading={uniqueCitiesLoader}
                                    />
                                </Form.Group>
                                <div className='field'>
                                    <label>Who can see this group?</label>
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
                            </div>
                            <div className='createnewSec'>
                                <Header className='sectionHeader'>Monthly gifts</Header>
                                <p>Choose whether supporters can set up monthly gifts to your Giving Group.</p>
                                <Checkbox
                                    checked={prefersRecurringEnabled === "1"}
                                    toggle
                                    className="c-chkBox left"
                                    id="discoverability"
                                    name="prefersRecurringEnabled"
                                    label='Allow monthly gifts to the Giving Group'
                                    onChange={handleOnChange}
                                />
                            </div>
                        </Form>
                        <div className='buttonsWrap'>
                            <Button
                                className='blue-btn-rounded-def'
                                disabled={disableContinue || !validity.doesNameExist}
                                onClick={handleContinue}
                            >
                                Continue
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

CreateGivingGroupBasic.defaultProps = {
    createGivingGroupStoreFlowObject: { ...intializeCreateGivingGroup }
};

CreateGivingGroupBasic.prototype = {
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
        galleryImages: PropTypes.array,
    })
};

export default CreateGivingGroupBasic;
