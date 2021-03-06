/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import {
    Form,
    Grid,
    Icon,
    Input,
    Button,
    Popup,
    Select,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

import {
    canadaProvinceOptions,
    countryOptions,
    usStateOptions,
} from '../../../helpers/constants';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import { withTranslation } from '../../../i18n';

function TaxReceiptProfileForm(props) {
    const handleInputChange = (e, {
        value, name,
    }) => {
        // condition for restricting the max characters to be entered in full name input field
        if (name === 'fullName' && !_isEmpty(value) && value.length > 250) {
            return;
        }
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
            t,
            validity,
        } = props;
        const formatMessage = t;
        let provinceOptions = canadaProvinceOptions;
        let showUSNote = false;
        let provinceMessage = 'province';
        if (country !== countryOptions[0].value) {
            provinceOptions = usStateOptions;
            provinceMessage = 'state';
            showUSNote = true;
        }
        const invalidCharsErrorMsg = `${formatMessage('invalidInputFormat')} "\\/<>"`;
        if (props.data.attributes) {
            return (
                <React.Fragment>
                    { !!showFormData
                    && <div>
                        <div className="addRecipientForm">
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
                                    condition={!validity.isFullNameHas2}
                                    errorMessage={formatMessage('invalidFullName')}
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.isValidFullNameFormat}
                                    errorMessage={invalidCharsErrorMsg}
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
                                    condition={!validity.isAddressHas2}
                                    errorMessage={formatMessage('invalidAddress')}
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.isAddressLessThan128}
                                    errorMessage={formatMessage('invalidFieldLength', {
                                        fieldName: 'address',
                                        length: 128,
                                    })}
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.isValidAddressFormat}
                                    errorMessage={invalidCharsErrorMsg}
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
                                    value={_isEmpty(addressTwo) ? '' : addressTwo}
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.isValidSecondAddress}
                                    errorMessage={invalidCharsErrorMsg}
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
                                    condition={!validity.isCityHas2Chars}
                                    errorMessage={formatMessage('invalidCity')}
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.isCityLessThan64}
                                    errorMessage={formatMessage('invalidFieldLength', {
                                        fieldName: 'city name',
                                        length: 64,
                                    })}
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.isValidCityFormat}
                                    errorMessage={invalidCharsErrorMsg}
                                />
                            </Form.Field>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column mobile={16} tablet={8} computer={8}>
                                        <Form.Field className="mb-1">
                                            <label htmlFor="country">
                                                {formatMessage('country')}
                                            </label>
                                            <Form.Field
                                                control={Select}
                                                className="dropdownWithArrowParent"
                                                id="country"
                                                name="country"
                                                onBlur={handleInputOnBlur}
                                                options={countryOptions}
                                                onChange={handleInputChange}
                                                selection
                                                value={country}
                                            />
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column mobile={16} tablet={8} computer={8}>
                                        <Form.Field className="mb-1">
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
                                                condition={!validity.isPostalCodehas5Chars}
                                                errorMessage={formatMessage('invalidPostalCode')}
                                            />
                                            <FormValidationErrorMessage
                                                condition={!validity.isPostalCodeLessThan16}
                                                errorMessage={formatMessage('invalidFieldLength', {
                                                    fieldName: 'postal code',
                                                    length: 16,
                                                })}
                                            />
                                            <FormValidationErrorMessage
                                                condition={!validity.isValidPostalCodeFormat}
                                                errorMessage={invalidCharsErrorMsg}
                                            />
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Form.Field>
                                <label htmlFor="province">
                                    {formatMessage(provinceMessage)}
                                </label>
                                <Form.Field
                                    closeOnBlur={false}
                                    control={Select}
                                    id="province"
                                    name="province"
                                    className="dropdownWithArrowParent"
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
                                <span
                                    className="spanLink"
                                    onClick={()=>{props.handleDisplayForm()}}>
                                    {formatMessage('makeChangesText')}
                                </span>
                                    
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
export default withTranslation('taxReceipt')(TaxReceiptProfileForm);
