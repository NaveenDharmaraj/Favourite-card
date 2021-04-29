import React, {
    useState,
} from 'react';
import {
    useDispatch,
    useSelector,
} from 'react-redux';
import {
    Header,
    Form,
    Button,
    Icon,
    Table,
    Input,
    TextArea,
} from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';

import {
    sendEmailInvite,
} from '../../../actions/createGivingGroup';

const Invite = () => {
    const groupDetails = useSelector((state) => state.group.groupDetails);
    const dispatch = useDispatch();
    const [emails, setemails] = useState('');
    const [message, setmessage] = useState('');
    const [showLoader, setshowLoader] = useState(false);
    const handleEmail = (event) => {
        setemails(event.target.value);
    };
    const handleMessage = (event) => {
        setmessage(event.target.value);
    };
    const sendInvite = () => {
        const payload = {
            data: {
                attributes: {
                    group_id: groupDetails.id,
                    invites: emails,
                    notes: message,
                },
                type: 'groups',
            },
        };
        setshowLoader(true);
        dispatch(sendEmailInvite(payload)).then(() => {
            setemails('');
            setmessage('');
            setshowLoader(false);
        });
    };

    return (
        <div className="basicsettings">
            <Header className="titleHeader">
                Invite
            </Header>
            <div className="Invite">
                <Header as="h3">Invite people you're friends with on Charitable Impact to join your Giving Group.</Header>
                <div className="search-banner campaignSearchBanner InviteSearch">
                    <div className="searchbox">
                        <Input
                            fluid
                            placeholder="Search friends"
                        />
                        <div className="search-btn campaignSearch">
                            <a>
                                <Icon name="search" />
                            </a>
                        </div>
                    </div>
                </div>
                <Table basic="very" unstackable className="ManageTable Topborder Bottomborder">
                    <Table.Body>
                        {/* <Table.Row className="ManageWappeer">
                            <Table.Cell className="ManageGroup">
                                <List verticalAlign="middle">
                                    <List.Item>
                                        <Image src={imageManage} className="imgManage" />
                                        <List.Content>
                                            <List.Header className="ManageAdmin">
                                                Name Here
                                            </List.Header>
                                            <List.Description>
                                                <p>
                                                    Vancouver, BC
                                                </p>
                                            </List.Description>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Table.Cell>
                            <Table.Cell className="Managebtn">
                                <Button
                                    className="blue-btn-rounded-def disabled btnFrinend">
                                    Sent
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row className="ManageWappeer">
                            <Table.Cell className="ManageGroup">
                                <List verticalAlign="middle">
                                    <List.Item>
                                        <Image src={imageManage} className="imgManage" />
                                        <List.Content>
                                            <List.Header className="ManageAdmin">
                                                Name Here
                                            </List.Header>
                                            <List.Description>
                                                <p>
                                                    Vancouver, BC
                                                </p>
                                            </List.Description>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Table.Cell>
                            <Table.Cell className="Managebtn">
                                <Button
                                    className="btnFrinend blue-bordr-btn-round-def">
                                    Invite
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row className="ManageWappeer">
                            <Table.Cell className="ManageGroup">
                                <List verticalAlign="middle">
                                    <List.Item>
                                        <Image src={imageManage} className="imgManage" />
                                        <List.Content>
                                            <List.Header className="ManageAdmin">
                                                Name Here
                                            </List.Header>
                                            <List.Description>
                                                <p>
                                                    Vancouver, BC
                                                </p>
                                            </List.Description>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Table.Cell>
                            <Table.Cell className="Managebtn">
                                <Button
                                    className="btnFrinend blue-bordr-btn-round-def">
                                    Invite
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row className="ManageWappeer">
                            <Table.Cell className="ManageGroup">
                                <List verticalAlign="middle">
                                    <List.Item>
                                        <Image src={imageManage} className="imgManage" />
                                        <List.Content>
                                            <List.Header className="ManageAdmin">
                                                Name Here
                                            </List.Header>
                                            <List.Description>
                                                <p>
                                                    Vancouver, BC
                                                </p>
                                            </List.Description>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Table.Cell>
                            <Table.Cell className="Managebtn">
                                <Button
                                    className="btnFrinend blue-bordr-btn-round-def">
                                    Invite
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row className="ManageWappeer">
                            <Table.Cell className="ManageGroup">
                                <List verticalAlign="middle">
                                    <List.Item>
                                        <Image src={imageManage} className="imgManage" />
                                        <List.Content>
                                            <List.Header className="ManageAdmin">
                                                Name Here
                                            </List.Header>
                                            <List.Description>
                                                <p>
                                                    Vancouver, BC
                                                </p>
                                            </List.Description>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Table.Cell>
                            <Table.Cell className="Managebtn">
                                <Button
                                    className="btnFrinend blue-bordr-btn-round-def">
                                    Invite
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row className="ManageWappeer">
                            <Table.Cell className="ManageGroup">
                                <List verticalAlign="middle">
                                    <List.Item>
                                        <Image src={imageManage} className="imgManage" />
                                        <List.Content>
                                            <List.Header className="ManageAdmin">
                                                Name Here
                                            </List.Header>
                                            <List.Description>
                                                <p>
                                                    Vancouver, BC
                                                </p>
                                            </List.Description>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Table.Cell>
                            <Table.Cell className="Managebtn">
                                <Button
                                    className="btnFrinend blue-bordr-btn-round-def">
                                    Invite
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row className="ManageWappeer">
                            <Table.Cell className="ManageGroup">
                                <List verticalAlign="middle">
                                    <List.Item>
                                        <Image src={imageManage} className="imgManage" />
                                        <List.Content>
                                            <List.Header className="ManageAdmin">
                                                Name Here
                                            </List.Header>
                                            <List.Description>
                                                <p>
                                                    Vancouver, BC
                                                </p>
                                            </List.Description>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </Table.Cell>
                            <Table.Cell className="Managebtn">
                                <Button
                                    className="btnFrinend blue-bordr-btn-round-def">
                                    Invite
                                </Button>
                            </Table.Cell>
                        </Table.Row> */}

                    </Table.Body>
                </Table>

            </div>
            <div className="Invitepeople">
                <Header as="h3" className="message_bottom">Invite people with a personal message</Header>
                <p className="InvitepeopleText">Send an invitation to friends, family, or anyone who might be interested in joining your Giving Group. You can also include a personal note with your invitation.</p>
                <label>Enter as many email addresses as you like, separated by comma</label>
                <Form>
                    <Input
                        className="fulllWidth"
                        placeholder="Email address"
                        onChange={handleEmail}
                        value={emails}
                    />
                    <label>Message</label>
                    <TextArea
                        placeholder="Include a personal message in your invitation."
                        onChange={handleMessage}
                        value={message}
                    />
                    <Button
                        className="blue-btn-rounded-def Invitagebtn"
                        floated="right"
                        onClick={sendInvite}
                        disabled={_isEmpty(emails) || _isEmpty(message) || showLoader}
                        loading={showLoader}
                    >
                    Send invite
                    </Button>
                </Form>
            </div>
            {/* <div className="Invitepeople">
                <Header as='h3'>Or share link</Header>
                <div className="linkhtp">
                    <Input type="text" value="https://charitableimpact.com/share-this-awesome-link" />
                </div>
                <div className="Shared_ShareProfile">
                    <i aria-hidden="true" class="twitter icon"></i>
                </div>
                <div className="Shared_ShareProfile">
                    <i aria-hidden="true" class="facebook icon"></i>
                </div>
            </div> */}
        </div>

    );
};

export default Invite;
