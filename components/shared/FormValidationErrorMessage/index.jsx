import {
    bool,
    string,
} from 'prop-types';
import { Icon } from 'semantic-ui-react';
import React from 'react';


/**
 * A custom error message for form validation
 *
 * @param  {bool}  props.condition    Is true if a component state is in an error condition
 * @param  {string} props.error-message    Error message
 * @return {JSX}    The paragraph for error message
 */
const FormValidationErrorMessage = ({
    condition,
    errorMessage,
}) => (
    condition ?
        (<p className="error-message"><Icon name="exclamation circle" />{errorMessage}</p>)
        : null
);

FormValidationErrorMessage.propTypes = {
    condition: bool.isRequired,
    errorMessage: string.isRequired,
};
export default FormValidationErrorMessage;
