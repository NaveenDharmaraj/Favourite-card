import React, {
    Fragment,
} from 'react';
import _ from 'lodash';
import {
    Dropdown,
    Form,
    Placeholder,
} from 'semantic-ui-react';
import FormValidationErrorMessage from '../FormValidationErrorMessage';

function TaxReceiptDropDown(props) {
    const {
        disableField,
        formatMessage,
        giveTo,
        handleAddNewButtonClicked,
        handleInputChange,
        taxReceipt,
        taxReceiptsOptions,
        validity,
    } = props;
    let taxReceiptField = null;
    if (!disableField) {
        if (!_.isEmpty(taxReceiptsOptions) && taxReceiptsOptions.length > 1 && giveTo.value > 0 && taxReceipt) {
            taxReceiptField = (
                <Form.Field>
                    <div className="paymentMethodDropdown add_space">
                        <label htmlFor="">Tax receipt recipient</label>
                        <Dropdown
                            button
                            className="taxReceiptDropDown label_top mb-3"
                            name="taxReceipt"
                            icon='cardExpress'
                            floating
                            fluid
                            selection
                            options={taxReceiptsOptions}
                            onChange={handleInputChange}
                            placeholder='Select Tax Receipt'
                            value={taxReceipt.value}
                        />
                    </div>
                </Form.Field>
            );
        } else if (_.isEmpty(taxReceiptsOptions) && giveTo.value > 0) {
            taxReceiptField = (
                <div className="mb-2">
                    <label>Tax receipt recipient</label>
                    <div
                        className="addNewCardInput mb-1"
                        id="addNewTaxReceipt"
                        onClick={handleAddNewButtonClicked}>
                        + Add new tax receipt recipient
                    </div>
                    <FormValidationErrorMessage
                        condition={!validity.isTaxReceiptSelected}
                        errorMessage={formatMessage('giveCommon:errorMessages.taxReceiptNotAdded')}
                    />
                </div>
            );
        }
    } else {
        taxReceiptField = (
            <Placeholder>
                <Placeholder.Header>
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder.Header>
            </Placeholder>
        );
    }
        return taxReceiptField;
}
export default TaxReceiptDropDown;
