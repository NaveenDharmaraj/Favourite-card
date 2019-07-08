import _ from 'lodash';
import _concat from 'lodash/concat';
import _isEmpty from 'lodash/isEmpty';
import {
    hasMinTwoChars,
    hasMinFiveChars,
    isLessThanNChars,
    isInputBlank,
} from '../common/giving-form-validations';

/**
* Determine whether the supplied field is valid.
* @param  {String} field The tax receipt profile form field name
* @param  {any} value    The field's value
* @param  {object} validity    validition properties of taxereceipt profile
* @return {object} validity return validate object.
*/
const validateTaxReceiptProfileForm = (field, value, validity) => {
    const inputRegEx = new RegExp(/^[^\\<>/]+$/);
    const postalCodeRegEx = new RegExp(/[^\w-]/);
    switch (field) {
        case 'fullName':
            validity.isFullNameHas2 = hasMinTwoChars(value);
            validity.isValidFullNameFormat = !_.isEmpty(value) ? (inputRegEx).test(value) : true;
            validity.isValidFullName = _.every(
                _.pick(validity, [
                    'isFullNameHas2',
                    'isValidFullNameFormat',
                ]),
            );
            break;
        case 'addressOne':
            validity.isAddressHas2 = hasMinTwoChars(value);
            validity.isAddressLessThan128 = isLessThanNChars(value, 128);
            validity.isValidAddressFormat = !_.isEmpty(value) ? (inputRegEx).test(value) : true;
            validity.isValidAddress = _.every(
                _.pick(validity, [
                    'isAddressLessThan128',
                    'isAddressHas2',
                    'isValidAddressFormat',
                ]),
            );
            break;
        case 'addressTwo':
            validity.isValidSecondAddress = !_.isEmpty(value) ? (inputRegEx).test(value) : true;
            break;
        case 'city':
            validity.isCityHas2Chars = hasMinTwoChars(value);
            validity.isCityLessThan64 = isLessThanNChars(value, 64);
            validity.isValidCityFormat = !_.isEmpty(value) ? (inputRegEx).test(value) : true;
            validity.isValidCity = _.every(
                _.pick(validity, [
                    'isCityHas2Chars',
                    'isCityLessThan64',
                    'isValidCityFormat',
                ]),
            );
            break;
        case 'province':
            validity.isValidProvince = !isInputBlank(value);
            break;
        case 'postalCode':
            const postalValue = value.trim();
            const postalValueRex = value.replace(/ /g, '');
            validity.isPostalCodehas5Chars = hasMinFiveChars(postalValue);
            validity.isPostalCodeLessThan16 = isLessThanNChars(postalValue, 16);
            validity.isValidPostalCodeFormat = !_.isEmpty(postalValueRex) ? !(postalCodeRegEx).test(postalValueRex) : true;
            validity.isValidPostalCode = _.every(
                _.pick(validity, [
                    'isPostalCodehas5Chars',
                    'isPostalCodeLessThan16',
                    'isValidPostalCodeFormat',
                ]),
            );
            break;
        default: break;
    }
    return validity;
};



export {
    validateTaxReceiptProfileForm
};
