import {
    Form, Select,
} from 'semantic-ui-react';
const P2pFrequency = ({ frequencyObject, handleSendMoneyInputChange }) => {
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
                        id="frequency"
                        name="frequency"
                        options={frequencyObject.options}
                        value={frequencyObject.value}
                        onChange={handleSendMoneyInputChange}
                    />
                </Form.Field>
            </div>
        </div>
    );
};

P2pFrequency.defaultProps = {
    frequencyObject: {
        options: [
            {
                text: 'Send once',
                value: 'once',
            },
        ],
        value: 'once',
    },
    handleSendMoneyInputChange: () => { },
};

export default P2pFrequency;
