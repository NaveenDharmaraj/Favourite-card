/* eslint-disable react/prop-types */
import React from 'react';
import jwt from 'jwt-decode';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import {
    Button,
    Input,
    Form,
    Header,
    Modal,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';

import storage from '../../../helpers/storage';
import { validateUserRegistrationForm } from '../../../helpers/users/utils';
import {
    userResetPassword,
} from '../../../actions/userProfile';
import {
    logout,
} from '../../../actions/auth';
const ModalStatusMessage = dynamic(() => import('../../shared/ModalStatusMessage'));

class ManagePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonClicked: false,
            errorMessage: null,
            statusMessage: false,
            successMessage: '',
            authId: this.getAuthId(),
            confirmButtonClicked: false,
            confirmPasswordModal: false,
            password: '',
            validity: {
                isPasswordValid: false,
            },
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleCancelButton = this.handleCancelButton.bind(this);
        this.handleRedirectOkClick = this.handleRedirectOkClick.bind(this);
    }

    // eslint-disable-next-line class-methods-use-this
    getAuthId() {
        const token = storage.get('auth0AccessToken', 'cookie');
        const { sub } = jwt(token);
        return sub;
    }

    handleInputChange(event, data) {
        const {
            options,
            value,
        } = data;
        let {
            validity,
        } = this.state;
        const newValue = (!_.isEmpty(options)) ? _.find(options, { value }) : value;
        validity = validateUserRegistrationForm('password', newValue, validity);
        this.setState({
            password: newValue,
            validity: {
                ...this.state.validity,
                validity,
            },
        });
    }

    handlePasswordChange() {
        const {
            authId,
            password,
            validity: {
                isPasswordValid,
            },
        } = this.state;
        this.setState({
            buttonClicked: true,
        });
        if (isPasswordValid) {
            const {
                dispatch,
            } = this.props;
            const userData = {
                authId,
                password,
            };
            userResetPassword(dispatch, userData).then(() => {
                this.setState({
                    confirmPasswordModal: true,
                    buttonClicked: false,
                });
            }).catch((err) => {
                this.setState({
                    buttonClicked: false,
                    errorMessage: 'Error in changing the Password. Please try after sometime.',
                    statusMessage: true,
                });
            });
        } else {
            this.setState({
                buttonClicked: false,
            });
        }
    }

    handleCancelButton() {
        let {
            password,
            validity,
        } = this.state;
        password = '';
        validity = validateUserRegistrationForm('password', '', validity);
        this.setState({
            password,
            validity: {
                ...this.state.validity,
                validity,
            },
        });
    }

    handleRedirectOkClick() {
        logout();
    }

    render() {
        const {
            buttonClicked,
            errorMessage,
            statusMessage,
            successMessage,
            confirmButtonClicked,
            confirmPasswordModal,
            password,
            validity,
        } = this.state;
        const pwdCharCount = (password) ? password.length : 0;
        return (
            <div className="remove-gutter">
                <div className="userSettingsContainer">
                    <div className="settingsDetailWraper heading brdr-btm pb-1">
                        <Header as="h4">Change password </Header>
                    </div>
                    <div className="mt-2">
                        <div>
                            <Modal
                                size="tiny"
                                dimmer="inverted"
                                className="chimp-modal"
                                closeOnEscape={false}
                                closeOnDimmerClick={false}
                                open={confirmPasswordModal}
                                onClose={() => { this.setState({ confirmPasswordModal: false }); }}
                            >
                                <Modal.Header>Confirmation</Modal.Header>
                                <Modal.Content>
                                    <Modal.Description className="font-s-16">
                                        Your Password has been changed successfully.
                                        You will be redirected to login page.
                                        Please login with your new credentials.
                                    </Modal.Description>
                                    <div className="btn-wraper pt-3 text-right">
                                        <Button
                                            className="danger-btn-rounded-def c-small"
                                            onClick={this.handleRedirectOkClick}
                                            disabled={confirmButtonClicked}
                                        >
                                            Ok
                                        </Button>
                                    </div>
                                </Modal.Content>
                            </Modal>
                        </div>
                        <Form>
                            {
                                statusMessage && (
                                    <div className="mb-2">
                                        <ModalStatusMessage 
                                            message = {!_.isEmpty(successMessage) ? successMessage : null}
                                            error = {!_.isEmpty(errorMessage) ? errorMessage : null}
                                        />
                                    </div>
                                )
                            }
                            <Form.Field>
                                <label htmlFor="password">New Password</label>
                                <Form.Field
                                    control={Input}
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={_.isEmpty(password) ? '' : password}
                                    onChange={this.handleInputChange}
                                    placeholder="New Password"
                                />
                            </Form.Field>
                            <p>
                                <span className={(validity.doesPwdHaveCount) ? 'blueText' : ''}>
                                    {pwdCharCount}
                                    / 8 Characters,
                                </span>
                                <span className={(validity.doesPwdhaveLowerCase) ? 'blueText' : ''}> Lowercase letters (a-z), </span>
                                <span className={(validity.doesPwdhaveUpperCase) ? 'blueText' : ''}>Uppercase letters (A-Z), </span>
                                <span className={(validity.doesPwdhaveSpecialChars) ? 'blueText' : ''}>Special characters (e.g. !@#$%^&)</span>
                            </p>
                            <div className="pt-2">
                                <Button
                                    className="blue-btn-rounded-def w-140"
                                    disabled={!validity.isPasswordValid || buttonClicked}
                                    onClick={this.handlePasswordChange}
                                >
                                    Save
                                </Button>
                                <Button
                                    onClick={this.handleCancelButton}
                                    className="blue-bordr-btn-round-def w-140"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
    };
}

export default (connect(mapStateToProps)(ManagePassword));
