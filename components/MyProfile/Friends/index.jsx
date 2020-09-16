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

    // componentDidMount() {
    //     const {
    //         dispatch,
    //     } = this.props;
    //     generateDeeplinkSignup(dispatch, 'signup');
    // }

    // componentDidUpdate(prevProps) {
    //     const {
    //         userProfileSignUpDeeplink,
    //     } = this.props;
    //     if (!_.isEqual(userProfileSignUpDeeplink, prevProps.userProfileSignUpDeeplink)) {
    //         this.setState({
    //             signUpDeeplink: userProfileSignUpDeeplink.data.attributes['short-link'],
    //         })
    //     };
    // }
    // // eslint-disable-next-line react/sort-comp
    // handleTab(event, data) {
    //     switch (data.activeIndex) {
    //         case 0:
    //             Router.pushRoute('/user/profile/friends/findfriends');
    //             break;
    //         case 1:
    //             Router.pushRoute('/user/profile/friends/myfriends');
    //             break;
    //         default:
    //             break;
    //     }
    //     this.setState({
    //         activeTabIndex: data.activeIndex,
    //     });
    // }

    // handleInviteClick() {
    //     this.setState({
    //         statusMessage: false,
    //         userEmailId: '',
    //         userEmailIdsArray:[],
    //         isValidEmails: true,
    //     })
    // }

    // handleInputChange(event, data) {
    //     const {
    //         value,
    //     } = !_.isEmpty(data) ? data : event.target;
    //     let {
    //         userEmailId,
    //     } = this.state;
    //     userEmailId = value;
    //     this.setState({
    //         userEmailId,
    //     });
    // }

    // handleKeyDown = evt => {
    //     let {
    //         userEmailIdsArray,
    //         userEmailId,
    //     } = this.state;
    //     if (["Enter", "Tab", " ", ","].includes(evt.key)) {
    //         evt.preventDefault();
    //         var value = userEmailId.trim();
    //         let isEmailIdValid = this.isEmail(userEmailId);
    //         this.setState({ isValidEmails: isEmailIdValid });
    //         if (value && isEmailIdValid) {
    //         this.setState({
    //             userEmailIdsArray: [...userEmailIdsArray, userEmailId],
    //             userEmailId: "",
    //         });
    //         }
    //     }
    // };
    
    // isEmail(email) {
    //     return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
    // }

    // handleDelete = item => {
    //     this.setState({
    //       userEmailIdsArray: this.state.userEmailIdsArray.filter(i => i !== item)
    //     });
    // };

    // validateEmailIds(emailIds) {        
    //     let isValidEmail = true;
    //     // let splitedEmails = emailIds.split(',');
    //     if(emailIds.length === 0) {
    //         return false
    //     }
    //     for (let i = 0; i < emailIds.length; i++) {
    //         isValidEmail = /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(emailIds[i]);
    //         if(!isValidEmail) {
    //             return false;
    //         }
    //     }
    //     return true;
    // }

    // handleInviteFriendsClick() {
    //     this.setState({
    //         inviteButtonClicked: true,
    //         statusMessage: false,
    //     });
    //     const {
    //         userEmailId,
    //         userEmailIdsArray,
    //     } = this.state;
    //     let emailIdsArray = userEmailIdsArray;
    //     if(userEmailId !== null) {
    //         var value = userEmailId.trim();
    //         let isEmailIdValid = this.isEmail(userEmailId);
    //         this.setState({ isValidEmails: isEmailIdValid });
    //         // if (value && isEmailIdValid) {
    //             emailIdsArray = [...userEmailIdsArray, userEmailId];               
    //         // }
    //     }
    //     const emailsValid = this.validateEmailIds(emailIdsArray);
    //     this.setState({ isValidEmails: emailsValid });
    //     if(emailIdsArray !== null && emailsValid) {
    //         const {
    //             dispatch,
    //         } = this.props;
    //         let userEmailIdList = emailIdsArray.join();
    //         inviteFriends(dispatch, userEmailIdList).then(() => {
    //             this.setState({
    //                 errorMessage: null,
    //                 successMessage: 'Invite sent.',
    //                 statusMessage: true,
    //                 inviteButtonClicked: false,
    //                 userEmailId: '',
    //                 userEmailIdsArray:[],
    //             });
    //         }).catch((err) => {
    //             this.setState({
    //                 errorMessage: 'Error in sending invite.',
    //                 statusMessage: true,
    //                 inviteButtonClicked: false,
    //                 userEmailId: '',
    //                 userEmailIdsArray:[],
    //             });
    //         });
    //     } else {
    //         this.setState({
    //             inviteButtonClicked: false,
    //         });
    //     }
    // }

    // handleCopyLink = (e) => {
    //     this.textArea.select();
    //     document.execCommand('copy');        
    //     e.target.focus();
    //     this.setState({
    //         errorMessage: null,
    //         successMessage: 'Copied to clipboard',
    //         statusMessage: true,
    //     });
    // };

    // eslint-disable-next-line class-methods-use-this
    // getPageIndexByName(pageName) {
    //     switch (pageName) {
    //         case 'findfriends':
    //             return 0;
    //         case 'myfriends':
    //             return 1;
    //         default:
    //             break;
    //     }
    // }

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
                <p>FRIEND</p>
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
