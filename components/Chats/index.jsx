import React from 'react';
import { connect } from 'react-redux';
import { Container, Grid } from 'semantic-ui-react';

import { actionTypes } from '../../actions/chat';
import '../../static/less/message.less';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import ChatHeader from './ChatHeader/index';
import ChatInboxList from './ChatInboxList';
import ChatMessages from './ChatMessages';
import { loadFriendsList, loadConversations, loadMuteUserList } from '../../actions/chat';

class ChatWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSmallerScreen: null,
        }
    }

    componentDidMount() {
        const {
            dispatch,
            userInfo,
            msgId,
            friendListLoaded,
        } = this.props;
        dispatch(loadMuteUserList());
        //This conidition make sure this is called once even when redux state gets changes and dom rebuilds once again.
        if (!friendListLoaded) {
            dispatch({
                payload: {
                    compose: msgId == 'new',
                    smallerScreenSection: 'convList',
                },
                type: actionTypes.COMPOSE_SCREEN_SECTION
            })
            dispatch(loadFriendsList(userInfo, msgId));
        }
        //dispatch(loadConversations(msgId));
        window.addEventListener("resize", this.resize);
        this.setState({ isSmallerScreen: window.innerWidth <= 767 });
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (this.state.isSmallerScreen === nextState.isSmallerScreen) {
    //         return false;
    //     }
    //     return true;
    // }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize)
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
        const {
            userInfo
        } = this.props;
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
                                        userInfo={userInfo}
                                    />
                                </Grid.Column>
                                <Grid.Column className="remove-pad-left" mobile={16} tablet={10} computer={11}>
                                    <ChatMessages
                                        isSmallerScreen={isSmallerScreen}
                                    />
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
        userDetails: state.chat.userDetails,
        auth: state.user.auth,
        userInfo: state.user.info,
        friendListLoaded: state.chat.friendListLoaded
    };
}

export default connect(mapStateToProps)(ChatWrapper);
