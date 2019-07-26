/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import {
    Container,
    Grid,
} from 'semantic-ui-react';
import _ from 'lodash';

import Layout from '../../../components/shared/Layout';
import validateUserRegistrationForm from '../../../helpers/users/utils';
import { saveUser } from '../../../actions/user';

import FirstComponent from './FirstComponent';
import SecondComponent from './SecondComponent';
import CausesComponent from './CausesComponent';

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
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.handleCauses = this.handleCauses.bind(this);
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
        const newValue = (!_.isEmpty(options)) ? _.find(options, { value }) : value;
        if (attributes[name] !== newValue) {
            attributes[name] = newValue;
        }
        // switch(name) {
        //     case 'firstName'
        // }
        this.setState({
            attributes: {
                ...this.state.attributes,
                ...attributes,
            },

        });
    }

    intializeValidations() {
        this.validity = {
            isEmailIdValid: true,
            isFirstNameNotNull: true,
            isLastNameNotNull: true,
            isPasswordNotNull: true,
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
                console.log(userCauses.length);
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
        console.log(isValid);
        if (isValid) {
            let {
                stepIndex,
                attributes:{
                    firstName,
                    lastName,
                    emailId,
                    password,
                },
            } = this.state;
            if (stepIndex === 2) {
                let userDetails = {};
                userDetails.name = (firstName) ? firstName + lastName : '';
                userDetails.given_name = firstName;
                userDetails.family_name = lastName;
                userDetails.email = emailId;
                userDetails.password = password;
                debugger

                let result = saveUser(userDetails);
            }
            stepIndex += 1;
            this.setState({
                stepIndex,
            });
        } else{
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
        console.log(userCauses);
        this.setState({
            attributes: {
                ...this.state.attributes,
                userCauses,
            },
        });
    }

    render() {
        let {
            stepIndex,
            attributes: {
                firstName,
                lastName,
                userCauses,
            },
            validity,
        } = this.state;
        console.log(_.every(validity));
        return (
            <Layout>
                <div className="pageWraper">
                    <Container>
                        <div className="linebg">
                            <Grid columns={2} verticalAlign='middle'>
                                {
                                    (stepIndex === 0) && (
                                        <FirstComponent
                                            parentInputChange={this.handleInputChange}
                                            handleSubmit={this.handleSubmit}
                                            firstName={firstName}
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
                                            firstName={firstName}
                                            lastName={lastName}
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

                        </div>
                    </Container>
                </div>

            </Layout>
        );
    }
}

export default Login;
