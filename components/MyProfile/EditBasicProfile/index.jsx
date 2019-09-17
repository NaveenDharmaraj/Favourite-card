/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Button,
    Form,
    Grid,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import dynamic from 'next/dynamic';

import {
    saveUserBasicProfile,
} from '../../../actions/userProfile';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import PrivacySetting from '../../shared/Privacy';
const ModalStatusMessage = dynamic(() => import('../../shared/ModalStatusMessage'));

class EditBasicProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonClicked: false,
            errorMessage: null,
            statusMessage: false,
            successMessage: '',
            userBasicDetails: {
                about: (!_.isEmpty(props.userData)) ? props.userData.description : '',
                firstName: (!_.isEmpty(props.userData)) ? props.userData.first_name : '',
                givingGoal: (!_.isEmpty(props.userData)) ? props.userData.giving_goal_amt : '',
                lastName: (!_.isEmpty(props.userData)) ? props.userData.last_name : '',
                location: (!_.isEmpty(props.userData)) ? props.userData.location : '',
            },
            validity: this.intializeValidations(),
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
    }

    componentDidUpdate(prevProps) {
        const {
            userData,
        } = this.props;        
        if (!_.isEqual(userData, prevProps.userData)) {
            this.setState({
                userBasicDetails: {
                    about: userData.description,
                    firstName: userData.first_name,
                    givingGoal: userData.giving_goal_amt,
                    lastName: userData.last_name,
                    location: userData.location,
                },
            });
        }
    }

    handleAmount(amount) {
        const {
            userBasicDetails,
        } = this.state;
        let {
            validity,
        } = this.state;
        userBasicDetails.givingGoal = amount;
        this.setState({
            userBasicDetails: {
                ...this.state.userBasicDetails,
                ...userBasicDetails,
            },
        });
        validity = this.validateUserProfileBasicForm('givingGoal', amount, validity);
        this.setState({
            validity,
        });
    }

    intializeValidations() {
        this.validity = {
            isDescriptionNotNull: true,
            isFirstNameNotNull: true,
            isGivingGoalNotNull: true,
            isLastNameNotNull: true,
        };
        return this.validity;
    }

    handleInputChange(event, data) {
        const {
            name,
            options,
            value,
        } = data;
        const {
            userBasicDetails,
        } = this.state;
        const newValue = (!_.isEmpty(options)) ? _.find(options, { value }) : value;
        if (userBasicDetails[name] !== newValue) {
            userBasicDetails[name] = newValue;
        }
        this.setState({
            statusMessage: false,
            userBasicDetails: {
                ...this.state.userBasicDetails,
                ...userBasicDetails,
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
        validity = this.validateUserProfileBasicForm(name, inputValue, validity);
        this.setState({
            validity,
        });
    }

    // eslint-disable-next-line class-methods-use-this
    validateUserProfileBasicForm(field, value, validity) {
        switch (field) {
            case 'firstName':
                validity.isFirstNameNotNull = !(!value || value.length === 0);
                break;
            case 'lastName':
                validity.isLastNameNotNull = !(!value || value.length === 0);
                break;
            case 'about':
                validity.isDescriptionNotNull = !(!value || value.length === 0);
                break;
            case 'givingGoal':
                validity.isGivingGoalNotNull = !(!value || value.length === 0);
                break;
            default:
                break;
        }
        return validity;
    }

    validateForm() {
        let {
            validity,
        } = this.state;
        const {
            userBasicDetails: {
                firstName,
                lastName,
                about,
                givingGoal,
            },
        } = this.state;
        validity = this.validateUserProfileBasicForm('firstName', firstName, validity);
        validity = this.validateUserProfileBasicForm('lastName', lastName, validity);
        validity = this.validateUserProfileBasicForm('about', about, validity);
        validity = this.validateUserProfileBasicForm('givingGoal', givingGoal, validity);
        this.setState({
            validity,
        });

        return _.every(validity);
    }

    handleSubmit() {
        this.setState({
            buttonClicked: true,
        });
        const isValid = this.validateForm();
        if (isValid) {
            const {
                currentUser: {
                    id,
                    attributes: {
                        email,
                    },
                },
                dispatch,
            } = this.props;
            const {
                userBasicDetails,
            } = this.state;
            saveUserBasicProfile(dispatch, userBasicDetails, id, email).then(() => {
                this.setState({
                    buttonClicked: true,
                    errorMessage: null,
                    successMessage: 'User Profile basic details saved Successfully.',
                    statusMessage: true,
                    buttonClicked: false,
                });
            }).catch((err) => {
                this.setState({
                    buttonClicked: true,
                    errorMessage: 'Error in saving the Credit Card.',
                    statusMessage: true,
                });
            });
        } else {
            this.setState({
                buttonClicked: false,
            });
        }
    }

    render() {
        const {
            buttonClicked,
            errorMessage,
            statusMessage,
            successMessage,
            userBasicDetails: {
                firstName,
                lastName,
                about,
                location,
                givingGoal,
            },
            validity,
        } = this.state;
        const {
            userData,
        } = this.props;
        const privacyColumn = 'giving_goal_visibility';
        return (
            <Grid>
                {
                    statusMessage && (
                        <Grid.Row>
                            <ModalStatusMessage 
                                message = {!_.isEmpty(successMessage) ? successMessage : null}
                                error = {!_.isEmpty(errorMessage) ? errorMessage : null}
                            />
                        </Grid.Row>
                    )
                }
                <Grid.Row>
                    <Grid.Column mobile={16} tablet={12} computer={10}>
                        <Form>
                            <Form.Group widths="equal">
                                <Form.Field>
                                    <Form.Input
                                        fluid
                                        label="First name"
                                        placeholder="First name"
                                        id="firstName"
                                        name="firstName"
                                        maxLength="50"
                                        onChange={this.handleInputChange}
                                        onBlur={this.handleInputOnBlur}
                                        error={!validity.isFirstNameNotNull}
                                        value={firstName}
                                    />
                                    <FormValidationErrorMessage
                                        condition={!validity.isFirstNameNotNull}
                                        errorMessage="Please input your first name"
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Form.Input
                                        fluid
                                        label="Last name"
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Last name"
                                        maxLength="50"
                                        onChange={this.handleInputChange}
                                        onBlur={this.handleInputOnBlur}
                                        error={!validity.isLastNameNotNull}
                                        value={lastName}
                                    />
                                    <FormValidationErrorMessage
                                        condition={!validity.isLastNameNotNull}
                                        errorMessage="Please input your Last name"
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Field>
                                <Form.TextArea
                                    label="About"
                                    placeholder="Tell us a bit about yourself..."
                                    id="about"
                                    name="about"
                                    maxLength="1000"
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleInputOnBlur}
                                    error={!validity.isDescriptionNotNull}
                                    value={about}
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.isDescriptionNotNull}
                                    errorMessage="Please input about yourself"
                                />
                            </Form.Field>
                            <Form.Input
                                fluid
                                label="Location"
                                placeholder="Location"
                                id="location"
                                name="location"
                                maxLength="150"
                                onChange={this.handleInputChange}
                                onBlur={this.handleInputOnBlur}
                                value={location}
                            />
                            <Form.Field>
                                <label>
                                    Set Giving Goal
                                    <PrivacySetting
                                        columnName={privacyColumn}
                                        columnValue={userData.giving_goal_visibility}
                                    />
                                </label>
                                <Form.Field>
                                    <Form.Input
                                        placeholder="Giving Goal"
                                        id="givingGoal"
                                        name="givingGoal"
                                        maxLength="8"
                                        onChange={this.handleInputChange}
                                        onBlur={this.handleInputOnBlur}
                                        value={givingGoal}
                                        error={!validity.isGivingGoalNotNull}
                                    />
                                    <FormValidationErrorMessage
                                        condition={!validity.isGivingGoalNotNull}
                                        errorMessage="Please input your Giving Goal"
                                    />
                                </Form.Field>

                            </Form.Field>
                            <Form.Field>
                                <Button basic size="tiny" onClick={() => this.handleAmount(500)}>$500</Button>
                                <Button basic size="tiny" onClick={() => this.handleAmount(1000)}>$1000</Button>
                                <Button basic size="tiny" onClick={() => this.handleAmount(1500)}>$1500</Button>
                            </Form.Field>                            
                            <div className="pt-2">
                                <Button
                                    className="blue-btn-rounded-def w-140"
                                    onClick={this.handleSubmit}
                                    disabled={buttonClicked}
                                >
                                    Save
                                </Button>
                            </div>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userProfileBasicData: state.userProfile.userProfileBasicData,
    };
}

export default (connect(mapStateToProps)(EditBasicProfile));
