import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Card, Form, Icon, Modal, TextArea, Segment, Header } from "semantic-ui-react";

import { editGivingGroupApiCall } from "../../../actions/createGivingGroup";
import { aboutDescriptionLimit, intializeCreateGivingGroup } from "../../../helpers/createGrouputils";


const EditGivingGroupDescriptionModal = ({ formatMessage, editGivingGroupObject, groupId }) => {
    const {
        attributes: {
            short
        }
    } = editGivingGroupObject;
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [editDescription, setEditDescription] = useState(short);
    const [disableSave, setDisableSave] = useState(true)
    const [doesDescriptionPresent, setDoesDescriptionPresent] = useState(true);
    const handleReset = () => {
        setShowModal(false);
        setDisableSave(true);
        setDoesDescriptionPresent(true);
    }
    const handleSave = () => {
        setDisableSave(true)
        if (editDescription === '') {
            setDoesDescriptionPresent(false)
            return;
        }
        editGivingGroupObject.attributes.short = editDescription;
        dispatch(editGivingGroupApiCall({
            'attributes': {
                'short': editDescription,
            }
        }, groupId))
            .then(() => {
                handleReset();
                setEditDescription(editDescription);
            })
            .catch(() => {
                //handle error
            });
    };

    return (
        <Modal
            className="chimp-modal addAbout-Modal"
            closeIcon
            size="small"
            open={showModal}
            onClose={() => handleReset()}
            trigger={
                <div className="group_box" onClick={() => setShowModal(true)}>
                    <h3>Group description</h3>
                    <p>{short}</p>
                </div>
            }
            dimmer="inverted"
        >
            <Modal.Header>Describe your group</Modal.Header>
            <Modal.Content>
                <p>Provide a brief summary about why you started this Giving Group.</p>
                <Form>
                    <div className='requiredfield field'>
                        <label>Group description</label>
                        <Form.Field
                            control={TextArea}
                            value={editDescription}
                            onChange={(event) => {
                                setDisableSave(false)
                                setDoesDescriptionPresent(true)
                                setEditDescription(event.target.value)
                            }}
                            onBlur={(event) => { event.target.value ? setDoesDescriptionPresent(true) : setDoesDescriptionPresent(false) }}
                            name="short"
                            error={!doesDescriptionPresent}
                            maxLength={aboutDescriptionLimit}
                        />
                        {!doesDescriptionPresent && <div className='fieldInfoWrap'>
                            <p className="error-message"><Icon name="exclamation circle" />The field is required</p>
                            <div class="field-info">{editDescription.length} {formatMessage('ofText')} 300</div>
                        </div>
                        }
                    </div>
                    <div className='buttonsWrap'>
                        <Button
                            className='blue-btn-rounded-def'
                            onClick={() => handleSave()}
                            disabled={disableSave || !doesDescriptionPresent}
                        >
                            Save
                        </Button>
                        <Button
                            className='blue-bordr-btn-round-def'
                            onClick={() => handleReset()}
                        >
                            Cancel
                            </Button>
                    </div>
                </Form>
            </Modal.Content>
        </Modal>
    );
}

EditGivingGroupDescriptionModal.defaultProps = {
    formatMessage: () => { },
    editGivingGroupObject: intializeCreateGivingGroup,
    short: ''
};

export default EditGivingGroupDescriptionModal;