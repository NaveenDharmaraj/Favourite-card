import React from 'react';
import {
    Form,Select,Input
} from 'semantic-ui-react';
function P2pFrequency(props) {
    const options =[
        {
         text: 'Send once',
         value: 'Send once',
         },
        {
         text: 'Repeat weekly on Thursday',
         value: 'Repeat weekly on Thursday',
         },
        {
        text: 'Repeat monthly on the 9th',
        value: 'Repeat monthly on the 9th',
         },
         {
            text: 'Repeat annually on July 9',
            value: 'Repeat annually on July 9',
             },
        ]
    return (
        <div className="Frequency_Reason">
            <div className="Frequency_Wrapper">
            <Form.Field >
                    <label>
                        Frequency
                    </label>
                    <Form.Field
                        control={Select}
                        className="dropdownWithArrowParent icon"
                        id="infoToShare"
                        name="infoToShare"
                        options={options}
                        placeholder="Repeat weekly on Thursday"
                    />
                </Form.Field>
            </div>
    </div>
    );
}

export default P2pFrequency; 