import React, { Fragment } from 'react';
import {
    Container,
    List,
    Image,
    Header,
    Button,
    Icon,
    Grid,
    Input,
} from 'semantic-ui-react';

import Layout from '../../components/shared/Layout';
import PrivacySettings from './privacySettings';
import GivingGoal_CauseAndTopics from './givingGoal_CauseandTopics';
import EditProfile from './editProfile';
import '../../static/less/userProfile.less';

function UserFriendList() {

    return (
        <Layout>
            <Container>
                <div className="userProfileScreen">
                    <div className="userHeaderBanner"></div>
                    <div className="usercontentsecWrap">
                        <div className="userleftColumn">
                            <div className="userdetailsWrap">
                                <div className='user_profileImage'>
                                    <Image src='../static/images/no-data-avatar-charity-profile.png' />
                                </div>               
                                <div className='user_profileDetails'>
                                    <Header className="usrName">Tammy Tuba</Header>
                                    <div className="userCity_friends">
                                        <p>Vancouver, BC</p>
                                        <div className="userfriends">
                                            <Header as='h5'>12 friends</Header>
                                        </div>
                                    </div>
                                    <div className="userButtonsWrap">
                                        <Button className='blue-bordr-btn-round-def'>Return to profile</Button>
                                    </div>
                                    <div className='userfriendsWrap'>
                                        <Header as='h3'>Your friends</Header>
                                        <div className='invitationsWrap'>
                                            <Header as='h4'>Invitations</Header>
                                            <List divided verticalAlign="middle" className="users_List">
                                                <List.Item>
                                                    <Image avatar src='../static/images/no-data-avatar-user-profile.png'/>
                                                    <List.Content>
                                                        <List.Header as='a'>Kiandra Lowe</List.Header>
                                                        <List.Description >Vancouver, BC</List.Description>
                                                    </List.Content>
                                                    <List.Content floated="right">
                                                        <Button
                                                            className="blue-bordr-btn-round-def c-small"
                                                        >
                                                            Accept
                                                        </Button>
                                                        <Icon className="trash alternate outline"></Icon>
                                                    </List.Content>
                                                </List.Item>
                                                <List.Item>
                                                    <Image avatar src='../static/images/no-data-avatar-user-profile.png'/>
                                                    <List.Content>
                                                        <List.Header as='a'>Kiandra Lowe</List.Header>
                                                        <List.Description >Vancouver, BC</List.Description>
                                                    </List.Content>
                                                    <List.Content floated="right">
                                                        <Button
                                                            className="blue-bordr-btn-round-def c-small"
                                                        >
                                                            Accept
                                                        </Button>
                                                        <Icon className="trash alternate outline"></Icon>
                                                    </List.Content>
                                                </List.Item>
                                                <List.Item>
                                                    <Image avatar src='../static/images/no-data-avatar-user-profile.png'/>
                                                    <List.Content>
                                                        <List.Header as='a'>Kiandra Lowe</List.Header>
                                                        <List.Description >Vancouver, BC</List.Description>
                                                    </List.Content>
                                                    <List.Content floated="right">
                                                        <Button
                                                            className="blue-bordr-btn-round-def c-small"
                                                        >
                                                            Accept
                                                        </Button>
                                                        <Icon className="trash alternate outline"></Icon>
                                                    </List.Content>
                                                </List.Item>
                                            </List>
                                        </div>
                                        <div className='friendsSearch'>
                                            <Header as='h4'>Friends</Header>
                                            <div className="searchBox">
                                                <Input
                                                    className="searchInput"
                                                    placeholder="Search topics"
                                                    fluid
                                                />
                                                <a
                                                    className="search-btn"
                                                >
                                                </a>
                                            </div>
                                        </div>
                                        <List divided verticalAlign="middle" className="users_List">
                                                <List.Item>
                                                    <Image avatar src='../static/images/no-data-avatar-user-profile.png'/>
                                                    <List.Content>
                                                        <List.Header as='a'>Kiandra Lowe</List.Header>
                                                        <List.Description >Vancouver, BC</List.Description>
                                                    </List.Content>
                                                    <List.Content floated="right">
                                                        <Button
                                                            className="blue-btn-rounded-def c-small"
                                                        >
                                                            Message
                                                        </Button>
                                                    </List.Content>
                                                </List.Item>
                                                <List.Item>
                                                    <Image avatar src='../static/images/no-data-avatar-user-profile.png'/>
                                                    <List.Content>
                                                        <List.Header as='a'>Kiandra Lowe</List.Header>
                                                        <List.Description >Vancouver, BC</List.Description>
                                                    </List.Content>
                                                    <List.Content floated="right">
                                                        <Button
                                                            className="blue-btn-rounded-def c-small"
                                                        >
                                                            Message
                                                        </Button>
                                                    </List.Content>
                                                </List.Item>
                                                <List.Item>
                                                    <Image avatar src='../static/images/no-data-avatar-user-profile.png'/>
                                                    <List.Content>
                                                        <List.Header as='a'>Kiandra Lowe</List.Header>
                                                        <List.Description >Vancouver, BC</List.Description>
                                                    </List.Content>
                                                    <List.Content floated="right">
                                                        <Button
                                                            className="blue-btn-rounded-def c-small"
                                                        >
                                                            Message
                                                        </Button>
                                                    </List.Content>
                                                </List.Item>
                                            </List>
                                    </div>
                                    
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </Container>
        </Layout>
    );
}

export default UserFriendList;
