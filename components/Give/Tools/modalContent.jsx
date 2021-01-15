/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import {
    Form,
    Icon,
    Input,
} from 'semantic-ui-react';

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
                    placeholder="Enter goal amount"
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
                condition={validity.doesAmountExist && !validity.isAmountLessThanOneBillion}
                errorMessage="Please input a value less than 10000000"
            />
            <FormValidationErrorMessage
                condition={validity.doesAmountExist && !validity.isAmountMoreThanOneDollor}
                errorMessage="Please input a value more than 1$"
            />
            <FormValidationErrorMessage
                condition={validity.doesAmountExist && !validity.isValidPositiveNumber}
                errorMessage="Please input a valid positive number"
            />
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
