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
        givngGoal,
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
                    onChange={handleInputChange}
                    fluid
                />
            </Form.Field>
        </Form>
    );
}
export default ModalContent;
