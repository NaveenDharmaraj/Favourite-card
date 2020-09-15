import React, { Fragment } from 'react';
import {
    Modal,
    Button,
    Header,
    Grid,
    Responsive,
    Icon,
    Input,
} from 'semantic-ui-react';

class EditCauseAndTopics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
    }
    render() {
        return (
            <Modal
                size="tiny"
                dimmer="inverted"
                closeIcon
                className="chimp-modal editCauseModal"
                open={this.state.showModal}
                onClose={()=>{this.setState({showModal: false})}}
                trigger={
                    <a className='editModalTrigger' onClick={() => this.setState({ showModal: true })}>Edit</a>
                }
            >
                <Modal.Header>Causes and topics you care about
                    <Responsive minWidth={767}>
                        <span className='header-note'>Select causes, topics, or both to discover charities and Giving Groups that might interest you.</span>
                    </Responsive>
                </Modal.Header>
                <Modal.Content>
                    <Responsive maxWidth={767}>
                        <span className='header-note'>Select causes, topics, or both to discover charities and Giving Groups that might interest you.</span>
                    </Responsive>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column computer={10} mobile={16}>
                                <div className="causesec">
                                    <Header as='h4'>Causes</Header>
                                    <p>Causes represent broader areas of charitable interests.</p>
                                    <div className='causeselect-wraper'>
                                        <Button basic className='select-btn active'>Amenities</Button>
                                        <Button basic className='select-btn active'>Amenities</Button>
                                        <Button basic className='select-btn active'>Amenities</Button>
                                        <Button basic className='select-btn active'>Amenities</Button>
                                        <Button basic className='select-btn active'>Amenities</Button>
                                        <Button basic className='select-btn active'>Amenities</Button>
                                    </div>
                                </div>
                            </Grid.Column>
                            <Grid.Column computer={6} mobile={16}>
                                <Header as='h4'>Topics you care about</Header>
                                <div className="user-badge-group">
                                    <Button className="user_badgeButton active">Addiction <Icon className='delete'></Icon></Button>
                                    <Button className="user_badgeButton active">Clothing-bank <Icon className='delete'></Icon></Button>
                                    <Button className="user_badgeButton active">Climate <Icon className='delete'></Icon></Button>
                                    <Button className="user_badgeButton active">Early-childhood <Icon className='delete'></Icon></Button>
                                    <Button className="user_badgeButton active">Ball-sports <Icon className='delete'></Icon></Button>
                                    <Button className="user_badgeButton active">Civil <Icon className='delete'></Icon></Button>
                                    <Button className="user_badgeButton active">Counselling <Icon className='delete'></Icon></Button>
                                </div>
                                <Header as='h4'>All topics</Header>
                                <p>Topics represent specific areas of charitable interests.</p>
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
                                <div className="user-badge-group">
                                    <Button className="user_badgeButton">Addiction</Button>
                                    <Button className="user_badgeButton">Clothing-bank</Button>
                                    <Button className="user_badgeButton">Climate</Button>
                                    <Button className="user_badgeButton">Early-childhood</Button>
                                    <Button className="user_badgeButton">Ball-sports</Button>
                                    <Button className="user_badgeButton">Civil</Button>
                                    <Button className="user_badgeButton">Counselling </Button>
                                </div>
                                <a className='EditTopicseeMore'><Icon className='share'></Icon>See more topics</a>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column computer={10} mobile={16}>
                                <p className='footInfo'>Only you can see causes and topics you care about unless you decide to share them on your personal profile. We don’t share your selected causes and topics with charities or anyone else.</p>
                            </Grid.Column>
                            <Grid.Column computer={6} mobile={16} textAlign='right'>
                              <Button className='blue-btn-rounded-def save'>Save</Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>        
                </Modal.Content>
            </Modal>
        );
    }
}

export default EditCauseAndTopics;
