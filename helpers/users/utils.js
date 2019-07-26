/* eslint-disable max-len */
import _ from 'lodash';

const hasLowerCase = (str) => {
    return (/[a-z]/.test(str));
};

const hasUpperCase = (str) => {
    return (/[A-Z]/.test(str));
};

const hasSpecialChar = (str) => {
    return (/[!@#$%^&]/.test(str));
};

const validateUserRegistrationForm = (field, value, validity) =>{
    // console.log(value.length);
    const emailRegex = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
    switch (field) {
        case 'firstName':
            validity.isFirstNameNotNull = !(!value || value.length === 0);
            break;
        case 'lastName':
            validity.isLastNameNotNull = !(!value || value.length === 0);
            break;
        case 'emailId':
            const emailValue = value;
            validity.isEmailIdNotNull = !(!value || value.length === 0);
            validity.isEmailValidFormat = !_.isEmpty(emailValue) ? (emailRegex).test(emailValue) : true;
            validity.isEmailIdValid = _.every(
                _.pick(validity, [
                    'isEmailIdNotNull',
                    'isEmailValidFormat',
                ]),
            );
            break;
        case 'password':
            // validity.isPasswordNotNull = !(!value || value.length === 0);
            validity.doesPwdHaveCount = (value.length >= 8) ? true : false;
            validity.doesPwdhaveLowerCase = hasLowerCase(value);
            validity.doesPwdhaveUpperCase = hasUpperCase(value);
            validity.doesPwdhaveSpecialChars = hasSpecialChar(value);
            validity.isPasswordValid = _.every(
                _.pick(validity, [
                    // 'isPasswordNotNull',
                    'doesPwdHaveCount',
                    'doesPwdhaveLowerCase',
                    'doesPwdhaveUpperCase',
                    'doesPwdhaveSpecialChars',
                ]),
            );
            break;
        default:
            break;
    }
    return validity;
};


export default validateUserRegistrationForm;
