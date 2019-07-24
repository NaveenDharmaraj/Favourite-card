import React from 'react';
import {
    Button,
    Header,
    Input,
    Form,
    Grid,
} from 'semantic-ui-react';

import FormValidationErrorMessage from '../../../components/shared/FormValidationErrorMessage';

function SecondComponent(props) {
    let {
        handleSubmit,
        emailId,
        parentInputChange,
        password,
        validity
    } = props;
    return (
        <Grid.Row>
            <Grid.Column className="left-bg"></Grid.Column>
            <Grid.Column>
                <div className="login-form-wraper">
                    <div className="reg-header">
                        <Header as="h3">Create your Impact account.</Header>
                    </div>
                    <Form>
                        <Form.Field>
                            <label>Email</label>
                            <Form.Field
                                control={Input}
                                id="emailId"
                                name="emailId"
                                value={emailId}
                                onChange={parentInputChange}
                                error={!validity.isEmailIdNotNull}
                                placeholder="Your email Id"
                            />
                            <FormValidationErrorMessage
                                condition={!validity.isEmailIdNotNull}
                                errorMessage="Please input your email id"
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Password</label>
                            <Form.Field
                                control={Input}
                                id="password"
                                name="password"
                                value={password}
                                onChange={parentInputChange}
                                error={!validity.isPasswordNotNull}
                                placeholder="Password"
                            />
                            <FormValidationErrorMessage
                                condition={!validity.isPasswordNotNull}
                                errorMessage="Please input your account password"
                            />
                        </Form.Field>
                        <p>
                            0/8 characters, lowercase letters (a-z), uppercase letters (A-Z),
    special characters (e.g. !@#$%^&*)
                        </p>
                        <div className="reg-btn-wraper">
                            <Button type='submit' primary onClick={handleSubmit}>Continue</Button>
                        </div>
                    </Form>
                </div>
            </Grid.Column>
        </Grid.Row>
    );
}

export default SecondComponent;
