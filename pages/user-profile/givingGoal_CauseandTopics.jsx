import React, { Fragment } from 'react';
import {
    Progress,
    Header,
    Grid,
    Button
} from 'semantic-ui-react';
import PrivacySettings from './privacySettings';
import EditCauseAndTopics from './editCauseAndTopics';
import '../../static/less/userProfile.less';

class GivingGoal_CauseAndTopics extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Fragment>
                <div className="givingGoalWrap">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column computer={12} mobile={13} tablet={11}>
                                <Header>Giving goal</Header>
                            </Grid.Column>
                            <Grid.Column computer={4} mobile={3} tablet={5}>
                                <PrivacySettings iconName='lock'/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Header>$1,120.00</Header>
                    <p>contributed to your <span>'{'$Amount'}'</span> goal this year</p>
                    <Progress percent={33}/>
                </div>
                    <div className="cause_topicsWrap">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column computer={12} mobile={13} tablet={11}>
                                <div className='headerWrap'>
                                    <Header>Causes and topics</Header>
                                    <EditCauseAndTopics/>                                   
                                </div>
                            </Grid.Column>
                            <Grid.Column computer={4} mobile={3} tablet={5}>
                                <PrivacySettings iconName='lock'/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <div className="user-badge-group">
                        <Button className="user_badgeButton active">Addiction</Button>
                        <Button className="user_badgeButton active">Clothing-bank</Button>
                        <Button className="user_badgeButton active">Climate</Button>
                        <Button className="user_badgeButton active">Early-childhood</Button>
                        <Button className="user_badgeButton active">Ball-sports</Button>
                        <Button className="user_badgeButton active">Civil</Button>
                        <Button className="user_badgeButton active">Counselling</Button>
                    </div>
                    <div className='text-center'>
                        <Button className="blue-bordr-btn-round-def">View all</Button>
                    </div>
                </div>
             </Fragment>
        );
    }
}

export default GivingGoal_CauseAndTopics;
