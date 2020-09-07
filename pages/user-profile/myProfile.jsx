import React, { Fragment } from 'react';
import {
    Container,
    Grid,
    Image,
    Header,
    Button,
    Card,
    Dropdown,
    Tab,
    Responsive
} from 'semantic-ui-react';

import Layout from '../../components/shared/Layout';
import PrivacySettings from './privacySettings';
import GivingGoal_CauseAndTopics from './givingGoal_CauseandTopics';
import EditProfile from './editProfile';
import '../../static/less/userProfile.less';

function MyProfile() {

    const ManagedGivingGroups = (props) => {
        return (
            <div className='userPrfl_tabSec'>
                <div className="tabHeader">
                    <Header>Managed Giving Groups</Header>
                    <PrivacySettings iconName='globe'/>
                </div>
                <div className="cardwrap">
                    <Card>
                        <Card.Content>
                            <div className="cardPrflImg">
                                <Image src="../static/images/no-data-avatar-giving-group-profile.png" />
                            </div>
                            <div className="cardcontentWrap">
                                <Header as='h6' className='groupClr'>GIVING GROUPS</Header>
                                <Header as='h4'>#GIVEITUP4PEACE with decision tree</Header>
                                <p>Cause</p>
                                <p>Vancouver, BC</p>
                                <p>Total Raised: $2,000.00</p>
                            </div>
                            <a className="edit">Edit</a>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Content>
                            <div className="cardPrflImg">
                                <Image src="../static/images/no-data-avatar-giving-group-profile.png" />
                            </div>
                            <div className="cardcontentWrap">
                                <Header as='h6' className='groupClr'>GIVING GROUPS</Header>
                                <Header as='h4'>#GIVEITUP4PEACE with decision tree</Header>
                                <p>Cause</p>
                                <p>Vancouver, BC</p>
                                <p>Total Raised: $2,000.00</p>
                            </div>
                            <a className="edit">Edit</a>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Content>
                            <div className="cardPrflImg">
                                <Image src="../static/images/no-data-avatar-giving-group-profile.png" />
                            </div>
                            <div className="cardcontentWrap">
                                <Header as='h6' className='groupClr'>GIVING GROUPS</Header>
                                <Header as='h4'>#GIVEITUP4PEACE with decision tree</Header>
                                <p>Cause</p>
                                <p>Vancouver, BC</p>
                                <p>Total Raised: $2,000.00</p>
                            </div>
                            <a className="edit">Edit</a>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Content>
                            <div className="cardPrflImg">
                                <Image src="../static/images/no-data-avatar-giving-group-profile.png" />
                            </div>
                            <div className="cardcontentWrap">
                                <Header as='h6' className='groupClr'>GIVING GROUPS</Header>
                                <Header as='h4'>#GIVEITUP4PEACE with decision tree</Header>
                                <p>Cause</p>
                                <p>Vancouver, BC</p>
                                <p>Total Raised: $2,000.00</p>
                            </div>
                            <a className="edit">Edit</a>
                        </Card.Content>
                    </Card>               
                </div>
            </div>
        );
    };

    const JoinedGivingGroups = (props) => {
        return (
            <div className='userPrfl_tabSec'>
               <div className="tabHeader">
                    <Header>Joined Giving Groups</Header>
                    <PrivacySettings iconName='users'/>
                </div>
            </div>
        );
    };

    const Favourites = (props) => {
        return (
            <div className='userPrfl_tabSec'>
               <div className="tabHeader">
                    <Header>Favourites</Header>
                    <PrivacySettings iconName='globe'/>
                </div>
            </div>
        );
    };

    const panes = [
        {
          menuItem: 'Managed Giving Groups',
          render: () => 
            <Tab.Pane>
                <ManagedGivingGroups/>
            </Tab.Pane>,
        },
        { menuItem: 'Joined Giving Groups', 
        render: () => 
            <Tab.Pane>
                <JoinedGivingGroups/>
            </Tab.Pane> },
        { menuItem: 'Favourites',
         render: () => 
            <Tab.Pane>
               <Favourites/>
            </Tab.Pane> },
      ]
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
                                            <PrivacySettings iconName='users'/>
                                        </div>
                                    </div>
                                    <p className='textAboutuser'>Hi I'm Tammy! I use this account to give to others and to charities, to help make a bit of a difference. Have a great day.</p>
                                    <div className="userButtonsWrap">
                                        <Button className='blue-bordr-btn-round-def m-w-100'>View what others see</Button>
                                        <EditProfile/>
                                         <Dropdown className='userProfile_drpbtn threeDotBtn' direction='left'>
                                            <Dropdown.Menu >
                                                <Dropdown.Item text='Copy profile URL' />
                                                <Dropdown.Item text='Block' />
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div> 
                            <Responsive minWidth={768}>
                                <Tab className='userprfleTab' menu={{ secondary: true, pointing: true }} panes={panes} />             
                            </Responsive>  
                            <Responsive minWidth={320} maxWidth={767}>
                                <GivingGoal_CauseAndTopics/> 
                                <ManagedGivingGroups/>
                                <JoinedGivingGroups/>
                                <Favourites/>
                            </Responsive>  
                        </div>
                        <div className="userrightColumn">  
                            <Responsive minWidth={768}>
                                <GivingGoal_CauseAndTopics/> 
                            </Responsive>                 
                        </div>
                    </div>
                </div>
            </Container>
        </Layout>
    );
}

export default MyProfile;
