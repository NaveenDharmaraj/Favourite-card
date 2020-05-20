import React from 'react';
import {
    Modal, Button,
} from 'semantic-ui-react';
import { PropTypes } from 'prop-types';

const ChatModal = ({
    modalDetails, modalAction, handleModalClick, handleHideModal, buttonLoader,
}) => {
    let action = null;
    if (modalAction === 'MAKE_USER_ADMIN' || modalAction === 'REMOVE_ADMIN' || modalAction === 'REMOVE_USER') {
        action = 'MEMBERS_LIST';
    }
    return (
        <Modal
            size="tiny"
            dimmer="inverted"
            className="chimp-modal"
            onClose={() => handleHideModal(action)}
            closeIcon
            open={modalAction}
            centered
        >
            <Modal.Header>{modalDetails.header}</Modal.Header>
            <Modal.Content>
                <Modal.Description className="font-s-16">{modalDetails.description}</Modal.Description>
                <div className="btn-wraper pt-3 text-right">
                    {modalDetails.button && (
                        <Button
                            loading={buttonLoader}
                            disabled={buttonLoader}
                            className="blue-btn-rounded-def c-small"
                            onClick={() => handleModalClick(modalDetails.param, modalAction)}
                        >
                            {modalDetails.button}
                        </Button>
                    )}
                    <Button
                        className="blue-bordr-btn-round-def c-small"
                        onClick={() => handleHideModal(action)}
                    >
                        {modalDetails.button ? 'Cancel' : 'Close'}
                    </Button>
                </div>
            </Modal.Content>
        </Modal>
    );
};

ChatModal.defaultProps = {
    buttonLoader: false,
    handleHideModal: () => { },
    handleModalClick: () => { },
    modalAction: '',
    modalDetails: {
        button: 'Close',
        description: '',
        header: '',
        param: {},
    },
};

ChatModal.propTypes = {
    buttonLoader: PropTypes.bool,
    handleHideModal: PropTypes.func,
    handleModalClick: PropTypes.func,
    modalAction: PropTypes.string,
    modalDetails: PropTypes.shape({
        button: PropTypes.string,
        description: PropTypes.string,
        header: PropTypes.string,
        param: PropTypes.shape({
        }),
    }),
};

export default ChatModal;
