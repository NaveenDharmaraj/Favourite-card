import React, { cloneElement } from 'react';
import {
    Icon,
    Image,
    Input,
    List,
} from 'semantic-ui-react'
import _ from 'lodash';
import applozicApi from "../../services/applozicApi"
class InboxPeople extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            userDetails: {},
            selectedConversation: null
        };
    }
    componentDidMount() {
        let self = this;
        applozicApi.get("/message/v2/list", { data: { startIndex: 0, mainPageSize: 100, pageSize: 50 } }).then(function (response) {
            // handle success
            console.log(response);
            let userDetails = {};
            _.forEach(response.response.userDetails, function (userDetail) {
                userDetails[userDetail.userId] = userDetail;
            });
            response.response.message[0].selected = true;
            self.setState({ messages: response.response.message, userDetails: userDetails, selectedConversation: response.response.message[0] });
        })
            .catch(function (error) {
                // handle error
                console.log(error);
                self.setState({ messages: [] });
            })
            .finally(function () {
                // always executed
            });
    }
    onConversationSelect(msg) {
        console.log(msg);
        this.setState({ selectedConversation: msg });
    }
    render() {
        let self = this;
        return (

            <div className="messageLeftMenu">
                <div className="messageLeftSearch">
                    <Input fluid iconPosition='left' icon='search' placeholder='Search...' />
                </div>
                <div className="chatList">
                    <List divided verticalAlign='middle'>
                        {(() => {
                            if (self.state.messages && self.state.messages.length > 0) {
                                return self.state.messages.map((msg) => (
                                    <List.Item as="a" active={msg.selected} key={msg.key} onClick={() => self.onConversationSelect(msg)}>
                                        <List.Content floated='right'>
                                            <div className="time">
                                                12:24 AM
                    </div>
                                            <div className="iconWraper">
                                                {/* <Icon name="mute" /> */}
                                            </div>
                                        </List.Content>
                                        <Image avatar src={self.state.userDetails[msg.contactIds]['imageLink']} />
                                        <List.Content>
                                            <List.Header as='a'><span className="newMessage">{self.state.userDetails[msg.contactIds]['displayName']}</span></List.Header>
                                            <List.Description>
                                                {msg.message}
                                            </List.Description>
                                        </List.Content>
                                    </List.Item>
                                ));
                            }
                        })()}

                        {/* <List.Item as="a">
                            <List.Content floated='right'>
                                <div className="time">
                                    12:24 AM
                    </div>
                                <div className="iconWraper">

                                </div>
                            </List.Content>
                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/lindsay.png' />
                            <List.Content>
                                <List.Header as='a'><span className="newMessage">Lindsay</span></List.Header>
                                <List.Description>
                                    Nunc et sapien vitae turpis aliqueon
                    </List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item as="a">
                            <List.Content floated='right'>
                                <div className="time">
                                    12:24 AM
                    </div>
                                <div className="iconWraper">

                                </div>
                            </List.Content>
                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/matthew.png' />
                            <List.Content>
                                <List.Header as='a'>Matthew</List.Header>
                                <List.Description>
                                    Nunc et sapien vitae turpis aliqueon
                    </List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item as="a">
                            <List.Content floated='right'>
                                <div className="time">
                                    12:24 AM
                    </div>
                                <div className="iconWraper">

                                </div>
                            </List.Content>
                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/matthew.png' />
                            <List.Content>
                                <List.Header as='a'>Matthew</List.Header>
                                <List.Description>
                                    Nunc et sapien vitae turpis aliqueon
                    </List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item as="a">
                            <List.Content floated='right'>
                                <div className="time">
                                    12:24 AM
                    </div>
                                <div className="iconWraper">

                                </div>
                            </List.Content>
                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/matthew.png' />
                            <List.Content>
                                <List.Header as='a'>Matthew</List.Header>
                                <List.Description>
                                    Nunc et sapien vitae turpis aliqueon
                    </List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item as="a">
                            <List.Content floated='right'>
                                <div className="time">
                                    12:24 AM
                    </div>
                                <div className="iconWraper">

                                </div>
                            </List.Content>
                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/matthew.png' />
                            <List.Content>
                                <List.Header as='a'>Matthew</List.Header>
                                <List.Description>
                                    Nunc et sapien vitae turpis aliqueon
                    </List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item as="a">
                            <List.Content floated='right'>
                                <div className="time">
                                    12:24 AM
                    </div>
                                <div className="iconWraper">

                                </div>
                            </List.Content>
                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/matthew.png' />
                            <List.Content>
                                <List.Header as='a'>Matthew</List.Header>
                                <List.Description>
                                    Nunc et sapien vitae turpis aliqueon
                    </List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item as="a">
                            <List.Content floated='right'>
                                <div className="time">
                                    12:24 AM
                    </div>
                                <div className="iconWraper">

                                </div>
                            </List.Content>
                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/matthew.png' />
                            <List.Content>
                                <List.Header as='a'>Matthew</List.Header>
                                <List.Description>
                                    Nunc et sapien vitae turpis aliqueon
                    </List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item as="a">
                            <List.Content floated='right'>
                                <div className="time">
                                    12:24 AM
                    </div>
                                <div className="iconWraper">

                                </div>
                            </List.Content>
                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/matthew.png' />
                            <List.Content>
                                <List.Header as='a'>Matthew</List.Header>
                                <List.Description>
                                    Nunc et sapien vitae turpis aliqueon
                    </List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item as="a">
                            <List.Content floated='right'>
                                <div className="time">
                                    12:24 AM
                    </div>
                                <div className="iconWraper">

                                </div>
                            </List.Content>
                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/matthew.png' />
                            <List.Content>
                                <List.Header as='a'>Matthew</List.Header>
                                <List.Description>
                                    Nunc et sapien vitae turpis aliqueon
                    </List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item as="a">
                            <List.Content floated='right'>
                                <div className="time">
                                    12:24 AM
                    </div>
                                <div className="iconWraper">

                                </div>
                            </List.Content>
                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/matthew.png' />
                            <List.Content>
                                <List.Header as='a'>Matthew</List.Header>
                                <List.Description>
                                    Nunc et sapien vitae turpis aliqueon
                    </List.Description>
                            </List.Content>
                        </List.Item>
                        <List.Item as="a">
                            <List.Content floated='right'>
                                <div className="time">
                                    12:24 AM
                    </div>
                                <div className="iconWraper">

                                </div>
                            </List.Content>
                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/matthew.png' />
                            <List.Content>
                                <List.Header as='a'>Matthew</List.Header>
                                <List.Description>
                                    Nunc et sapien vitae turpis aliqueon
                    </List.Description>
                            </List.Content>
                        </List.Item> */}
                    </List>
                </div>
            </div>

        );
    }

}

export default InboxPeople
