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
    // let pwdCharCount =0;
    console.log(validity);
    let pwdCharCount = (password) ? password.length : 0;
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
                                error={!validity.isEmailIdValid}
                                placeholder="Your email Id"
                            />
                            <FormValidationErrorMessage
                                condition={!validity.isEmailIdValid}
                                errorMessage="Please input a valid email id"
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
                                // error={!validity.isPasswordValid}
                                placeholder="Password"
                            />
                            <FormValidationErrorMessage
                                condition={!validity.isPasswordValid}
                                errorMessage="Please input your account password"
                            />
                        </Form.Field>
                        <p>
                            <span className={(validity.doesPwdHaveCount) ? 'blueText' : ''}>
                                {pwdCharCount}/8 characters,
                            </span>
                            <span className={(validity.doesPwdhaveLowerCase) ? 'blueText' : ''}>lowercase letters (a-z),</span>
                            <span className={(validity.doesPwdhaveUpperCase) ? 'blueText' : ''}>>uppercase letters (A-Z),</span>
                            <span className={(validity.doesPwdhaveSpecialChars) ? 'blueText' : ''}>special characters (e.g. !@#$%^&*)</span>
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
