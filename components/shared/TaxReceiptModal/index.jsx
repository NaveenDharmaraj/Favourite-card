import React, { Fragment } from 'react';
import {
    Button,
    Checkbox,
    Form,
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
            isDefaultChecked:false,
            selectedTaxReceiptProfile: this.intializeFormData,
            validity: this.intializeValidations(),
        };
        this.handleChildInputChange = this.handleChildInputChange.bind(this);
        this.handleChildOnBlurChange = this.handleChildOnBlurChange.bind(this);
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

    handleChildInputChange(name, value) {
        const {
            selectedTaxReceiptProfile:{
                attributes,
            },
        } = this.state;
        if (name === 'country') {
            attributes.province = '';
        }
        attributes[name] = value;
        this.setState({
            buttonClicked: false,
            selectedTaxReceiptProfile: {
                ...this.state.selectedTaxReceiptProfile,
                attributes: {
                    ...attributes,
                },
            },
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
            this.setState({
                buttonClicked: true,
            });
            handleAddNewTaxReceipt(flowObject,selectedTaxReceiptProfile,isDefaultChecked)
            .then(()=>{
                this.setState({
                    buttonClicked: false,
                });
            });
        }
    }

    renderContinueButton() {
        const {
            buttonClicked,
        } = this.state;
        return (
            <Button primary disabled={buttonClicked} onClick={() => this.handleSubmit()} className="blue-btn-rounded w-120">Add</Button>
        );
    }

    render() {
        const {
            selectedTaxReceiptProfile,
            validity,
            isDefaultChecked,
        } = this.state;
        const {
            handleModalClose,
            isTaxReceiptModelOpen,
            name,
            t,
        } = this.props;
        const formatMessage = t;
        return (
            <Fragment>
            <Modal size="tiny" dimmer="inverted" className="chimp-modal" closeIcon open={isTaxReceiptModelOpen} onClose={handleModalClose }>
                <Modal.Header>{name}</Modal.Header>
                <Modal.Content>
                    <Modal.Description className="font-s-16">
                        <Form>
                            <Form.Field>
                                <TaxReceiptFrom
                                    data={selectedTaxReceiptProfile}
                                    showFormData={true}
                                    formatMessage={formatMessage}
                                    parentInputChange={this.handleChildInputChange}
                                    parentOnBlurChange={this.handleChildOnBlurChange}
                                    validity={validity}
                                />
                            </Form.Field>
                            <Form.Field className="mt-2">
                            <div className="checkboxToRadio">
                                <Checkbox
                                    className="checkboxToRadio f-weight-n"
                                    type="checkbox"
                                    id="checkbox"
                                    onClick={() => { this.setState({ buttonClicked: false, isDefaultChecked: !isDefaultChecked }); }}
                                    label="Set as default tax receipt recipient"
                                />
                            </div>
                            </Form.Field>
                        </Form>
                    </Modal.Description>
                    <div className="btn-wraper pt-2 text-right">
                        {this.renderContinueButton()}
                    </div>
                </Modal.Content>
            </Modal>
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
