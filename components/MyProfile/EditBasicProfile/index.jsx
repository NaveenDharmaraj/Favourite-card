/* eslint-disable react/prop-types */
import React from 'react';
import _ from 'lodash';
import {
    Button,
    Form,
    Grid,
    Popup,
    Icon,
    Image
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import dynamic from 'next/dynamic';

import {
    saveUserBasicProfile,
    uploadUserImage,
    removeProfilePhoto,
} from '../../../actions/userProfile';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import PrivacySetting from '../../shared/Privacy';
const ModalStatusMessage = dynamic(() => import('../../shared/ModalStatusMessage'), {
    ssr: false
});
import {
    formatAmount,
    formatCurrency,
    isValidGivingGoalAmount,
} from '../../../helpers/give/utils';
import {
    isInputBlank,
    isAmountLessThanOneBillionDollars,
    isAmountMoreThanOneDollor,
    isValidPositiveNumber,
} from '../../../helpers/give/giving-form-validation';
import UserPlaceholder from '../../../static/images/no-data-avatar-user-profile.png';

class EditBasicProfile extends React.Component {
    constructor(props) {
        super(props);
        const {
            currentUser: {
                attributes: {
                    logoFileName,
                }
            }
        } = props;
        const givingGoalAmount = (!_.isEmpty(props.userData.giving_goal_amt) || typeof props.userData.giving_goal_amt !== 'undefined') ? formatAmount(Number(props.userData.giving_goal_amt)) : '';
        this.state = {
            buttonClicked: true,
            errorMessage: null,
            isImageChanged: false,
            isDefaultImage: logoFileName === null ? true : false,
            uploadImage: '',
            uploadImagePreview: '',
            statusMessage: false,
            successMessage: '',
            userBasicDetails: {
                about: (!_.isEmpty(props.userData)) ? props.userData.description : '',
                firstName: (!_.isEmpty(props.userData)) ? props.userData.first_name : '',
                givingGoal: givingGoalAmount,
                lastName: (!_.isEmpty(props.userData)) ? props.userData.last_name : '',
                location: (!_.isEmpty(props.userData)) ? props.userData.location : '',
                displayName: (!_.isEmpty(props.userData)) ? props.userData.display_name : '',
                formatedGoalAmount: _.replace(formatCurrency(givingGoalAmount, 'en', 'USD'), '$', ''),
            },
            validity: this.intializeValidations(),
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleRemovePreview = this.handleRemovePreview.bind(this);
        this.handleRemoveProfilePhoto = this.handleRemoveProfilePhoto.bind(this);
    }

    componentDidUpdate(prevProps) {
        const {
            currentUser,
            userData,
        } = this.props;        
        if (!_.isEqual(userData, prevProps.userData)) {
            const givingGoalAmount = typeof userData.giving_goal_amt !== 'undefined' ? formatAmount(Number(userData.giving_goal_amt)) : '';
            this.setState({
                userBasicDetails: {
                    about: userData.description,
                    firstName: userData.first_name,
                    givingGoal: givingGoalAmount,
                    lastName: userData.last_name,
                    location: userData.location,
                    displayName: userData.display_name,
                    formatedGoalAmount: _.replace(formatCurrency(givingGoalAmount, 'en', 'USD'), '$', ''),
                },
            });
        }
        if (!_.isEqual(currentUser, prevProps.currentUser)) {
            this.setState({
                isDefaultImage: currentUser.attributes.logoFileName === null ? true : false,
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
        userBasicDetails.givingGoal = formatAmount(amount);
        userBasicDetails.formatedGoalAmount = _.replace(formatCurrency(userBasicDetails.givingGoal, 'en', 'USD'), '$', '');
        this.setState({
            buttonClicked: false,
            statusMessage: false,
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
            isAmountLessThanOneBillion: true,
            isDisplayNameNotNull: true,
            isFirstNameNotNull: true,
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
            if (name === 'givingGoal') {
                userBasicDetails.formatedGoalAmount = newValue;
            }
            userBasicDetails[name] = newValue;

        }
        this.setState({
            buttonClicked: false,
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
            userBasicDetails,
            validity,
        } = this.state;
        let inputValue = value;
        const isNumber = /^(?:[0-9]+,)*[0-9]+(?:\.[0-9]+)?$/;
        if ((name === 'givingGoal') && !_.isEmpty(value) && value.match(isNumber)) {
            inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
            userBasicDetails[name] = inputValue;
            userBasicDetails.formatedGoalAmount = _.replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
        }
        validity = this.validateUserProfileBasicForm(name, inputValue, validity);
        this.setState({
            userBasicDetails: {
                ...this.state.userBasicDetails,
                ...userBasicDetails,
            },
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
            case 'displayName':
                validity.isDisplayNameNotNull = !(!value || value.length === 0);
                break;
            case 'givingGoal':
                validity.isAmountLessThanOneBillion = isAmountLessThanOneBillionDollars(value);
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
                displayName,
                givingGoal,
            },
        } = this.state;
        validity = this.validateUserProfileBasicForm('firstName', firstName, validity);
        validity = this.validateUserProfileBasicForm('lastName', lastName, validity);
        validity = this.validateUserProfileBasicForm('displayName', displayName, validity);
        validity = this.validateUserProfileBasicForm('givingGoal', givingGoal, validity);
        this.setState({
            validity,
        });

        return _.every(validity);
    }

    handleSubmit() {
        this.setState({
            buttonClicked: true,
            statusMessage: false,
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
                isImageChanged,
                userBasicDetails,
            } = this.state;
            saveUserBasicProfile(dispatch, userBasicDetails, id, email).then(() => {
                this.setState({
                    errorMessage: null,
                    successMessage: 'Changes saved.',
                    statusMessage: true,
                    buttonClicked: true,
                });
            }).catch((err) => {
                this.setState({
                    errorMessage: 'Error in saving the profile.',
                    statusMessage: true,
                    buttonClicked: true,
                });
            });
            if (isImageChanged) {
                const {
                    currentUser: {
                        id,
                    },
                    dispatch,
                } = this.props;
                const {
                    uploadImage,
                } = this.state;
                uploadUserImage(dispatch, id, uploadImage).then(() => {
                    this.setState({                       
                        buttonClicked: true,
                        uploadImagePreview: '',
                    });
                }).catch((err) => {
                    this.setState({                        
                        buttonClicked: true,
                        uploadImagePreview: '',
                    });
                });
            }
        } else {
            this.setState({
                buttonClicked: false,
            });
        }
    }

    getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            // console.log('Error: ', error);
        };
    }
    
    handleUpload(event) {
        this.setState({
            uploadImagePreview: '',
            isDefaultImage: true,
        })
        this.getBase64(event.target.files[0], (result) => {
            this.setState({
                isImageChanged: true,
                uploadImage: result,
                buttonClicked: false,
                uploadImagePreview: result,
            });
        });
    }

    handleRemovePreview() {
        const {
            currentUser: {
                attributes: {
                    logoFileName,
                }
            },
        } = this.props;
        this.setState({
            isDefaultImage: logoFileName === null ? true : false,
            uploadImagePreview: '',
        })
    }

    handleRemoveProfilePhoto() {
        const {
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        removeProfilePhoto(dispatch, id).then(() => {
            this.setState({
                errorMessage: null,
                successMessage: 'Profile photo removed successfully.',
                statusMessage: true,
                buttonClicked: true,
                isDefaultImage: true,
            });
        }).catch((err) => {
            this.setState({
                errorMessage: 'Error in removing profile photo.',
                statusMessage: true,
                buttonClicked: true,
                isDefaultImage: true,
            });
        });
    }

    render() {
        const {
            buttonClicked,
            errorMessage,
            statusMessage,
            successMessage,
            isDefaultImage,
            userBasicDetails: {
                firstName,
                lastName,
                about,
                location,
                givingGoal,
                displayName,
                formatedGoalAmount,
            },
            uploadImagePreview,
            validity,
        } = this.state;
        const {
            userData,
            currentUser: {
                attributes: {
                    avatar,
                },
            }
        } = this.props;
        const privacyColumn = 'giving_goal_visibility';
        let aboutCharCount = (!_.isEmpty(about)) ? Math.max(0, (1000 - Number(about.length))) : 1000;
        const userAvatar = (avatar === '') || (avatar === null) ? UserPlaceholder : avatar;
        const imageView = uploadImagePreview !== '' ? uploadImagePreview : userAvatar;
        const isPreview = uploadImagePreview !== '' ? true : false;
        return (
            <Grid>
                {
                    statusMessage && (
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <ModalStatusMessage 
                                    message = {!_.isEmpty(successMessage) ? successMessage : null}
                                    error = {!_.isEmpty(errorMessage) ? errorMessage : null}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                <Grid.Row>
                    <Grid.Column mobile={16} tablet={12} computer={10}>
                        <Form>
                            <Form.Field>
                                <input
                                    id="myInput"
                                    accept="image/png, image/jpeg, image/jpg"
                                    type="file"
                                    ref={(ref) => this.upload = ref}
                                    style={{ display: 'none' }}
                                    onChange={(e) => this.handleUpload(event)}
                                />
                            </Form.Field>
                            <Form.Field>
                                <div className="changeImageWraper removable">
                                <div className="subHead">Profile photo</div>
                                <div className="proPicWraper">
                                    <Image src={imageView} height="125px" width="125px"/>
                                    {
                                        isPreview && (
                                            <a
                                                href="#"
                                                className="removeBtn"
                                                onClick={this.handleRemovePreview}
                                            />
                                        )
                                    }
                                    {
                                        !isDefaultImage && (
                                            <a
                                                href="#"
                                                className="removeBtn"
                                                onClick={this.handleRemoveProfilePhoto}
                                            />
                                        )
                                    }
                                </div>
                                <div className="rightBtnWraper">
                                    <Button
                                    as="a"
                                        className="success-btn-rounded-def medium"
                                        onClick={(e) => this.upload.click()}
                                    >
                                        Change profile photo
                                    </Button>
                                </div>
                                </div>
                            </Form.Field>
                            <Form.Group widths="equal">
                                <Form.Field>
                                    <Form.Input
                                        fluid
                                        label="First name"
                                        placeholder="First name"
                                        id="firstName"
                                        name="firstName"
                                        maxLength="30"
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
                                        maxLength="30"
                                        onChange={this.handleInputChange}
                                        onBlur={this.handleInputOnBlur}
                                        error={!validity.isLastNameNotNull}
                                        value={lastName}
                                    />
                                    <FormValidationErrorMessage
                                        condition={!validity.isLastNameNotNull}
                                        errorMessage="Please input your last name"
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Field>
                                <Form.Input
                                    fluid
                                    label="Display Name"
                                    id="displayName"
                                    name="displayName"
                                    placeholder="Display name"
                                    maxLength="30"
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleInputOnBlur}
                                    error={!validity.isDisplayNameNotNull}
                                    value={displayName}
                                />
                                <FormValidationErrorMessage
                                    condition={!validity.isDisplayNameNotNull}
                                    errorMessage="Please input your display name"
                                />
                            </Form.Field>
                            <Form.Field>
                                <Form.TextArea
                                    label="Bio (optional)"
                                    placeholder="Tell us about yourself"
                                    id="about"
                                    name="about"
                                    maxLength="1000"
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleInputOnBlur}
                                    value={about}
                                />
                                <div className="field-info mt--1-2 text-right">{aboutCharCount} of 1000 characters left</div>
                            </Form.Field>
                            <Form.Input
                                fluid
                                label="Location (optional)"
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
                                    Giving Goal  (optional){' '}
                                    <Popup
                                        content="Set a personal goal for the dollars you want to commit for giving. Reach your goal by adding money to your account."
                                        position="top center"
                                        trigger={
                                            <Icon
                                                color="blue"
                                                name="question circle"
                                                size="large"
                                            />
                                        }
                                    />
                                    <span className="font-w-normal ml--1-2">
                                        <PrivacySetting
                                            columnName={privacyColumn}
                                            columnValue={userData.giving_goal_visibility}
                                        />
                                    </span>
                                </label>
                                <Form.Field>
                                    <Form.Input
                                        placeholder="Giving Goal"
                                        id="givingGoal"
                                        name="givingGoal"
                                        icon="dollar"
                                        iconPosition="left"
                                        maxLength="11"
                                        onChange={this.handleInputChange}
                                        onBlur={this.handleInputOnBlur}
                                        value={formatedGoalAmount}
                                        error={!isValidGivingGoalAmount(validity)}
                                    />                                    
                                    <FormValidationErrorMessage
                                        condition={!validity.isAmountLessThanOneBillion}
                                        errorMessage="Please choose an amount less than one billion dollars"
                                    />
                                </Form.Field>

                            </Form.Field>
                            <Form.Field>
                                <Button basic size="tiny" onClick={() => this.handleAmount(100)}>$100</Button>
                                <Button basic size="tiny" onClick={() => this.handleAmount(500)}>$500</Button>
                                <Button basic size="tiny" onClick={() => this.handleAmount(1000)}>$1,000</Button>
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
