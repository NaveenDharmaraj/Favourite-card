/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-closing-bracket-location */
import React from 'react';
import {
    Form,
    Input
} from 'semantic-ui-react';

function ModalContent(props) {
    const {
        handleInputChange,
        newGoal
    } = props;
    return (
        <Form>
            <Form.Field inline>
                <label>My 2019 Goal is</label>
                <Form.Field
                    placeholder='$'
                    control={Input}
                    id="giving-goal"
                    name="giving-goal"
                    value={newGoal}
                    handleInputChange={handleInputChange}
                    fluid/>
            </Form.Field>
        </Form>
    );
}
export default ModalContent;
