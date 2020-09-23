import React from 'react';
import { connect } from 'react-redux';
import { Container, Grid } from 'semantic-ui-react';

import { actionTypes, setSelectedConversation, loadConversationMessages } from '../../actions/chat';
import '../../static/less/message.less';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import ChatHeader from './ChatHeader/index';
import ChatInboxList from './ChatInboxList';
import ChatMessages from './ChatMessages';
import { loadFriendsList, loadConversations, loadMuteUserList } from '../../actions/chat';
import { defaultSelectedConversation } from '../../helpers/chat/utils';
import configObj from '../../helpers/configEnv';
import { getParamStoreConfig } from '../../actions/user';
import registerAppLozic from '../../helpers/initApplozic'

class ChatWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSmallerScreen: null,
        }
    }

    async componentDidMount() {
        const {
            dispatch,
            userInfo,
            msgId,
            friendListLoaded,
            isAuthenticated
        } = this.props;
        if (window !== 'undefined' && window.SetAppLogicRegister === undefined && isAuthenticated) {
            window.SetAppLogicRegister = 'SetAppLogicRegister';
            let id = this.props.userInfo && this.props.userInfo.id ? this.props.userInfo.id : '';
            const userEmail = this.props.userInfo ? this.props.userInfo.attributes.email : "";
            const userAvatar = this.props.userInfo ? this.props.userInfo.attributes.avatar : "";
            const userDisplayName = this.props.userInfo ? this.props.userInfo.attributes.displayName : "";
            const userFirstName = this.props.userInfo ? this.props.userInfo.attributes.firstName : "";
            const userLastName = this.props.userInfo ? this.props.userInfo.attributes.lastName : "";
            window.userEmail = userEmail
            window.userAvatar = userAvatar
            window.userDisplayName = userDisplayName
            window.userFirstName = userFirstName
            window.userLastName = userLastName;
            try {
                const applozicConfig = await dispatch(getParamStoreConfig(["APPLOZIC_APP_KEY", "APPLOZIC_BASE_URL", "APPLOZIC_WS_URL"]))
                configObj.envVariable = applozicConfig;
                window.APPLOZIC_BASE_URL = applozicConfig['APPLOZIC_BASE_URL']
                window.APPLOZIC_WS_URL = applozicConfig['APPLOZIC_WS_URL']
                window.APPLOZIC_APP_KEY = applozicConfig['APPLOZIC_APP_KEY'];
                await registerAppLozic(id);
            }
            catch (err) { }
        }
        try {
            await dispatch(loadMuteUserList());
        } catch (err) { }
        //This conidition make sure this is called once even when redux state gets changes and dom rebuilds once again.
        if (!friendListLoaded) {
            dispatch({
                payload: {
                    compose: msgId == 'new',
                    smallerScreenSection: 'convList',
                },
                type: actionTypes.COMPOSE_SCREEN_SECTION
            });
            dispatch(loadFriendsList(userInfo, msgId, this.props.muteUserList));
        }
        dispatch({
            payload: {
                msgId,
            },
            type: actionTypes.CHAT_MESSAGE_ID
        })
        window.addEventListener("resize", this.resize);
        this.setState({ isSmallerScreen: window.innerWidth <= 767 });
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (this.state.isSmallerScreen === nextState.isSmallerScreen) {
    //         return false;
    //     }
    //     return true;
    // }
    componentDidUpdate(prevPros) {
        const {
            currentMsgId,
            dispatch,
            messages,
            msgId,
            userDetails,
            groupFeeds,
            friendListLoaded
        } = this.props;
        if (!_isEqual(currentMsgId, prevPros.currentMsgId) && friendListLoaded) {
            const {
                compose,
                selectedConversation,
            } = defaultSelectedConversation(msgId, messages, selectedConversation, userDetails, groupFeeds)
            dispatch(setSelectedConversation(selectedConversation));
            dispatch(loadConversationMessages(selectedConversation));
            if (compose) {
                dispatch({
                    payload: {
                        compose,
                    },
                    type: actionTypes.COMPOSE_SCREEN_SECTION
                });
            }

        }
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.resize)
        this.props.dispatch({
            payload: {
                msgId: '',
            },
            type: actionTypes.CHAT_MESSAGE_ID
        })
    }
    resize = () => {
        this.setState({
            isSmallerScreen: window.innerWidth <= 767
        });
    }



    render() {
        const {
            isSmallerScreen,
        } = this.state;
        return (
            <div className="messageMainWraper">
                <Container>
                    <ChatHeader
                        isSmallerScreen={isSmallerScreen}
                    />
                    <div className="messageWraper">
                        <Grid stretched>
                            <Grid.Row>
                                <Grid.Column className="remove-pad-right" mobile={16} tablet={6} computer={5}>
                                    <ChatInboxList
                                        isSmallerScreen={isSmallerScreen}
                                    />
                                </Grid.Column>
                                <Grid.Column className="remove-pad-left" mobile={16} tablet={10} computer={11}>
                                    <div className="chatSection">
                                        <ChatMessages
                                            isSmallerScreen={isSmallerScreen}
                                        />
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>
                </Container>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        muteUserList: state.chat.muteUserList,
        userInfo: state.user.info,
        friendListLoaded: state.chat.friendListLoaded,
        currentMsgId: state.chat.currentMsgId,
        userDetails: state.chat.userDetails,
        groupFeeds: state.chat.groupFeeds,
        isAuthenticated: state.auth.isAuthenticated,
        messages: state.chat.messages,

    };
}

export default connect(mapStateToProps)(ChatWrapper);
