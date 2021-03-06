import React, { Fragment } from 'react';
import {
    Button,
    Modal,
    List,
    Dropdown,
    Placeholder,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import {
    PropTypes,
    func,
} from 'prop-types';
import _ from 'lodash';

import {
    deleteUserEmailAddress,
    setPrimaryUserEmailAddress,
    resendUserVerifyEmail,
} from '../../../actions/userProfile';

class EmailDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            setPrimaryEmailClicked: false,
            showDeleteEmailModalState: false,
            showSetPrimaryEmailModal: false,
        };
        this.openDeleteEmailModal = this.openDeleteEmailModal.bind(this);
        this.closeDeleteEmailModal = this.closeDeleteEmailModal.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.setPrimaryEmail = this.setPrimaryEmail.bind(this);
        this.resendEmail = this.resendEmail.bind(this);
        this.openSetPrimaryModal = this.openSetPrimaryModal.bind(this);
        this.closeSetPrimaryModal = this.closeSetPrimaryModal.bind(this);
    }

    onDeleteClick() {
        const {
            dispatch,
            id: userEmailId,
            userInfo: {
                id: userId,
            },
        } = this.props;
        deleteUserEmailAddress(dispatch, userEmailId, userId);
        this.closeDeleteEmailModal();
    }

    setPrimaryEmail() {
        const {
            dispatch,
            id,
            userInfo: {
                id: userId,
            },
        } = this.props;
        this.setState({
            setPrimaryEmailClicked: true,
        });
        setPrimaryUserEmailAddress(dispatch, id, userId);
    }

    resendEmail() {
        const {
            dispatch,
            id,
            userInfo: {
                id: userId,
            },
        } = this.props;
        resendUserVerifyEmail(dispatch, id, userId);
    }

    openDeleteEmailModal() {
        this.setState({
            showDeleteEmailModalState: true,
        });
    }

    closeDeleteEmailModal() {
        this.setState({
            showDeleteEmailModalState: false,
        });
    }

    openSetPrimaryModal() {
        this.setState({
            showSetPrimaryEmailModal: true,
        });
    }

    closeSetPrimaryModal() {
        this.setState({
            showSetPrimaryEmailModal: false,
        });
    }

    render() {
        const {
            email,
            isPrimary,
            verified,
            showEmailLoader,
        } = this.props;
        const {
            showDeleteEmailModalState,
            showSetPrimaryEmailModal,
            setPrimaryEmailClicked,
        } = this.state;
        const emailData = (
            <Fragment>
                <span className="font-s-17">{email}</span>
                {isPrimary
                    && (
                        <span className="primary">Primary</span>
                    )}
                {!verified
                    && (
                        <span className="pending">PENDING VERIFICATION</span>
                    )}
            </Fragment>
        );
        return (
            <Fragment>
                <List.Item>
                    {!isPrimary
                    && (
                        <List.Content floated="right">
                            <Dropdown className="rightBottom" icon="ellipsis horizontal">
                                <Dropdown.Menu>
                                    {verified
                                        ? (
                                            <Dropdown.Item
                                                text="Set as primary"
                                                onClick={this.openSetPrimaryModal}
                                            />
                                        )
                                        : (
                                            <Dropdown.Item
                                                text="Resend verification email"
                                                onClick={this.resendEmail}
                                            />
                                        )
                                    }
                                    <Dropdown.Item
                                        text="Delete email address"
                                        onClick={this.openDeleteEmailModal}
                                    />
                                </Dropdown.Menu>
                            </Dropdown>
                        </List.Content>
                    )}
                    <List.Content>
                        <List.Header>
                            {showEmailLoader
                                ? (
                                    <Placeholder>
                                        <Placeholder.Line length="medium" />
                                    </Placeholder>
                                )
                                : emailData
                            }
                        </List.Header>
                    </List.Content>
                </List.Item>
                <Modal
                    onClose={this.closeDeleteEmailModal}
                    open={showDeleteEmailModalState}
                    size="tiny"
                    dimmer="inverted"
                    className="chimp-modal"
                    closeIcon
                >
                    <Modal.Header>Delete email address?</Modal.Header>
                    <Modal.Content>
                        <Modal.Description className="font-s-16">
                            {`Your email address '${email}' will be removed.`}
                        </Modal.Description>
                        <div className="btn-wraper pt-3 text-right">
                            <Button className="danger-btn-rounded-def c-small" onClick={this.onDeleteClick}>Delete</Button>
                            <Button className="blue-bordr-btn-round-def c-small" onClick={this.closeDeleteEmailModal}>Cancel</Button>
                        </div>
                    </Modal.Content>
                </Modal>
                <Modal
                    onClose={this.closeSetPrimaryModal}
                    open={showSetPrimaryEmailModal}
                    size="tiny"
                    dimmer="inverted"
                    className="chimp-modal"
                    closeIcon
                >
                    <Modal.Header>Set as primary? </Modal.Header>
                    <Modal.Content>
                        <Modal.Description className="font-s-16">
                        You???ll be asked to log in again with your new primary email address.
                        </Modal.Description>
                        <div className="btn-wraper pt-3 text-right">
                            <Button
                                className="danger-btn-rounded-def c-small"
                                onClick={this.setPrimaryEmail}
                                content={setPrimaryEmailClicked ? 'Saving...' : 'OK'}
                                disabled={setPrimaryEmailClicked}
                            />
                            <Button className="blue-bordr-btn-round-def c-small" onClick={this.closeSetPrimaryModal}>Cancel</Button>
                        </div>
                    </Modal.Content>
                </Modal>
            </Fragment>
        );
    }
}

EmailDetails.defaultProps = {
    dispatch: func,
    email: '',
    id: '',
    isPrimary: false,
    showEmailLoader: false,
    userInfo: {
        id: '',
    },
    verified: false,
};

EmailDetails.propTypes = {
    dispatch: _.noop,
    email: PropTypes.string,
    id: PropTypes.string,
    isPrimary: PropTypes.bool,
    showEmailLoader: PropTypes.bool,
    userInfo: PropTypes.shape({
        id: PropTypes.string,
    }),
    verified: PropTypes.bool,
};

function mapStateToProps(state) {
    return {
        showEmailLoader: state.userProfile.showEmailLoader,
        userInfo: state.user.info,
    };
}

export default connect(mapStateToProps)(EmailDetails);
