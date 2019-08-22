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
        };
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

    // eslint-disable-next-line class-methods-use-this
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
        this.setState({
            userBasicDetails: {
                givingGoal: amount,
            },
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


    render() {
        const {
            userBasicDetails,
        } = this.state;
        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column mobile={16} tablet={12} computer={10}>
                        <Form>
                            <Form.Group widths="equal">
                                <Form.Input
                                    fluid
                                    label="First name"
                                    placeholder="First name"
                                    value={userBasicDetails.firstName}
                                />
                                <Form.Input
                                    fluid
                                    label="Last name"
                                    placeholder="Last name"
                                    value={userBasicDetails.lastName}
                                />
                            </Form.Group>
                            <Form.TextArea
                                label="About"
                                placeholder="Tell us a bit yourself..."
                                value={userBasicDetails.about}
                            />
                            <Form.Input
                                fluid
                                label="Location"
                                placeholder="Location"
                                value={userBasicDetails.location}
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
                                                <List.Item className={userBasicDetails.publicLink}>
                                                    <List.Content>
                                                        <List.Header as="a" onClick={() => this.handlePrivacyClick('public')}>
                                                            Public
                                                            {' '}
                                                            <span style={{ display: userBasicDetails.showPublicIcon ? 'inline' : 'none' }}><Icon name="check" /></span>
                                                        </List.Header>
                                                    </List.Content>
                                                </List.Item>
                                                <List.Item className={userBasicDetails.friendsLink}>
                                                    <List.Content>
                                                        <List.Header as="a" onClick={() => this.handlePrivacyClick('friends')}>
                                                            Friends
                                                            {' '}
                                                            <span style={{ display: userBasicDetails.showFriendsIcon ? 'inline' : 'none' }}><Icon name="check" /></span>
                                                        </List.Header>
                                                    </List.Content>
                                                </List.Item>
                                                <List.Item className={userBasicDetails.onlyMeLink}>
                                                    <List.Content>
                                                        <List.Header as="a" onClick={() => this.handlePrivacyClick('onlyme')}>
                                                            Only me
                                                            {' '}
                                                            <span style={{ display: userBasicDetails.showonlyMeIcon ? 'inline' : 'none' }}><Icon name="check" /></span>
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
                                <input
                                    placeholder="Giving Goal"
                                    id="givingGoal"
                                    value={userBasicDetails.givingGoal}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Button basic size="tiny" onClick={() => this.handleAmount(500)}>$500</Button>
                                <Button basic size="tiny" onClick={() => this.handleAmount(1000)}>$1000</Button>
                                <Button basic size="tiny" onClick={() => this.handleAmount(1500)}>$1500</Button>
                            </Form.Field>
                            <div className="pt-2">
                                <Button className="blue-btn-rounded-def w-140">Save</Button>
                                <Button className="blue-bordr-btn-round-def w-140">Cancel</Button>
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
