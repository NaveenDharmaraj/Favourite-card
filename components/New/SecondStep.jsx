/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import {
    Button,
    Header,
    Input,
    Form,
    Grid,
    Message,
} from 'semantic-ui-react';

import FormValidationErrorMessage from '../shared/FormValidationErrorMessage';

function SecondStep(props) {
    let {
        apiValidating,
        handleSubmit,
        emailId,
        parentInputChange,
        handleInputOnBlur,
        password,
        userExists,
        validity,
    } = props;
    let pwdCharCount = (password) ? password.length : 0;
    let pwdEntered = (password && password.length > 0);
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
                                onBlur={handleInputOnBlur}
                                error={!validity.isEmailIdValid || userExists}
                                placeholder="Your email Id"
                            />
                            <FormValidationErrorMessage
                                condition={!validity.isEmailIdNotNull}
                                errorMessage="Please input an email id"
                            />
                            <FormValidationErrorMessage
                                condition={!validity.isEmailValidFormat}
                                errorMessage="Please input a valid email id"
                            />
                            <FormValidationErrorMessage
                                condition={!!userExists}
                                errorMessage="This user already Exists!. Please Input a different Email Id"
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Password</label>
                            <Form.Field
                                control={Input}
                                id="password"
                                name="password"
                                type="password"
                                value={_.isEmpty(password) ? '' : password}
                                onChange={parentInputChange}
                                onBlur={handleInputOnBlur}
                                // error={!validity.isPasswordValid}
                                placeholder="Password"
                            />
                            {/* <FormValidationErrorMessage
                                condition={!validity.isPasswordValid}
                                errorMessage="Please input your account password"
                            /> */}
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
                            {/* {(!emailId || !password)
                            && <Button type='submit' primary disabled onClick={handleSubmit}>Continue</Button>
                            }
                            {(emailId && password)
                            && <Button type='submit' primary onClick={handleSubmit}>Continue</Button>
                            } */}
                            <Button
                                type='submit'
                                primary
                                content={(apiValidating === true) ? 'Validating..' : 'Continue'}
                                disabled={!validity.isEmailIdValid || !validity.isPasswordValid || !!userExists || typeof userExists === 'undefined' || !pwdEntered}
                                onClick={handleSubmit}
                            />
                        </div>
                    </Form>
                </div>
            </Grid.Column>
        </Grid.Row>
    );
}

export default SecondStep;
