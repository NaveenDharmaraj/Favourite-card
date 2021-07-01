import { useState } from 'react';
import { useDispatch } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import { Button, Card, Form, Icon, Modal, TextArea, Segment, Header } from "semantic-ui-react";

import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import { editGivingGroupApiCall } from "../../../actions/createGivingGroup";
import {
    aboutDescriptionLimit,
    intializeCreateGivingGroup,
    isValidText,
} from '../../../helpers/createGrouputils';


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
    const [isWhiteSpace, setisWhiteSpace] = useState(true);
    const handleReset = () => {
        setShowModal(false);
        setDisableSave(true);
        setDoesDescriptionPresent(true);
        setEditDescription(short);
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

    const handleOnBlur = (event) => {
        let {
            value,
        } = event.target;
        let modofiedValue = '';
        let isValid = true;
        if (value) {
            modofiedValue = value.trim();
        }
        if (!_isEmpty(value)) {
            isValid = !(modofiedValue.length === 0);
            setDoesDescriptionPresent(true);
            setisWhiteSpace(isValid);
        } else {
            setDoesDescriptionPresent(false);
        }
    };

    const handleDescriptionChange = (event) => {
        const isValid = isValidText(event.target.value);
        if (isValid) {
            setDisableSave(false);
            setDoesDescriptionPresent(true);
            setEditDescription(event.target.value);
        }
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
                            onChange={handleDescriptionChange}
                            onBlur={handleOnBlur}
                            name="short"
                            error={!doesDescriptionPresent}
                            maxLength={aboutDescriptionLimit}
                        />
                        <FormValidationErrorMessage
                            condition={!doesDescriptionPresent}
                            errorMessage="The field is required"
                        />
                        <FormValidationErrorMessage
                            condition={!isWhiteSpace}
                            errorMessage="This field should not be empty space"
                        />
                        <div className='fieldInfoWrap'>
                            <div class="field-info manage_description_modal">{`${editDescription.length}/300`}</div>
                        </div>
                    </div>
                    <div className='buttonsWrap'>
                        <Button
                            className='blue-btn-rounded-def'
                            onClick={() => handleSave()}
                            disabled={disableSave || !doesDescriptionPresent || !isWhiteSpace}
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