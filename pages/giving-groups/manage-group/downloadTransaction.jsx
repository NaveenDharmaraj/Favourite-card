import React, { Fragment } from 'react';
import {
    Header,
    Form,
    Checkbox,
    Button,
    Icon,
} from 'semantic-ui-react';

import { Link } from '../../../routes';

function downloadTransaction() {

    
    return (
 
        <div className='basicsettings'>
            <Header className='titleHeader transaction'>Download transaction data
            <p className="SubHeader">Download transaction data and donor information</p>
            </Header>
            <Form>
                <div className='TransactionText'>
                <p className="Transactioncontent">This report includes any information that the donor has chosen to share with Giving Group administrators, such as their name, email, mailing address, and a custom message.</p>
                <Button className='success-btn-rounded-def transactionBtn'><Icon className='transaction'/>Download transaction data</Button>
                </div>
            </Form>
        </div>    
    
    );
}

export default downloadTransaction;
