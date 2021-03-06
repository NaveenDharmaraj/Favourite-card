import React from 'react';
import {
    Modal,
    Button,
} from 'semantic-ui-react';
import {
    func,
    bool,
} from 'prop-types';

import { withTranslation } from '../../i18n';

const GroupJoinModal = (props) => {
    const {
        open,
        close,
        handleJoinGroup,
        showJoinLoader,
        t: formatMessage,
    } = props;

    return (
        <Modal
            size="my_model"
            dimmer="inverted"
            className="chimp-modal"
            closeIcon
            open={open}
            onClose={close}
        >
            <Modal.Header>
                {formatMessage('groupProfile:joinGroupModalHeader')}
            </Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <p>{formatMessage('groupProfile:joinGroupModalDescription')}</p>
                </Modal.Description>
                <div className="btn-wraper pt-3 text-center">
                    <Button
                        className="blue-bordr-btn-round-def btn_joinGroup"
                        content={formatMessage('groupProfile:joinGroup')}
                        onClick={handleJoinGroup}
                        disabled={showJoinLoader}
                    />
                </div>
            </Modal.Content>
        </Modal>
    );
};

GroupJoinModal.defaultProps = {
    close: () => {},
    handleJoinGroup: () => {},
    open: () => {},
    showJoinLoader: false,
    t: () => {},
};

GroupJoinModal.propTypes = {
    close: func,
    handleJoinGroup: func,
    open: func,
    showJoinLoader: bool,
    t: func,
};

export default withTranslation('groupProfile')(GroupJoinModal);
