import {
    Form, Select, Input
} from 'semantic-ui-react';
const reasonValueArray = ['Birthday', 'Thank you', 'Charitable Allowance', 'Prefer not to say'];
const P2pReasons = ({ handleSendMoneyInputChange, reason, reasonOther }) => {
    const reasonOptions = [
        {
            text: 'Birthday',
            value: 'Birthday',
        },
        {
            text: 'Thank you',
            value: 'Thank you',
        },
        {
            text: 'Charitable Allowance',
            value: 'Charitable Allowance',
        },
        {
            text: 'Other',
            value: 'Other',
        },
        {
            text: 'Prefer not to say',
            value: 'Prefer not to say',
        },
    ];

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
                        id="reason"
                        name="reason"
                        options={reasonOptions}
                        value={reasonValueArray.includes(reason) ? reason : 'Other'}
                        onChange={handleSendMoneyInputChange}
                    />
                </Form.Field>
            </div>
            {!reasonValueArray.includes(reason) && <div className="giving_optional">
                <Form.Field
                    control={Input}
                    icon={null}
                    placeholder="Why are you giving? (optional)"
                    maxLength='100'
                    size="large"
                    name="reasonOther"
                    onChange={handleSendMoneyInputChange}
                    value={reasonOther}
                />
            </div>
            }
        </div>
    );
};

P2pReasons.defaultProps = {
    handleSendMoneyInputChange: () => { },
    reason: '',
    reasonOther: '',
};

export default P2pReasons;
