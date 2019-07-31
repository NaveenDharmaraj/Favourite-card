/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import {
    Container,
    Grid,
} from 'semantic-ui-react';
import _ from 'lodash';
import { connect } from 'react-redux';

import Layout from '../../../components/shared/Layout';
import validateUserRegistrationForm from '../../../helpers/users/utils';
import { saveUser } from '../../../actions/user';

import FirstComponent from './FirstComponent';
import SecondComponent from './SecondComponent';
import CausesComponent from './CausesComponent';
import CreateComponent from './CreateComponent';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            attributes: {
                userCauses: [],
            },
            stepIndex: 0,
            validity: this.intializeValidations(),
        };
        const {
            dispatch,
        } = props;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.handleCauses = this.handleCauses.bind(this);
        this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
        this.isButtonDisabled = this.isButtonDisabled.bind(this);
    }

    handleInputChange(event, data) {
        const {
            name,
            options,
            value,
        } = data;
        const {
            attributes,
        } = this.state;
        let {
            // eslint-disable-next-line no-unused-vars
            validity,
        } = this.state;
        // let pwdCharCount = 0;
        // let pwdHasLwrCase = false;
        // let pwdHasUprCase = false;
        const newValue = (!_.isEmpty(options)) ? _.find(options, { value }) : value;
        if (attributes[name] !== newValue) {
            attributes[name] = newValue;
        }
        switch (name) {
            case 'password':
                validity = validateUserRegistrationForm('password', newValue, validity);
                break;
            // case 'emailId':
            //     validity = validateUserRegistrationForm('emailId', newValue, validity);
            //     break;
            default:
                break;
        }
        this.setState({
            attributes: {
                ...this.state.attributes,
                ...attributes,
                // pwdCharCount,
                // pwdHasLwrCase,
                // pwdHasUprCase,
            },

        });
    }

    handleInputOnBlur(event, data) {
        const {
            name,
            value,
        } = !_.isEmpty(data) ? data : event.target;
        let {
            validity,
        } = this.state;
        const inputValue = value;
        switch (name) {
            case 'firstName':
                validity = validateUserRegistrationForm('firstName', inputValue, validity);
                break;
            case 'lastName':
                validity = validateUserRegistrationForm('lastName', inputValue, validity);
                break;
            case 'emailId':
                validity = validateUserRegistrationForm('emailId', inputValue, validity);
                break;
            case 'password':
                validity = validateUserRegistrationForm('password', inputValue, validity);
                break;
            default:
                break;
        }
        this.setState({
            validity,
        });
    }

    intializeValidations() {
        this.validity = {
            isEmailIdNew: true,
            isEmailIdNotNull: true,
            isEmailIdValid: true,
            isEmailValidFormat: true,
            isFirstNameNotNull: true,
            isLastNameNotNull: true,
            isPasswordValid: true,
            isValidCauses: true,
        };
        return this.validity;
    }

    validateForm() {
        let {
            validity,
        } = this.state;
        const {
            attributes: {
                firstName,
                lastName,
                emailId,
                password,
                userCauses,
            },
            stepIndex,
        } = this.state;
        switch (stepIndex) {
            case 0:
                validity = validateUserRegistrationForm('firstName', firstName, validity);
                validity = validateUserRegistrationForm('lastName', lastName, validity);
                break;
            case 1:
                validity = validateUserRegistrationForm('emailId', emailId, validity);
                validity = validateUserRegistrationForm('password', password, validity);
                break;
            case 2:
                validity.isValidCauses = (userCauses.length >= 3);
                break;
            default:
                break;
        }

        this.setState({
            validity,
        });

        return _.every(validity);
    }

    handleSubmit() {
        const isValid = this.validateForm();
        if (isValid) {
            let {
                stepIndex,
                attributes: {
                    firstName,
                    lastName,
                    emailId,
                    password,
                },
                validity,
            } = this.state;
            const {
                dispatch,
            } = this.props;
            if (stepIndex === 1) {
                validity = validateUserRegistrationForm('emailId', emailId, validity);
            } else if (stepIndex === 3) {
                const userDetails = {};
                userDetails.name = (firstName) ? firstName + lastName : '';
                userDetails.given_name = firstName;
                userDetails.family_name = lastName;
                userDetails.email = emailId;
                userDetails.password = password;
                let result = saveUser(dispatch, userDetails);
                console.log(result);
            }
            stepIndex += 1;
            this.setState({
                stepIndex,
            });
        } else {
            console.log('invalid');
        }
    }

    handleCauses(event, data) {
        const {
            name,
            options,
            value,
        } = data;
        let {
            attributes: {
                userCauses,
            },
        } = this.state;
        if (_.includes(userCauses, name)) {
            _.pull(userCauses, name);
        } else {
            userCauses.push(name);
        }
        this.setState({
            attributes: {
                ...this.state.attributes,
                userCauses,
            },
        });
    }

    isButtonDisabled(params) {
        const {
            attributes,
            // validity,
        } = { ...this.state };

        let validity = {};
        console.log(params);
        params.forEach((param) => {
            validity = validateUserRegistrationForm(param, attributes[param], validity);
            console.log('localvariale', validity);
        });
        // console.log('state', this.state.validity);
        console.log(_.every(validity));
        return (_.every(validity));
    }

    render() {
        let {
            stepIndex,
            attributes: {
                firstName,
                lastName,
                emailId,
                password,
                userCauses,
            },
            validity,
        } = this.state;
        return (
            <Layout>
                <div className="pageWraper">
                    <Container>
                        <div className="linebg">
                            <Grid columns={2} verticalAlign="middle">
                                {
                                    (stepIndex === 0) && (
                                        <FirstComponent
                                            parentInputChange={this.handleInputChange}
                                            handleSubmit={this.handleSubmit}
                                            firstName={firstName}
                                            handleInputOnBlur={this.handleInputOnBlur}
                                            isButtonDisabled={this.isButtonDisabled}
                                            lastName={lastName}
                                            validity={validity}
                                        />
                                    )
                                }
                                {
                                    (stepIndex === 1) && (
                                        <SecondComponent
                                            parentInputChange={this.handleInputChange}
                                            handleSubmit={this.handleSubmit}
                                            emailId={emailId}
                                            handleInputOnBlur={this.handleInputOnBlur}
                                            isButtonDisabled={this.isButtonDisabled}
                                            password={password}
                                            validity={validity}
                                        />
                                    )
                                }
                            </Grid>
                            {
                                (stepIndex === 2) && (
                                    <Grid centered>
                                        <CausesComponent
                                            parentInputChange={this.handleInputChange}
                                            parentHandleCauses={this.handleCauses}
                                            handleSubmit={this.handleSubmit}
                                            userCauses={userCauses}
                                            validity={validity}
                                        />
                                    </Grid>
                                )
                            }
                            {
                                (stepIndex === 3) && (
                                    <Grid columns={2} centered>
                                        <Grid.Row>
                                            <CreateComponent
                                                handleSubmit={this.handleSubmit}
                                            />
                                        </Grid.Row>
                                    </Grid>
                                )
                            }

                        </div>
                    </Container>
                </div>

            </Layout>
        );
    }
}
function mapStateToProps(state) {
    return {
    };
}
export default (connect(mapStateToProps)(Login));
