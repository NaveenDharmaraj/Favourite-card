import React, { Component } from 'react';
import {
    Container,
    Grid,
    Image,
    Header,
    Button,
    Dropdown,
    Accordion,
    Menu,
    Icon,
    Tab,
    Form,
} from 'semantic-ui-react';

import _ from 'lodash';
import { Router } from '../../../routes';

import Layout from '../../../components/shared/Layout';
import '../../../static/less/charityProfile.less';
import '../../../static/less/create_manage_group.less';
import BasicSetting from './basic';
import AboutGroup from './about';
import PicsVideo from './pics-video';
import MonthlyGifts from './monthlyGifts';
import CharitiesToSupport from './charitiesToSupport';
import GivingGoal from './givingGoal'
import DownloadTransaction from './downloadTransaction';
import AddDonation from './addDonation';
import EmailMembers from './emailMembers';
import Manage from './manage';
import Invite from './invite';
import InviteFriends from './inviteFriends';

class ManageGivingGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeAccordionIndex: 0 ,
            activeMenuIndex: 0
        };

        this.handleAccordionClick = this.handleAccordionClick.bind(this);
        this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
    }

    handleAccordionClick = (e, titleProps) => {
      const { accordionIndex } = titleProps
      const { activeAccordionIndex } = this.state
      const newAccordionIndex = activeAccordionIndex === accordionIndex ? -1 : accordionIndex
  
      this.setState({ activeAccordionIndex: newAccordionIndex })
    }

    handleMenuItemClick = (e, titleProps) => {
        const { menuIndex } = titleProps
        const { activeMenuIndex } = this.state
        const newMenuIndex = activeMenuIndex === menuIndex ? -1 : menuIndex
        this.setState({ activeMenuIndex: newMenuIndex })
    }

   

    render(){
        const { 
            activeAccordionIndex,
            activeMenuIndex
        } = this.state

    return (
        <Layout>
            <Container>
                <div className='manage_giving_group_wrap'>
                    <div className="ch_headerImage greenBg greenBgnew" />
                    <Grid.Row>
                        <Grid>
                            <Grid.Column mobile={16} tablet={10} computer={11}>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column mobile={16} tablet={4} computer={4} className="ch_profileWrap">
                                            <div className='GG_profileWrap'>
                                                <div className="ch_profileImage">
                                                    <Image
                                                        src='../../../static/images/no-data-avatar-giving-group-profile.png'
                                                    />
                                                </div>
                                                <Dropdown className='' icon='camera' direction='right'>
                                                    <Dropdown.Menu >
                                                        <Dropdown.Item text='Delete photo' />
                                                        <Dropdown.Item text='Change photo' />
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                {/* <Icon name='camera'/> */}
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column mobile={16} tablet={12} computer={12}>
                                            <div className="ch_profileDetails">
                                                <Header as="h5" className='textGreen'>
                                                    Giving group
                                                </Header>
                                                <Header as="h3">
                                                    Alberta vets ride for vets
                                                    <br />
                                                </Header>
                                                <Header as="p">
                                                    Vancouver, BC
                                                </Header>
                                                <div className="ch_badge-group">
                                                    <span class="badge">Health</span>  <span class="badge">Health</span>  <span class="badge">Health</span>
                                                </div>
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={6} computer={5} className='returnBtnWrap'>
                            <Button className='blue-bordr-btn-round-def'>Return to profile</Button>
                        </Grid.Column>
                        </Grid>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid className='menuContentWrap'>

                            <Grid.Column computer={5} tablet={5} mobile={16}>
                                <Accordion as={Menu} fluid vertical tabular>
                                    <Menu.Item className='itemAccordion' active={activeAccordionIndex === 0}>
                                        <Accordion.Title
                                            accordionIndex={0}
                                            onClick={this.handleAccordionClick}
                                        >
                                            <Icon name='edit'/>
                                            Edit Group
                                        </Accordion.Title>
                                        <Accordion.Content>
                                            <Menu.Item
                                                menuIndex={activeMenuIndex}
                                                active={activeMenuIndex === 0}
                                                onClick={this.handleMenuItemClick}
                                            >
                                                Basic Settings
                                            </Menu.Item>
                                            <Menu.Item
                                                menuIndex={1}
                                                active={activeMenuIndex === 1}
                                                onClick={this.handleMenuItemClick}
                                            >
                                                About the group 
                                            </Menu.Item>
                                            <Menu.Item
                                                menuIndex={2}
                                                active={activeMenuIndex === 2}
                                                onClick={this.handleMenuItemClick}
                                            >
                                                Pics & video 
                                            </Menu.Item>
                                            <Menu.Item
                                                menuIndex={3}
                                                active={activeMenuIndex === 3}
                                                onClick={this.handleMenuItemClick}
                                            >
                                                Giving goal 
                                            </Menu.Item>
                                            <Menu.Item
                                                menuIndex={4}
                                                active={activeMenuIndex === 4}
                                                onClick={this.handleMenuItemClick}
                                            >
                                                Monthly gifts 
                                            </Menu.Item>
                                            <Menu.Item
                                                menuIndex={5}
                                                active={activeMenuIndex === 5}
                                                onClick={this.handleMenuItemClick}
                                            >
                                                Charities to support 
                                            </Menu.Item>
                                        </Accordion.Content>
                                    </Menu.Item>
                                    <Menu.Item className='itemAccordion' active={activeAccordionIndex === 1}>
                                        <Accordion.Title
                                            accordionIndex={1}
                                            onClick={this.handleAccordionClick}
                                        >
                                            <Icon name='users'/>
                                            Members
                                        </Accordion.Title>
                                        <Accordion.Content>
                                            <Menu.Item>
                                                Manage
                                            </Menu.Item>
                                            <Menu.Item>
                                                Invite
                                            </Menu.Item>
                                            <Menu.Item>
                                                Email members
                                            </Menu.Item>
                                        </Accordion.Content>
                                    </Menu.Item>
                                    <Menu.Item 
                                       menuIndex={9}
                                       active={activeMenuIndex === 9}
                                       onClick={this.handleMenuItemClick}
                                    >
                                        <Icon name='donation'/>
                                        Download transaction data
                                    </Menu.Item>
                                    <Menu.Item
                                        menuIndex={10}
                                        active={activeMenuIndex === 10}
                                        onClick={this.handleMenuItemClick}
                                    >
                                        <Icon name='landing'/>
                                        Add donation button
                                    </Menu.Item>
                                </Accordion>
                            </Grid.Column>

                            <Grid.Column  computer={11} tablet={11} mobile={16} className='active'>
                                <div className='createNewGroupWrap manageGroupWrap'>
                                    <div className='mainContent'>
                                        {/* <BasicSetting/> */}
                                        {/* <AboutGroup/> */}
                                        {/* <PicsVideo/> */}
                                        {/* <MonthlyGifts/> */}
                                        {/* <CharitiesToSupport/> */}
                                        {/* <GivingGoal/> */}
                                        {/* {<DownloadTransaction/>} */}
                                        {/* {<AddDonation/>} */}
                                        {/* {<EmailMembers/>} */}
                                        {<Manage/>}
                                        {/* {<Invite/>} */}
                                       {/* { <InviteFriends/>} */}
                                    </div>
                                </div>
                            </Grid.Column>
                        </Grid>
                    </Grid.Row>
                </div>
            </Container>
        </Layout>
    )
   };
}

export default ManageGivingGroup;
