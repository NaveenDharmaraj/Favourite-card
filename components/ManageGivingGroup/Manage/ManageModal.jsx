import React, {
    Fragment,
} from 'react';
import {
    Button,
    Modal,
} from 'semantic-ui-react';
import iconred from '../../../static/images/icons/red.svg';

const ManageModal = (props) => {
    const {
        showModal,
        closeModal,
        modalHeader,
        modalDescription,
        onButtonClick,
        loader,
        isSingleAdmin,
        buttonText,
        isRemove,
    } = props;
    return (
        <Modal
            size="tiny"
            dimmer="inverted"
            className="chimp-modal"
            closeIcon
            closeOnEscape={false}
            closeOnDimmerClick={false}
            open={showModal}
            onClose={closeModal}
        >
            <Modal.Header>
                {modalHeader}
            </Modal.Header>
            <Modal.Content>
                <Modal.Description className="font-s-14 mb-1 ">
                    {!isSingleAdmin
                        ? modalDescription
                        : (
                            <Fragment>
                                <div className="p_wrapper">
                                    <p><span><img src={iconred}/></span>A Giving Group needs at least one admin.</p>
                                </div>
                                <p>You are the only admin in this group. Please make another group member as admin first.</p>
                            </Fragment>
                        )}
                </Modal.Description>
                {!isSingleAdmin
                    && (
                        <div className="btn-wraper pt-3 text-right">
                            <Button
                                className={`w-120 ${isRemove ? 'danger-btn-rounded-def' : 'blue-btn-rounded-def'}`}
                                onClick={onButtonClick}
                                loading={loader}
                                disabled={loader}
                            >
                                {buttonText}
                            </Button>
                            <Button
                                className="blue-bordr-btn-round-def w-120"
                                onClick={closeModal}
                            >
                                Cancel
                            </Button>
                        </div>
                    )
                }
            </Modal.Content>
        </Modal>
    );
};

ManageModal.defaultProps = {
    buttonText: '',
    closeModal: () => {},
    isRemove: false,
    isSingleAdmin: false,
    loader: false,
    modalDescription: '',
    modalHeader: '',
    onButtonClick: () => {},
    showModal: false,
};

export default ManageModal;
