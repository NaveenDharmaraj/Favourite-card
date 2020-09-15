import React, { Fragment } from 'react';
import {
    Modal,
    Button,
    Header,
    Image,
    Form,
    Grid,
    Input, TextArea, Responsive,
} from 'semantic-ui-react';

class EditProfile extends React.Component {
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
                className="chimp-modal"
                open={this.state.showModal}
                onClose={()=>{this.setState({showModal: false})}}
                trigger={
                    <Button className='blue-bordr-btn-round-def' onClick={() => this.setState({ showModal: true })}>
                        Edit profile
                    </Button>
                }
            >
                <Modal.Header>Edit profile</Modal.Header>
                <Modal.Content>
                <Responsive minWidth={767}>
                    <Header as='h5'>Profile photo</Header>
                </Responsive>        
                    <div className='editProfileModal'>
                        <div className='editProfilePhotoWrap'>
                            <div className="userProfileImg">
                                <Image src="../static/images/no-data-avatar-charity-profile.png"/>
                            </div>
                            <div className='editprflButtonWrap'>
                                <Button className='success-btn-rounded-def'>Change profile photo</Button>
                                <a className='remvephoto'>Remove photo</a>
                            </div>
                        </div>
                        <Form>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column computer={8} mobile={16}>
                                        <Form.Field
                                            id='form-input-control-first-name'
                                            control={Input}
                                            label='First name'
                                            placeholder='First name'
                                        />
                                    </Grid.Column>
                                    <Grid.Column computer={8} mobile={16}>
                                        <Form.Field
                                            id='form-input-control-last-name'
                                            control={Input}
                                            label='Last name'
                                            placeholder='Last name'
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Form.Field
                                id='form-input-control-display-name'
                                control={Input}
                                label='Display name'
                                placeholder='Display name'
                            />
                            <Form.Field
                                id='form-textarea-bio'
                                control={TextArea}
                                label='Bio'
                                placeholder='Bio...'
                            />
                            <div class="field-info">1000 of 1000 characters left </div>
                            <Form.Field
                                id='form-input-control-locaion'
                                control={Input}
                                label='Locaion'
                                placeholder='Locaion'
                            />
                            <div className="field">
                                <label for='form-input-control-givingGoal'>Giving goal</label>
                                <div className='label-info'>Set a personal goal for the dollars you want to commit for giving. Reach your goal by adding money to your account throughout the calendar year. Goals are reset to $0 at the start of each year, and you can update your goal anytime.</div>
                                <Form.Field
                                    id='form-input-control-givingGoal'
                                    control={Input}
                                    placeholder='Enter amount'
                                />
                                <div className='price_btn'>
                                    <Button basic>$500</Button>
                                    <Button basic>$1000</Button>
                                    <Button basic>$1500</Button>
                                </div>
                            </div>
                            <Button className='blue-btn-rounded-def save'>Save</Button>
                        </Form>     
                    </div>  
                              
                </Modal.Content>
            </Modal>
        );
    }
}

export default EditProfile;
