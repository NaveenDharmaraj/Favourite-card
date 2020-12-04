import React, { Fragment } from 'react';
import _ from 'lodash';
import {
    Button,
    Form,
    Grid,
    Responsive,
    Header,
    Image,
    Select,
    Modal,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import dynamic from 'next/dynamic';

import {
    saveUserBasicProfile,
    uploadUserImage,
    removeProfilePhoto,
    searchLocationByUserInput,
} from '../../../actions/userProfile';
import { actionTypes } from '../../../actions/userProfile';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import {
    formatAmount,
    formatCurrency,
    isValidGivingGoalAmount,
} from '../../../helpers/give/utils';
import {
    getLocation,
} from '../../../helpers/profiles/utils';
import {
    isAmountLessThanOneBillionDollars,
} from '../../../helpers/give/giving-form-validation';
import UserPlaceholder from '../../../static/images/no-data-avatar-user-profile.png';

let timeout = '';
class EditBasicProfile extends React.Component {
    constructor(props) {
        super(props);
        const {
            currentUser: {
                attributes: {
                    logoFileName,
                }
            },
            userFriendProfileData: {
                attributes: {
                    city,
                    province,
                    description,
                    display_name,
                    first_name,
                    last_name,
                    giving_goal_amt,
                },
            },
        } = props;
        const givingGoalAmount = (!_.isEmpty(giving_goal_amt) ? formatAmount(Number(giving_goal_amt)) : '');
        const location = getLocation(city, province);
        this.state = {
            showEditProfileModal: false,
            buttonClicked: true,
            isImageChanged: false,
            isDefaultImage: logoFileName === null ? true : false,
            uploadImage: '',
            uploadImagePreview: '',
            searchQuery: (!_.isEmpty(location)) ? location : null,
            locationDropdownValue: '',
            userBasicDetails: {
                about: description,
                firstName: first_name,
                givingGoal: givingGoalAmount,
                lastName: last_name,
                displayName: display_name,
                formatedGoalAmount: formatCurrency(giving_goal_amt, 'en', 'USD'),
            },
            validity: this.intializeValidations(),
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleRemoveProfilePhoto = this.handleRemoveProfilePhoto.bind(this);
        this.handleLocationSearchChange = this.handleLocationSearchChange.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.handleCustomSearch = this.handleCustomSearch.bind(this);
        this.handleAmount = this.handleAmount.bind(this);
    }

    componentDidUpdate(prevProps) {
        const {
            currentUser,
            userData,
        } = this.props;
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
        userBasicDetails.formatedGoalAmount = formatCurrency(userBasicDetails.givingGoal, 'en', 'USD');
        validity = this.validateUserProfileBasicForm('givingGoal', amount, validity);
        this.setState({
            buttonClicked: false,
            userBasicDetails: {
                ...this.state.userBasicDetails,
                ...userBasicDetails,
            },
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
            userBasicDetails.formatedGoalAmount = formatCurrency(inputValue, 'en', 'USD');
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
            saveUserBasicProfile(dispatch, userBasicDetails, id, email, true).then(() => {
                this.setState({
                    buttonClicked: true,
                });
            }).catch((err) => {
                this.setState({
                    buttonClicked: true,
                });
            }).finally(() => {
                this.setState({
                    showEditProfileModal: false,
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
        });
        this.getBase64(event.target.files[0], (result) => {
            this.setState({
                isImageChanged: true,
                uploadImage: result,
                buttonClicked: false,
                uploadImagePreview: result,
            });
        });
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
                buttonClicked: true,
                isDefaultImage: true,
                buttonClicked: false,
            });
        }).catch((err) => {
            this.setState({
                buttonClicked: true,
                isDefaultImage: true,
            });
        }).finally();
    }

    handleLocationChange(event, data) {
        const locationValue = event.target.innerText;
        const {
            name,
            options,
            value,
        } = data;
        const {
            userBasicDetails,
        } = this.state;
        const newValue = (!_.isEmpty(options)) ? _.find(options, { value }) : locationValue;
        userBasicDetails['city'] = newValue.city ? newValue.city : '';
        userBasicDetails['province'] = newValue.province ? newValue.province : '';
        this.setState({
            buttonClicked: userBasicDetails[name] != locationValue ? false : true,
            userBasicDetails: {
                ...this.state.userBasicDetails,
                ...userBasicDetails,
            },
            searchQuery: locationValue,
            locationDropdownValue: value,
        });
    }

    debounceFunction = ({dispatch, searchValue}, delay) => {
        if(timeout){
            clearTimeout(timeout);
        }
        timeout = setTimeout(function(){
            dispatch(searchLocationByUserInput(searchValue));
        },delay);
    }

    handleLocationSearchChange(event, { searchQuery }) {
        const {
            userBasicDetails,
        } = this.state;
        if (event.target.value.length >= 4) {
            const {
                dispatch,
            } = this.props;
        const params = { dispatch, searchValue: event.target.value};
        this.debounceFunction(params, 300);
        }
        if (event.target.value.length === 0) {
            const {
                dispatch,
                userData: {
                    city,
                }
            } = this.props;
            dispatch({
                type: actionTypes.USER_PROFILE_LOCATION_SEARCH,
                payload: {
                    data : []
                },
            });
            userBasicDetails['city'] = null;
            userBasicDetails['province'] = null;
            this.setState({
                buttonClicked: city ? false : true,
                userBasicDetails: {
                    ...this.state.userBasicDetails,
                    ...userBasicDetails,
                },
            });
        }
        this.setState({
            searchQuery: event.target.value,
            locationDropdownValue: '',
        });
    }

    handleCustomSearch = (options) => {
        return options
    }
    render() {
        const {
            showEditProfileModal,
            buttonClicked,
            isDefaultImage,
            locationDropdownValue,
            userBasicDetails: {
                firstName,
                lastName,
                about,
                displayName,
                formatedGoalAmount,
            },
            searchQuery,
            uploadImagePreview,
            validity,
        } = this.state;
        const {
            currentUser: {
                attributes: {
                    avatar,
                },
            },
            locationLoader,
            locationOptions,
        } = this.props;
        const aboutCharCount = (!_.isEmpty(about)) ? Math.max(0, (1000 - Number(about.length))) : 1000;
        const userAvatar = (avatar === '') || (avatar === null) ? UserPlaceholder : avatar;
        const imageView = uploadImagePreview !== '' ? uploadImagePreview : userAvatar;
        const isPreview = uploadImagePreview !== '' ? true : false;
        return (
            <Fragment>
            <Modal
                size="tiny"
                dimmer="inverted"
                closeIcon
                className="chimp-modal"
                open={showEditProfileModal}
                onClose={()=>{this.setState({showEditProfileModal: false})}}
                trigger={
                    <Button className='blue-bordr-btn-round-def' onClick={() => this.setState({ showEditProfileModal: true })}>
                        Edit profile
                    </Button>
                }
            >
                <Modal.Header>Edit profile</Modal.Header>
                <Modal.Content>
                    <Responsive minWidth={767}>
                        <Header as='h5'>Profile photo</Header>
                    </Responsive>
                    <input
                        id="myInput"
                        accept="image/png, image/jpeg, image/jpg"
                        type="file"
                        ref={(ref) => this.upload = ref}
                        style={{ display: 'none' }}
                        onChange={(e) => this.handleUpload(event)}
                    />
                    <div className='editProfileModal'>
                        <div className='editProfilePhotoWrap'>
                            <div className="userProfileImg">
                                <Image src={imageView} height="125px" width="125px"/>
                            </div>
                            <div className='editprflButtonWrap'>
                                <Button
                                    as="a"
                                    className='success-btn-rounded-def'
                                    onClick={(e) => this.upload.click()}
                                >
                                    Change profile photo
                                </Button>
                                {!isDefaultImage
                                && (
                                    <a 
                                        className='remvephoto'
                                        onClick={this.handleRemoveProfilePhoto}
                                        >Remove photo
                                    </a>
                                )}
                            </div>
                        </div>
                        <Form>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column computer={8} mobile={16}>
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
                                                condition= {!validity.isFirstNameNotNull}
                                                errorMessage="Please input your first name"
                                            />
                                        </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column computer={8} mobile={16}>
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
                                                condition= {!validity.isLastNameNotNull}
                                                errorMessage= "Please input your last name"
                                            />
                                        </Form.Field>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
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
                                    label="Bio"
                                    placeholder="Bio..."
                                    id="about"
                                    name="about"
                                    maxLength="1000"
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleInputOnBlur}
                                    value={about}
                                />
                                <div className="field-info">{aboutCharCount} of 1000 characters left</div>
                            </Form.Field>
                            <Form.Field>
                                <label htmlFor="location">
                                    Location
                                </label>
                                <Form.Field
                                    single
                                    control={Select}
                                    className="locationSearchDropdown"
                                    style={{minHeight : 'auto'}}
                                    id="location"
                                    name="location"
                                    onClick = {()=>{
                                        document.querySelector('#location input').focus()
                                    }}
                                    onChange={this.handleLocationChange}
                                    onSearchChange={this.handleLocationSearchChange}
                                    options={locationOptions}
                                    search={this.handleCustomSearch}
                                    selection
                                    searchQuery={searchQuery}
                                    placeholder="Search location"
                                    loading={locationLoader}
                                    value={locationDropdownValue}
                                />
                            </Form.Field>
                            <div className="field">
                                <label for='form-input-control-givingGoal'>
                                    Giving goal
                                </label>
                                <div className='label-info'>
                                    Set a personal goal for the dollars you want to commit for giving. Reach your goal by adding money to your account throughout the calendar year. Goals are reset to $0 at the start of each year, and you can update your goal anytime.
                                </div>
                                <Form.Field>
                                    <Form.Input
                                        placeholder="Giving Goal"
                                        id="givingGoal"
                                        name="givingGoal"
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
                                <div className='price_btn'>
                                    <Button basic size="tiny" onClick={() => this.handleAmount(100)}>$100</Button>
                                    <Button basic size="tiny" onClick={() => this.handleAmount(500)}>$500</Button>
                                    <Button basic size="tiny" onClick={() => this.handleAmount(1000)}>$1,000</Button>
                                </div>
                            </div>
                            <Button
                                    className="blue-btn-rounded-def save"
                                    onClick={this.handleSubmit}
                                    disabled={buttonClicked}
                                >
                                    Save
                                </Button>
                        </Form>
                    </div>
                </Modal.Content>
            </Modal>
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        locationLoader: state.userProfile.locationLoader,
        locationOptions: state.userProfile.locationOptions,
        userFriendProfileData: state.userProfile.userFriendProfileData,
        userProfileBasicData: state.userProfile.userProfileBasicData,
    };
}

EditBasicProfile.defaultProps = {
    locationOptions: [{ key: '0', value: "No record found", text: "No record found" }],
}
export default (connect(mapStateToProps)(EditBasicProfile));
