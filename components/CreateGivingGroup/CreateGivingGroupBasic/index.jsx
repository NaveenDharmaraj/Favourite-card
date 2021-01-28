import React from 'react';
import {
    Container,
    Header,
    Button,
    Dropdown,
    Input,
    Breadcrumb,
    Form,
    Select,
    Icon,
    Checkbox,
} from 'semantic-ui-react';
import { generateBreadCrum } from '../../../helpers/createGrouputils';

import { Link } from '../../../routes';
import '../../../static/less/create_manage_group.less';

const provinceOptions = [
    { key: 'm', text: 'Male', value: 'male' },
    { key: 'f', text: 'Female', value: 'female' },
    { key: 'o', text: 'Other', value: 'other' },
]
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

const CreateGivingGroupBasic = () => {
    const breakCrumArray = ['Basic settings', 'About the group', 'Pics & video', 'Charities and goal'];
    const currentActiveStepCompleted = [1];
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
                                        control={Input}
                                        label='Group name'
                                        placeholder='Your group name'
                                    />
                                    <p className="error-message"><Icon name="exclamation circle" />The field is required</p>
                                </div>
                                <Form.Group widths='equal'>
                                    <Form.Field
                                        className='dropdownWithArrowParent'
                                        control={Select}
                                        options={provinceOptions}
                                        label={{ children: 'Province (optional)', htmlFor: 'form-select-control-province' }}
                                        placeholder='Select a province'
                                        searchInput={{ id: 'form-select-control-province' }}
                                    />
                                    <Form.Field
                                        className='dropdownWithArrowParent'
                                        control={Select}
                                        options={provinceOptions}
                                        label={{ children: 'City (optional)', htmlFor: 'form-select-control-city' }}
                                        placeholder='Select a city'
                                        searchInput={{ id: 'form-select-control-city' }}
                                    />
                                </Form.Group>
                                <div className='field'>
                                    <label>Who can see this group?</label>
                                    <Dropdown
                                        inline
                                        options={whoCanSeeOptions}
                                        defaultValue={whoCanSeeOptions[0].value}
                                        icon='chevron down'
                                        className='whocanseeDropdown'
                                    />
                                </div>
                            </div>
                            <div className='createnewSec'>
                                <Header className='sectionHeader'>Monthly gifts</Header>
                                <p>Choose whether supporters can set up monthly gifts to your Giving Group.</p>
                                <Checkbox
                                    toggle
                                    className="c-chkBox left"
                                    id="discoverability"
                                    name="allowMonthly"
                                    label='Allow monthly gifts to the Giving Group'
                                />
                            </div>
                        </Form>
                        <div className='buttonsWrap'>
                            <Link route='/giving-groups/create-group/about'>
                                <Button className='blue-btn-rounded-def'>Continue</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default CreateGivingGroupBasic;
