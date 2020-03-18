import React from 'react';
import { connect } from 'react-redux';
import { Container, Grid } from 'semantic-ui-react';

import ChatHeader from './ChatHeader/index';
import ChatInboxList from './ChatInboxList';
import ChatMessages from './ChatMessages';

class ChatWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            compose: props.msgId == 'new',
            smallerScreenSection: 'convList',
        };
    }

    componentDidMount() {
        const {
            disptach,
            userInfo,
            userDetails,
        } = this.props;
        //disptach(loadFriendsList(userInfo,userDetails));
        window.addEventListener("resize", this.resize);
        this.setState({ isSmallerScreen: window.innerWidth <= 767 });
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.isSmallerScreen === nextState.isSmallerScreen) {
            return false;
        }
        return true;
    }

    resize = () => {
        this.setState({ isSmallerScreen: window.innerWidth <= 767 });
    }

    loadConversations = () => {
        console.log('loading conversation')
    }
    handleChatHeaderBackButton = () => {
        this.setState({
            smallerScreenSection: 'convList',
            //filteredMessages: self.state.messages
        })
    }

    composeNew = () => {
        this.setState((prevState) => ({
            compose: !prevState.compose,
            smallerScreenSection: prevState.compose ? "convList" : "convMsgs",
            newGroupMemberIds: [],
            newGroupName: "New Group",
            newGroupImageUrl: null,
            //check this????????
            //selectedConversation: (!this.state.compose ? null : (this.state.selectedConversation && this.state.selectedConversation.key ? this.state.selectedConversation : (this.state.filteredMessages ? this.state.filteredMessages[0] : null))) 

        }));
    }

    render() {
        const {
            compose,
            isSmallerScreen,
            smallerScreenSection,
        } = this.state;
        const {
            userInfo
        } = this.props;
        return (
            <div className="messageMainWraper">
                <Container>
                    <ChatHeader
                        compose={compose}
                        isSmallerScreen={isSmallerScreen}
                        smallerScreenSection={smallerScreenSection}
                        handleChatHeaderBackButton={this.handleChatHeaderBackButton}
                        composeNew={this.composeNew}
                    />
                    <div className="messageWraper">
                        <Grid stretched>
                            <Grid.Row>
                                <Grid.Column className="remove-pad-right" mobile={16} tablet={6} computer={5}>
                                    <ChatInboxList 
                                      compose={compose}
                                      isSmallerScreen={isSmallerScreen}
                                      smallerScreenSection={smallerScreenSection}
                                      userInfo={userInfo}
                                    />
                                </Grid.Column>
                                <Grid.Column className="remove-pad-left" mobile={16} tablet={10} computer={11}>
                                    <ChatMessages />
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
    };
}

export default connect(mapStateToProps)(ChatWrapper);
