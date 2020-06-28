import getConfig from 'next/config';
import React from 'react';
import { Button, Form, Icon, Input } from 'semantic-ui-react';
import _every from 'lodash/every';
import _isEmpty from 'lodash/isEmpty';

import { Router } from '../../routes';
import coreApi from '../../services/coreApi';
import FormValidationErrorMessage from '../shared/FormValidationErrorMessage';
import { validateUserRegistrationForm } from '../../helpers/users/utils';
const { publicRuntimeConfig } = getConfig();

const {
    APP_URL_ORIGIN,
} = publicRuntimeConfig;
class ClaimP2PSignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonClicked: false,
            firstName: '',
            lastName: '',
            password: '',
            pwdHide: true,
            validity: this.intializeValidations(),
        };
    }
    intializeValidations() {
        this.validity = {
            doesFirstNameHave2: true,
            isFirstnameLengthInLimit: true,
            isFirstNameNotNull: true,
            isFirstNameValid: true,
            isLastnameLengthInLimit: true,
            isLastNameNotNull: true,
            isLastNameValid: true,
            isPasswordLengthInLimit: true,
            isPasswordNull: true,
            isPasswordValid: true,
        };
        return this.validity;
    }

    handleInputChange = (event, data) => {
        const {
            name,
            value,
        } = data;
        this.setState({
            [name]: value,
        });
    }

    handleInputOnBlur = (event, data) => {
        const {
            name,
            value,
        } = !_isEmpty(data) ? data : event.target;
        let {
            validity,
        } = this.state;
        const inputValue = value;
        validity = validateUserRegistrationForm(name, inputValue, validity)
        this.setState({
            validity,
        });
    }

    handlePwdShow = () => {
        this.setState(prevState => ({ pwdHide: !prevState.pwdHide }))
    }

    validateForm() {
        const {
            firstName,
            lastName,
            password,
        } = this.state;
        let validity = this.intializeValidations();
        validity = validateUserRegistrationForm('firstName', firstName, validity);
        validity = validateUserRegistrationForm('lastName', lastName, validity);
        validity = validateUserRegistrationForm('password', password, validity);
        return _every(validity);
    }

    handleSubmit(e) {
        e.preventDefault();
        const isValid = this.validateForm();
        if (isValid) {
            let {
                firstName,
                lastName,
                password,
            } = this.state;
            const {
                claimToken,
                email,
            } = this.props;
            this.setState({
                buttonClicked: true,
            })
             coreApi.post('/claimP2ps', {
                data: {
                    attributes: {
                        firstName,
                        lastName,
                        email,
                        password,
                        claimToken,
                    }
                }
            })
                .then(res => {
                    Router.push('/users/login');
                })
                .catch(err => {
                    Router.push('/users/login');
                })
        };

    }

    render() {
        const {
            buttonClicked,
            firstName,
            lastName,
            password,
            pwdHide,
            validity,
        } = this.state;
        const {
            email,
        } = this.props;
        return (
            <Form className="claimp2pForm">
                <Form.Group>
                    <Form.Field width={8} className="claimP2P_field">
                        <label data-test="ClaimP2PSignUp_label_firstName">First name</label>
                        <Form.Input
                            data-test="ClaimP2PSignUp_inputFeild_firstName"
                            name="firstName"
                            placeholder="Your first name"
                            value={firstName}
                            onChange={this.handleInputChange}
                            onBlur={this.handleInputOnBlur}
                            error={!validity.isFirstNameValid}
                        />
                        <FormValidationErrorMessage
                            condition={!validity.isFirstNameNotNull}
                            errorMessage="Please enter your first name"
                        />
                        <FormValidationErrorMessage
                            condition={!validity.doesFirstNameHave2 && validity.isFirstNameNotNull}
                            errorMessage="First Name should have minimum 2 characters"
                        />
                        <FormValidationErrorMessage
                            condition={!validity.isFirstnameLengthInLimit && validity.isFirstNameNotNull}
                            errorMessage="First Name cannot have more than 30 characters"
                        />
                    </Form.Field>
                    <Form.Field width={8} className="claimP2P_field">
                        <label data-test="ClaimP2PSignUp_label_lastName">Last name</label>
                        <Form.Input
                            data-test="ClaimP2PSignUp_inputFeild_lastName"
                            placeholder="Your last name"
                            name="lastName"
                            value={lastName}
                            onChange={this.handleInputChange}
                            onBlur={this.handleInputOnBlur}
                            error={!validity.isLastNameValid}
                        />
                        <FormValidationErrorMessage
                            condition={!validity.isLastNameNotNull}
                            errorMessage="Please enter your last name"
                        />
                        <FormValidationErrorMessage
                            condition={!validity.isLastnameLengthInLimit && validity.isLastNameNotNull}
                            errorMessage="Last Name cannot have more than 30 characters"
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Field className="claimP2P_field">
                    <label data-test="ClaimP2PSignUp_label_email">Email</label>
                    <Form.Input data-test="ClaimP2PSignUp_inputFeild_email" disabled placeholder="Enter your email" width={16} value={email} />
                </Form.Field>
                <Form.Field className="claimP2P_field">
                    <label data-test="ClaimP2PSignUp_label_password">Password</label>
                    <Form.Field
                        control={Input}
                        data-test="ClaimP2PSignUp_inputFeild_password"
                        className="passwordField"
                        name="password"
                        placeholder="Choose your password"
                        type={(pwdHide) ? "password" : "input"}
                        value={password}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputOnBlur}
                        maxLength="30"
                        error={!validity.isPasswordNull}
                        icon={(
                            <Icon
                                name='eye'
                                onClick={this.handlePwdShow}
                                className={(pwdHide) ? "" : "active"}
                                link
                            />
                        )}
                        width={16}
                    />
                    <FormValidationErrorMessage
                        condition={!validity.isPasswordNull}
                        errorMessage="Please choose a password."
                    />
                    <p className="passwordNote">
                        <span data-test="ClaimP2PSignUp_passwordCount_Characters" className={(validity.doesPwdHaveCount) ? 'blueText' : ''}>
                            {password.length}/8 characters,
                        </span><br />
                        <span data-test="ClaimP2PSignUp_passwordCharacter_lowerCase" className={(validity.doesPwdhaveLowerCase) ? 'blueText' : ''}>lowercase letters (a-z),</span><br />
                        <span data-test="ClaimP2PSignUp_passwordCharacter_upperCase" className={(validity.doesPwdhaveUpperCase) ? 'blueText' : ''}>uppercase letters (A-Z),</span><br />
                        <span data-test="ClaimP2PSignUp_passwordCharacter_specialCase" className={(validity.doesPwdhaveSpecialChars) ? 'blueText' : ''}>special characters (e.g. !@#$%^&*)</span>
                    </p>
                </Form.Field>
                <Button
                    data-test = "ClaimP2PSignUp_submit_button"
                    className="blue-btn-rounded-def openImpAct"
                    onClick={(e) => this.handleSubmit(e)}
                    disabled={(!this.validateForm() || buttonClicked)}
                    type="submit"
                >
                    {buttonClicked ? 'Submitting' : 'Open an Impact Account and claim gift'}
                </Button>
                <p className="openImpactInfo">
                    By clicking ‘Open an Impact Account and claim your gift’, you acknowlege that you have read the
                    <a href={`${APP_URL_ORIGIN}/privacy`} target="_blank"> Privacy Policy</a>, and agree to the
                    <a href={`${APP_URL_ORIGIN}/terms`} target="_blank">Terms & Conditions</a> and
                    <a href={`${APP_URL_ORIGIN}/account-agreement`} target="_blank">Account Agreement</a>.
                </p>
            </Form>
        )
    }
}

export default ClaimP2PSignUp;