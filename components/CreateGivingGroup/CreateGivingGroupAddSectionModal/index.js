import { useEffect, useState } from 'react';
import { Button, Form, Icon, Input, Modal, TextArea } from "semantic-ui-react";
import { addModalDescriptionLimit, initializeAddSectionModalObject, intializeValidity, ValidateCreateGivingGroup } from "../../../helpers/createGrouputils";
import _isEmpty from 'lodash/isEmpty';

const CreateGivingGroupAddSectionModal = ({
    showModal,
    handleParentModalClick,
    addModalSectionObject,
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
        setAddModalObj({ name: '', description: '' });
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
                    <span><Icon className='plus' />Add about section</span>
                </Button>
            }
            dimmer="inverted"
        >
            <Modal.Header>Add section</Modal.Header>
            <Modal.Content>
                <p>Use this section to add more information about your group, such as information about your group's organizers or how people can help.</p>
                <Form>
                    <div className="requiredfield field">
                        <Form.Field
                            id='form-input-control-Section-title'
                            control={Input}
                            label='Section title'
                            placeholder='How to help'
                            value={addModalObj.name}
                            name='name'
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
                        <label>Description</label>
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
                            <div class="field-info">{addModalObj.description.length} of 10,000</div>
                        </div>
                    </div>
                    <div className='buttonsWrap'>
                        <Button
                            className='blue-btn-rounded-def'
                            disabled={
                                disableContinue || !validity.doesNameExist || !validity.doesDescriptionNotExist
                                || (addModalObj.name !== '' && addModalObj.description === '')
                                || (addModalObj.name === '' && addModalObj.description !== '')
                            }
                            onClick={() => handleOnModalClick(false, 'add')}
                        >
                            Add
                        </Button>
                        <Button
                            className='blue-bordr-btn-round-def'
                            onClick={() => handleOnModalClick(false, 'cancel')}
                        >
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Modal.Content>
        </Modal>

    )
};

CreateGivingGroupAddSectionModal.defaultProps = {
    addModalSectionObject: initializeAddSectionModalObject,
    handleParentModalClick: () => { },
    modalTitle: '',
    showModal: false,
}
export default React.memo(CreateGivingGroupAddSectionModal);
