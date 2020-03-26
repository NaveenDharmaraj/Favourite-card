import React, { Fragment } from 'react';
import {
    Button,
    Checkbox,
    Form,
    Icon,
    Message,
    Modal,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import _every from 'lodash/every';
import _merge from 'lodash/merge';
import _isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';
import _cloneDeep from 'lodash/cloneDeep';
import PropTypes from 'prop-types';

import {
    validateTaxReceiptProfileForm,
} from '../../../helpers/give/utils';
import {
    countryOptions,
} from '../../../helpers/constants';
const TaxReceiptFrom = dynamic(() => import('../../../components/Give/TaxReceipt/TaxReceiptProfileForm'));
const ModalStatusMessage = dynamic(() => import('../ModalStatusMessage'));
import { withTranslation } from '../../../i18n';

export const actionTypes = {
    GET_ALL_COMPANY_TAX_RECEIPT_PROFILES: 'GET_ALL_COMPANY_TAX_RECEIPT_PROFILES',
    GET_ALL_USER_TAX_RECEIPT_PROFILES: 'GET_ALL_USER_TAX_RECEIPT_PROFILES',
};

class TaxReceiptModalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonClicked: true,
            errorMessage: null,
            isDefaultChecked:false,
            selectedTaxReceiptProfile: this.intializeFormData,
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

    intializeFormData = {
        attributes: {
            addressOne: '',
            addressTwo: '',
            city: '',
            country: countryOptions[0].value,
            fullName: '',
            postalCode: '',
            province: '',
        },
        relationships: {
            accountHoldable: {
                data: {
                    id: this.props.flowObject.giveData.giveTo.id,
                    type: this.props.flowObject.giveData.giveTo.type,
                },
            },
        },
        type: 'taxReceiptProfiles',
    };

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
            flowObject,
            handleAddNewTaxReceipt
        } = this.props;
        const {
            isDefaultChecked,
            selectedTaxReceiptProfile,

        } = this.state;
        const isValid = this.validateForm();
        if (isValid) {
            handleAddNewTaxReceipt(flowObject,selectedTaxReceiptProfile,isDefaultChecked);
            
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
            <Button primary disabled={buttonClicked} onClick={() => this.handleSubmit()} className="blue-btn-rounded w-120">Add</Button>
        );
    }

    renderCheckBox(selectedTaxReceiptProfile) {
        const {
            isDefaultChecked,
        } = this.state;
        if (!_isEmpty(selectedTaxReceiptProfile) && !_isEmpty(selectedTaxReceiptProfile.attributes) && selectedTaxReceiptProfile.attributes.isDefault) {
            return (
                <div className="checkboxToRadio">
                    <Checkbox
                        className=" f-weight-n"
                        checked
                        type="checkbox"
                        id="checkbox"
                        label="Set as default tax receipt recipient"
                    />
                </div>
                
            );
        // eslint-disable-next-line no-else-return
        } else {
            return (
                <div className="checkboxToRadio">
                    <Checkbox
                        className="checkboxToRadio f-weight-n"
                        type="checkbox"
                        id="checkbox"
                        onClick={() => { this.setState({ buttonClicked: false, isDefaultChecked: !isDefaultChecked }); }}
                        label="Set as default tax receipt recipient"
                    />
                </div>
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
                {/* {statusMessage
                && (
                       <ModalStatusMessage 
                       error = {!_isEmpty(errorMessage) ? errorMessage : null}
                       />
                )
                } */}
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
                    <Modal.Description className="font-s-14">If you discard, you will lose your edits.</Modal.Description>
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
TaxReceiptModalComponent.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.string,
    }),
};

TaxReceiptModalComponent.defaultProps = {
    currentUser: {
        id: null,
    },
};
const mapStateToProps = (state) => ({
    currentUser: state.user.info,
});
export default withTranslation(['taxReceipt'])(connect(mapStateToProps)(TaxReceiptModalComponent));
