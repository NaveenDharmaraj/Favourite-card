import React, { Fragment } from 'react';
import {
    Header,
    Button,
    Dropdown,
    Input,
    Form,
    Select,
    Icon,
    Responsive
} from 'semantic-ui-react';

import { Link } from '../../../routes';

function BasicSetings() {

    const provinceOptions = [
        { key: 'm', text: 'Male', value: 'male' },
        { key: 'f', text: 'Female', value: 'female' },
        { key: 'o', text: 'Other', value: 'other' },
      ]
    const whoCanSeeOptions = [
        {
            key: 'Public',
            text: <span className='text'><Icon className='globe'/>This group is public, anyone can see it.</span>,
            value: 'Public',
        },
        {
            key: 'Private',
            text: <span className='text'><Icon className='lock'/>This group is private, only those who are invited to the Giving Group can join</span>,
            value: 'Private',
        },
    ]  
    return (
 
        <div className='basicsettings'>
            <Header className='titleHeader'>
                <Responsive maxWidth={767}>
                    <Icon name='back'></Icon>
                </Responsive>
                Basic settings
            </Header>
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
                    <div className='buttonsWrap'>
                        <Link route='/giving-groups/create-group/about'>
                            <Button className='blue-btn-rounded-def'>Save</Button>
                        </Link>    
                    </div>
                </div>
            </Form>
            
        </div>    
    
    );
}

export default BasicSetings;
