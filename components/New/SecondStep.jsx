/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import {
    Button,
    Header,
    Input,
    Form,
    Grid,
    Icon,
} from 'semantic-ui-react';
import { Link } from '../../routes';

import FormValidationErrorMessage from '../shared/FormValidationErrorMessage';

class SecondStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pwdHide: true,
        };
        this.handlePwdShow = this.handlePwdShow.bind(this);
    }

    handlePwdShow() {
        const {
            pwdHide,
        } = this.state;
        this.setState({
            pwdHide: !pwdHide,
        });
    }

    render() {
        let {
            apiValidating,
            handleSubmit,
            handleBack,
            emailId,
            parentInputChange,
            handleInputOnBlur,
            password,
            userExists,
            validity,
        } = this.props;
        let {
            pwdHide,
        } = this.state;
        let pwdCharCount = (password) ? password.length : 0;
        let pwdEntered = (password && password.length > 0);
        return (
            <Grid.Row>
                <Grid.Column className="left-bg second"><div></div></Grid.Column>
                <Grid.Column>
                    <div className="login-form-wraper">
                        <div className="reg-header">
                            <Header as="h3">Create your Impact Account</Header>
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
                                    placeholder="Enter your email"
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.isEmailIdNotNull}
                                    errorMessage="Please enter your email address"
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.isEmailValidFormat}
                                    errorMessage="Please enter a valid email address"
                                />
                                <FormValidationErrorMessage
                                    condition={!!userExists && validity.isEmailValidFormat}
                                    errorMessage="Looks like this email is already registered. "
                                >
                                    Would you like to&nbsp;<Link route='/users/login'>log in</Link>?
                                </FormValidationErrorMessage>
                                <FormValidationErrorMessage
                                    condition={!validity.isEmailLengthInLimit && validity.isEmailIdNotNull}
                                    errorMessage="Email address cannot have more than 100 characters"
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Password</label>
                                <Form.Field
                                    control={Input}
                                    id="password"
                                    name="password"
                                    className="w-380"
                                    type={(pwdHide) ? "password" : "input"}
                                    value={_.isEmpty(password) ? '' : password}
                                    onChange={parentInputChange}
                                    onBlur={handleInputOnBlur}
                                    maxLength="30"
                                    error={!validity.isPasswordNull}
                                    placeholder="Choose your password"
                                    icon={(
                                        <Icon
                                            onClick={this.handlePwdShow}
                                            name='eye'
                                            link
                                            className={ (pwdHide) ? "" : "active"}
                                        />
                                    )}
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.isPasswordNull}
                                    errorMessage="Please choose a password."
                                />
                            </Form.Field>
                            <p className="font-s-12">
                                <span className={(validity.doesPwdHaveCount) ? 'blueText' : ''}>
                                    {pwdCharCount}/8 characters,
                                </span><br />
                                <span className={(validity.doesPwdhaveLowerCase) ? 'blueText' : ''}>lowercase letters (a-z),</span><br />
                                <span className={(validity.doesPwdhaveUpperCase) ? 'blueText' : ''}>uppercase letters (A-Z),</span><br />
                                <span className={(validity.doesPwdhaveSpecialChars) ? 'blueText' : ''}>special characters (e.g. !@#$%^&*)</span>
                            </p>
                            <div className="reg-btn-wraper floatBtns">
                                {/* {(!emailId || !password)
                                && <Button type='submit' primary disabled onClick={handleSubmit}>Continue</Button>
                                }
                                {(emailId && password)
                                && <Button type='submit' primary onClick={handleSubmit}>Continue</Button>
                                } */}
                                <Button
                                    type='submit'
                                    primary
                                    tabIndex="0"
                                    content={(apiValidating === true) ? 'Validating..' : 'Continue'}
                                    disabled={!validity.isEmailIdValid || !validity.isPasswordValid || !!userExists || typeof userExists === 'undefined' || !pwdEntered}
                                    onClick={handleSubmit}
                                    tabIndex={1}

                                />
                                <Button
                                    className="blue-bordr-btn-round-def leftBtn"
                                    content="Back"
                                    onClick={handleBack}
                                />

                            </div>
                        </Form>
                    </div>
                </Grid.Column>
            </Grid.Row>
        );
    }
}

export default SecondStep;
