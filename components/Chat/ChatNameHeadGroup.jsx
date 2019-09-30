import React, { cloneElement } from 'react';
import {
    Button,
    Image,
    Popup,
    Modal,
    List,
    Icon,
    Input,
    Divider
} from 'semantic-ui-react'
import moreIcon from '../../static/images/icons/icon-ellipsis-big.svg';
class ChatNameHeadGroup extends React.Component {

    render() {
        return (

            <div className="chatHeader">
                <div className="chatWithGroup">
                    <List divided verticalAlign='middle'>
                        <List.Item>
                            <List.Content floated='right'>
                                <Popup className="moreOptionPopup"
                                    trigger={<Button className="moreOption-btn transparent" circular >
                                        <Image src={moreIcon} ref={this.contextRef} />
                                    </Button>} basic position='bottom right' on='click'>
                                    <Popup.Content>
                                        <List>
                                            <Modal size="tiny" dimmer="inverted" className="chimp-modal" closeIcon trigger={<List.Item as='a'>See members</List.Item>} centered={false}>
                                                <Modal.Header>Members</Modal.Header>
                                                <Modal.Content>
                                                    <Modal.Description className="font-s-16">
                                                        <div className="messageSearch">
                                                            <Input fluid iconPosition='left' icon='search' placeholder='Search...' />
                                                        </div>
                                                        <List divided verticalAlign='middle'>
                                                            <List.Item>
                                                                <List.Content floated='right'>
                                                                    <Popup className="moreOptionPopup"
                                                                        trigger={<Button className="moreOption-btn transparent" circular>
                                                                            <Image src={moreIcon} ref={this.contextRef} />
                                                                        </Button>} basic position='bottom right' on='click'>
                                                                        <Popup.Content></Popup.Content>
                                                                    </Popup>
                                                                </List.Content>
                                                                <Image avatar src='https://react.semantic-ui.com/images/avatar/small/lena.png' />
                                                                <List.Content>
                                                                    <List.Header as='a'>Ekene Obasey (you)</List.Header>
                                                                    <List.Description>
                                                                        Vancouver, BC
                                                        </List.Description>
                                                                </List.Content>
                                                            </List.Item>
                                                        </List>
                                                    </Modal.Description>
                                                    <div className="btn-wraper pt-3 text-right">
                                                        <Button className="blue-btn-rounded-def c-small">Mute</Button>
                                                        <Button className="blue-bordr-btn-round-def c-small" onClick={this.close}>Cancel</Button>
                                                    </div>
                                                </Modal.Content>
                                            </Modal>
                                            <Modal size="tiny" dimmer="inverted" className="chimp-modal" closeIcon trigger={<List.Item as='a'>Add members</List.Item>} centered={false}>
                                                <Modal.Header>Add members</Modal.Header>
                                                <Modal.Content>
                                                    <Modal.Description className="font-s-16">Deleting removes conversations from inbox, but no ones else’s inbox.</Modal.Description>
                                                    <div className="btn-wraper pt-3 text-right">
                                                        <Button className="blue-btn-rounded-def c-small">Delete</Button>
                                                        <Button className="blue-bordr-btn-round-def c-small">Cancel</Button>
                                                    </div>
                                                </Modal.Content>
                                            </Modal>
                                            <Modal size="tiny" dimmer="inverted" className="chimp-modal" closeIcon trigger={<List.Item as='a'>Mute</List.Item>} centered={false}>
                                                <Modal.Header>Mute conversation?</Modal.Header>
                                                <Modal.Content>
                                                    <Modal.Description className="font-s-16">You can unmute this conversation anytime.</Modal.Description>
                                                    <div className="btn-wraper pt-3 text-right">
                                                        <Button className="blue-btn-rounded-def c-small">Mute</Button>
                                                        <Button className="blue-bordr-btn-round-def c-small">Cancel</Button>
                                                    </div>
                                                </Modal.Content>
                                            </Modal>
                                            <Divider />
                                            <Modal size="tiny" dimmer="inverted" className="chimp-modal" closeIcon trigger={<List.Item as='a' className="red">Leave conversation</List.Item>} centered={false}>
                                                <Modal.Header>Mute conversation?</Modal.Header>
                                                <Modal.Content>
                                                    <Modal.Description className="font-s-16">You can unmute this conversation anytime.</Modal.Description>
                                                    <div className="btn-wraper pt-3 text-right">
                                                        <Button className="blue-btn-rounded-def c-small">Mute</Button>
                                                        <Button className="blue-bordr-btn-round-def c-small">Cancel</Button>
                                                    </div>
                                                </Modal.Content>
                                            </Modal>
                                        </List>
                                    </Popup.Content>
                                </Popup>
                            </List.Content>
                            <Popup className="moreOptionPopup"
                                trigger={<Image avatar src='https://react.semantic-ui.com/images/avatar/small/lena.png' />} basic position='bottom left' on='click' hideOnClick>
                                <Popup.Content>
                                    <List>
                                        <Modal size="tiny" dimmer="inverted" className="chimp-modal image-modal" style={{ backgroundImage: 'url(https://react.semantic-ui.com/images/avatar/small/lena.png)' }} closeIcon trigger={<List.Item as='a'>View photo</List.Item>} centered={false}>

                                        </Modal>
                                        <List.Item as='a'>Upload photo</List.Item>
                                        <List.Item as='a'>Remove photo</List.Item>
                                    </List>
                                </Popup.Content>
                            </Popup>
                            <List.Content>
                                Run for the Cure<Icon name="pencil" />
                            </List.Content>
                        </List.Item>
                    </List>
                </div>
            </div>
        );
    }

}

export default ChatNameHeadGroup