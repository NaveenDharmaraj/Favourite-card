import React, { Fragment } from 'react';
import {
    Header,
    Form,
    Checkbox,
} from 'semantic-ui-react';

import { Link } from '../../../routes';

function MonthlyGifts() {

    
    return (
 
        <div className='basicsettings'>
            <Header className='titleHeader'>Monthly gifts</Header>
            <Form>
                <div className='createnewSec'>
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
        </div>    
    
    );
}

export default MonthlyGifts;
