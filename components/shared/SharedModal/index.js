import { useState } from "react";
import _every from 'lodash/every';
import { Button, Modal } from "semantic-ui-react";

const SharedModal = ({
    trigger,
    handleClose,
    handleSave,
    modalHeader,
    modalContent,
    modalFooterSave,
    modalFooterCancel,
    showLoader,
    showModal,
    validity,
    hasModified,
}) => {
    return (
        <Modal
            className="chimp-modal addAbout-Modal edit-goal-modal"
            closeIcon
            size="small"
            open={showModal}
            onClose={() => handleClose()}
            trigger={trigger}
            dimmer="inverted"
        >
            <Modal.Header>{modalHeader}</Modal.Header>
            <Modal.Content className="createnewSec">
                {modalContent}
                <div className='buttonsWrap'>
                <Button
                    className='blue-btn-rounded-def'
                    onClick={() => handleSave()}
                    disabled={!_every(validity) || !hasModified}
                    loader={showLoader}
                >
                    {modalFooterSave}
                </Button>
                <Button
                    className='blue-bordr-btn-round-def'
                    onClick={() => handleClose()}
                >
                    {modalFooterCancel}
                </Button>
            </div>
            </Modal.Content>
        </Modal>
    )
}
SharedModal.defaultProps = {
    trigger: null,
    handleClose: () => { },
    handleSave: () => { },
    modalHeader: '',
    modalContent: null,
    showModal: false,
    modalFooterSave: 'Save',
    modalFooterCancel: 'Cancel',
    showLoader: false,
    validity: {},
}
export default SharedModal;