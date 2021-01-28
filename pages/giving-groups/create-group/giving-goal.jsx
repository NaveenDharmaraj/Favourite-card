import React, { Component } from 'react';
import {
    Container,
    Header,
    Button,
    Input,
    Breadcrumb,
    Form,
    Image,
    Icon,
} from 'semantic-ui-react';

import Layout from '../../../components/shared/Layout';
import { Link } from '../../../routes';
import '../../../static/less/create_manage_group.less';

import ChimpDatePicker from '../../../components/shared/DatePicker';

class GivingGoal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            goalStartDate: null,
            goalEndDate: null,
        };
        this.handleCreateGroup = this.handleCreateGroup.bind(this);
    }

    handleCreateGroup(){
        console.log(this.state.goalStartDate); 
        console.log(this.state.goalEndDate);
    }

    render() {
        return (
            <Layout>
                <Container>
                    <div className='createNewGroupWrap'>
                        <div className='createNewGrpheader'>
                            <Header as='h2'>Create a new Giving Group</Header>
                            <div className="flowBreadcrumb">
                                <Breadcrumb size="mini">
                                    <Breadcrumb.Section className='completed_step'>Basic settings</Breadcrumb.Section>
                                    <Breadcrumb.Divider icon='right chevron' />
                                    <Breadcrumb.Section className='completed_step'>About the group</Breadcrumb.Section>
                                    <Breadcrumb.Divider icon='right chevron' />
                                    <Breadcrumb.Section className='completed_step'>Pics & video</Breadcrumb.Section>
                                    <Breadcrumb.Divider icon='right chevron' />
                                    <Breadcrumb.Section active>Charities and goal</Breadcrumb.Section>
                                </Breadcrumb>
                            </div>
                        </div>
                        <div className='mainContent'>
                            <div className='basicsettings'>
                                <Header className='titleHeader'>Charities and goal</Header>
                                <Form>
                                    <div className='createnewSec'>
                                        <Header className='sectionHeader'>Giving goal <span className='optional'>(optional)</span></Header>
                                        <div className='givingGoalForm'>
                                            <div className="field">
                                                <label>Goal amount</label>
                                                <Input iconPosition='left' placeholder='Enter a custom amount'>
                                                    <Icon name='dollar sign' />
                                                    <input />
                                                </Input>
                                            </div>
                                            <div className='field'>
                                                <label>Goal start date</label>
                                                <p className='label-info'>All money sent to the group from this date will count towards your group goal.</p>
                                                <ChimpDatePicker dateValue={this.state.goalStartDate} onChangeValue={date => this.setState({goalStartDate:date})}/>
                                            </div>
                                            <div className='field'>
                                                <label>Goal end date</label>
                                                <ChimpDatePicker dateValue={this.state.goalEndDate} onChangeValue={date => this.setState({goalEndDate:date})}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='createnewSec'>
                                        <Header className='sectionHeader'>Charities to support <span className='optional'>(optional)</span></Header>
                                        <p>Choose which charities this group plans to support.
    <span>You can select up to 5 charities and you can change these anytime.</span></p>
                                        <div className="searchBox charitysearch">
                                            <Input
                                                className="searchInput"
                                                placeholder="Search for charity"
                                                fluid
                                            />
                                            <a
                                                className="search-btn"
                                            >
                                            </a>
                                        </div>
                                        <div className='charityWrap'>
                                            <div className="charity">
                                                <Icon className='remove'/>
                                                <Image src='../../static/images/no-data-avatar-giving-group-profile.png'/>
                                                <Header>YWAM</Header>
                                            </div>
                                            <div className="charity">
                                                <Icon className='remove'/>
                                                <Image src='../../static/images/no-data-avatar-giving-group-profile.png'/>
                                                <Header>YWAM</Header>
                                            </div>
                                            <div className="charity">
                                                <Icon className='remove'/>
                                                <Image src='../../static/images/no-data-avatar-giving-group-profile.png'/>
                                                <Header>YWAM</Header>
                                            </div>
                                            <div className="charity">
                                                <Icon className='remove'/>
                                                <Image src='../../static/images/no-data-avatar-giving-group-profile.png'/>
                                                <Header>YWAM</Header>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                                <div className='buttonsWrap'>
                                    <Link route='/giving-groups/create-group/pics-video'>
                                        <Button className='blue-bordr-btn-round-def'>Back</Button>
                                    </Link> 
                                    <Button className='blue-btn-rounded-def' onClick={this.handleCreateGroup}>Create Giving Group</Button>
                                </div>
                            </div>    
                        </div>
                    </div>
                </Container>
            </Layout>
        );
    }
}

export default GivingGoal;
