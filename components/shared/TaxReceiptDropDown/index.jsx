import React, {
    Fragment,
} from 'react';
import _ from 'lodash';
import {
    Dropdown,
    Form,
} from 'semantic-ui-react';

function TaxReceiptDropDown(props) {
    const {
        giveTo,
        handleAddNewButtonClicked,
        handleInputChange,
        taxReceipt,
        taxReceiptsOptions,
    } = props;
    let taxReceiptField = null;
    if (!_.isEmpty(taxReceiptsOptions) && taxReceiptsOptions.length > 1 && giveTo.value > 0) {
        taxReceiptField = (
            <Form.Field className="mb-2">
                <div className="paymentMethodDropdown add_space">
                    <label htmlFor="">Tax receipt</label>
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
    } else if (!_.isEmpty(taxReceiptsOptions) && taxReceiptsOptions.length === 1 && giveTo.value > 0) {
        taxReceiptField = (
            <Fragment>
                <label>Tax Receipt</label>
                <div
                    className="addNewCardInput mb-3"
                    id="addNewTaxReceipt"
                    onClick={handleAddNewButtonClicked}>
                    + Add new tax receipt
                </div>
            </Fragment>
        );
    }
    return taxReceiptField;
}
export default TaxReceiptDropDown;
