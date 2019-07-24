import _ from 'lodash';

const validateUserRegistrationForm = (field, value, validity) =>{
    // console.log(value.length);
    switch (field) {
        case 'firstName':
            validity.isFirstNameNotNull = !(!value || value.length === 0);
            break;
        case 'lastName':
            validity.isLastNameNotNull = !(!value || value.length === 0);
            break;
        case 'emailId':
            validity.isEmailIdNotNull = !(!value || value.length === 0);
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
