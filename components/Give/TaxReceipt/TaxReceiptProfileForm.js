import React from 'react';
import {Form, Input, FormField} from 'semantic-ui-react';

class TaxReceiptProfileForm extends React.Component {

    handleInputChange = (e, {
        value, name,
    }) => {
        this.props.parentInputChange(name, value);
    }

    /**
     * Synchronise form data with React state
     * @param  {Event} event The Event instance object.
     * @param  {object} options The Options of event
     * @return {Void} { void } The return nothing.
     */
    handleInputOnBlur = (event, options) => {
        // options values are getting from select control
        if (options !== undefined) {
            const {
                name,
                value,
            } = options;
            this.props.parentOnBlurChange(name, value);
        } else {
            const {
                name,
                value,
            } = event.target;
            this.props.parentOnBlurChange(name, value);
        }
    }

    displayForm() {
        if(this.props.data.attributes){
            return(
                <React.Fragment>
                    { !!this.props.showFormData &&
                                <div>
                                    <div>
                                        <Form.Field>
                                            <label htmlFor="fullName">
                                                Full Name
                                            </label>
                                            <Form.Field
                                                control={Input}
                                                id="fullName"
                                                name="fullName"
                                                size="large"
                                                error={!this.props.validity.isValidFullName}
                                                onBlur={this.handleInputOnBlur}
                                                onChange={this.handleInputChange}
                                                value={this.props.data.attributes.fullName}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <label htmlFor="addressOne">
                                                Address One
                                            </label>
                                            <Form.Field
                                                control={Input}
                                                id="addressOne"
                                                name="addressOne"
                                                size="large"
                                                error={!this.props.validity.isValidAddress}
                                                onBlur={this.handleInputOnBlur}
                                                onChange={this.handleInputChange}
                                                value={this.props.data.attributes.addressOne}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <label htmlFor="addressTwo">
                                                Address Two
                                            </label>
                                            <Form.Field
                                                control={Input}
                                                id="addressTwo"
                                                name="addressTwo"
                                                size="large"
                                                error={!this.props.validity.isValidSecondAddress}
                                                onBlur={this.handleInputOnBlur}
                                                onChange={this.handleInputChange}
                                                value={_.isEmpty(this.props.data.attributes.addressTwo) ? '' : this.props.data.attributes.addressTwo}
                                                />
                                        </Form.Field>
                                        <Form.Field>
                                            <label htmlFor="city">
                                                City
                                            </label>
                                            <Form.Field
                                                control={Input}
                                                id="city"
                                                name="city"
                                                size="large"
                                                onBlur={this.handleInputOnBlur}
                                                onChange={this.handleInputChange}
                                                value={this.props.data.attributes.city}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <label htmlFor="country">
                                                Country
                                            </label>
                                            <Form.Field
                                                control={Input}
                                                id="country"
                                                name="country"
                                                onBlur={this.handleInputOnBlur}
                                                onChange={this.handleInputChange}
                                                value={this.props.data.attributes.country}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <label htmlFor="postalCode">
                                                Postal Code
                                            </label>
                                            <Form.Field
                                                control={Input}
                                                id="postalCode"
                                                name="postalCode"
                                                size="large"
                                                // error={!validity.isValidPostalCode}
                                                onBlur={this.handleInputOnBlur}
                                                onChange={this.handleInputChange}
                                                value={this.props.data.attributes.postalCode}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <label htmlFor="province">
                                                Province
                                            </label>
                                            <Form.Field
                                                control={Input}
                                                id="province"
                                                name="province"
                                                onBlur={this.handleInputOnBlur}
                                                onChange={this.handleInputChange}
                                                value={this.props.data.attributes.province}
                                            />
                                        </Form.Field>
                                    </div>

                                    <div className="taxprofilelink">
                                        <Form.Field>
                                                <a className="achPointer ach-padding">
                                                </a>
                                        </Form.Field>
                                    </div>
                                </div>
                            }
                            { !this.props.showFormData &&
                                <div className="taxprofilelink">
                                    <Form.Field>
                                        Edit Tax receipt
                                            <a
                                                className="achPointer ach-padding"
                                                onClick={this.props.handleDisplayForm}
                                            >
                                                Edit tax receipt
                                            </a>
                                    </Form.Field>
                                </div>
                    }
                </React.Fragment>)
        } else{
            return(<div>Hi</div>)
        }
    }

    render() {
        console.log('From tax receipt form ------------> ');
        console.log(this.props);
        return(
           this.displayForm()
        )
    }
}

export default TaxReceiptProfileForm;
