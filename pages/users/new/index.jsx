/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import {
    Container,
    Grid,
} from 'semantic-ui-react';
import _ from 'lodash';
import { connect } from 'react-redux';

import {
    getUserCauses,
    saveUser,
    validateNewUser,
} from '../../../actions/onBoarding';
import storage from '../../../helpers/storage';
import { Router } from '../../../routes';
import Layout from '../../../components/shared/Layout';
import { validateUserRegistrationForm, addGtmEventsSignUp } from '../../../helpers/users/utils';
import FirstStep from '../../../components/New/FirstStep';
import SecondStep from '../../../components/New/SecondStep';
import CausesSelection from '../../../components/New/CausesSelection';
import FinalStep from '../../../components/New/FinalStep';
import ClaimCharityFirstStep from '../../../components/New/ClaimCharityFirstStep';
import { invitationParameters } from '../../../services/auth';
class Login extends React.Component {

    static async getInitialProps({ query }) {
        return {
            isClaimCharity: query.isClaimCharity,
            reqParams: {
                invitationType: query.invitationType,
                sourceId: query.sourceId,
                signUpSourceId:query.signUpSourceId,
            },
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            attributes: {
                userCauses: [],
            },
            stepIndex: 0,
            buttonClicked: false,
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

    componentDidMount() {
        const {
            dispatch,
            reqParams,
        } = this.props;
        getUserCauses(dispatch);
        if(reqParams && reqParams.invitationType, reqParams.sourceId){
            invitationParameters.reqParameters = reqParams;
        }
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEmpty(this.props.newUserDetails) && this.state.stepIndex >= 3) {
                if (this.props.newUserDetails && this.props.newUserDetails.email && this.props.newUserDetails.identities && this.props.newUserDetails.identities[0] && this.props.newUserDetails.identities[0].user_id) {
                    storage.set('auth0UserEmail', this.props.newUserDetails.email, 'local', null);
                    storage.set('auth0UserId', this.props.newUserDetails.identities[0].user_id, 'local', null);
                    Router.pushRoute('/users/email-verification');
                }
            }
        }
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
        const newValue = (!_.isEmpty(options)) ? _.find(options, { value }) : value;
        if (attributes[name] !== newValue) {
            attributes[name] = newValue;
        }
        switch (name) {
            case 'password':
                validity = validateUserRegistrationForm('password', newValue, validity);
                break;
            default:
                break;
        }
        this.setState({
            attributes: {
                ...this.state.attributes,
                ...attributes,
            },
            validity: {
                ...this.state.validity,
                validity,
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
        const {
            dispatch,
        } = this.props;
        validity = validateUserRegistrationForm(name, inputValue, validity)
        if (name === 'emailId' && validity.isEmailIdValid) {
            validateNewUser(dispatch, inputValue);
        }
        this.setState({
            validity,
        });
    }

    intializeValidations() {
        this.validity = {
            doesFirstNameHave2: true,
            isEmailIdNotNull: true,
            isEmailIdValid: true,
            isEmailLengthInLimit: true,
            isEmailValidFormat: true,
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
            },
            stepIndex,
        } = this.state;
        validity = this.intializeValidations();
        switch (stepIndex) {
            case 0:
                validity = validateUserRegistrationForm('firstName', firstName, validity);
                validity = validateUserRegistrationForm('lastName', lastName, validity);
                break;
            case 1:
                validity = validateUserRegistrationForm('emailId', emailId, validity);
                validity = validateUserRegistrationForm('password', password, validity);
                break;
            default:
                break;
        }

        this.setState({
            validity,
        });

        return _.every(validity);
    }

    handleSubmit(e) {
        e.preventDefault();
        const isValid = this.validateForm();
        if (isValid) {
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
            const {
                dispatch,
            } = this.props;
            addGtmEventsSignUp(stepIndex, 'Continue', userCauses);
            if (stepIndex === 3) {
                this.setState({
                    buttonClicked: true,
                });
                const userDetails = {};
                // userDetails.name = (firstName) ? `${firstName} ${lastName}` : '';
                userDetails.given_name = firstName;
                userDetails.family_name = lastName;
                userDetails.email = emailId;
                userDetails.password = password;
                userDetails.longitude = null;
                userDetails.latitude = null;
                userDetails.causes = userCauses;
                userDetails.signupSource = storage.getLocalStorageWithExpiry('signup_source','local');
                const sourceId = storage.getLocalStorageWithExpiry('signup_source_id','local');
                if(sourceId) {
                    userDetails.signupSourceId = sourceId.toString();
                };
                userDetails.claimToken = storage.getLocalStorageWithExpiry('claimToken','local');
                userDetails.referrer = document.referrer;
                const reqPar = invitationParameters.reqParameters;
                if(reqPar && reqPar.invitationType === 'groupInvite'){
                    userDetails.signupSource = reqPar.signupSource;
                    userDetails.signupSourceId = reqPar.signupSourceId;
                }
                saveUser(dispatch, userDetails);
            }
            if (stepIndex !== 3) {
                stepIndex += 1;
                this.setState({
                    stepIndex,
                });
            }
        } else {
            // console.log('invalid');
        }
    }

    handleBack = () => {
        let {
            stepIndex
        } = this.state;
        addGtmEventsSignUp(stepIndex, 'Back');
        this.setState({
            stepIndex: stepIndex - 1,
        });
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
        params.forEach((param) => {
            validity = validateUserRegistrationForm(param, attributes[param], validity);
        });
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
            buttonClicked,
            validity,
        } = this.state;
        const {
            causesList,
            userExists,
            apiValidating,
            isClaimCharity,
        } = this.props;
        const lineBgClass = (stepIndex === 3) ? "linebg signup-last-step" : "linebg";

        return (
            <Layout onBoarding={isClaimCharity ? false : true}>
                {
                    (stepIndex === 0) && isClaimCharity ? (
                        <ClaimCharityFirstStep
                            parentInputChange={this.handleInputChange}
                            handleSubmit={this.handleSubmit}
                            firstName={firstName}
                            handleInputOnBlur={this.handleInputOnBlur}
                            isButtonDisabled={this.isButtonDisabled}
                            lastName={lastName}
                            validity={validity}
                        />
                    ) :
                        (
                            <div className="pageWraper">
                                <Container>
                                    <div className={lineBgClass}>
                                        <Grid columns={2} doubling>
                                            {
                                                (stepIndex === 0) && 
                                                    (
                                                        <FirstStep
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
                                                    <SecondStep
                                                        apiValidating={apiValidating}
                                                        parentInputChange={this.handleInputChange}
                                                        handleSubmit={this.handleSubmit}
                                                        handleBack={this.handleBack}
                                                        emailId={emailId}
                                                        handleInputOnBlur={this.handleInputOnBlur}
                                                        userExists={userExists}
                                                        password={password}
                                                        validity={validity}
                                                    />
                                                )
                                            }
                                        </Grid>
                                        {
                                            (stepIndex === 2) && (
                                                <Grid centered>
                                                    <CausesSelection
                                                        parentInputChange={this.handleInputChange}
                                                        parentHandleCauses={this.handleCauses}
                                                        handleSubmit={this.handleSubmit}
                                                        handleBack={this.handleBack}
                                                        userCauses={userCauses}
                                                        causesList={causesList}
                                                        validity={validity}
                                                    />
                                                </Grid>
                                            )
                                        }
                                        {
                                            (stepIndex === 3) && (
                                                <Grid columns={2} centered doubling>
                                                    <Grid.Row>
                                                        <FinalStep
                                                            handleSubmit={this.handleSubmit}
                                                            buttonClicked={buttonClicked}
                                                            handleBack={isClaimCharity ? this.handleBack : ''}
                                                        />
                                                    </Grid.Row>
                                                </Grid>
                                            )
                                        }

                                    </div>
                                </Container>
                            </div>
                        )
                }


            </Layout>
        );
    }
}
function mapStateToProps(state) {
    return {
        apiValidating: state.onBoarding.apiValidating,
        causesList: state.onBoarding.causesList,
        newUserDetails: state.onBoarding.newUserDetails,
        userExists: state.onBoarding.userExists,
    };
}
export default (connect(mapStateToProps)(Login));
