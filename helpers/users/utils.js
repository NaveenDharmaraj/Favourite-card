/* eslint-disable max-len */
import _ from 'lodash';

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
            validity.isEmailValidFormat = !_.isEmpty(emailValue) ? !(emailRegex).test(emailValue) : true;
            validity.isEmailIdValid = _.every(
                _.pick(validity, [
                    'isEmailIdNotNull',
                    'isEmailValidFormat',
                ]),
            );
            break;
        case 'password':
            validity.isPasswordNotNull = !(!value || value.length === 0);
            break;
        default:
            break;
    }
    return validity;
};

export default validateUserRegistrationForm;
