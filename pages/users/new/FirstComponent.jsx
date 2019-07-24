import React from 'react';
import {
    Button,
    Header,
    Form,
    Grid,
    Input,
} from 'semantic-ui-react';

import FormValidationErrorMessage from '../../../components/shared/FormValidationErrorMessage';

function FirstComponent(props) {
    const {
        firstName,
        handleSubmit,
        lastName,
        parentInputChange,
        validity
    } = props;

    return (
        <Grid.Row>
            <Grid.Column className="left-bg"></Grid.Column>
            <Grid.Column>
                <div className="login-form-wraper">
                    <div className="reg-header">
                        <Header as="h3">Create the change you want to see in the world.</Header>
                        <Header as="h4"> Tell us about yourself. </Header>
                    </div>
                    <Form>
                        <Form.Field>
                            <label>First Name</label>
                            <Form.Field
                                control={Input}
                                id="firstName"
                                name="firstName"
                                value={firstName}
                                onChange={parentInputChange}
                                error={!validity.isFirstNameNotNull}
                                placeholder="Your first name"
                            />
                            <FormValidationErrorMessage
                                condition={!validity.isFirstNameNotNull}
                                errorMessage="Please input your first name"
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Last Name<a style={{float:'right'}} className="forgot-link">Forgot Password?</a></label>
                            <Form.Field
                                control={Input}
                                id="lastName"
                                name="lastName"
                                value={lastName}
                                onChange={parentInputChange}
                                error={!validity.isLastNameNotNull}
                                placeholder="Your last name"
                            />
                            <FormValidationErrorMessage
                                condition={!validity.isLastNameNotNull}
                                errorMessage="Please input your last name"
                            />
                        </Form.Field>
                        <div className="reg-btn-wraper">
                            <Button type='submit' onClick={handleSubmit} primary>Continue</Button>
                        </div>
                    </Form>
                </div>
            </Grid.Column>
        </Grid.Row>
    );
}

export default FirstComponent;
