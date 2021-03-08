import React, { Fragment } from 'react';
import {
    Header,
    Button,
    Icon,
    List,
    Image, Table, Input, Dropdown, Modal,
}
    from 'semantic-ui-react';
import { Link } from '../../../routes';
import imageManage from '../../../static/images/no-data-avatar-group-chat-profile.png';

class Manage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showmodel: false,
            showGroupModel: false,
        }
    }
    render() {
        const {
            showmodel, showGroupModel,
        } = this.state
        return (
            <Fragment>
                <div className='basicsettings'>
                    <Header className='titleHeader'>Manage
                </Header>
                    <div className=" campaignSearchBanner ManageSearch">
                        <div className="searchbox">
                            <Input
                                fluid
                                placeholder="Find a group member"
                            />
                            <div className="search-btn campaignSearch">
                                <a>
                                    <Icon name="search" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="memberswapper">
                        <div className="membersadmin">
                            <p><span><i aria-hidden="true" class="users icon"></i></span>1022 members</p>
                        </div>
                        <div className="Emailmembers">
                            <p><span> <i aria-hidden="true" className="icon icon-mail" /></span>Email members</p>
                        </div>
                    </div>
                    <Table basic="very" unstackable className="ManageTable Topborder Bottomborder">
                        <Table.Body>
                            <Table.Row className="ManageWappeer">
                                <Table.Cell className="ManageGroup">
                                    <List verticalAlign="middle">
                                        <List.Item>
                                            <Image src={imageManage} className="imgManage" />
                                            <List.Content>
                                                <List.Header className="ManageAdmin">
                                                    Chimp • Admin
                                                <span>
                                                        <i aria-hidden="true" className="icon star outline" />
                                                    </span>
                                                </List.Header>
                                                <List.Description>
                                                    <p>
                                                        Vancouver, BC
                                                    </p>
                                                </List.Description>
                                            </List.Content>
                                        </List.Item>
                                    </List>
                                </Table.Cell>
                                <Table.Cell className="Managebtn">
                                    <a role="listitem" className="item">
                                        <Dropdown
                                            icon="ellipsis horizontal"
                                            className="dropdown_ellipsisnew"
                                            closeOnBlur
                                        >
                                            <Dropdown.Menu className="left">
                                                <Dropdown.Item text="Remove as admin " onClick={() => this.setState({ showmodel: true })} />
                                                <Dropdown.Item text="Remove from group " onClick={() => this.setState({ showGroupModel: true })} />
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </a>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row className="ManageWappeer">
                                <Table.Cell className="ManageGroup">
                                    <List verticalAlign="middle">
                                        <List.Item>
                                            <Image src={imageManage} className="imgManage" />
                                            <List.Content>
                                                <List.Header className="ManageAdmin">
                                                    Chimp • Admin
                                                <span>
                                                        <i aria-hidden="true" className="icon star outline" />
                                                    </span>
                                                </List.Header>
                                                <List.Description>
                                                    <p>
                                                        Vancouver, BC
                                                    </p>
                                                </List.Description>
                                            </List.Content>
                                        </List.Item>
                                    </List>
                                </Table.Cell>
                                <Table.Cell className="Managebtn">
                                    <a role="listitem" className="item">
                                        <Dropdown
                                            icon="ellipsis horizontal"
                                            className="dropdown_ellipsisnew"
                                            closeOnBlur>
                                            <Dropdown.Menu className="left">
                                                <Dropdown.Item text="Remove as admin " />
                                                <Dropdown.Item text="Remove from group " />
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </a>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </div>
                {
                    showmodel && (
                        <Modal
                            size="tiny"
                            dimmer="inverted"
                            className="chimp-modal"
                            closeIcon
                            closeOnEscape={false}
                            closeOnDimmerClick={false}
                            open={showmodel}
                            onClose={() => { this.setState({ showmodel: false }); }}
                        >
                            <Modal.Header>
                                Remove Emily Bath as group admin?
                        </Modal.Header>
                            <Modal.Content>
                                <Modal.Description className="font-s-14 ">
                                    Emily Bath will no longer be able to message group members, send money to charities, and make changes to the group's profile.
                            </Modal.Description>
                                <div className="btn-wraper pt-3 text-right">
                                    <Button
                                        className="danger-btn-rounded-def w-120"
                                    // onClick={() => this.handleBlockUser(userData.user_id)}
                                    // disabled={blockButtonClicked}
                                    >
                                        Block
                                </Button>
                                    <Button
                                        className="blue-bordr-btn-round-def w-120"
                                    // onClick={this.handleBlockCancelClick}
                                    // disabled={blockButtonClicked}
                                    >
                                        Cancel
                                </Button>
                                </div>
                            </Modal.Content>
                        </Modal>
                    )
                }
                {
                    showGroupModel && (
                        <Modal
                            size="tiny"
                            dimmer="inverted"
                            className="chimp-modal"
                            closeIcon
                            closeOnEscape={false}
                            closeOnDimmerClick={false}
                            open={showGroupModel}
                            onClose={() => { this.setState({ showGroupModel: false }); }}
                        >
                            <Modal.Header>
                                Remove María Paula Morterero?
                        </Modal.Header>
                            <Modal.Content>
                                <Modal.Description className="font-s-14">
                                    María Paula Morterero will no longer be a member of this group.
                            </Modal.Description>
                                <div className="btn-wraper pt-3 text-right">
                                    <Button
                                        className="danger-btn-rounded-def w-120"
                                    // onClick={() => this.handleBlockUser(userData.user_id)}
                                    // disabled={blockButtonClicked}
                                    >
                                        Block
                                </Button>
                                    <Button
                                        className="blue-bordr-btn-round-def w-120"
                                    // onClick={this.handleBlockCancelClick}
                                    // disabled={blockButtonClicked}
                                    >
                                        Cancel
                                </Button>
                                </div>
                            </Modal.Content>
                        </Modal>
                    )
                }
            </Fragment>
        );
    }
}

export default Manage;
