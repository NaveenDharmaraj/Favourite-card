/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import {
    Form,
    Icon,
    Input,
    Button,
    Popup,
    Select,
} from 'semantic-ui-react';
import _ from 'lodash';

import {
    canadaProvinceOptions,
    countryOptions,
    usStateOptions,
} from '../../../helpers/constants';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';

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
            showFormData,
            data: {
                attributes: {
                    fullName,
                    addressOne,
                    addressTwo,
                    city,
                    country,
                    postalCode,
                    province,
                },
            },
            validity,
        } = props;
        let provinceOptions = canadaProvinceOptions;
        let showUSNote = false;
        let provinceMessage = 'province';
        if (country !== countryOptions[0].value) {
            provinceOptions = usStateOptions;
            provinceMessage = 'state';
            showUSNote = true;
        }
        if (props.data.attributes) {
            return (
                <React.Fragment>
                    { !!showFormData
                    && <div>
                        <div>
                            <Form.Field>
                                <label htmlFor="fullName">
                                    {formatMessage('fullName')}
                                </label>
                                <Popup
                                    content={formatMessage('fullNamePopup')}
                                    position="top center"
                                    trigger={
                                        <Icon
                                            color="blue"
                                            name="question circle"
                                            size="large"
                                        />
                                    }
                                />
                                <Form.Field
                                    control={Input}
                                    id="fullName"
                                    name="fullName"
                                    size="large"
                                    error={!validity.isValidFullName}
                                    onBlur={handleInputOnBlur}
                                    onChange={handleInputChange}
                                    placeholder={formatMessage('fullNamePlaceHolder')}
                                    value={fullName}
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.isValidFullName}
                                    errorMessage={formatMessage('invalidFullName')}
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
                                    error={!validity.isValidAddress}
                                    onBlur={handleInputOnBlur}
                                    onChange={handleInputChange}
                                    placeholder={formatMessage('addressPlaceHolder')}
                                    value={addressOne}
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.isValidAddress}
                                    errorMessage={formatMessage('invalidAddress')}
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
                                    error={!validity.isValidSecondAddress}
                                    onBlur={handleInputOnBlur}
                                    onChange={handleInputChange}
                                    placeholder={formatMessage('secondAddressPlaceHolder')}
                                    value={_.isEmpty(addressTwo) ? '' : addressTwo}
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
                                    error={!validity.isValidCity}
                                    onBlur={handleInputOnBlur}
                                    onChange={handleInputChange}
                                    placeholder={formatMessage('cityPlaceHolder')}
                                    value={city}
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.isValidCity}
                                    errorMessage={formatMessage('invalidCity')}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="country">
                                    {formatMessage('country')}
                                </label>
                                <Form.Field
                                    control={Select}
                                    id="country"
                                    name="country"
                                    onBlur={handleInputOnBlur}
                                    options={countryOptions}
                                    onChange={handleInputChange}
                                    selection
                                    value={country}
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
                                    error={!validity.isValidPostalCode}
                                    onBlur={handleInputOnBlur}
                                    onChange={handleInputChange}
                                    placeholder={formatMessage('postalCodePlaceHolder')}
                                    value={postalCode}
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.isValidAddress}
                                    errorMessage={formatMessage('invalidPostalCode')}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="province">
                                    {formatMessage(provinceMessage)}
                                </label>
                                <Form.Field
                                    control={Select}
                                    id="province"
                                    name="province"
                                    onBlur={handleInputOnBlur}
                                    options={provinceOptions}
                                    onChange={handleInputChange}
                                    placeholder={formatMessage('provincePlaceHolder')}
                                    error={!validity.isValidProvince}

                                    value={province}
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.isValidProvince}
                                    errorMessage={formatMessage('invalidProvince')}
                                />
                            </Form.Field>
                            { showUSNote &&
                            <div id="usNote">
                                <p>
                                    {formatMessage('usCountryNote')}
                                </p>
                            </div>
                            }
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
                                {formatMessage('changeAddressText')}
                                <Button secondary style={{ marginLeft: '1rem' }} onClick={()=>{props.handleDisplayForm()}}>
                                    {formatMessage('makeChangesText')}
                                </Button>
                                    
                            </Form.Field>
                        </div>
                    }
                </React.Fragment>);
        } else {
            return (<div>No data available</div>)
        }
    };
    return (
        displayForm()
    );
}
export default TaxReceiptProfileForm;
