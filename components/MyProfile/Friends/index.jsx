/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import _ from 'lodash';
import {
    Button,
    Header,
    Form,
    Modal,
    Icon,
    Grid,
    Responsive,
    Tab,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import dynamic from 'next/dynamic';

import { Router } from '../../../routes';
import {
    inviteFriends,
    generateDeeplinkSignup,
} from '../../../actions/userProfile';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
const ModalStatusMessage = dynamic(() => import('../../shared/ModalStatusMessage'), {
    ssr: false
});

import FindFriends from './findFriends';
import MyFriends from './myFriends';

const panes2 = [
    {
        menuItem: {
            content: 'Find friends',
            icon: 'find_friends',
            iconPosition: 'left',
            key: 'Find friends',
        },
        render: () => (
            <Tab.Pane attached={false}>
                <FindFriends />
            </Tab.Pane>
        ),
    },
    {
        menuItem: {
            content: 'Your friends',
            icon: 'friends',
            iconPosition: 'left',
            key: 'Your friends',
        },
        render: () => (
            <Tab.Pane attached={false}>
                <MyFriends />
            </Tab.Pane>
        ),
    },
];

class Friends extends React.Component {
    constructor(props) {
        super(props);
        const {
            settingName,
        } = props;
        const activeTabIndex = _.isEmpty(settingName) ? 0 : this.getPageIndexByName(settingName);
        this.state = {
            activeTabIndex,
            inviteButtonClicked: false,
            errorMessage: null,
            signUpDeeplink: '',
            statusMessage: false,
            successMessage: '',
            userEmailId: '',
            userEmailIdsArray:[],
            isValidEmails: true,
        };
        this.handleTab = this.handleTab.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInviteFriendsClick = this.handleInviteFriendsClick.bind(this);
        this.handleCopyLink = this.handleCopyLink.bind(this);
        this.handleInviteClick = this.handleInviteClick.bind(this);
        this.validateEmailIds = this.validateEmailIds.bind(this);
    }

    componentDidMount() {
        const {
            dispatch,
        } = this.props;
        generateDeeplinkSignup(dispatch, 'signup');
    }

    componentDidUpdate(prevProps) {
        const {
            userProfileSignUpDeeplink,
        } = this.props;
        if (!_.isEqual(userProfileSignUpDeeplink, prevProps.userProfileSignUpDeeplink)) {
            this.setState({
                signUpDeeplink: userProfileSignUpDeeplink.data.attributes['short-link'],
            })
        };
    }
    // eslint-disable-next-line react/sort-comp
    handleTab(event, data) {
        switch (data.activeIndex) {
            case 0:
                Router.pushRoute('/user/profile/friends/findfriends');
                break;
            case 1:
                Router.pushRoute('/user/profile/friends/myfriends');
                break;
            default:
                break;
        }
        this.setState({
            activeTabIndex: data.activeIndex,
        });
    }

    handleInviteClick() {
        this.setState({
            statusMessage: false,
            userEmailId: '',
            userEmailIdsArray:[],
            isValidEmails: true,
        })
    }

    handleInputChange(event, data) {
        const {
            value,
        } = !_.isEmpty(data) ? data : event.target;
        let {
            userEmailId,
        } = this.state;
        userEmailId = value;
        this.setState({
            userEmailId,
        });
    }

    handleKeyDown = evt => {
        let {
            userEmailIdsArray,
            userEmailId,
        } = this.state;
        if (["Enter", "Tab", " ", ","].includes(evt.key)) {
            evt.preventDefault();
            var value = userEmailId.trim();
            let isEmailIdValid = this.isEmail(userEmailId);
            this.setState({ isValidEmails: isEmailIdValid });
            if (value && isEmailIdValid) {
            this.setState({
                userEmailIdsArray: [...userEmailIdsArray, userEmailId],
                userEmailId: "",
            });
            }
        }
    };
    
    isEmail(email) {
        return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
    }

    handleDelete = item => {
        this.setState({
          userEmailIdsArray: this.state.userEmailIdsArray.filter(i => i !== item)
        });
    };

    validateEmailIds(emailIds) {        
        let isValidEmail = true;
        // let splitedEmails = emailIds.split(',');
        if(emailIds.length === 0) {
            return false
        }
        for (let i = 0; i < emailIds.length; i++) {
            isValidEmail = /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(emailIds[i]);
            if(!isValidEmail) {
                return false;
            }
        }
        return true;
    }

    handleInviteFriendsClick() {
        this.setState({
            inviteButtonClicked: true,
            statusMessage: false,
        });
        const {
            userEmailId,
            userEmailIdsArray,
        } = this.state;
        let emailIdsArray = userEmailIdsArray;
        if(userEmailId !== null) {
            var value = userEmailId.trim();
            let isEmailIdValid = this.isEmail(userEmailId);
            this.setState({ isValidEmails: isEmailIdValid });
            // if (value && isEmailIdValid) {
                emailIdsArray = [...userEmailIdsArray, userEmailId];               
            // }
        }
        const emailsValid = this.validateEmailIds(emailIdsArray);
        this.setState({ isValidEmails: emailsValid });
        if(emailIdsArray !== null && emailsValid) {
            const {
                dispatch,
            } = this.props;
            let userEmailIdList = emailIdsArray.join();
            inviteFriends(dispatch, userEmailIdList).then(() => {
                this.setState({
                    errorMessage: null,
                    successMessage: 'Invite sent.',
                    statusMessage: true,
                    inviteButtonClicked: false,
                    userEmailId: '',
                    userEmailIdsArray:[],
                });
            }).catch((err) => {
                this.setState({
                    errorMessage: 'Error in sending invite.',
                    statusMessage: true,
                    inviteButtonClicked: false,
                    userEmailId: '',
                    userEmailIdsArray:[],
                });
            });
        } else {
            this.setState({
                inviteButtonClicked: false,
            });
        }
    }

    handleCopyLink = (e) => {
        this.textArea.select();
        document.execCommand('copy');        
        e.target.focus();
        this.setState({
            errorMessage: null,
            successMessage: 'Copied to clipboard',
            statusMessage: true,
        });
    };

    // eslint-disable-next-line class-methods-use-this
    getPageIndexByName(pageName) {
        switch (pageName) {
            case 'findfriends':
                return 0;
            case 'myfriends':
                return 1;
            default:
                break;
        }
    }

    render() {
        const {
            inviteButtonClicked,
            errorMessage,
            signUpDeeplink,
            statusMessage,
            successMessage,
            activeTabIndex,
            userEmailId,
            isValidEmails,
        } = this.state;
        return (
            <div>
                <div className="inviteSettings">
                    <Grid doubling centered columns={2}>
                        <Grid.Row>
                            <Grid.Column>
                                <Header as="h3" icon>
                                    <Icon name="settings" />
                                        Find friends and give together
                                    <Header.Subheader className="mb-1">
                                        Send your friends charitable dollars that they can give away,
                                        give together in Giving Groups and share messages and
                                        encouragement that inspires them to give.
                                    </Header.Subheader>
                                    <Modal
                                        className="chimp-modal"
                                        closeIcon
                                        trigger={<Button className="blue-bordr-btn-round-def" onClick={this.handleInviteClick}>Invite friends</Button>}
                                        centered
                                        dimmer="inverted"
                                    >
                                        <Modal.Header>
                                            Invite friends to join Charitable Impact
                                        </Modal.Header>
                                        <Modal.Content>
                                            <Modal.Description>
                                                <Form className="mb-2 inviteForm">
                                                    {
                                                        statusMessage && (
                                                            <div className="mb-1">
                                                                <ModalStatusMessage 
                                                                    message = {!_.isEmpty(successMessage) ? successMessage : null}
                                                                    error = {!_.isEmpty(errorMessage) ? errorMessage : null}
                                                                />
                                                            </div>
                                                        )
                                                    }
                                                    <label>
                                                        Enter as many email addresses as you like,
                                                        separated by comma
                                                    </label>

                                                    
                                                    <Grid verticalAlign="middle">                                                        
                                                        <Grid.Row>
                                                            <Grid.Column mobile={11} tablet={12} computer={13}>
                                                                <Form.Field className="cpTagsInput" 
                                                                onClick={() => {this.myInp.focus()}}
                                                                >
                                                                    {this.state.userEmailIdsArray.map(item => (
                                                                    <div className="tag-item" key={item}>
                                                                        {item}
                                                                        <button
                                                                        type="button"
                                                                        className="button"
                                                                        onClick={() => this.handleDelete(item)}
                                                                        >
                                                                        &times;
                                                                        </button>
                                                                    </div>
                                                                    ))}
                                                                    <input
                                                                        placeholder="Email Address"
                                                                        error={!isValidEmails}
                                                                        id="userEmailId"
                                                                        name="userEmailId"
                                                                        onKeyDown={this.handleKeyDown}
                                                                        onChange={this.handleInputChange}
                                                                        ref={(ip) => this.myInp = ip}
                                                                        value={userEmailId}
                                                                    />                                                                    
                                                                </Form.Field>                                                                
                                                            </Grid.Column>
                                                            <Grid.Column mobile={5} tablet={4} computer={3} className="text-right">
                                                                <Button
                                                                    className="blue-btn-rounded-def c-small"
                                                                    onClick={this.handleInviteFriendsClick}
                                                                    disabled={inviteButtonClicked}
                                                                >
                                                                    Invite
                                                                </Button>
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    </Grid>
                                                </Form>
                                                <div className="mt--1 mb-1">
                                                    <FormValidationErrorMessage
                                                        condition={!isValidEmails}
                                                        errorMessage="Please enter a valid email address."
                                                    />
                                                </div>
                                                <Form className="inviteForm">
                                                    <label>
                                                        Share link
                                                    </label>
                                                    <Grid verticalAlign="middle">
                                                        <Grid.Row>
                                                            <Grid.Column mobile={11} tablet={12} computer={13}>
                                                                <Form.Field>
                                                                    <input
                                                                    ref={(textarea) => this.textArea = textarea}
                                                                    value={signUpDeeplink} />
                                                                </Form.Field>
                                                            </Grid.Column>
                                                            <Grid.Column mobile={5} tablet={4} computer={3} className="text-right">
                                                                <Button
                                                                    className="blue-bordr-btn-round-def c-small"
                                                                    onClick={this.handleCopyLink}
                                                                >
                                                                    Copy link
                                                                </Button>
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    </Grid>
                                                </Form>
                                            </Modal.Description>
                                        </Modal.Content>
                                    </Modal>
                                </Header>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <div className="border-top">
                    <Responsive minWidth={768}>
                        <div className="settingsTab margin-0">
                            <Tab
                                grid={{
                                    paneWidth: 11,
                                    tabWidth: 5,
                                }}
                                menu={{
                                    fluid: true,
                                    tabular: true,
                                    vertical: true,
                                }}
                                panes={panes2}
                                activeIndex={activeTabIndex}
                                onTabChange={this.handleTab}
                            />
                        </div>
                    </Responsive>
                    <Responsive maxWidth={767}>
                        <div className="charityTab n-border margin-0">
                            <Tab
                                menu={{
                                    pointing: true,
                                    secondary: true,
                                }}
                                panes={panes2}
                                activeIndex={activeTabIndex}
                                onTabChange={this.handleTab}
                            />
                        </div>
                    </Responsive>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.user.info,
        userProfileSignUpDeeplink: state.userProfile.userProfileSignUpDeeplink,
    };
}

export default (connect(mapStateToProps)(Friends));
