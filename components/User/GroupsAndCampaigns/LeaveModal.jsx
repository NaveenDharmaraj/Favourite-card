/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import {
  List,
  Button,
  Modal,
} from 'semantic-ui-react'
import { Link } from '../../../routes';

class LeaveModal extends React.Component {
    render() {
        const {
            showError,
            showMangeGroups,
            slug,
            name,
            id,
            callLeaveGroup,
            close,
            open,
            errorMessage,
            leaveButtonLoader
        } = this.props;
        return(
            <Modal 
                size="tiny"
                dimmer="inverted"
                className="chimp-modal"
                closeIcon
                open={open}
                onClose={close}
            >
                <Modal.Header>Leave {name} </Modal.Header>
                <Modal.Content>
                    <Modal.Description className="font-s-16">
                        {
                            (showError) ?
                                (
                                    <List divided relaxed className="modalWarning mt-1">
                                        <List.Item>
                                            <List.Icon verticalAlign='middle'>
                                                <span className="warningIcon">!</span>
                                            </List.Icon>
                                            <List.Content>
                                                <List.Header>{errorMessage.message}</List.Header>
                                            </List.Content>
                                        </List.Item>
                                    </List>
                                )
                                : (
                                    <span>
                                        Are you sure you would like to leave this Giving Group?
                                    </span>
                                )
                        }
                    </Modal.Description>
                    <div className="btn-wraper pt-3 text-right">
                        { (showError && showMangeGroups) ?
                            (
                                <Link route={`/groups/${slug}/dashboard`}>
                                    <Button 
                                        className="blue-btn-rounded-def c-small" 
                                    >
                                        Manage Groups
                                    </Button>
                                </Link>
                            )
                            : (
                                <Button
                                    className="danger-btn-rounded-def c-small" 
                                    onClick={() => callLeaveGroup(id)} 
                                    content={(leaveButtonLoader === true) ? "Loading..": "Leave Group"}
                                    disabled={leaveButtonLoader}
                                />
                            )}
                        <Button className="blue-bordr-btn-round-def c-small"  onClick={close}>Cancel</Button>
                    </div>
                </Modal.Content>
            </Modal>
        );
    }

}
export default LeaveModal;
