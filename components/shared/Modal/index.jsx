import React from 'react';
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
            errorMessage: null,
            isDefaultChecked: (!_isEmpty(props.taxReceipt) && !_isEmpty(props.taxReceipt.attributes))? props.taxReceipt.attributes.isDefault : false,
            selectedTaxReceiptProfile: _merge({}, props.taxReceipt),
            showFormData: true,
            statusMessage: false,
            validity: this.intializeValidations(),
        };
        this.handleDisplayForm = this.handleDisplayForm.bind(this);
        this.handleChildInputChange = this.handleChildInputChange.bind(this);
        this.handleChildOnBlurChange = this.handleChildOnBlurChange.bind(this);
        this.renderCheckBox = this.renderCheckBox.bind(this);
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
            buttonClicked,
            errorMessage,
            isDefaultChecked,
            statusMessage,
        } = this.state;
        const isValid = this.validateForm();
        if (isValid) {
            const {
                selectedTaxReceiptProfile,
            } = this.state;

            updateTaxReceiptProfile(selectedTaxReceiptProfile, action).then(() => {
                if (isDefaultChecked) {
                    getTaxReceiptProfileMakeDefault(selectedTaxReceiptProfile.id).then(() => {
                        selectedTaxReceiptProfile.attributes.isDefault = isDefaultChecked;
                        dispatch({
                            payload: {
                                editedTaxProfile: selectedTaxReceiptProfile,
                            },
                            type: 'UPDATE_TAX_RECEIPT_PROFILE',
                        });
                    })
                } else {
                    dispatch({
                        payload: {
                            editedTaxProfile: selectedTaxReceiptProfile,
                        },
                        type: 'UPDATE_TAX_RECEIPT_PROFILE',
                    });
                    
                }
                handleModalOpen(true);
                this.setState({
                    buttonClicked: false,
                    errorMessage: null,
                    statusMessage: true,
                });
               
            }).catch((err) => {
                handleModalOpen(true);
                this.setState({
                    buttonClicked: false,
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

    renderContinueButton() {
        const {
            buttonClicked,
        } = this.state;
        const {
            action,
        } = this.props;
        return (
            <Button primary disabled={buttonClicked} onClick={() => this.handleSubmit()} className="blue-btn-rounded">{action === 'update' ? 'Update' : 'Add'}</Button>
        );
    }

    renderCheckBox(selectedTaxReceiptProfile) {
        const {
            isDefaultChecked,
        } = this.state;
        if (!_isEmpty(selectedTaxReceiptProfile) && !_isEmpty(selectedTaxReceiptProfile.attributes) && selectedTaxReceiptProfile.attributes.isDefault) {
            return (
                <Checkbox
                    checked
                    type="checkbox"
                    id="checkbox"
                    onClick={() => { this.setState({ isDefaultChecked: !isDefaultChecked }); }}
                    label="Set as default tax receipt recipient"
                />
            );
        // eslint-disable-next-line no-else-return
        } else {
            return (
                <Checkbox
                    type="checkbox"
                    id="checkbox"
                    onClick={() => { this.setState({ isDefaultChecked: !isDefaultChecked }); }}
                    label="Set as default tax receipt recipient"
                />
            );
        }
    }

    render() {
        const {
            errorMessage,
            selectedTaxReceiptProfile,
            showFormData,
            statusMessage,
            validity,
        } = this.state;
        const {
            action,
            handleModalOpen,
            isSelectPhotoModalOpen,
            name,
            t,
        } = this.props;
        const formatMessage = t;
        return (
            <Modal size="tiny" dimmer="inverted" className="chimp-modal" closeIcon open={isSelectPhotoModalOpen} onClose={() => { handleModalOpen(false); }}>
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
        );
    }
}
export default withTranslation('taxReceipt')(ModalComponent);
