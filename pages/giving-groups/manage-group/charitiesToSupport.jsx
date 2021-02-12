import React, { Fragment } from 'react';
import {
    Header,
    Input,
    Icon,
    Image,
    Form,
} from 'semantic-ui-react';

import { Link } from '../../../routes';

function CharitiesToSupport() {

    
    return (
 
        <div className='basicsettings'>
            <Header className='titleHeader'>Charities to support</Header>
            <Form>
                <div className='createnewSec'>
                <p className='charityPara_1'>Choose which charities this group plans to support.</p>
                <p className='charityPara_2'>You can select up to 5 charities and you can change these anytime.</p>
                <div className="searchBox charitysearch">
                    <Input
                        className="searchInput"
                        placeholder="Search for charity"
                        fluid
                    />
                    <a
                        className="search-btn"
                    >
                    </a>
                </div>
                <div className='charityWrap'>
                    <div className="charity">
                        <Icon className='remove'/>
                        <Image src='../../static/images/no-data-avatar-giving-group-profile.png'/>
                        <Header>YWAM</Header>
                    </div>
                    <div className="charity">
                        <Icon className='remove'/>
                        <Image src='../../static/images/no-data-avatar-giving-group-profile.png'/>
                        <Header>YWAM</Header>
                    </div>
                    <div className="charity">
                        <Icon className='remove'/>
                        <Image src='../../static/images/no-data-avatar-giving-group-profile.png'/>
                        <Header>YWAM</Header>
                    </div>
                    <div className="charity">
                        <Icon className='remove'/>
                        <Image src='../../static/images/no-data-avatar-giving-group-profile.png'/>
                        <Header>YWAM</Header>
                    </div>
                </div>
            </div>
           </Form>
        </div>    
    
    );
}

export default CharitiesToSupport;
