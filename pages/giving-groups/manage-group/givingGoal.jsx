import React, { Fragment } from 'react';
import {
    Button,
    Grid,
    Header,
    Image,
    Icon,
    Popup,
    Responsive
} from 'semantic-ui-react';


function GivingGoal() {
    const contextRef = React.useRef();
    let BarWidth = 90;

    function toolTopPos(goalValue) {

        if(goalValue < 20){
            return 'top left';
        }
        else if(goalValue > 80){
            return 'top right';
        }
        else if(goalValue > 20 && goalValue < 80){
            return 'top center';
        }
      }

    return (
 
        <div className='basicsettings'>
            <Header className='titleHeader'>
                <Responsive maxWidth={767}>
                    <Icon name='back'></Icon>
                </Responsive>
                Giving Goal
            </Header>
            <div className='givingGoalWrap'>
                <div className='headerWrap'>
                    <Grid>
                        <Grid.Column computer={2} mobile={4} >
                            <Image src='../static/images/givinggroup_banner.png'/>
                        </Grid.Column>
                        <Grid.Column computer={9} mobile={12}>
                        <div className='headerContent'>
                            <p>Your group has set a goal to raise $100.00 by Dec 30, 2020.</p>
                        </div>
                        </Grid.Column>
                        <Grid.Column computer={5} mobile={16} >
                            <p className='daysleftText'>365 days left to reach goal</p>
                        </Grid.Column>
                    </Grid>
                </div>
                <div className='contentWrap'>
                    <Header as='h5'>Progress</Header>
                    <Grid>
                        <Grid.Column computer={4} mobile={8}>
                            <p>Goal</p>
                            <Header as='h3'>$44,500.00</Header>
                        </Grid.Column>
                        <Grid.Column computer={4} mobile={8}>
                            <p>Money raised</p>
                            <Header as='h3'>$44,500.00</Header>
                        </Grid.Column>
                        <Grid.Column computer={8} mobile={16}>
                            <div class="ui progress">
                                <div class="bar" style={{width:BarWidth+'%'}}>
                                    <div class="progress">{BarWidth}%</div>
                                    <div className='tooltipPos' ref={contextRef}></div>
                                </div>
                                <div class="label">
                                    <span>Jan 10, 2020</span><span>May 10, 2020</span>
                                </div>
                            </div>
                            <Popup
                                context={contextRef}
                                content='Reached goal on April 10, 2020'
                                open
                                position={toolTopPos(BarWidth)}
                                className='progress-tooltip'
                            />
                        </Grid.Column>
                    </Grid>
                </div>
                <div className='footerWrap'>
                <Grid>
                    <Grid.Column computer={8} mobile={16} >
                        <p>When you edit or delete a giving goal, the total money raised is not affected.</p>
                        <p>When you delete a giving goal, it will reset your goal.</p>
                    </Grid.Column>
                    <Grid.Column computer={8} mobile={16} >
                        <Button className='blue-bordr-btn-round-def'>Edit</Button>
                        <Button className='blue-bordr-btn-round-def'>Delete</Button>
                    </Grid.Column>
                </Grid>    
                </div>
            </div>
        </div>    
    
    );
}

export default GivingGoal;
