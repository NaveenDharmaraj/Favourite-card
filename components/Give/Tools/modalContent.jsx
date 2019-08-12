/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import {
    Form,
    Input
} from 'semantic-ui-react';

import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';

function ModalContent(props) {
    const {
        handleInputChange,
        givngGoal,
        validity,
    } = props;
    return (
        <Form>
            <Form.Field inline>
                <label>My 2019 Goal is</label>
                <Form.Field
                    placeholder="$"
                    control={Input}
                    id="givingGoal"
                    name="givingGoal"
                    value={givngGoal}
                    error={!validity.isValidGiveAmount}
                    onChange={handleInputChange}
                    fluid
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
}
export default ModalContent;
