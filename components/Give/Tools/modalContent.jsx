/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import {
    Form,
    Icon,
    Input,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';

function ModalContent(props) {
    const {
        handleInputChange,
        handleInputOnBlurGivingGoal,
        givingGoal,
        validity,
        currentYear,
        showDollarIcon,
        showLabel,
        placeholder,
    } = props;
    return (
        <Form>
            <Form.Field inline>
                {showLabel && <label>My {currentYear} Goal is</label>}
                <Form.Field
                    control={Input}
                    id="givingGoal"
                    name="givingGoal"
                    value={givingGoal}
                    error={!validity.isValidGiveAmount}
                    onChange={handleInputChange}
                    onBlur={handleInputOnBlurGivingGoal}
                    placeholder={!_isEmpty(placeholder) ? placeholder : 'Amount'}
                    fluid
                    icon={showDollarIcon && (
                        <Icon
                            name='dollar sign'
                        />
                    )}
                    iconPosition={showDollarIcon && "left"}
                />
            </Form.Field>
            <FormValidationErrorMessage
                condition={!validity.isAmountLessThanOneBillion}
                errorMessage="Please input a value less than 10000000"
            />
            {/* <FormValidationErrorMessage
                condition={validity.doesAmountExist && !validity.isAmountMoreThanOneDollor}
                errorMessage="Please input a value more than 1$"
            /> */}
             <FormValidationErrorMessage
                condition={!validity.isValidPositiveNumber}
                errorMessage="Please input a valid amount"
            />
            {/* <FormValidationErrorMessage
                condition={validity.doesAmountExist && !validity.isValidPositiveNumber}
                errorMessage="Please input a valid positive number"
            /> */}
            {/* <FormValidationErrorMessage
                condition={validity.doesAmountExist && !validity.isValidGiveAmount}
                errorMessage="Please input a valid amount"
            /> */}
        </Form>
    );
};

ModalContent.defaultProps = {
    showLabel: true,
    showDollarIcon: true
}
export default ModalContent;
