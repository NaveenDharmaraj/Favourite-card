import React from 'react';
import _ from 'lodash';
import {
    Button,
    Form,
    Icon,
    Popup,
    Grid,
    List,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';

import {
    saveUserBasicProfile,
} from '../../../actions/userProfile';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';

class EditBasicProfile extends React.Component {
    constructor(props) {
        super(props);
        const {
            friendsLink, onlyMeLink, publicLink, showFriendsIcon, showonlyMeIcon, showPublicIcon,
        } = this.getPrivacySettings(props.userData);
        this.state = {
            userBasicDetails: {
                about: (!_.isEmpty(props.userData)) ? props.userData.description : '',
                firstName: (!_.isEmpty(props.userData)) ? props.userData.first_name : '',
                friendsLink,
                givingGoal: (!_.isEmpty(props.userData)) ? props.userData.giving_goal_amt : '',
                lastName: (!_.isEmpty(props.userData)) ? props.userData.last_name : '',
                location: (!_.isEmpty(props.userData)) ? props.userData.location : '',
                onlyMeLink,
                publicLink,
                showFriendsIcon,
                showonlyMeIcon,
                showPublicIcon,                
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
        const {
            friendsLink, onlyMeLink, publicLink, showFriendsIcon, showonlyMeIcon, showPublicIcon,
        } = this.getPrivacySettings(userData);
        if (!_.isEqual(this.props, prevProps)) {
            if (!_.isEqual(userData, prevProps.userData)) {
                this.setState({
                    userBasicDetails: {
                        about: userData.description,
                        firstName: userData.first_name,
                        friendsLink,
                        givingGoal: userData.giving_goal_amt,
                        lastName: userData.last_name,
                        location: userData.location,
                        onlyMeLink,
                        publicLink,
                        showFriendsIcon,
                        showonlyMeIcon,
                        showPublicIcon,
                    },
                });
            }
        }
    }

    getPrivacySettings(userData) {
        let publicLink = '';
        let friendsLink = '';
        let onlyMeLink = '';
        let showFriendsIcon = false;
        let showonlyMeIcon = false;
        let showPublicIcon = false;
        if (userData.giving_goal_visibility === 0) {
            publicLink = 'active';
            showPublicIcon = true;
        } else if (userData.giving_goal_visibility === 1) {
            friendsLink = 'active';
            showFriendsIcon = true;
        } else if (userData.giving_goal_visibility === 3) {
            onlyMeLink = 'active';
            showonlyMeIcon = true;
        }
        return {
            friendsLink,
            onlyMeLink,
            publicLink,
            showFriendsIcon,
            showonlyMeIcon,
            showPublicIcon,
        };
    }

    handleAmount(amount) {
        let {
            validity,
        } = this.state;
        this.setState({
            userBasicDetails: {
                givingGoal: amount,
            },
        });
        validity = this.validateUserProfileBasicForm('givingGoal', amount, validity);
        this.setState({
            validity,
        });
    }

    handlePrivacyClick(type) {
        if (type === 'public') {
            this.setState({
                userBasicDetails: {
                    friendsLink: '',
                    onlyMeLink: '',
                    publicLink: 'active',
                    showFriendsIcon: false,
                    showonlyMeIcon: false,
                    showPublicIcon: true,
                },
            });
        } else if (type === 'friends') {
            this.setState({
                userBasicDetails: {
                    friendsLink: 'active',
                    onlyMeLink: '',
                    publicLink: '',
                    showFriendsIcon: true,
                    showonlyMeIcon: false,
                    showPublicIcon: false,
                },
            });
        } else if (type === 'onlyme') {
            this.setState({
                userBasicDetails: {
                    friendsLink: '',
                    onlyMeLink: 'active',
                    publicLink: '',
                    showFriendsIcon: false,
                    showonlyMeIcon: true,
                    showPublicIcon: false,
                },
            });
        }
    }

    intializeValidations() {
        this.validity = {
            isFirstNameNotNull: true,
            isLastNameNotNull: true,
            isDescriptionNotNull: true,
            isGivingGoalNotNull: true,
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
    };

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
        console.log(validity);
        validity = this.validateUserProfileBasicForm('lastName', lastName, validity);
        validity = this.validateUserProfileBasicForm('about', about, validity);
        validity = this.validateUserProfileBasicForm('givingGoal', givingGoal, validity);
                
        this.setState({
            validity,
        });

        return _.every(validity);
    }

    handleSubmit() {
        const isValid = this.validateForm();
        if (isValid) {
            const {
                currentUser: {
                    id,
                },
                dispatch,
            } = this.props;
            const {
                userBasicDetails
            } = this.state;
            saveUserBasicProfile(dispatch, userBasicDetails, id);
        } else {
            console.log('Invalid Data');
        }
    }

    render() {
        const {
            userBasicDetails: {
                firstName,
                lastName,
                about,
                location,
                givingGoal,
                onlyMeLink,
                publicLink,
                showFriendsIcon,
                showonlyMeIcon,
                showPublicIcon,
                friendsLink,
            },
            validity,
        } = this.state;
        return (
            <Grid>
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
                                    placeholder="Tell us a bit yourself..."
                                    id="about"
                                    name="about"
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
                                onChange={this.handleInputChange}
                                onBlur={this.handleInputOnBlur}
                                value={location}
                            />
                            <Form.Field>
                                <label>
                                    Set Giving Goal
                                    <Popup
                                        trigger={<a className="font-s-10 d-in-block hoverable" style={{marginLeft:'.5rem'}}>Privacy settings > </a>}
                                        on="click"
                                        pinned
                                        position="bottom left"
                                        className="privacy-popup"
                                        basic
                                    >
                                        <Popup.Header>I want this to be visible to:</Popup.Header>
                                        <Popup.Content>
                                            <List divided verticalAlign="middle" className="selectable-tick-list">
                                                <List.Item className={publicLink}>
                                                    <List.Content>
                                                        <List.Header as="a" onClick={() => this.handlePrivacyClick('public')}>
                                                            Public
                                                            {' '}
                                                            <span style={{ display: showPublicIcon ? 'inline' : 'none' }}><Icon name="check" /></span>
                                                        </List.Header>
                                                    </List.Content>
                                                </List.Item>
                                                <List.Item className={friendsLink}>
                                                    <List.Content>
                                                        <List.Header as="a" onClick={() => this.handlePrivacyClick('friends')}>
                                                            Friends
                                                            {' '}
                                                            <span style={{ display: showFriendsIcon ? 'inline' : 'none' }}><Icon name="check" /></span>
                                                        </List.Header>
                                                    </List.Content>
                                                </List.Item>
                                                <List.Item className={onlyMeLink}>
                                                    <List.Content>
                                                        <List.Header as="a" onClick={() => this.handlePrivacyClick('onlyme')}>
                                                            Only me
                                                            {' '}
                                                            <span style={{ display: showonlyMeIcon ? 'inline' : 'none' }}><Icon name="check" /></span>
                                                        </List.Header>
                                                    </List.Content>
                                                </List.Item>
                                            </List>
                                        </Popup.Content>
                                        <div className="popup-footer">
                                            <Button size="tiny" className="blue-btn-rounded-def">Save</Button>
                                            <Button size="tiny" className="blue-bordr-btn-round-def">Cancel</Button>
                                        </div>
                                    </Popup>
                                </label>
                                <Form.Field>
                                    <Form.Input
                                        placeholder="Giving Goal"
                                        id="givingGoal"
                                        name="givingGoal"
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
                                <Button className="blue-btn-rounded-def w-140" onClick={this.handleSubmit}>Save</Button>
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
