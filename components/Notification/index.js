import React, { cloneElement, Fragment } from 'react';
//import dynamic from 'next/dynamic';
import { connect } from 'react-redux'
import { Icon, Image, Label, List, Menu, Popup } from 'semantic-ui-react';
import _ from 'lodash';
import { NotificationHelper } from '../../Firebase/NotificationHelper';

class NotificationWrapper extends React.Component {
    constructor(props) {
        super(props)
        /* const messageCount = props.messageCount;
         const messages = props.messages;
         const userInfo = props.userInfo;
         const dispatch = props.dispatch;
         this.state = {
             msgId: props.msgId,
             messageCount: messageCount,
             messages: messages,
             userInfo: userInfo,
             dispatch: dispatch
         };*/
    }

    componentWillUpdate(nextProps, nextState) {

    }

    async componentDidMount() {
        const {
            userInfo,
            dispatch
        } = this.state;
        await NotificationHelper.getMessages(userInfo, dispatch);
    }
    async onClick(userInfo, dispatch) {
        await NotificationHelper.getMessages(userInfo, dispatch);
    }
    async onMessageClick(msgKey, msg) {
        const {
            userInfo,
            dispatch
        } = this.state;
        await NotificationHelper.markAsRead(userInfo, dispatch, msgKey, msg);
    };

    async acceptFriendRequestAsync(msg) {
        const {
            userInfo,
            dispatch
        } = this.state;
        await NotificationHelper.acceptFriendRequest(userInfo, dispatch, msg);
    };
    timeDifference(current, previous) {

        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed = current - previous;

        if (elapsed < msPerMinute) {
            return Math.round(elapsed / 1000) + ' seconds ago';
        } else if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + ' minutes ago';
        } else if (elapsed < msPerDay) {
            return Math.round(elapsed / msPerHour) + ' hours ago';
        } else if (elapsed < msPerMonth) {
            return Math.round(elapsed / msPerDay) + ' days ago';
        } else if (elapsed < msPerYear) {
            return Math.round(elapsed / msPerMonth) + ' months ago';
        } else {
            return Math.round(elapsed / msPerYear) + ' years ago';
        }
    }
    render() {
        const messageCount = this.props.messageCount;
        const messages = this.props.messages;
        const userInfo = this.props.userInfo;
        const dispatch = this.props.dispatch;
        const msgId = this.props.msgId;
        this.state = {
            msgId: msgId,
            messageCount: messageCount,
            messages: messages,
            userInfo: userInfo,
            dispatch: dispatch
        };
        let self = this;
        console.log(self.state);
        return (
            <Fragment>
                <div onClick={() => this.onClick(self.state.userInfo, self.state.dispatch)}>Notifications</div>
                <List relaxed>
                {(() => {
                    if (self.state.messages && self.state.messages.length > 0) {
                        return self.state.messages.map((msg) => (
                            <List.Item key={msg._key} >
                                <Image avatar src='https://react.semantic-ui.com//images/avatar/small/daniel.jpg' />
                                <List.Content style={{width:"90%"}}>
                                    <List.Header as='a'>{msg.sourceDisplayName}</List.Header>
                                    <List.Description onClick={() => this.onMessageClick(msg._key, msg)}>
                                        {msg.message}
                                        {(() => {
                                            if (msg.type == "friendRequest" && msg.sourceUserId != userInfo.id) {
                                                return <div style={{ textAlign: 'center', float: 'right', display: 'inline-block' }}>
                                                    {/* <button style={{ float: "right" }} className="ui button">Reject</button> */}
                                                    <button style={{ float: "right", marginRight: "10px" }} className="ui primary button" onClick={() => this.acceptFriendRequestAsync(msg)}>Accept</button>
                                                </div>;
                                            }
                                        })()}
                                        &nbsp;
                                        {this.timeDifference(new Date().getTime(), msg.createdTs)}
                                    </List.Description>
                                </List.Content>
                            </List.Item>
                        ));
                    }
                })()}
                </List>               
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.user.auth,
        messages: state.firebase.messages,
        messageCount: state.firebase.messages ? Object.keys(state.firebase.messages).length : 0,
        userInfo: state.user.info
    };
}

export default connect(mapStateToProps)(NotificationWrapper);