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
    Modal,
} from 'semantic-ui-react';

import Layout from '../../components/shared/Layout';
import GivingGoal_CauseAndTopics from './givingGoal_CauseandTopics';
import '../../static/less/userProfile.less';

class FriendProfile extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
    }
  
    render() {  
        const ManagedGivingGroups = (props) => {
            return (
                <div className='userPrfl_tabSec'>
                    <div className="tabHeader">
                        <Header>Managed Giving Groups</Header>
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
                    </div> 
                    <div className='seeMoreBtnWrap'>
                        <Button className='blue-bordr-btn-round-def'>See more</Button>
                        <p>Showing 24 of 301</p>
                    </div>*/}
                    <div className="nodata-friendsprfl">
                            Nothing to show here yet
                    </div>
                </div>
            );
        };
    
        const JoinedGivingGroups = (props) => {
            return (
                <div className='userPrfl_tabSec'>
                   <div className="tabHeader">
                        <Header>Joined Giving Groups</Header>
                    </div>
                    <div className="nodata-friendsprfl">
                        Nothing to show here yet
                    </div>
                </div>
            );
        };
    
        const Favourites = (props) => {
            return (
                <div className='userPrfl_tabSec'>
                   <div className="tabHeader">
                        <Header>Favourites</Header>
                    </div>
                    <div className="nodata-friendsprfl">
                        Nothing to show here yet
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
        const pendingTrigger = (
            <Button className='blue-bordr-btn-round-def'>Pending</Button>
        )
        const respondtoTrigger = (
            <Button className='blue-btn-rounded-def'>Respond to friend request</Button>
        )
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
                                        <p className='textAboutuser'>Hi I'm Tammy! I use this account to give to others and to charities, to help make a bit of a difference. Have a great day.</p>
                                        <div className="userButtonsWrap">
                                            {/* <Button className='blue-btn-rounded-def'>Add friend</Button> */}
                                            <Button className='blue-btn-rounded-def'>Message</Button>
                                            {/* <Dropdown trigger={pendingTrigger} className='userProfile_drpbtn' icon='chevron down'>
                                                <Dropdown.Menu >
                                                    <Dropdown.Item text='Cancel friend request' />
                                                </Dropdown.Menu>
                                            </Dropdown> */}
                                            {/* <Dropdown trigger={respondtoTrigger} className='userProfile_drpbtn m-w-100' icon='chevron down' direction='left'>
                                                <Dropdown.Menu >
                                                    <Dropdown.Item text='Accept' />
                                                    <Dropdown.Item text='Ignore' />
                                                </Dropdown.Menu>
                                            </Dropdown> */}
                                            <Button className='blue-bordr-btn-round-def'>Give</Button>
                                            <Dropdown className='userProfile_drpbtn threeDotBtn' direction='left'>
                                                <Dropdown.Menu >
                                                    <Dropdown.Item text='Copy profile URL' />
                                                    <Modal
                                                        size="tiny"
                                                        dimmer="inverted"
                                                        closeIcon
                                                        className="chimp-modal"
                                                        open={this.state.showModal}
                                                        onClose={()=>{this.setState({showModal: false})}}
                                                        trigger={
                                                            <Dropdown.Item text='Block'  onClick={() => this.setState({ showModal: true })}/>
                                                        }
                                                    >
                                                        <Modal.Header>Block Sophia Yakisoba?</Modal.Header>
                                                        <Modal.Content>
                                                            <p>They won't be able to find your profile or message you on Charitable Impact. We won't let them know you blocked them.</p>
                                                            <div className='block-unfriend-Modal-buttons'>
                                                                <Button className='red-btn-rounded-def'>Block</Button>
                                                                <Button className='blue-bordr-btn-round-def' onClick={() => this.setState({ showModal: false })}>Cancel</Button>
                                                            </div>
                                                        </Modal.Content>
                                                    </Modal>                                        
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
}

export default FriendProfile;
