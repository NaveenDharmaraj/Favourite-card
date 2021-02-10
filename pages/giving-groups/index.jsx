import React, { Fragment } from 'react';
import {
    Container,
    Grid,
    Image,
    Header,
    Button,
    Card,
    Placeholder,
    Input,
} from 'semantic-ui-react';

import Layout from '../../components/shared/Layout';
import { CreateGivingGroupFlowSteps } from '../../helpers/createGrouputils';
import { Link } from '../../routes';
import '../../static/less/create_manage_group.less';

function MyProfile() {
    const GivingGroupsCampaignCard = (props) => {
        return (
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
        )
    }    
    return (
        <Layout>
            <Container>
                <div className='group_campaign_header'>
                    <div className='grp_camp_banner'>
                        <div class="grp_campBannerTxt">
                            <Header as='h3'>Give together</Header>
                            <p>With a Giving Group, multiple people can combine forces, pool or raise money, and support one or more charities together.</p>
                            <Link route={CreateGivingGroupFlowSteps.stepOne}>
                                <Button className='success-btn-rounded-def'>Create a new Giving Group</Button>
                            </Link>
                        </div>   
                    </div>
                    <div className="searchBox">
                        <Input
                            className="searchInput"
                            placeholder="Search your Giving Groups"
                            fluid
                        />
                        <a
                            className="search-btn"
                        >
                        </a>
                    </div>
                </div>
                <div className='gvingGroup_campSec'>
                    <Grid stackable columns={3}>
                        <Grid.Column>
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
                        </Grid.Column>
                        <Grid.Column>
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
                        </Grid.Column>
                        <Grid.Column>
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
                        </Grid.Column>
                    </Grid>
                </div>
                <div className='gvingGroup_campSec'>
                    <Header as='h4'>Giving Groups you manage</Header>
                    <Grid stackable columns={3}>
                        <Grid.Column>
                            <GivingGroupsCampaignCard/>
                        </Grid.Column>
                        <Grid.Column>
                            <GivingGroupsCampaignCard/>
                        </Grid.Column>
                        <Grid.Column>
                            <GivingGroupsCampaignCard/>
                        </Grid.Column>
                    </Grid>
                    <div className='seeMoreBtnWrap'>
                        <Button className='blue-bordr-btn-round-def'>See more</Button>
                        <p>Showing 24 of 301</p>
                    </div>
                </div>
                <div className='gvingGroup_campSec'>
                    <Header as='h4'>Giving Groups you have joined</Header>
                    <Grid stackable columns={3}>
                        <Grid.Column>
                            <GivingGroupsCampaignCard/>
                        </Grid.Column>
                        <Grid.Column>
                            <GivingGroupsCampaignCard/>
                        </Grid.Column>
                        <Grid.Column>
                            <GivingGroupsCampaignCard/>
                        </Grid.Column>
                        <Grid.Column>
                            <GivingGroupsCampaignCard/>
                        </Grid.Column>
                        <Grid.Column>
                            <GivingGroupsCampaignCard/>
                        </Grid.Column>
                        <Grid.Column>
                            <GivingGroupsCampaignCard/>
                        </Grid.Column>
                    </Grid>
                    <div className='seeMoreBtnWrap'>
                        <Button className='blue-bordr-btn-round-def'>See more</Button>
                        <p>Showing 24 of 301</p>
                    </div>
                </div>
                <div className='gvingGroup_campSec'>
                    <Header as='h4'>Campaigns you manage</Header>
                    <Grid stackable columns={3}>
                        <Grid.Column>
                            <GivingGroupsCampaignCard/>
                        </Grid.Column>
                        <Grid.Column>
                            <GivingGroupsCampaignCard/>
                        </Grid.Column>
                        <Grid.Column>
                            <GivingGroupsCampaignCard/>
                        </Grid.Column>
                    </Grid>
                    <div className='seeMoreBtnWrap'>
                        <Button className='blue-bordr-btn-round-def'>See more</Button>
                        <p>Showing 24 of 301</p>
                    </div>
                </div>
            </Container>
        </Layout>
    );
}

export default MyProfile;
