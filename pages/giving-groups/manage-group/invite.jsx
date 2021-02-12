import React, { Fragment } from 'react';
import {
    Header,
    Form,
    Checkbox,
    Button,
    Icon,
    List,
    Image, Table,Grid,Input, TextArea,
} 
from 'semantic-ui-react';
import { Link } from '../../../routes';
import imageManage from '../../../static/images/no-data-avatar-group-chat-profile.png';

function invite() {

    
    return (
 
        <div className='basicsettings'>
             <Header className='titleHeader'>Invite
            </Header>
            <div className="Invite">
            <Header as='h3'>Invite people you're friends with on Charitable Impact to join your Giving Group.</Header>
            <div className="search-banner campaignSearchBanner InviteSearch">
                    <div className="searchbox">
                                    <Input
                                        fluid
                                        placeholder="Search Giving Groups"
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
                        <Table.Row className="ManageWappeer">
                            <Table.Cell className="ManageGroup">
                                <List verticalAlign="middle">
                                    <List.Item>
                                        <Image src={imageManage} className="imgManage"/>
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
                                        <Image src={imageManage} className="imgManage"/>
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
                                        <Image src={imageManage} className="imgManage"/>
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
                                        <Image src={imageManage} className="imgManage"/>
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
                                        <Image src={imageManage} className="imgManage"/>
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
                                        <Image src={imageManage} className="imgManage"/>
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
                                        <Image src={imageManage} className="imgManage"/>
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
                        
                </Table.Body>
            </Table>
            
            </div>
            <div className="Invitepeople">
            <Header as='h3' className="message_bottom">Invite people with a personal message</Header>
            <p className="InvitepeopleText">Send an invitation to friends, family, or anyone who might be interested in joining your Giving Group. You can also include a personal note with your invitation.</p>
            <label>Enter as many email addresses as you like, separated by comma</label>
            <Form>
            <Input className="fulllWidth" placeholder='Email address' />
            <label>Message</label>
            <TextArea placeholder="Include a personal message in your invitation."/>
            <Button className="blue-btn-rounded-def Invitagebtn disabled" floated='right'>Send invite</Button>
            </Form>
            </div>
            <div className="Invitepeople">
            <Header as='h3'>Or share link</Header>
            <div className="linkhtp">
                <Input type="text" value="https://charitableimpact.com/share-this-awesome-link"/>
            </div>
            <div className="Shared_ShareProfile">
            <i aria-hidden="true" class="twitter icon"></i>
            </div>
            <div className="Shared_ShareProfile">
            <i aria-hidden="true" class="facebook icon"></i>
            </div>
            </div>
        </div>    
    
    );
}

export default invite;
