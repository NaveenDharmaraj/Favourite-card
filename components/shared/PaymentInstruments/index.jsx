import React, {
    Fragment,
} from 'react';
import _ from 'lodash';
import {
    Dropdown,
    Form,
} from 'semantic-ui-react';

function PaymentInstruments(props) {
    const {
        creditCard,
        giveTo,
        formatMessage,
        handleAddNewButtonClicked,
        handleInputChange,
        options,
    } = props;
    let iconClass = {
        amex: 'cardExpress',
        discover: "cardVisa",
        mastercard: "cardMaster",
        stripe: "cardVisa",
        visa: "cardVisa",
    };
    let creditCardField = null;
    if (_.isEmpty(options) && giveTo.value > 0) {
        creditCardField = (
            <Fragment>
                <label>Payment method</label>
                <div
                className="addNewCardInput mb-2"
                id="addNewCreditCard"
                onClick={handleAddNewButtonClicked}>
                    + Add new card
                </div>
            </Fragment>
        );
    } else if (!_.isEmpty(options) && giveTo.value > 0) {
        creditCardField = (
            <Fragment>
                <Form.Field>
                    <label htmlFor="creditCard">
                        {formatMessage('giveCommon:creditCardLabel')}
                    </label>
                    <div className="paymentMethodDropdown">
                        <Dropdown
                            id="creditCard"
                            name="creditCard"
                            button
                            icon={iconClass[creditCard.processor]}
                            className="dropdownWithArrowParent icon creditCardDropDown mb-3"
                            selection
                            fluid
                            floating
                            labeled
                            onChange={handleInputChange}
                            options={options}
                            placeholder={formatMessage('creditCardPlaceholder')}
                            value={creditCard.value}
                        />
                    </div>

                </Form.Field>
            </Fragment>
        );
    }
    
    return creditCardField;
}
export default PaymentInstruments;
