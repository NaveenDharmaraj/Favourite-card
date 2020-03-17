import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'semantic-ui-react';

import ChatHeader from './ChatHeader/index';
class ChatWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            compose: props.msgId == 'new',
            smallerScreenSection: 'convList',
        };
    }

    componentDidMount() {
        window.addEventListener("resize", this.resize);
        this.setState({ isSmallerScreen: window.innerWidth <= 767 });
    }
    shouldComponentUpdate(nextState){
        if(this.state.isSmallerScreen === nextState.isSmallerScreen){
            return false;
        }
        return true;
    }

    resize = () => {
        this.setState({ isSmallerScreen: window.innerWidth <= 767 });
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

        return (
            <div className="messageMainWraper">
                <Container>
                    <ChatHeader
                        compose = {compose}
                        isSmallerScreen = {isSmallerScreen}
                        smallerScreenSection = {smallerScreenSection}
                        handleChatHeaderBackButton={this.handleChatHeaderBackButton}
                        composeNew = {this.composeNew}
                    />
                </Container>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.user.auth,
        userInfo: state.user.info,
    };
}

export default connect(mapStateToProps)(ChatWrapper);
