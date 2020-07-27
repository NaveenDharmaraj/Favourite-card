import getConfig from 'next/config';
import React from 'react';
import { Button, Form, Icon, Input } from 'semantic-ui-react';
import _every from 'lodash/every';
import _isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';

import { Router } from '../../routes';
import FormValidationErrorMessage from '../shared/FormValidationErrorMessage';
import { validateUserRegistrationForm } from '../../helpers/users/utils';
import { claimp2pCreateNewUser } from '../../actions/onBoarding';
const { publicRuntimeConfig } = getConfig();
import { withTranslation } from '../../i18n';

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

    async handleSubmit(e) {
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
                dispatch,
            } = this.props;
            this.setState({
                buttonClicked: true,
            });
            await dispatch(claimp2pCreateNewUser(firstName, lastName, email, password, claimToken))
            .then(()=>{
                Router.pushRoute('/users/login');
            })
            .catch((err)=>{
                this.setState({
                    buttonClicked: false,
                });
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
            const formatMessage = this.props.t;
            return (
                <Form className="claimp2pForm">
                    <Form.Group>
                        <Form.Field width={8}>
                            <label data-test="ClaimP2PSignUp_label_firstName">{formatMessage('claimP2P_signUp.firstNameLabel')}</label>
                            <Form.Input
                                data-test="ClaimP2PSignUp_inputFeild_firstName"
                                name="firstName"
                                placeholder={formatMessage('claimP2P_signUp.firstNamePlaceholder')}
                                value={firstName}
                                onChange={this.handleInputChange}
                                onBlur={this.handleInputOnBlur}
                                error={!validity.isFirstNameValid}
                            />
                            <FormValidationErrorMessage
                                condition={!validity.isFirstNameNotNull}
                                errorMessage={formatMessage('error:signUpValidationError.firstNameNotNull')}
                            />
                            <FormValidationErrorMessage
                                condition={!validity.doesFirstNameHave2 && validity.isFirstNameNotNull}
                                errorMessage={formatMessage('error:signUpValidationError.firstNameHaveLength2')}
                            />
                            <FormValidationErrorMessage
                                condition={!validity.isFirstnameLengthInLimit && validity.isFirstNameNotNull}
                                errorMessage={formatMessage('error:signUpValidationError.firstnameLengthInLimit')}
                            />
                        </Form.Field>
                        <Form.Field width={8}>
                            <label data-test="ClaimP2PSignUp_label_lastName">{formatMessage('claimP2P_signUp.lastNameLabel')}</label>
                            <Form.Input
                                data-test="ClaimP2PSignUp_inputFeild_lastName"
                                placeholder={formatMessage('claimP2P_signUp.lastNamePlaceholder')}
                                name="lastName"
                                value={lastName}
                                onChange={this.handleInputChange}
                                onBlur={this.handleInputOnBlur}
                                error={!validity.isLastNameValid}
                            />
                            <FormValidationErrorMessage
                                condition={!validity.isLastNameNotNull}
                                errorMessage={formatMessage('error:signUpValidationError.lastNameNotNull')}
                            />
                            <FormValidationErrorMessage
                                condition={!validity.isLastnameLengthInLimit && validity.isLastNameNotNull}
                                errorMessage={formatMessage('error:signUpValidationError.lastnameLengthInLimit')}
                            />
                        </Form.Field>
                    </Form.Group>

                    <Form.Field>
                        <label data-test="ClaimP2PSignUp_label_email">{formatMessage('claimP2P_signUp.emailLabel')}</label>
                        <Form.Input data-test="ClaimP2PSignUp_inputFeild_email" disabled width={16} value={email} />
                    </Form.Field>
                    <Form.Field>
                        <label data-test="ClaimP2PSignUp_label_password">{formatMessage('claimP2P_signUp.password')}</label>
                        <Form.Field
                            control={Input}
                            data-test="ClaimP2PSignUp_inputFeild_password"
                            className="passwordField"
                            name="password"
                            placeholder={formatMessage('claimP2P_signUp.passwordPlaceholder')}
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
                            errorMessage={formatMessage('error:signUpValidationError.passwordNull')}
                        />
                        <p className="passwordNote">
                            <span data-test="ClaimP2PSignUp_passwordCount_Characters" className={(validity.doesPwdHaveCount) ? 'blueText' : ''}>
                                {password.length}/{formatMessage('signUpPasswordValidation.noOfCharacter')}
                            </span>
                            <span data-test="ClaimP2PSignUp_passwordCharacter_lowerCase" className={(validity.doesPwdhaveLowerCase) ? 'blueText' : ''}>{formatMessage('signUpPasswordValidation.lowerCaseCharacter')}</span>
                            <span data-test="ClaimP2PSignUp_passwordCharacter_upperCase" className={(validity.doesPwdhaveUpperCase) ? 'blueText' : ''}>{formatMessage('signUpPasswordValidation.upperCaseCharacter')}</span><br />
                            <span data-test="ClaimP2PSignUp_passwordCharacter_specialCase" className={(validity.doesPwdhaveSpecialChars) ? 'blueText' : ''}>{formatMessage('signUpPasswordValidation.specialCharacter')}</span>
                        </p>
                    </Form.Field>
                    <Button
                        data-test="ClaimP2PSignUp_submit_button"
                        className="blue-btn-rounded-def openImpAct"
                        onClick={(e) => this.handleSubmit(e)}
                        disabled={(!this.validateForm() || buttonClicked)}
                        type="submit"
                    >
                        {buttonClicked ? formatMessage('claimP2P_signUp.submitButtonLoading') : formatMessage('claimP2P_signUp.submitButton')}
                    </Button>
                    <p className="openImpactInfo">
                        {formatMessage('openImpactInfo.info1')}
                        <a href={`${APP_URL_ORIGIN}/privacy`} target="_blank"> {formatMessage('openImpactInfo.privacyPolicyLink')}</a>{formatMessage('openImpactInfo.info2')}
                        &nbsp;<a href={`${APP_URL_ORIGIN}/terms`} target="_blank">{formatMessage('openImpactInfo.termsAndConditionLink')}</a> {formatMessage('openImpactInfo.info3')}
                        &nbsp;<a href={`${APP_URL_ORIGIN}/account-agreement`} target="_blank">{formatMessage('openImpactInfo.accountAgreement')}</a>.
                </p>
                </Form>
            )
        }
    }

    const withTranslationClaimP2PSignUp = withTranslation(['claimP2P', 'error'])(connect(null,null)(ClaimP2PSignUp));

export {
    withTranslationClaimP2PSignUp as default,
    ClaimP2PSignUp,

};