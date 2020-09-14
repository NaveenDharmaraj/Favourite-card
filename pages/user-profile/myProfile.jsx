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
    Responsive,
    Placeholder,
    Segment,
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
                {/* <div className="cardwrap">
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
                </div>  */}
                <div className="cardwrap">
                    <Card>
                        <Card.Content>
                            <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line  length='full' />
                                    <Placeholder.Line length='short'/>
                                    <Placeholder.Line length='medium' />
                                    <Placeholder.Line length='long' />
                                </Placeholder.Header>
                            </Placeholder>
                        </Card.Content>
                    </Card>  
                    <Card>
                        <Card.Content>
                            <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line  length='full' />
                                    <Placeholder.Line length='short'/>
                                    <Placeholder.Line length='medium' />
                                    <Placeholder.Line length='long' />
                                </Placeholder.Header>
                            </Placeholder>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Content>
                            <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line  length='full' />
                                    <Placeholder.Line length='short'/>
                                    <Placeholder.Line length='medium' />
                                    <Placeholder.Line length='long' />
                                </Placeholder.Header>
                            </Placeholder>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Content>
                            <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line  length='full' />
                                    <Placeholder.Line length='short'/>
                                    <Placeholder.Line length='medium' />
                                    <Placeholder.Line length='long' />
                                </Placeholder.Header>
                            </Placeholder>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Content>
                            <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line  length='full' />
                                    <Placeholder.Line length='short'/>
                                    <Placeholder.Line length='medium' />
                                    <Placeholder.Line length='long' />
                                </Placeholder.Header>
                            </Placeholder>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Content>
                            <Placeholder>
                                <Placeholder.Header image>
                                    <Placeholder.Line  length='full' />
                                    <Placeholder.Line length='short'/>
                                    <Placeholder.Line length='medium' />
                                    <Placeholder.Line length='long' />
                                </Placeholder.Header>
                            </Placeholder>
                        </Card.Content>
                    </Card>
                     
                </div>    
                <div className='seeMoreBtnWrap'>
                    <Button className='blue-bordr-btn-round-def'>See more</Button>
                    <p>Showing 24 of 301</p>
                </div>

                <div className="ggManage noData">
                    <Grid verticalAlign="middle">
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={6} computer={6}>
                              <Image src='../static/images/givinggroupsyoumanage_nodata_illustration.png' className="noDataLeftImg" />
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={10} computer={10}>
                                <div className="givingGroupNoDataContent">
                                    <Header as="h4">
                                        <Header.Content>
                                        Groups you manage will appear here
                                        </Header.Content>
                                    </Header>
                                    <div>
                                        <a href=''>
                                            <Button className="success-btn-rounded-def">Create a Giving Group</Button>
                                        </a>
                                    </div>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
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
                <div className="ggJoin noData">
                    <Grid verticalAlign="middle">
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={6} computer={6}>
                                <Image src='../static/images/givinggroupsyoujoined_nodata_illustration.png' className="noDataLeftImg" />
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={10} computer={10}>
                                <div className="givingGroupNoDataContent">
                                    <Header as="h4">
                                        <Header.Content>
                                        Groups you've joined will appear here
                                        </Header.Content>
                                    </Header>
                                    <div>
                                        <a href="">
                                            <Button className="white-btn-rounded-def">Find a Giving Group</Button>
                                        </a>
                                    </div>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
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
                <div className="ggJoin ggFavorite noData">
                    <Grid verticalAlign="middle">
                        <Grid.Row>
                            <Grid.Column mobile={16} tablet={6} computer={6}>
                                <Image src='../static/images/favourites-illo-desktop.png' className="noDataLeftImg" />
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={10} computer={10}>
                                <div className="givingGroupNoDataContent">
                                    <Header as="h4">
                                        <Header.Content>
                                             Your favourite charities and Giving Groups will appear here
                                        </Header.Content>
                                    </Header>
                                    <div>
                                        <a href="">
                                            <Button className="white-btn-rounded-def">Find a charity or Giving Group </Button>
                                        </a>
                                    </div>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
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
                                    <Placeholder fluid>
                                        <Placeholder.Line length='short'/>
                                        <Placeholder.Line length='medium'/>
                                        <Placeholder.Line length='full'/>
                                    </Placeholder>
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
