import React from 'react';
import {
    Container,
    Header,
    Button,
    Dropdown,
    Input,
    Form,
    TextArea,
    Icon,
    Modal,
    Card,
} from 'semantic-ui-react';
import { generateBreadCrum } from '../../../helpers/createGrouputils';

import { Link } from '../../../routes';
import '../../../static/less/create_manage_group.less';

import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';

const breakCrumArray = ['Basic settings', 'About the group', 'Pics & video', 'Charities and goal'];
const currentActiveStepCompleted = [1, 2];

class CreateGivingGroupAbout extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            showModal: false,
            items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'],
         }
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({items}) => ({
          items: arrayMove(items, oldIndex, newIndex),
        }));
        console.log(this.state.items)
    };

    render() {
        const SortableItem = SortableElement(({value}) => 
            <Card className='DragDesc' as='div' onClick={() => this.setState({ showModal: true })}>
                <Card.Header>{value}</Card.Header>
                <div className='moveDeleteWrap'>
                    <Icon className='move'/>
                    <Dropdown className='threeDotBtn' direction='left'>
                        <Dropdown.Menu >
                            <Dropdown.Item text='Delete'/>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <Card.Content>
                    {value}
                </Card.Content>
            </Card>
        );

        const SortableList = SortableContainer(({items}) => {
            return (
                <div className='about_descCardWrap'>
                    {items.map((value, index) => (
                        <SortableItem key={`item-${value}`} index={index} value={value} />
                    ))}
                </div>
            );
        });
        return (
            <Container>
                <div className='createNewGroupWrap'>
                    <div className='createNewGrpheader'>
                        <Header as='h2'>Create a new Giving Group</Header>
                        {generateBreadCrum(breakCrumArray, currentActiveStepCompleted)}
                    </div>
                    <div className='mainContent'>
                        <div className='about-group'>
                            <Header className='titleHeader'>About the group</Header>
                            <Form>
                                <div className='createnewSec'>
                                    <div className='requiredfield field'>
                                        <label>Describe your group</label>
                                        <p className='label-info'>Provide a brief summary about why you started this Giving Group.</p>
                                        <Form.Field
                                            control={TextArea}
                                        />
                                        <div className='fieldInfoWrap'>
                                            <p className="error-message"><Icon name="exclamation circle" />The field is required</p>
                                            <div class="field-info">0 of 300</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='createnewSec'>
                                    <Header className='sectionHeader'>Expand your group description <span className='optional'>(optional)</span></Header>
                                    <p>Provide additional details about your Giving Group. You can add up to 5 sections, and you can edit or re-order how they appear on your profile anytime.</p>

                                    <SortableList 
                                        items={this.state.items} 
                                        onSortEnd={this.onSortEnd} 
                                        lockAxis='y'
                                        pressDelay={220}
                                        disableAutoscroll={true}
                                    />

                                    <Modal
                                        className="chimp-modal addAbout-Modal"
                                        closeIcon
                                        size="small"
                                        open={this.state.showModal}
                                        onClose={() => { this.setState({ showModal: false }) }}
                                        trigger={
                                            <Button className='light-blue-btn-bordered addBtn' onClick={() => this.setState({ showModal: true })}><span><Icon className='plus' />Add about section</span></Button>
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
                            <div className='buttonsWrap'>
                                <Link route='/giving-groups/create-group/basic'>
                                    <Button className='blue-bordr-btn-round-def'>Back</Button>
                                </Link>
                                <Link route='/giving-groups/create-group/pics-video'>
                                    <Button className='blue-btn-rounded-def'>Continue</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }
}

export default CreateGivingGroupAbout;
