import React, { cloneElement } from 'react';
import { connect } from 'react-redux';
import {
    Button,
    Image,
    Popup,
    Modal,
    List,
} from 'semantic-ui-react'
import moreIcon from '../../static/images/icons/icon-ellipsis-big.svg';
import applozicApi from "../../services/applozicApi";
class ChatNameHead extends React.Component {
    constructor(props) {
        super(props)
        const selectedConversation = props.selectedConversation;
        const userDetails = props.userDetails;
        const groupFeeds = props.groupFeeds;
        const userInfo = props.userInfo;
        const dispatch = props.dispatch;
        this.state = {
            messages: [],
            filteredMessages: [],
            selectedConversation: selectedConversation,
            userDetail: selectedConversation ? userDetails[selectedConversation["contactIds"]] : {},
            userDetails: userDetails,
            groupFeeds: groupFeeds,
            userInfo: userInfo,
            dispatch: dispatch
        };
    }

    async componentDidMount() {

    }
    componentWillReceiveProps() {
        console.log("componentWillReceiveProps");
        console.log(this.props);
        const selectedConversation = this.props.selectedConversation;
        const userDetails = this.props.userDetails;
        const groupFeeds = this.props.groupFeeds;
        this.setState({ selectedConversation: selectedConversation, userDetails: userDetails, groupFeeds: groupFeeds, userDetail: selectedConversation ? userDetails[selectedConversation["contactIds"]] : {} });
        let self = this;
        console.log("Component Did Mount");

        if (selectedConversation) {
            console.log(selectedConversation.contactIds);
            applozicApi.get("/message/v2/list", { params: { userId: selectedConversation.contactIds } }).then(function (response) {
                // handle success
                console.log("Loaded Mseesass");
                console.log(response);
                let userDetails = {};
                _.forEach(response.response.userDetails, function (userDetail) {
                    userDetails[userDetail.userId] = userDetail;
                });
                let groupFeeds = {};
                _.forEach(response.response.groupFeeds, function (groupFeed) {
                    groupFeeds[groupFeed.id] = groupFeed;
                });
                response.response.message[0].selected = true;
                self.setState({ messages: response.response.message, filteredMessages: response.response.message, userDetails: userDetails, groupFeeds: groupFeeds, selectedConversation: response.response.message[0] });
            })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                    self.setState({ messages: [] });
                })
                .finally(function () {
                    // always executed 
                    console.log("Chat Load Done!");
                });
        }
    }

    render() {
        console.log("RENDER");

        return (

            <div className="chatHeader">
                <div className="chatWith">
                    Message with {this.state.userDetail ? this.state.userDetail.displayName : ""}
                </div>
                <div className="moreOption">
                    <Popup className="moreOptionPopup"
                        trigger={<Button className="moreOption-btn transparent" circular>
                            <Image src={moreIcon} ref={this.contextRef} />
                        </Button>} basic position='bottom right' on='click'>
                        <Popup.Content>
                            <List>
                                <Modal size="tiny" dimmer="inverted" className="chimp-modal" closeIcon trigger={<List.Item as='a'>Mute</List.Item>} centered={false}>
                                    <Modal.Header>Mute conversation?</Modal.Header>
                                    <Modal.Content>
                                        <Modal.Description className="font-s-16">You can unmute this conversation anytime.</Modal.Description>
                                        <div className="btn-wraper pt-3 text-right">
                                            <Button className="blue-btn-rounded-def c-small">Mute</Button>
                                            <Button className="blue-bordr-btn-round-def c-small">Cancel</Button>
                                        </div>
                                    </Modal.Content>
                                </Modal>
                                <Modal size="tiny" dimmer="inverted" className="chimp-modal" closeIcon trigger={<List.Item as='a'>Delete conversation</List.Item>} centered={false}>
                                    <Modal.Header>Delete conversation?</Modal.Header>
                                    <Modal.Content>
                                        <Modal.Description className="font-s-16">Deleting removes conversations from inbox, but no ones else’s inbox.</Modal.Description>
                                        <div className="btn-wraper pt-3 text-right">
                                            <Button className="blue-btn-rounded-def c-small">Delete</Button>
                                            <Button className="blue-bordr-btn-round-def c-small">Cancel</Button>
                                        </div>
                                    </Modal.Content>
                                </Modal>
                            </List>
                        </Popup.Content>
                    </Popup>
                </div>
            </div>
        );
    }

}
function mapStateToProps(state) {
    return {
        auth: state.user.auth,
        userInfo: state.user.info
    };
}

export default connect(mapStateToProps)(ChatNameHead);