import { useEffect, useState } from 'react';
import { Button, Form, Icon, Input, Modal, TextArea } from "semantic-ui-react";

import {
    addModalDescriptionLimit,
    initializeAddSectionModalObject,
    intializeValidity,
    validateCreateGivingGroup,
    isValidText,
} from '../../../helpers/createGrouputils';
import TextAreaWithInfo from '../../shared/TextAreaWithInfo';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';

const CreateGivingGroupAddSectionModal = ({
    showModal,
    handleParentModalClick,
    addModalSectionObject,
    formatMessage,
    isEdit,
}) => {
    //initialzing the add modal object 
    const [addModalObj, setAddModalObj] = useState(addModalSectionObject);

    //intializing validitity object
    const [validity, setValidity] = useState(intializeValidity);
    const [disableContinue, setDisableContinue] = useState(true);

    useEffect(() => {
        setAddModalObj(addModalSectionObject);
        setDisableContinue(true);
    }, [addModalSectionObject]);

    const handleOnChange = (event, data) => {
        const {
            name,
            value
        } = data || event.target;
        if (isValidText(value)) {
            setAddModalObj({
                ...addModalObj,
                [name]: value,
            });
            setDisableContinue(false);
            setValidity(validateCreateGivingGroup(validity, name, value));
        }
    };

    const handleOnBlur = (event, data) => {
        const {
            name,
            value
        } = data || event.target;
        setValidity(validateCreateGivingGroup(validity, name, value));
    };
    const handleOnModalClick = (modalState, buttonClicked = '') => {
        setValidity({
            doesDescriptionNotExist: true,
            doesNameExist: true,
            hasValidLength: true,
            isNotEmpty: true,
            isSectionNotEmpty: true,
        });
        setAddModalObj({ purpose: '', description: '' });
        setDisableContinue(true);
        handleParentModalClick(modalState, buttonClicked === 'add' ? addModalObj : {});
    };
    return (
        <Modal
            className="chimp-modal addAbout-Modal"
            closeIcon
            size="small"
            open={showModal}
            onClose={() => { handleOnModalClick(false, 'cancel') }}
            trigger={
                <Button
                    className='light-blue-btn-bordered addBtn'
                    onClick={() => handleOnModalClick(true, '')}
                >
                    <span><Icon className='plus' />{formatMessage('createGivingGroupAbout.addSectionModalHeader')}</span>
                </Button>
            }
            dimmer="inverted"
        >
            {isEdit
            ? (
                <Modal.Header>Edit section</Modal.Header>
            ): (
                <Modal.Header>{formatMessage('createGivingGroupAbout.addSectionModalHeader')}</Modal.Header>
            )}
            <Modal.Content>
                <p>{formatMessage('createGivingGroupAbout.addSectionModalDescription')}</p>
                <Form>
                    <div className="requiredfield field">
                        <Form.Field
                            id='form-input-control-Section-title'
                            control={Input}
                            label={formatMessage('createGivingGroupAbout.addSectionModalTile')}
                            placeholder={formatMessage('createGivingGroupAbout.addSectionModalSectionTitlePlaceholder')}
                            value={addModalObj.purpose}
                            name='purpose'
                            onChange={handleOnChange}
                            onBlur={handleOnBlur}
                            error={!validity.doesNameExist}
                        />
                        <FormValidationErrorMessage
                            condition={!validity.hasValidLength}
                            errorMessage='Field should not exceed 300 characters'
                        />
                        <FormValidationErrorMessage
                            condition={!validity.doesNameExist}
                            errorMessage='The field is required'
                        />
                        <FormValidationErrorMessage
                            condition={!validity.isNotEmpty}
                            errorMessage='The field should not be empty space'
                        />
                    </div>
                    <div className='requiredfield field'>
                        <label>{formatMessage('createGivingGroupAbout.addSectionModalSectionDescription')}</label>
                        <Form.Field
                            control={TextAreaWithInfo}
                            value={addModalObj.description}
                            name='description'
                            onChange={handleOnChange}
                            onBlur={handleOnBlur}
                            error={!validity.doesDescriptionNotExist}
                            maxLength={addModalDescriptionLimit}
                            info={`${addModalObj.description.length}/10,000`}
                        />
                        <FormValidationErrorMessage
                            condition={!validity.doesDescriptionNotExist}
                            errorMessage='The field is required'
                        />
                        <FormValidationErrorMessage
                            condition={!validity.isSectionNotEmpty}
                            errorMessage='The field should not be empty space'
                        />
                    </div>
                    <div className='buttonsWrap'>
                        <Button
                            className='blue-btn-rounded-def'
                            disabled={
                                disableContinue || !validity.doesNameExist || !validity.doesDescriptionNotExist
                                || !validity.hasValidLength || !validity.isNotEmpty
                                || (addModalObj.purpose !== '' && addModalObj.description === '')
                                || (addModalObj.purpose === '' && addModalObj.description !== '')
                            }
                            onClick={() => handleOnModalClick(false, 'add')}
                        >
                            {isEdit ? 'Save' : formatMessage('addButton')}
                        </Button>
                        <Button
                            className='blue-bordr-btn-round-def'
                            onClick={() => handleOnModalClick(false, 'cancel')}
                        >
                            {formatMessage('cancelButton')}
                        </Button>
                    </div>
                </Form>
            </Modal.Content>
        </Modal>

    )
};

CreateGivingGroupAddSectionModal.defaultProps = {
    addModalSectionObject: initializeAddSectionModalObject,
    formatMessage: () => { },
    handleParentModalClick: () => { },
    modalTitle: '',
    showModal: false,
}
export default React.memo(CreateGivingGroupAddSectionModal);
