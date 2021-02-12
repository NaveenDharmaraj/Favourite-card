import React, { Fragment } from 'react';
import {
    Header,
    Form,
    Checkbox,
    Button,
    Icon,
    TextArea,
} from 'semantic-ui-react';

import { Link } from '../../../routes';

function addDonation() {

    
    return (
 
        <div className='basicsettings'>
             <Header className='titleHeader transaction'>Add donation button
            <p className="SubHeader">You can add a donation button to your website to accept credit card donations through Charitable Impact. </p>
            </Header>
            <Form>
                    <div className='GetDonation'>
                        <Header as='h3'>Get the donation button</Header>
                        <div className="Step1">
                            <Header as='h5'>Step 1</Header>
                            <p className="stepSubHeader">Choose a button design</p>
                        </div>
                        <div className="Donateonline chkMarginBtm checkboxToRadio"> <Checkbox /> <Button className='primary btn-width-donate blue-btn-rounded-def'>Donate online</Button></div>
                        <div className="Donateonline chkMarginBtm checkboxToRadio"> <Checkbox /><Button className='btn-width-donate success-btn-rounded-def'> Donate online</Button></div>
                        <div className="Step1 top-mrg">
                            <Header as='h5'>Step 2</Header>
                            <p className="stepSubHeader">Paste this code on your website where you’d like the button to appear.</p>
                            <p>The person who manages your website will likely be able to help you with this. You can also copy and paste the code in an email to them.</p>
                        </div>
                        <div className="donationTextares">
                        <TextArea type="text" value="https://chimp.net/widget/js/loader.js?MTcxOTgsbWluaSx0ZWFsLEtlaSYjMzk7cyBUZXN0IEdyb3VwLEdyb3Vw" />
                        </div>
                </div>
            </Form>
        </div>    
    
    );
}

export default addDonation;
