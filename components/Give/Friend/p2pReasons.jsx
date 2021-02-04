import React from 'react';
import {
    Form,Select,Input
} from 'semantic-ui-react';
function P2pReasons(props) {
    const options_2 =[
        {
         text: 'Thank you',
         value: 'Thank you',
         },
        {
         text: 'charitable Allowance',
         value: 'charitable Allowance',
         },
        {
        text: 'Other',
        value: 'Other',
         },
         {
            text: 'Perfer not to Say',
            value: 'Perfer not to Say',
             },
        ]

    return (
       <div>
            <div className="Wrapper_Reason">
        <Form.Field >
            <label>
              Reason to give
            </label>
            <Form.Field
                control={Select}
                className="dropdownWithArrowParent icon"
                id="infoToShare"
                name="infoToShare"
                options={options_2}
                placeholder="Birthday"
            />
        </Form.Field>
        </div>
        <div className="giving_optional">
            <Form.Field
                control={Input}
                icon={null}
                placeholder="Why are you giving? (optional)"
                size="large"
                
            />
        
        </div>
       </div>
    )
}

export default P2pReasons; 