import React, {
    Fragment,
} from 'react';
import _ from 'lodash';
import {
    Dropdown,
    Form,
    Placeholder,
} from 'semantic-ui-react';

import { Link } from '../../../routes';
import FormValidationErrorMessage from '../FormValidationErrorMessage';

function PaymentInstruments(props) {
    const {
        creditCard,
        giveTo,
        disableField,
        formatMessage,
        handleAddNewButtonClicked,
        handleInputChange,
        options,
        validity,
        fromEdit,
    } = props;
    let iconClass = {
        amex: 'cardExpress',
        discover: "cardVisa",
        express: 'cardExpress',
        mastercard: "cardMaster",
        stripe: "cardVisa",
        visa: "cardVisa",
    };
    let creditCardField = null;
    if (!disableField) {
        if (_.isEmpty(options) && giveTo.value > 0) {
            creditCardField = (
                <Fragment>
                  <div className="field give_flow_field">
                        <label>Payment method</label>
                        <div
                            className="addNewCardInput credit-card"
                            id="addFirstCreditCard"
                            onClick={handleAddNewButtonClicked}>
                            + Add new card
                        </div>
                        <FormValidationErrorMessage
                            condition={!validity.isCreditCardSelected}
                            errorMessage={formatMessage('giveCommon:errorMessages.creditCardNotAdded')}
                        />
                    </div>
                </Fragment>
            );
        } else if (!_.isEmpty(options) && giveTo.value > 0) {
            creditCardField = (
                <Fragment>                  
                    <Form.Field className="give_flow_field">
                        <label htmlFor="creditCard">
                            {formatMessage('giveCommon:creditCardLabel')}
                        </label>
                        <div className="paymentMethodDropdown">
                            <Dropdown
                                id="creditCard"
                                name="creditCard"
                                button
                                icon={iconClass[creditCard.processor]}
                                className="dropdownWithArrowParent icon creditCardDropDown"
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
                        {(fromEdit)
                            && (
                                <p className="payment_method">
                                        {formatMessage('giveCommon:creditCardEditMessagePart1')}
                                    &nbsp;
                                        <Link route='profile/settings/creditcard'>
                                            {formatMessage('giveCommon:creditCardEditMessagePart2')}
                                        </Link>
                                    &nbsp;
                                        {formatMessage('giveCommon:creditCardEditMessagePart3')}

                                </p>
                            )
                        }
                    </Form.Field>
                </Fragment>
            );
        }
    } else {
        creditCardField = (
            <Placeholder>
                <Placeholder.Header>
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder.Header>
            </Placeholder>
        );
    }
    return creditCardField;
}
export default PaymentInstruments;
