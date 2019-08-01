/* eslint-disable max-len */
import _ from 'lodash';
import {
    validateNewUser,
} from '../../actions/user';

const hasLowerCase = (str) => {
    return (/[a-z]/.test(str));
};

const hasUpperCase = (str) => {
    return (/[A-Z]/.test(str));
};

const hasSpecialChar = (str) => {
    return (/[!@#$%^&]/.test(str));
};

const validateUserRegistrationForm =  (field, value, validity) => {
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
            
            const isUserNew = (validity.isEmailValidFormat) ? validateNewUser(emailValue) : false;

            validity.isEmailIdNew = (validity.isEmailValidFormat) ? !isUserNew.email_exists : false;
            validity.isEmailIdValid = _.every(
                _.pick(validity, [
                    'isEmailIdNotNull',
                    'isEmailValidFormat',
                    'isEmailIdNew',
                ]),
            );
            console.log(validity.isEmailIdNew);
            break;
        case 'password':
            // validity.isPasswordNotNull = !(!value || value.length === 0);
            validity.doesPwdHaveCount = !_.isEmpty(value) ? (value.length >= 8) : false;
            validity.doesPwdhaveLowerCase = !_.isEmpty(value) ? hasLowerCase(value) : false;
            validity.doesPwdhaveUpperCase = !_.isEmpty(value) ? hasUpperCase(value) : false;
            validity.doesPwdhaveSpecialChars = !_.isEmpty(value) ? hasSpecialChar(value) : false;
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
