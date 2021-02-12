import React, { Fragment } from 'react';
import {
    Container,
    Header,
    Button,
    Dropdown,
    Input,
    Breadcrumb,
    Form,
    TextArea,
    Icon,
    Modal,
    Card,
} from 'semantic-ui-react';

import { Link } from '../../../routes';

class AboutGroup extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            showModal : false,
            showDescrbModal: false,
        }
    }
    render() {
        return (
            <div className='about-group'>
                <Header className='titleHeader'>About the group</Header>
                <Form>
                    <div className='createnewSec'>
                        <Header className='sectionHeader'>Describe your group</Header>
                        <p>Provide a brief summary about why you started this Giving Group.</p>
                        <div className='about_descCardWrap'>
                        <Modal
                            className="chimp-modal addAbout-Modal"
                            
                            closeIcon
                            size="small"
                            open={this.state.showDescrbModal}
                            onClose={() => { this.setState({ showDescrbModal: false }) }}
                            trigger={
                                <Card as='div' onClick={() => this.setState({ showDescrbModal: true })}>
                                <Card.Header>The Group's purpose</Card.Header>
                              
                                <Card.Content>Coming from many different backgrounds and working in a wide range of situations, YWAMers are united in their 
desire to be part of changing people's lives and have responded to the "Great Commission".</Card.Content>
                            </Card>
                            }
                            dimmer="inverted"
                        >
                            <Modal.Header>Edit section</Modal.Header>
                            <Modal.Content>
                                <p>Provide a brief summary about why you started this Giving Group.</p>
                                <Form>
                                    <div className='createnewSec'>
                                        <div className='requiredfield field'>
                                            <label>Group description</label>
                                            <Form.Field
                                                control={TextArea}

                                            />
                                            <div className='fieldInfoWrap'>
                                                <p className="error-message"><Icon name="exclamation circle" />The field is required</p>
                                                <div class="field-info">0 of 300</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='buttonsWrap'>
                                        <Button className='blue-btn-rounded-def'>Save</Button>
                                        <Button className='blue-bordr-btn-round-def'>Cancel</Button>
                                    </div>
                                </Form>
                            </Modal.Content>
                        </Modal>
                        </div>
                    </div>
                    <div className='createnewSec'>
                        <Header className='sectionHeader'>Expand your group description <span className='optional'>(optional)</span></Header>
                        <p>Provide additional details about your Giving Group. You can add up to 5 sections, and you can edit or re-order how they appear on your profile anytime.</p>
                        <div className='about_descCardWrap'>
                            <Card>
                                <Card.Header>The Group's purpose</Card.Header>
                                <div className='moveDeleteWrap'>
                                    <Icon className='move'/>
                                    <Dropdown className='threeDotBtn' direction='left'>
                                        <Dropdown.Menu >
                                            <Dropdown.Item text='Delete' />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <Card.Content>Coming from many different backgrounds and working in a wide range of situations, YWAMers are united in their 
desire to be part of changing people's lives and have responded to the "Great Commission".</Card.Content>
                            </Card>
                            <Card>
                                <Card.Header>The Group's purpose</Card.Header>
                                <div className='moveDeleteWrap'>
                                    <Icon className='move'/>
                                    <Dropdown className='threeDotBtn' direction='left'>
                                        <Dropdown.Menu >
                                            <Dropdown.Item text='Delete' />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <Card.Content>Coming from many different backgrounds and working in a wide range of situations, YWAMers are united in their 
desire to be part of changing people's lives and have responded to the "Great Commission".</Card.Content>
                            </Card>
                            <Card>
                                <Card.Header>The Group's purpose</Card.Header>
                                <div className='moveDeleteWrap'>
                                    <Icon className='move'/>
                                    <Dropdown className='threeDotBtn' direction='left'>
                                        <Dropdown.Menu >
                                            <Dropdown.Item text='Delete' />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <Card.Content>Coming from many different backgrounds and working in a wide range of situations, YWAMers are united in their 
desire to be part of changing people's lives and have responded to the "Great Commission".</Card.Content>
                            </Card>
                        </div>
                        <Modal
                            className="chimp-modal addAbout-Modal"
                            closeIcon
                            size="small"
                            open={this.state.showModal}
                            onClose={() => { this.setState({ showModal: false }) }}
                            trigger={
                                <Button className='light-blue-btn-bordered addBtn' onClick={() => this.setState({ showModal: true })}><span><Icon className='plus'/>Add about section</span></Button>
                            }
                            dimmer="inverted"
                        >
                            <Modal.Header>Add section</Modal.Header>
                            <Modal.Content>
                                <p>Use this section to add more information about your group, such as information about your group's organizers or how people can help.</p>
                                <Form>
                                    <div className="requiredfield field">
                                        <Form.Field
                                            id='form-input-control-Section-title'
                                            control={Input}
                                            label='Section title'
                                            placeholder='How to help'
                                        />
                                        <p className="error-message"><Icon name="exclamation circle" />The field is required</p>
                                    </div>
                                    <div className='requiredfield field'>
                                        <label>Description</label>
                                        <Form.Field
                                            control={TextArea}
                                        />
                                        <div className='fieldInfoWrap'>
                                            <p className="error-message"><Icon name="exclamation circle" />The field is required</p>
                                            <div class="field-info">500 of 10,000</div>
                                        </div>
                                    </div>
                                    <div className='buttonsWrap'>
                                        <Button className='blue-btn-rounded-def'>Add</Button>
                                        <Button className='blue-bordr-btn-round-def'>Cancel</Button>
                                    </div>
                                </Form>
                            </Modal.Content>
                        </Modal>
                    </div>
                </Form>
            </div>    
        );
    }
}

export default AboutGroup;
