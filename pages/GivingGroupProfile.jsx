import React from 'react';
import {
    Container,
    Header,
    Grid,
    List,
    Segment,
    Breadcrumb,
    Divider,
    Icon,
    Input,
    Table, Image, Card, Button, Modal, Responsive,Progress,Tab,Feed,Comment,
} from 'semantic-ui-react';

import Layout from '../components/shared/Layout';
import '../static/less/charityProfile.less';


import ch_profileImg from '../static/images/no-data-avatar-giving-group-profile.png';
import ch__red_profileImg from '../static/images/no-data-avatar-charity-profile.png';
import cat_galleryImg from '../static/images/catImg.png';
import ProfileImg from '../static/images/no-data-avatar-user-profile.png'
function GivingGroupProfile() {
    return (
<div>
        <Layout>
            <Container>
                <Breadcrumb className='ch_breadcrumb'>
                    <Breadcrumb.Section>Explore</Breadcrumb.Section>
                    <Breadcrumb.Divider icon='right chevron' />
                    <Breadcrumb.Section>Giving Groups</Breadcrumb.Section>
                    <Breadcrumb.Divider icon='right chevron' />
                    <Breadcrumb.Section className='active'>Alberta vets ride for vets</Breadcrumb.Section>
                </Breadcrumb>
        </Container>
        <div className="GivingGroupProfileWapper">
        <Container>
            <div className='ch_headerImage greenBg'></div>
            <Grid.Row>
                            <Grid>
                                <Grid.Column mobile={16} tablet={10} computer={11} >
                                    <Grid.Row>
                                            <Grid>
                                                <Grid.Column mobile={16} tablet={4} computer={4} className="ch_profileWrap" > 
                                                    <div className='ch_profileImage'>
                                                        <Image src={ch_profileImg} />
                                                    </div>
                                                    </Grid.Column>
                                                    <Grid.Column mobile={16} tablet={12} computer={12}>
                                                        <div className='ch_profileDetails'>
                                                            <Header as='h5' className="textGreen">Giving group</Header>
                                                            <Header as='h3'>Alberta vets ride for vets</Header>
                                                            <Header as='p'>Vancouver, BC</Header>
                                                            <div class="ch_badge-group"><span class="badge">animals</span><span class="badge">Community development</span><span class="badge">International</span></div>
                                                            <div className='ch_share'>
                                                                <List horizontal className="shareAndLike">
                                                                    <List.Item as="a">
                                                                        <Icon
                                                                            id="follow"
                                                                            color='red'
                                                                            name="heart"
                                                                        />
                                                                    </List.Item>
                                                                    <List.Item as="a">
                                                                        <Icon  className="share alternate" />
                                                                    </List.Item>
                                                                    <List.Item as="a">
                                                                        <Button className="blue-bordr-btn-round-def CampaignBtn">Join group</Button>
                                                                    </List.Item>
                                                                    <List.Item as="a">
                                                                        <p className="groupmembers">Join this group to get updates, show your support, and connect with other group members.</p>
                                                                    </List.Item>
                                                                </List>
                                                            </div>
                                                        </div>
                                                    </Grid.Column>
                                            </Grid>
                                             </Grid.Row>
                                    <Grid.Row>
                                    <Grid.Column mobile={16}>
                                        <Responsive minWidth={320} maxWidth={767}>
                                        <div className='charityInfowrap tabcharityInfowrap fullwidth'>
                                        <div className='charityInfo'>
                                            <Header as='h1'>$34,299.00</Header>
                                            <p>raised of $44,500.00 goal</p>
                                            <div className="goalPercent">
                                            <Progress percent={70} ></Progress>
                                            </div>
                                            <Button className="white-btn-rounded-def goalbtn">15 days left to reach goal</Button>
                                                <div className="lastGiftWapper">
                                                <p className="lastGiftText">Last gift received 1 day ago</p>
                                                <p className="lastGiftText blueText">View transactions</p>
                                                </div>    
                                        </div>
                                    </div>
                                    <div className='charityInfowrap tabcharityInfowrap fullwidth lightGreenBg'>
                                        <div className='charityInfo'>
                                            <Header as='h4'>Thank you for your support!</Header>
                                            <p>Between November 1, 2019 and December 31, 2019, <b>Charitable Impact</b> generously matched each gift to this group dollar for dollar. </p>
                                            <div className="matchingFundsWapper">
                                            <div className="matchingFundsGraff">
                                                ads
                                            </div>
                                            <div className="matchingFundsText">
                                                <Header as='h3'>$200.00</Header>
                                                <Header as='h5'> matching funds remaining</Header>
                                                <div className="total">
                                                    <p>of $1,000.00 provided by Charitable Impact</p>
                                                </div>
                                            </div>
                                            </div>
                                            <Grid.Row className="MatchingPartnerWapper">
                                                <Grid>
                                                    <Grid.Column mobile={3} tablet={4} computer={4} className="pr-0" >
                                                    <div className="h_profileMatching borderprofile">
                                                         <Image src={ch_profileImg} />
                                                     </div>
                                                    </Grid.Column>
                                                    <Grid.Column mobile={13} tablet={12} computer={12}>
                                                    <div className="MatchingPartner">
                                                    <Header as='h3'>Charitable Impact</Header>
                                                    <p>Matching partner</p>
                                                    </div>
                                                    </Grid.Column>
                                                </Grid>
                                             </Grid.Row>
                                            <Button className="white-btn-rounded-def goalbtn">Expires Dec 31, 2020</Button>
                                            <p className="blueHistory">View matching history</p>
                                        </div>
                                    </div>
                                    <div className='charityInfowrap tabcharityInfowrap fullwidth'>
                                        <div className='charityInfo paddingcharity'>
                                            <div className="GivingGroupPadding">
                                            <Header as='h4'>This Giving Group supports...</Header>
                                            <Grid.Row className="MatchingPartnerWapper">
                                                <Grid>
                                                    <Grid.Column mobile={3} tablet={2} computer={3} className="pr-0" >
                                                    <div className="h_profileMatching">
                                                         <Image src={ch_profileImg}  className="profileImgMargin" />
                                                     </div>
                                                    </Grid.Column>
                                                    <Grid.Column mobile={13} tablet={14} computer={13}>
                                                    <div className="MatchingPartner">
                                                    <Header as='h3'>#GIVEITUP4PEACE with decision tree</Header>
                                                    <p className="textGreen">Matching partner</p>
                                                    </div>
                                                    </Grid.Column>
                                                </Grid>
                                             </Grid.Row>
                                        </div>
                                        <Divider />
                                        <div className="GivingGroupPadding">
                                            <Grid.Row className="MatchingPartnerWapper">
                                                <Grid>
                                                    <Grid.Column mobile={3} tablet={2} computer={3} className="pr-0" >
                                                    <div className="h_profileMatching">
                                                         <Image src={ch__red_profileImg} className="profileImgMargin" />
                                                     </div>
                                                    </Grid.Column>
                                                    <Grid.Column mobile={13} tablet={14} computer={13}>
                                                    <div className="MatchingPartner">
                                                    <Header as='h3'>Safeguarding Animals In Need Today Society</Header>
                                                    <p className="textGreen orange">Matching partner</p>
                                                    </div>
                                                    </Grid.Column>
                                                </Grid>
                                             </Grid.Row>
                                        </div>
                                        <Divider />
                                        <div className="GivingGroupPadding">
                                            <Grid.Row className="MatchingPartnerWapper">
                                                <Grid>
                                                    <Grid.Column mobile={3} tablet={3} computer={3} className="pr-0" >
                                                    <div className="h_profileMatching">
                                                         <Image src={ch__red_profileImg} className="profileImgMargin" />
                                                     </div>
                                                    </Grid.Column>
                                                    <Grid.Column mobile={13} tablet={13} computer={13}>
                                                    <div className="MatchingPartner">
                                                    <Header as='h3'>Animal Rescue Krew (A.R.K.)</Header>
                                                    <p className="textGreen orange">Matching partner</p>
                                                    </div>
                                                    </Grid.Column>
                                                </Grid>
                                             </Grid.Row>
                                        </div>
                                        <Divider />
                                        <div className="GivingGroupPadding">
                                            <Grid.Row className="MatchingPartnerWapper">
                                                <Grid>
                                                    <Grid.Column mobile={3} tablet={3} computer={3} className="pr-0" >
                                                    <div className="h_profileMatching">
                                                         <Image src={ch__red_profileImg} className="profileImgMargin" />
                                                     </div>
                                                    </Grid.Column>
                                                    <Grid.Column mobile={13} tablet={13} computer={13}>
                                                    <div className="MatchingPartner">
                                                    <Header as='h3'>Feral And Abandoned Cat Society (Faacs)</Header>
                                                    <p className="textGreen orange">Matching partner</p>
                                                    </div>
                                                    </Grid.Column>
                                                </Grid>
                                             </Grid.Row>
                                        </div>
                                        <Divider />
                                        <div className="GivingGroupPadding">
                                            <Grid.Row className="MatchingPartnerWapper">
                                                <Grid>
                                                    <Grid.Column mobile={3} tablet={3} computer={3} className="pr-0" >
                                                    <div className="h_profileMatching">
                                                         <Image src={ch__red_profileImg} className="profileImgMargin" />
                                                     </div>
                                                    </Grid.Column>
                                                    <Grid.Column mobile={13} tablet={13} computer={13}>
                                                    <div className="MatchingPartner">
                                                    <Header as='h3'>Mountain Gorilla Conservation Society Of Canada</Header>
                                                    <p className="textGreen orange">Matching partner</p>
                                                    </div>
                                                    </Grid.Column>
                                                </Grid>
                                             </Grid.Row>
                                        </div>
                                       
                                        </div>
                                    </div>
                                    <div className='charityInfowrap tabcharityInfowrap fullwidth'>
                                        <div className='charityInfo'>
                                        <Header as='h4'>This Giving Group supports...</Header> 
                                            <p>This group has not yet chosen a campaign or charity to support.  </p>
                                            <Button className="success-btn-rounded-def medium btnboxWidth">Select a charity or campaign</Button>
                                        </div>
                                    </div>
                                        </Responsive>
                                    </Grid.Column>
                                    <Divider className="mt-2"/>
                                    <Grid.Column mobile={16} tablet={16} computer={16} className='ch_paragraph mt-2 mb-2' >
                                        <Header as='h3'>Group Admins</Header>
                                        <div className='ch_share'>
                                            <List horizontal relaxed='very' className="GroupPrfile">
                                                <List.Item as="a">
                                                <Image className="grProfile" src={ch__red_profileImg} />
                                                    <List.Content>
                                                        <List.Header>Ann Cox</List.Header>
                                                    </List.Content>
                                                </List.Item>
                                                <List.Item as="a">
                                                <Image className="grProfile" src={ch__red_profileImg} />
                                                    <List.Content>
                                                        <List.Header>Ora Lawson</List.Header>
                                                    </List.Content>
                                                </List.Item>
                                                <List.Item as="a">
                                                <Image className="grProfile" src={ch__red_profileImg} />
                                                    <List.Content>
                                                        <List.Header>Troy Schmidt</List.Header>
                                                    </List.Content>
                                                </List.Item>
                                                
                                            </List>
                                            
                                        </div>
                                        {/* <div className="ch_shareMore">
                                        <List horizontal relaxed='very' className="GroupPrfileAll">
                                                <List.Item as="a">
                                                <Image className="grProfile" src={ch__red_profileImg} />
                                                </List.Item>
                                                <List.Item as="a">
                                                <Image className="grProfile" src={ch__red_profileImg} />
                                                </List.Item>
                                                <List.Item as="a">
                                                <Image className="grProfile" src={ch__red_profileImg} />
                                                </List.Item>
                                                <List.Item as="a">
                                                <div className="RountBg">
                                                    <p>+10</p>
                                                </div>
                                                </List.Item>
                                            </List>
                                            <div className="GroupPrfileAllText">
                                                <p>Ann Cox, Ora Lawson, Troy Schmidt and 10 more</p>
                                            </div>
                                        </div> */}
                                    </Grid.Column>
                                    <Divider />
                                </Grid.Row>
                                <Grid.Row>
                                        <Grid.Column mobile={16} tablet={16} computer={16} className='ch_paragraph' >
                                            <div className="GroupPurposeTop">
                                            <p>Veterinarians and Animal Health Technologists will be joining six-time Olympian Clara Hughes to raise money and awareness for mental health organizations from coast to coast!
                                            </p>
                                            </div>
                                            <div className="GroupPurpose">
                                            <Header as='h3'>The Group’s Purpose</Header>
                                            <p>The purpose of our Giving Group is to raise awareness of mental health issues within the veterinary profession. The funds we raise will go towards the training of a Post Traumatic Stress Disorder (PTSD) service dog.</p>
                                            </div>
                                            <div className="GroupPurpose">
                                            <Header as='h3'>How to Help</Header>
                                            <p>There are several ways you can help us end the stigma around mental illness: Give $10, $20, or $50 to this Giving Group, Share the link to this Giving Group on social media using #ClarasBigRide.</p>
                                            </div>
                                            <div className="GroupPurpose">
                                            <Header as='h3'>About the Organizers</Header>
                                            <p>Kim Robinson DVM is a small animal veterinarian in Sherwood Park, Alberta.</p>
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column mobile={16} tablet={16} computer={16} className='OneGrProfileImg'>
                                        <Image src={cat_galleryImg} />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column mobile={16} tablet={16} computer={16} className="GroupTab">
                                        <div className="charityTab tabBottom">
                                            <Tab
                                                menu={{
                                                    pointing: true,
                                                    secondary: true,
                                                }}
                                                panes={[
                                                    {
                                                        id: 'Activity',
                                                        menuItem: 'Activity',
                                                        render: () => (
                                                            <div className="tabWapper">
                                                                <Grid centered>
                                                                    <Grid.Row className="ActivityPost">
                                                                        <Grid.Column mobile={16} tablet={16} computer={16}>
                                                                            <Grid>
                                                                                <Grid.Row className="postinputBox">
                                                                                    <Grid.Column mobile={16} tablet={16} computer={16}>
                                                                                        <div className="two-icon-brdr-btm-input">
                                                                                            <Input type='text' placeholder='Write a message to the group…' action fluid>
                                                                                                <input />
                                                                                                <Button icon><Icon name='smile outline' /></Button>
                                                                                            </Input>
                                                                                        </div>
                                                                                    </Grid.Column>
                                                                                </Grid.Row>
                                                                            </Grid>
                                                                            <div className="c-comment ActivityComment">
                                                                                <Comment.Group fluid>
                                                                                    <Comment>
                                                                                        <Feed.Meta className="cmntLike">
                                                                                            <Feed.Like>
                                                                                                <Icon name='heart outline' />
                                                                                                4
                                                                                            </Feed.Like>
                                                                                        </Feed.Meta>
                                                                                        <Comment.Avatar src={ProfileImg} />
                                                                                        <Comment.Content>
                                                                                            <Comment.Text>
                                                                                               <span>John</span> gave $25.00 to the group. 
                                                                                            </Comment.Text>
                                                                                            
                                                                                            
                                                                                            <Comment.Actions>
                                                                                                <Comment.Metadata>
                                                                                                <div>5 days ago</div>
                                                                                                </Comment.Metadata>
                                                                                                <Comment.Action> 0 Comments</Comment.Action>
                                                                                                <Comment.Action>•   Reply</Comment.Action>
                                                                                            </Comment.Actions>
                                                                                        </Comment.Content>
                                                                                    </Comment>
                                                                                    <Comment>
                                                                                        <Feed.Meta className="cmntLike">
                                                                                            <Feed.Like>
                                                                                                <Icon name='heart outline' />
                                                                                                4
                                                                                            </Feed.Like>
                                                                                        </Feed.Meta>
                                                                                        <Comment.Avatar src={ProfileImg} />
                                                                                        <Comment.Content>
                                                                                            <Comment.Text>
                                                                                               <span>John</span> gave $25.00 to the group. 
                                                                                            </Comment.Text>
                                                                                            
                                                                                            
                                                                                            <Comment.Actions>
                                                                                                <Comment.Metadata>
                                                                                                <div>5 days ago</div>
                                                                                                </Comment.Metadata>
                                                                                                <Comment.Action> 0 Comments</Comment.Action>
                                                                                                <Comment.Action>•   Reply</Comment.Action>
                                                                                            </Comment.Actions>
                                                                                        </Comment.Content>
                                                                                    </Comment>
                                                                                    <Comment>
                                                                                        <Feed.Meta className="cmntLike">
                                                                                            <Feed.Like>
                                                                                                <Icon name='heart outline' />
                                                                                                4
                                                                                            </Feed.Like>
                                                                                        </Feed.Meta>
                                                                                        <Comment.Avatar src={ProfileImg} />
                                                                                        <Comment.Content>
                                                                                            <Comment.Text>
                                                                                               <span>John</span> gave $25.00 to the group. 
                                                                                            </Comment.Text>
                                                                                            
                                                                                            
                                                                                            <Comment.Actions>
                                                                                                <Comment.Metadata>
                                                                                                <div>5 days ago</div>
                                                                                                </Comment.Metadata>
                                                                                                <Comment.Action> 0 Comments</Comment.Action>
                                                                                                <Comment.Action>•  Reply</Comment.Action>
                                                                                            </Comment.Actions>
                                                                                        </Comment.Content>
                                                                                    </Comment>
                                                                                    <Comment>
                                                                                        <Feed.Meta className="cmntLike">
                                                                                            <Feed.Like>
                                                                                                <Icon name='heart outline' />
                                                                                                1
                                                                                            </Feed.Like>
                                                                                        </Feed.Meta>
                                                                                        <Comment.Avatar src={ProfileImg} />
                                                                                        <Comment.Content>
                                                                                            <Comment.Text>
                                                                                               <span>John</span> gave $25.00 to the group. 
                                                                                            </Comment.Text>
                                                                                            
                                                                                            
                                                                                            <Comment.Actions>
                                                                                                <Comment.Metadata>
                                                                                                <div>5 days ago</div>
                                                                                                </Comment.Metadata>
                                                                                                <Comment.Action> 0 Comments</Comment.Action>
                                                                                                <Comment.Action>•  Reply</Comment.Action>
                                                                                            </Comment.Actions>
                                                                                        </Comment.Content>
                                                                                    </Comment>
                                                                                    <Comment>
                                                                                        <Feed.Meta className="cmntLike">
                                                                                            <Feed.Like>
                                                                                                <Icon name='heart outline' />
                                                                                                2
                                                                                            </Feed.Like>
                                                                                        </Feed.Meta>
                                                                                        <Comment.Avatar src={ProfileImg} />
                                                                                        <Comment.Content>
                                                                                            <Comment.Text>
                                                                                               <span>John</span> gave $25.00 to the group. 
                                                                                            </Comment.Text>
                                                                                            
                                                                                            
                                                                                            <Comment.Actions>
                                                                                                <Comment.Metadata>
                                                                                                <div>5 days ago</div>
                                                                                                </Comment.Metadata>
                                                                                                <Comment.Action> 0 Comments</Comment.Action>
                                                                                                <Comment.Action>•  Reply</Comment.Action>
                                                                                            </Comment.Actions>
                                                                                        </Comment.Content>
                                                                                    </Comment>
                                                                                </Comment.Group>
                                                                            </div>
                                                                        </Grid.Column>
                                                                        <Button className="blue-bordr-btn-round-def mt-2">View more</Button>
                                                                    </Grid.Row>
                                                                </Grid>
                                                            </div>
                                                        ),
                                                    },
                                                    {
                                                        id: 'Members',
                                                        menuItem: 'Members',
                                                        render: () => (
                                                            <div className="tabWapper">
                                                                <div className="members">
                                                                <Grid.Row>
                                                                    <Grid>
                                                                        <Grid.Row>
                                                                            <Grid.Column mobile={8} tablet={8} computer={8}>
                                                                              <div className="membersNumber"><i aria-hidden="true" class="group icon"></i> 1,245 members </div> 
                                                                            </Grid.Column>
                                                                            <Grid.Column mobile={8} tablet={8} computer={8}>
                                                                                 <Button className="success-btn-rounded-def" floated='right'><span><i aria-hidden="true" class="addmember icon"></i></span>Invite friends</Button> 
                                                                            </Grid.Column>
                                                                        </Grid.Row>
                                                                    </Grid>
                                                                    </Grid.Row>
                                                                </div>
                                                                 <Table basic="very" unstackable className="db-activity-tbl Topborder">
                                                                 <Table.Body>
                                                                   <Table.Row className="EmilyData" >
                                                                        <Table.Cell className="EmilyGroup">
                                                                            <List verticalAlign="middle">
                                                                                <List.Item>
                                                                                <Image className="imgEmily" src={ch_profileImg} />
                                                                                    <List.Content>
                                                                                        <List.Header className="EmilyAdmin">
                                                                                            Emily Bath • Admin <span><i aria-hidden="true" class="icon star outline"></i></span>
                                                                                        </List.Header>
                                                                                        <List.Description>
                                                                                            <p>Vancouver, BC</p>
                                                                                        </List.Description>
                                                                                    </List.Content>
                                                                                </List.Item>
                                                                            </List>
                                                                        </Table.Cell>
                                                                        <Table.Cell className="amount">
                                                                        <Button className="blue-btn-rounded-def btnFrinend" disabled>Pending</Button>
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                    </Table.Body>
                                                                    <Table.Body>
                                                                    <Table.Row className="EmilyData" >
                                                                        
                                                                        <Table.Cell className="EmilyGroup">
                                                                            <List verticalAlign="middle">
                                                                                <List.Item>
                                                                                <Image className="imgEmily" src={ch_profileImg} />
                                                                                    <List.Content>
                                                                                        <List.Header className="EmilyAdmin">
                                                                                            Emily Bath • Admin <span><i aria-hidden="true" class="icon star outline"></i></span>
                                                                                        </List.Header>
                                                                                        <List.Description>
                                                                                            <p>Vancouver, BC</p>
                                                                                        </List.Description>
                                                                                    </List.Content>
                                                                                </List.Item>
                                                                            </List>
                                                                        </Table.Cell>
                                                                        <Table.Cell className="amount">
                                                                        <Button className="blue-bordr-btn-round-def btnFrinend">Add friend</Button>
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                    </Table.Body>
                                                                    <Table.Body>
                                                                   <Table.Row className="EmilyData" >
                                                                        
                                                                        <Table.Cell className="EmilyGroup">
                                                                            <List verticalAlign="middle">
                                                                                <List.Item>
                                                                                <Image className="imgEmily" src={ch_profileImg} />
                                                                                    <List.Content>
                                                                                        <List.Header className="EmilyAdmin">
                                                                                            Emily Bath • Admin <span><i aria-hidden="true" class="icon star outline"></i></span>
                                                                                        </List.Header>
                                                                                        <List.Description>
                                                                                            <p>Vancouver, BC</p>
                                                                                        </List.Description>
                                                                                    </List.Content>
                                                                                </List.Item>
                                                                            </List>
                                                                        </Table.Cell>
                                                                        <Table.Cell className="amount">
                                                                        <Button className="blue-bordr-btn-round-def btnFrinend">Add friend</Button>
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                    </Table.Body>
                                                                    <Table.Body>
                                                                    <Table.Row className="EmilyData" >
                                                                        
                                                                        <Table.Cell className="EmilyGroup">
                                                                            <List verticalAlign="middle">
                                                                                <List.Item>
                                                                                <Image className="imgEmily" src={ch_profileImg} />
                                                                                    <List.Content>
                                                                                        <List.Header className="EmilyAdmin">
                                                                                            Emily Bath • Admin <span><i aria-hidden="true" class="icon star outline"></i></span>
                                                                                        </List.Header>
                                                                                        <List.Description>
                                                                                            <p>Vancouver, BC</p>
                                                                                        </List.Description>
                                                                                    </List.Content>
                                                                                </List.Item>
                                                                            </List>
                                                                        </Table.Cell>
                                                                        <Table.Cell className="amount">
                                                                        <Button className="blue-bordr-btn-round-def btnFrinend">Add friend</Button>
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                    </Table.Body>
                                                                    <Table.Body>
                                                                   <Table.Row className="EmilyData" >
                                                                        
                                                                        <Table.Cell className="EmilyGroup">
                                                                            <List verticalAlign="middle">
                                                                                <List.Item>
                                                                                <Image className="imgEmily" src={ch_profileImg} />
                                                                                    <List.Content>
                                                                                        <List.Header className="EmilyAdmin">
                                                                                            Emily Bath • Admin <span><i aria-hidden="true" class="icon star outline"></i></span>
                                                                                        </List.Header>
                                                                                        <List.Description>
                                                                                            <p>Vancouver, BC</p>
                                                                                        </List.Description>
                                                                                    </List.Content>
                                                                                </List.Item>
                                                                            </List>
                                                                        </Table.Cell>
                                                                        <Table.Cell className="amount">
                                                                        <Button className="blue-bordr-btn-round-def btnFrinend">Add friend</Button>
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                    </Table.Body>
                                                                    <Table.Body>
                                                                    <Table.Row className="EmilyData" >
                                                                        
                                                                        <Table.Cell className="EmilyGroup">
                                                                            <List verticalAlign="middle">
                                                                                <List.Item>
                                                                                <Image className="imgEmily" src={ch_profileImg} />
                                                                                    <List.Content>
                                                                                        <List.Header className="EmilyAdmin">
                                                                                            Emily Bath • Admin <span><i aria-hidden="true" class="icon star outline"></i></span>
                                                                                        </List.Header>
                                                                                        <List.Description>
                                                                                            <p>Vancouver, BC</p>
                                                                                        </List.Description>
                                                                                    </List.Content>
                                                                                </List.Item>
                                                                            </List>
                                                                        </Table.Cell>
                                                                        <Table.Cell className="amount">
                                                                        <Button className="blue-bordr-btn-round-def btnFrinend">Add friend</Button>
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                    </Table.Body>
                                                                    </Table>
                                                            </div>
                                                        ),
                                                    },
                                                    {
                                                        id: 'Transactions',
                                                        menuItem: 'Transactions',
                                                        render: () => (
                                                            <div className="tabWapper">
                                                                <div className="groupcreated">
                                                                <List verticalAlign="middle">
                                                                    <List.Item>
                                                                    <i aria-hidden="true" class="calendar icon"></i>
                                                                        <List.Content>
                                                                            <List.Header>
                                                                                    Group created in July 22th, 2019.
                                                                            </List.Header>
                                                                        </List.Content>
                                                                    </List.Item>
                                                                </List>
                                                                </div>
                                                                <div className="boxGroup">
                                                                        <Header as='h5'>Raised during current giving goal</Header>
                                                                        <div className="Currentbox">
                                                                            $44,299.00
                                                                        </div>
                                                                    </div>
                                                                <div className="duringCurrent">
                                                                    <div className="boxGroup">
                                                                        <Header as='h5'>All time total raised by the group</Header>
                                                                        <div className="Currentbox">
                                                                            $44,299.00
                                                                        </div>
                                                                    </div>
                                                                    <div className="icon-boxGroup"><p>-</p></div>
                                                                    <div className="boxGroup">
                                                                        <Header as='h5'>Total given to others by the group </Header>
                                                                        <div className="Currentbox">
                                                                            $20,399.00
                                                                        </div>
                                                                    </div>
                                                                    <div className="icon-boxGroup"><p>=</p></div>
                                                                    <div className="boxGroup">
                                                                        <Header as='h5'>Current group balance </Header>
                                                                        <div className="Currentbox greenbox">
                                                                            $23,900.00
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Table basic="very" unstackable  className=" db-activity-tbl Bottomborder">
                                                                <Table.Body>
                                                                   <Table.Row className="EmilyData" >
                                                                        <Table.Cell className="date">Feb 26, 2020</Table.Cell>
                                                                        <Table.Cell className="EmilyGroup">
                                                                            <List verticalAlign="middle">
                                                                                <List.Item>
                                                                                    <Image size="tiny" src={ch_profileImg} />
                                                                                    <List.Content>
                                                                                        <List.Header>
                                                                                           <span className="adminEmily">Emily (admin) </span>gave $399.00 from the group to Animal Rescue Krew (A.R.K.).
                                                                                        </List.Header>
                                                                                    </List.Content>
                                                                                </List.Item>
                                                                            </List>
                                                                        </Table.Cell>
                                                                        <Table.Cell className="amount">
                                                                        -$399.00
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                    </Table.Body>
                                                                    <Table.Body>
                                                                   <Table.Row className="EmilyData" >
                                                                        <Table.Cell className="date">Feb 26, 2020</Table.Cell>
                                                                        <Table.Cell className="EmilyGroup">
                                                                            <List verticalAlign="middle">
                                                                                <List.Item>
                                                                                    <Image size="tiny" src={ch_profileImg} />
                                                                                    <List.Content>
                                                                                        <List.Header>
                                                                                           <span className="adminEmily">Emily (admin) </span>gave $399.00 from the group to Animal Rescue Krew (A.R.K.).
                                                                                        </List.Header>
                                                                                    </List.Content>
                                                                                </List.Item>
                                                                            </List>
                                                                        </Table.Cell>
                                                                        <Table.Cell className="amount">
                                                                        -$399.00
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                    </Table.Body>
                                                                    <Table.Body>
                                                                   <Table.Row className="EmilyData" >
                                                                        <Table.Cell className="date">Feb 26, 2020</Table.Cell>
                                                                        <Table.Cell className="EmilyGroup">
                                                                            <List verticalAlign="middle">
                                                                                <List.Item>
                                                                                    <Image size="tiny" src={ch_profileImg} />
                                                                                    <List.Content>
                                                                                        <List.Header>
                                                                                           <span className="adminEmily">Emily (admin) </span>gave $399.00 from the group to Animal Rescue Krew (A.R.K.).
                                                                                        </List.Header>
                                                                                    </List.Content>
                                                                                </List.Item>
                                                                            </List>
                                                                        </Table.Cell>
                                                                        <Table.Cell className="amount">
                                                                        -$399.00
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                    </Table.Body>
                                                                    <Table.Body>
                                                                   <Table.Row className="EmilyData" >
                                                                        <Table.Cell className="date">Feb 26, 2020</Table.Cell>
                                                                        <Table.Cell className="EmilyGroup">
                                                                            <List verticalAlign="middle">
                                                                                <List.Item>
                                                                                    <Image size="tiny" src={ch_profileImg} />
                                                                                    <List.Content>
                                                                                        <List.Header>
                                                                                           <span className="adminEmily">Emily (admin) </span>gave $399.00 from the group to Animal Rescue Krew (A.R.K.).
                                                                                        </List.Header>
                                                                                    </List.Content>
                                                                                </List.Item>
                                                                            </List>
                                                                        </Table.Cell>
                                                                        <Table.Cell className="amount">
                                                                        -$399.00
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                    </Table.Body>
                                                                    <Table.Body>
                                                                   <Table.Row className="EmilyData" >
                                                                        <Table.Cell className="date">Feb 26, 2020</Table.Cell>
                                                                        <Table.Cell className="EmilyGroup">
                                                                            <List verticalAlign="middle">
                                                                                <List.Item>
                                                                                    <Image size="tiny" src={ch_profileImg} />
                                                                                    <List.Content>
                                                                                        <List.Header>
                                                                                           <span className="adminEmily">Emily (admin) </span>gave $399.00 from the group to Animal Rescue Krew (A.R.K.).
                                                                                        </List.Header>
                                                                                    </List.Content>
                                                                                </List.Item>
                                                                            </List>
                                                                        </Table.Cell>
                                                                        <Table.Cell className="amount">
                                                                        -$399.00
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                    </Table.Body>
                                                                    </Table>
                                                                    
                                                            </div>
                                                        ),
                                                    },
                                                    {
                                                        id: 'Matching history',
                                                        menuItem: 'Matching history',
                                                        render: () => (
                                                            <div className="tabWapper">
                                                                <div className="MatchingMessages">
                                                                <Grid.Row>
                                                                    <Grid>
                                                                        <Grid.Column mobile={16} tablet={2} computer={2} className="MatchingPartnerWapper margingWapper" >
                                                                            <div className="h_profileMatching borderprofile">
                                                                                <Image src={ch_profileImg} />
                                                                            </div>
                                                                        </Grid.Column>
                                                                        <Grid.Column mobile={16} tablet={8} computer={8}  >
                                                                          <p>A total of $500.00 was matched by <span className="textColor">Charitable Impact.</span></p>
                                                                        </Grid.Column>
                                                                        <Grid.Column mobile={16} tablet={6} computer={6} className="Messagestwapper" >
                                                                        <Button className="white-btn-rounded-def Messagestabbtn mt-1">Oct 1, 2019 – Dec 31, 2019</Button>
                                                                        </Grid.Column>
                                                                    </Grid>
                                                                </Grid.Row>
                                                                </div>
                                                                <div className="MatchingMessages">
                                                                <Grid.Row>
                                                                    <Grid>
                                                                        <Grid.Column mobile={16} tablet={2} computer={2} className="MatchingPartnerWapper margingWapper" >
                                                                            <div className="h_profileMatching borderprofile">
                                                                                <Image src={ch_profileImg} />
                                                                            </div>
                                                                        </Grid.Column>
                                                                        <Grid.Column mobile={16} tablet={8} computer={8}  >
                                                                          <p>A total of $1,200.00 was matched by <span className="textColor">Alberta Vets.</span></p>
                                                                        </Grid.Column>
                                                                        <Grid.Column mobile={16} tablet={6} computer={6} className="Messagestwapper"  >
                                                                        <Button className="white-btn-rounded-def Messagestabbtn mt-1">Feb 1, 2019 – Mar 31, 2019</Button>
                                                                        </Grid.Column>
                                                                    </Grid>
                                                                </Grid.Row>
                                                                </div>
                                                            </div>
                                                        ),
                                                    },
                                                ]}
                                            />
                                        </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid.Column>

                                <Grid.Column mobile={16} tablet={6} computer={5} >
                                <Responsive minWidth={767}>
                                <div className='charityInfowrap fullwidth'>
                                        <div className='charityInfo'>
                                            <Header as='h1'>$34,299.00</Header>
                                            <p>raised of $44,500.00 goal</p>
                                            <div className="goalPercent">
                                            <Progress percent={70} ></Progress>
                                            </div>
                                            <Button className="white-btn-rounded-def goalbtn">15 days left to reach goal</Button>
                                                <div className="lastGiftWapper">
                                                <p className="lastGiftText">Last gift received 1 day ago</p>
                                                <p className="lastGiftText blueText">View transactions</p>
                                                </div>    
                                            <Divider />
                                            <Button className=' blue-btn-rounded-def mt-1'>Give</Button>
                                        </div>
                                    </div>
                                    <div className='charityInfowrap fullwidth lightGreenBg'>
                                        <div className='charityInfo'>
                                            <Header as='h4'>Thank you for your support!</Header>
                                            <p>Between November 1, 2019 and December 31, 2019, <b>Charitable Impact</b> generously matched each gift to this group dollar for dollar. </p>
                                            <div className="matchingFundsWapper">
                                            <div className="matchingFundsGraff">
                                                 asd
                                            </div>
                                            <div className="matchingFundsText">
                                                <Header as='h3'>$200.00</Header>
                                                <Header as='h5'> matching funds remaining</Header>
                                                <div className="total">
                                                    <p>of $1,000.00 provided by Charitable Impact</p>
                                                </div>
                                            </div>
                                            </div>
                                            <Grid.Row className="MatchingPartnerWapper">
                                                <Grid>
                                                    <Grid.Column mobile={3} tablet={4} computer={4} className="pr-0" >
                                                    <div className="h_profileMatching borderprofile">
                                                         <Image src={ch_profileImg} />
                                                     </div>
                                                    </Grid.Column>
                                                    <Grid.Column mobile={13} tablet={12} computer={12}>
                                                    <div className="MatchingPartner">
                                                    <Header as='h3'>Charitable Impact</Header>
                                                    <p>Matching partner</p>
                                                    </div>
                                                    </Grid.Column>
                                                </Grid>
                                             </Grid.Row>
                                            <Button className="white-btn-rounded-def goalbtn">Expires Dec 31, 2020</Button>
                                            <p className="blueHistory">View matching history</p>
                                        </div>
                                    </div>
                                    <div className='charityInfowrap fullwidth'>
                                        <div className='charityInfo paddingcharity'>
                                            <div className="GivingGroupPadding">
                                            <Header as='h4'>This Giving Group supports...</Header>
                                            <Grid.Row className="MatchingPartnerWapper">
                                                <Grid>
                                                    <Grid.Column mobile={3} tablet={3} computer={3} className="pr-0" >
                                                    <div className="h_profileMatching">
                                                         <Image src={ch_profileImg}  className="profileImgMargin" />
                                                     </div>
                                                    </Grid.Column>
                                                    <Grid.Column mobile={13} tablet={13} computer={13}>
                                                    <div className="MatchingPartner">
                                                    <Header as='h3'>#GIVEITUP4PEACE with decision tree</Header>
                                                    <p className="textGreen">Matching partner</p>
                                                    </div>
                                                    </Grid.Column>
                                                </Grid>
                                             </Grid.Row>
                                        </div>
                                        <Divider />
                                        <div className="GivingGroupPadding">
                                            <Grid.Row className="MatchingPartnerWapper">
                                                <Grid>
                                                    <Grid.Column mobile={3} tablet={3} computer={3} className="pr-0" >
                                                    <div className="h_profileMatching">
                                                         <Image src={ch__red_profileImg} className="profileImgMargin" />
                                                     </div>
                                                    </Grid.Column>
                                                    <Grid.Column mobile={13} tablet={13} computer={13}>
                                                    <div className="MatchingPartner">
                                                    <Header as='h3'>Safeguarding Animals In Need Today Society</Header>
                                                    <p className="textGreen orange">Matching partner</p>
                                                    </div>
                                                    </Grid.Column>
                                                </Grid>
                                             </Grid.Row>
                                        </div>
                                        <Divider />
                                        <div className="GivingGroupPadding">
                                            <Grid.Row className="MatchingPartnerWapper">
                                                <Grid>
                                                    <Grid.Column mobile={3} tablet={3} computer={3} className="pr-0" >
                                                    <div className="h_profileMatching">
                                                         <Image src={ch__red_profileImg} className="profileImgMargin" />
                                                     </div>
                                                    </Grid.Column>
                                                    <Grid.Column mobile={13} tablet={13} computer={13}>
                                                    <div className="MatchingPartner">
                                                    <Header as='h3'>Animal Rescue Krew (A.R.K.)</Header>
                                                    <p className="textGreen orange">Matching partner</p>
                                                    </div>
                                                    </Grid.Column>
                                                </Grid>
                                             </Grid.Row>
                                        </div>
                                        <Divider />
                                        <div className="GivingGroupPadding">
                                            <Grid.Row className="MatchingPartnerWapper">
                                                <Grid>
                                                    <Grid.Column mobile={3} tablet={3} computer={3} className="pr-0" >
                                                    <div className="h_profileMatching">
                                                         <Image src={ch__red_profileImg} className="profileImgMargin" />
                                                     </div>
                                                    </Grid.Column>
                                                    <Grid.Column mobile={13} tablet={13} computer={13}>
                                                    <div className="MatchingPartner">
                                                    <Header as='h3'>Feral And Abandoned Cat Society (Faacs)</Header>
                                                    <p className="textGreen orange">Matching partner</p>
                                                    </div>
                                                    </Grid.Column>
                                                </Grid>
                                             </Grid.Row>
                                        </div>
                                        <Divider />
                                        <div className="GivingGroupPadding">
                                            <Grid.Row className="MatchingPartnerWapper">
                                                <Grid>
                                                    <Grid.Column mobile={3} tablet={3} computer={3} className="pr-0" >
                                                    <div className="h_profileMatching">
                                                         <Image src={ch__red_profileImg} className="profileImgMargin" />
                                                     </div>
                                                    </Grid.Column>
                                                    <Grid.Column mobile={13} tablet={13} computer={13}>
                                                    <div className="MatchingPartner">
                                                    <Header as='h3'>Mountain Gorilla Conservation Society Of Canada</Header>
                                                    <p className="textGreen orange">Matching partner</p>
                                                    </div>
                                                    </Grid.Column>
                                                </Grid>
                                             </Grid.Row>
                                        </div>
                                       
                                        </div>
                                    </div>
                                    <div className='charityInfowrap fullwidth'>
                                        <div className='charityInfo'>
                                        <Header as='h4'>This Giving Group supports...</Header> 
                                            <p>This group has not yet chosen a campaign or charity to support.  </p>
                                            <Button className="success-btn-rounded-def medium btnboxWidth">Select a charity or campaign</Button>
                                        </div>
                                    </div>
                                    </Responsive>
                                </Grid.Column>
                            </Grid>
                        </Grid.Row>
        </Container>
        </div>
        </Layout>
        <Responsive className='ch_MobGive' maxWidth={767} minWidth={320}>
         <Button className=' blue-btn-rounded-def'>Give</Button>
     </Responsive>
        </div>
    );
}

export default GivingGroupProfile;
