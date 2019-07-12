/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import {
    Form,
    Input,
    Button,
} from 'semantic-ui-react';


function TaxReceiptProfileForm(props) {
    const handleInputChange = (e, {
        value, name,
    }) => {
        props.parentInputChange(name, value);
    };

    /**
     * Synchronise form data with React state
     * @param  {Event} event The Event instance object.
     * @param  {object} options The Options of event
     * @return {Void} { void } The return nothing.
     */
    const handleInputOnBlur = (event, options) => {
        // options values are getting from select control
        if (options !== undefined) {
            const {
                name,
                value,
            } = options;
            props.parentOnBlurChange(name, value);
        } else {
            const {
                name,
                value,
            } = event.target;
            props.parentOnBlurChange(name, value);
        }
    };

    const displayForm = () => {
        const {
            formatMessage,
        } = props;
        if (props.data.attributes) {
            return (
                <React.Fragment>
                    { !!props.showFormData 
                    && <div>
                        <div>
                            <Form.Field>
                                <label htmlFor="fullName">
                                    {formatMessage('fullName')}
                                </label>
                                <Form.Field
                                    control={Input}
                                    id="fullName"
                                    name="fullName"
                                    size="large"
                                    error={!props.validity.isValidFullName}
                                    onBlur={handleInputOnBlur}
                                    onChange={handleInputChange}
                                    value={props.data.attributes.fullName}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="addressOne">
                                    {formatMessage('address')}
                                </label>
                                <Form.Field
                                    control={Input}
                                    id="addressOne"
                                    name="addressOne"
                                    size="large"
                                    error={!props.validity.isValidAddress}
                                    onBlur={handleInputOnBlur}
                                    onChange={handleInputChange}
                                    value={props.data.attributes.addressOne}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="addressTwo">
                                    {formatMessage('secondAddress')}
                                </label>
                                <Form.Field
                                    control={Input}
                                    id="addressTwo"
                                    name="addressTwo"
                                    size="large"
                                    error={!props.validity.isValidSecondAddress}
                                    onBlur={handleInputOnBlur}
                                    onChange={handleInputChange}
                                    value={_.isEmpty(props.data.attributes.addressTwo) ? '' : props.data.attributes.addressTwo}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="city">
                                    {formatMessage('city')}
                                </label>
                                <Form.Field
                                    control={Input}
                                    id="city"
                                    name="city"
                                    size="large"
                                    onBlur={handleInputOnBlur}
                                    onChange={handleInputChange}
                                    value={props.data.attributes.city}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="country">
                                    {formatMessage('coutnry')}
                                </label>
                                <Form.Field
                                    control={Input}
                                    id="country"
                                    name="country"
                                    onBlur={handleInputOnBlur}
                                    onChange={handleInputChange}
                                    value={props.data.attributes.country}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="postalCode">
                                    {formatMessage('postalCode')}
                                </label>
                                <Form.Field
                                    control={Input}
                                    id="postalCode"
                                    name="postalCode"
                                    size="large"
                                    // error={!validity.isValidPostalCode}
                                    onBlur={handleInputOnBlur}
                                    onChange={handleInputChange}
                                    value={props.data.attributes.postalCode}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="province">
                                    {formatMessage('province')}
                                </label>
                                <Form.Field
                                    control={Input}
                                    id="province"
                                    name="province"
                                    onBlur={handleInputOnBlur}
                                    onChange={handleInputChange}
                                    value={props.data.attributes.province}
                                />
                            </Form.Field>
                        </div>

                        <div className="taxprofilelink">
                            <Form.Field>
                                <a className="achPointer ach-padding"/>
                            </Form.Field>
                        </div>
                    </div>
                    }
                    { !props.showFormData &&
                        <div className="taxprofilelink">
                            <Form.Field>
                                {formatMessage('editTaxReceipt')}
                                <Button secondary onClick={props.handleDisplayForm}>
                                    {formatMessage('editTaxReceipt')}
                                </Button>
                                    
                            </Form.Field>
                        </div>
                    }
                </React.Fragment>)
        } else {
            return (<div>No data available</div>)
        }
    };
    return (
        displayForm()
    );
}
export default TaxReceiptProfileForm;
