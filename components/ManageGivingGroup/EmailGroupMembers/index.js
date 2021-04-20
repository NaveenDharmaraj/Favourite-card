import {
    Header,
    Form,
    Button,
    TextArea, Table,
    List,
    Image,
} from 'semantic-ui-react';

import { Link } from '../../../routes';
import imageManage from '../../../static/images/no-data-avatar-group-chat-profile.png';

const EmailGroupMembers = () => {
    return (
        <div className='basicsettings'>
            <Header className='titleHeader'>Email
            </Header>
            <Form>
                <div className="GroupMembers">
                    <Header as='h3'>Send an email to all group members</Header>
                    <label>Message</label>
                    <TextArea />
                    <Button className="blue-btn-rounded-def emailmessagebtn disabled" floated='right'>Send message</Button>
                </div>
            </Form>
            <div className="memberswapper emailMembersIcon">
                <div className="Emailmembers emailmembersLeft">
                    <p>
                        <span>
                            <i aria-hidden="true" className="icon icon-mail" />
                        </span>
                        Message history
                    </p>
                </div>
            </div>
            <div className="Invite">
                <Table basic="very" className="ManageTable Topborder Bottomborder">
                    <Table.Body>
                        <Table.Row className="ManageWappeer">
                            <Table.Cell className="ManageGroup">
                                <List>
                                    <List.Item>
                                        <Image src={imageManage} className="imgManage" />
                                        <List.Content>
                                            <List.Header className="ManageAdmin">
                                                Ann Blake • Admin
                                            </List.Header>
                                            <List.Description className="messageSend">
                                                <p>
                                                    Lorem Ipsum is simply dummied text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                                                    standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a
                                                    type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining
                                                    essentially unchanged.
                                                </p>
                                            </List.Description>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Table.Cell>
                            <Table.Cell className="Managebtn emailDate">
                                <p>Feb 14, 2020</p>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>
        </div>
    );
}

export default EmailGroupMembers;
