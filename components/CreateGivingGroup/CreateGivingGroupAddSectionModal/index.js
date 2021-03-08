import { useEffect, useState } from 'react';
import { Button, Form, Icon, Input, Modal, TextArea } from "semantic-ui-react";
import { addModalDescriptionLimit, initializeAddSectionModalObject, intializeValidity, ValidateCreateGivingGroup } from "../../../helpers/createGrouputils";
import _isEmpty from 'lodash/isEmpty';

const CreateGivingGroupAddSectionModal = ({
    showModal,
    handleParentModalClick,
    addModalSectionObject,
    formatMessage,
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
        setAddModalObj({
            ...addModalObj,
            [name]: value
        });
        setDisableContinue(false);
        setValidity(ValidateCreateGivingGroup(validity, name, value))
    };

    const handleOnBlur = (event, data) => {
        const {
            name,
            value
        } = data || event.target;
        setValidity(ValidateCreateGivingGroup(validity, name, value))
    };
    const handleOnModalClick = (modalState, buttonClicked = '') => {
        setValidity({
            doesNameExist: true,
            doesDescriptionNotExist: true,
        });
        setAddModalObj({ purpose: '', description: '' });
        setDisableContinue(true);
        handleParentModalClick(modalState, buttonClicked === 'add' ? addModalObj : {});
    }
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
                    <span><Icon className='plus' />{formatMessage('createGivingGroupAbout.addSectionModalAddButton')}</span>
                </Button>
            }
            dimmer="inverted"
        >
            <Modal.Header>{formatMessage('createGivingGroupAbout.addSectionModalHeader')}</Modal.Header>
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
                        {!validity.doesNameExist &&
                            <p className="error-message">
                                <Icon name="exclamation circle" />
                             The field is required
                        </p>
                        }
                    </div>
                    <div className='requiredfield field'>
                        <label>{formatMessage('createGivingGroupAbout.addSectionModalSectionDescription')}</label>
                        <Form.Field
                            control={TextArea}
                            value={addModalObj.description}
                            name='description'
                            onChange={handleOnChange}
                            onBlur={handleOnBlur}
                            error={!validity.doesDescriptionNotExist}
                            maxLength={addModalDescriptionLimit}
                        />
                        <div className='fieldInfoWrap'>
                            <p className="error-message">
                                {!validity.doesDescriptionNotExist &&
                                    (
                                        <>
                                            <Icon name="exclamation circle" />
                                            The field is required
                                        </>
                                    )
                                }
                            </p>
                            <div class="field-info">{addModalObj.description.length}/10,000</div>
                        </div>
                    </div>
                    <div className='buttonsWrap'>
                        <Button
                            className='blue-btn-rounded-def'
                            disabled={
                                disableContinue || !validity.doesNameExist || !validity.doesDescriptionNotExist
                                || (addModalObj.purpose !== '' && addModalObj.description === '')
                                || (addModalObj.purpose === '' && addModalObj.description !== '')
                            }
                            onClick={() => handleOnModalClick(false, 'add')}
                        >
                            {formatMessage('addButton')}
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
