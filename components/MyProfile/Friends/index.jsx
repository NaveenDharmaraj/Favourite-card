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
