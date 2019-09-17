import React, { Fragment } from 'react';
import {
    Button,
    Checkbox,
    Form,
    Icon,
    Message,
    Modal,
} from 'semantic-ui-react';
import _every from 'lodash/every';
import _merge from 'lodash/merge';
import _isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';
import _cloneDeep from 'lodash/cloneDeep';

import {
    validateTaxReceiptProfileForm,
} from '../../../helpers/give/utils';
import {
    updateTaxReceiptProfile,
} from '../../../actions/user';
import {
    getTaxReceiptProfileMakeDefault,
} from '../../../actions/taxreceipt';
const TaxReceiptFrom = dynamic(() => import('../../../components/Give/TaxReceipt/TaxReceiptProfileForm'));
const ModalStatusMessage = dynamic(() => import('../ModalStatusMessage'));
import { withTranslation } from '../../../i18n';


class ModalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonClicked: true,
            errorMessage: null,
            isDefaultChecked: (!_isEmpty(props.taxReceipt) && !_isEmpty(props.taxReceipt.attributes))? props.taxReceipt.attributes.isDefault : false,
            selectedTaxReceiptProfile: _cloneDeep(props.taxReceipt),
            showFormData: true,
            showPopUp: false,
            statusMessage: false,
            validity: this.intializeValidations(),
        };
        this.handleDisplayForm = this.handleDisplayForm.bind(this);
        this.handleChildInputChange = this.handleChildInputChange.bind(this);
        this.handleChildOnBlurChange = this.handleChildOnBlurChange.bind(this);
        this.handlePopUpCancel = this.handlePopUpCancel.bind(this);
        this.renderCheckBox = this.renderCheckBox.bind(this);
        this.renderPopUp = this.renderPopUp.bind(this);
    }

    intializeValidations() {
        this.validity = {
            isAddressHas2: true,
            isAddressLessThan128: true,
            isCityHas2Chars: true,
            isCityLessThan64: true,
            isFullNameHas2: true,
            isPostalCodehas5Chars: true,
            isPostalCodeLessThan16: true,
            isProvinceBlank: true,
            isValidAddress: true,
            isValidAddressFormat: true,
            isValidCity: true,
            isValidCityFormat: true,
            isValidFullName: true,
            isValidFullNameFormat: true,
            isValidPostalCode: true,
            isValidPostalCodeFormat: true,
            isValidProvince: true,
            isValidSecondAddress: true,
        };
        return this.validity;
    }

    handleDisplayForm() {
        this.setState({
            showFormData: true,
        });
    }


    handleChildInputChange(name, value) {
        const {
            selectedTaxReceiptProfile,
        } = this.state;
        const {
            attributes,
        } = selectedTaxReceiptProfile;
        if (name === 'country') {
            attributes.province = '';
        }
        attributes[name] = value;
        this.setState({
            buttonClicked: false,
            selectedTaxReceiptProfile: {
                ...selectedTaxReceiptProfile,
                attributes: {
                    ...attributes,
                },
            },
            statusMessage: false,
        });
    }

    handleChildOnBlurChange(name, value) {
        let {
            validity,
        } = this.state;
        validity = validateTaxReceiptProfileForm(name, value, validity);
        this.setState({
            validity,
        });
    }


    validateForm() {
        let {
            validity
        } = this.state;
        const {
            selectedTaxReceiptProfile: {
                attributes: {
                    addressOne,
                    city,
                    fullName,
                    postalCode,
                    province,
                },
            },
        } = this.state;
        validity = validateTaxReceiptProfileForm('fullName', fullName, validity);
        validity = validateTaxReceiptProfileForm('addressOne', addressOne, validity);
        validity = validateTaxReceiptProfileForm('city', city, validity);
        validity = validateTaxReceiptProfileForm('postalCode', postalCode, validity);
        validity = validateTaxReceiptProfileForm('province', province, validity);
        this.setState({
            validity,
        });

        return _every(validity);
    }

    handleSubmit() {
        this.setState({
            buttonClicked: true,
        });
        const {
            action,
            dispatch,
            handleModalOpen,
        } = this.props;
        const {
            isDefaultChecked,
        } = this.state;
        const isValid = this.validateForm();
        if (isValid) {
            const {
                selectedTaxReceiptProfile,
            } = this.state;

            updateTaxReceiptProfile(selectedTaxReceiptProfile, action).then((result) => {
                const {
                    id,
                } = result.data;
                if (isDefaultChecked) {
                    getTaxReceiptProfileMakeDefault(id).then((response) => {
                        const {
                            attributes,
                        } = response.data;
                        attributes.isDefault = isDefaultChecked;
                        dispatch({
                            payload: {
                                editedTaxProfile: response.data,
                            },
                            type: 'UPDATE_TAX_RECEIPT_PROFILE',
                        });
                    })
                } else {
                    dispatch({
                        payload: {
                            editedTaxProfile: {...selectedTaxReceiptProfile, id},
                        },
                        type: 'UPDATE_TAX_RECEIPT_PROFILE',
                    });
                    
                }
                handleModalOpen(true);
                this.setState({
                    buttonClicked: true,
                    errorMessage: null,
                    statusMessage: true,
                });
               
            }).catch((err) => {
                handleModalOpen(true);
                this.setState({
                    buttonClicked: true,
                    errorMessage: 'Error in saving the profile.',
                    statusMessage: true,
                })
            });
        } else {
            this.setState({
                buttonClicked: false,
            });
        }
    }

    handlePopUpCancel(type){
        const {
            handleModalOpen,
        } = this.props;
        type === 'discard' ? handleModalOpen(false) :  handleModalOpen(true);
        this.setState(()=>{
            return{
                showPopUp: false,
            }
        });
    }

    renderContinueButton() {
        const {
            buttonClicked,
        } = this.state;
        const {
            action,
        } = this.props;
        return (
            <Button primary disabled={buttonClicked} onClick={() => this.handleSubmit()} className="blue-btn-rounded w-120">{action === 'update' ? 'Done' : 'Add'}</Button>
        );
    }

    renderCheckBox(selectedTaxReceiptProfile) {
        const {
            isDefaultChecked,
        } = this.state;
        if (!_isEmpty(selectedTaxReceiptProfile) && !_isEmpty(selectedTaxReceiptProfile.attributes) && selectedTaxReceiptProfile.attributes.isDefault) {
            return (
                <Checkbox
                    className="cp_chkbx f-weight-n"
                    checked
                    type="checkbox"
                    id="checkbox"
                    label="Set as default tax receipt recipient"
                />
            );
        // eslint-disable-next-line no-else-return
        } else {
            return (
                <Checkbox
                className="cp_chkbx f-weight-n"
                    type="checkbox"
                    id="checkbox"
                    onClick={() => { this.setState({ buttonClicked: false, isDefaultChecked: !isDefaultChecked }); }}
                    label="Set as default tax receipt recipient"
                />
            );
        }
    }
    renderPopUp(){
        const {
            buttonClicked,
        } = this.state;
        const {
            handleModalOpen
        } = this.props;
        if(!buttonClicked){
            this.setState((prevState)=>{
                return{
                    showPopUp: true,
                }
            });
        } else {
            handleModalOpen(false);
        }
        
    }



    render() {
        const {
            errorMessage,
            selectedTaxReceiptProfile,
            showFormData,
            showPopUp,
            statusMessage,
            validity,
        } = this.state;
        const {
            action,
            isSelectPhotoModalOpen,
            name,
            t,
        } = this.props;
        const formatMessage = t;
        return (
            <Fragment>
            <Modal size="tiny" dimmer="inverted" className="chimp-modal" closeIcon open={isSelectPhotoModalOpen} onClose={() => { this.renderPopUp(); }}>
                <Modal.Header>{name}</Modal.Header>
                {action === 'update' && (
                    <div className="ModalWarning">
                        <span className="warningIcon">!</span>
                Editing this recipient will not affect previously issued tax receipts.
                    </div>
                )}
                {statusMessage
                && (
                       <ModalStatusMessage 
                       error = {!_isEmpty(errorMessage) ? errorMessage : null}
                       />
                )
                }
                <Modal.Content>
                    <Modal.Description className="font-s-16">
                        <Form>
                            <Form.Field>
                                <TaxReceiptFrom
                                    data={selectedTaxReceiptProfile}
                                    showFormData={showFormData}
                                    formatMessage={formatMessage}
                                    parentInputChange={this.handleChildInputChange}
                                    parentOnBlurChange={this.handleChildOnBlurChange}
                                    validity={validity}
                                />
                            </Form.Field>
                            <Form.Field className="mt-2">
                                {this.renderCheckBox(selectedTaxReceiptProfile)}
                            </Form.Field>
                        </Form>
                    </Modal.Description>
                    <div className="btn-wraper pt-2 text-right">
                        {this.renderContinueButton()}
                    </div>
                </Modal.Content>
            </Modal>
            {showPopUp
                && <Modal size="tiny" dimmer="inverted" className="chimp-modal" closeIcon open={showPopUp} centered={false} onClose={() => { this.handlePopUpCancel('cancel') }}>
                <Modal.Header>Discard edits?</Modal.Header>
                <Modal.Content>
                    <Modal.Description className="font-s-14">if you discard, you will lose your edits.</Modal.Description>
                    <div className="btn-wraper pt-3 text-right">
                    <Button className="blue-btn-rounded-def " onClick={()=>{ this.handlePopUpCancel('discard') }}>Discard</Button>
                    <Button className="blue-bordr-btn-round-def" onClick={()=>{ this.handlePopUpCancel('cancel') }}>Cancel</Button>
                    </div>
                </Modal.Content>
            </Modal>
            } 
            </Fragment>
        );
    }
}
export default withTranslation('taxReceipt')(ModalComponent);
