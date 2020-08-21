/* eslint-disable react/prefer-stateless-function */
import React, { Fragment } from 'react';
import getConfig from 'next/config';
import {
    Button,
    Checkbox,
    Form,
    Icon,
    Input,
    Modal,
    Popup,
    Select,
} from 'semantic-ui-react';
import _ from 'lodash';
import ReactHtmlParser from 'react-html-parser';
import {
    Elements,
    StripeProvider,
} from 'react-stripe-elements';

import {
    reloadDefaultProps,
} from '../../../helpers/give/defaultProps';
import {
    addNewCardAndLoad,
    addNewTaxReceiptProfileAndLoad,
    walletTopUp,
} from '../../../actions/give';
import {
    countryOptions,
} from '../../../helpers/constants';
import CreditCard from '../../shared/CreditCard';
import Note from '../../shared/Note';
import TaxReceiptDropDown from '../../shared/TaxReceiptDropDown';
import TaxReceiptFrom from '../TaxReceipt/TaxReceiptProfileForm';
import PaymentOptions from '../../shared/PaymentInstruments';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import {
    formatAmount,
    formatCurrency,
    fullMonthNames,
    getDefaultCreditCard,
    getTaxReceiptById,
    isValidGiftAmount,
    populateDonationMatch,
    validateDonationForm,
    validateTaxReceiptProfileForm,
    validateForMinReload,
} from '../../../helpers/give/utils';
const { publicRuntimeConfig } = getConfig();
const {
    STRIPE_KEY,
} = publicRuntimeConfig;
class ReloadAddAmount extends React.Component {
    constructor(props) {
        super(props);
        const defaultPropsData = _.merge({}, reloadDefaultProps);
        const payload = {
            ...defaultPropsData.reloadObject,
            giveData:{
                ...defaultPropsData.reloadObject.giveData,
                formatedDonationAmount: props.formatedDonationAmount,
                donationAmount: formatAmount(parseFloat(props.formatedDonationAmount.replace(/,/g, ''))),
                giveTo: props.giveTo,
                creditCard: getDefaultCreditCard(props.paymentInstrumentOptions),
                taxReceipt: getTaxReceiptById(props.taxReceiptsOptions,props.defaultTaxReceiptProfile.id),
            }
        };
        const reloadObject = _.cloneDeep(payload);
        this.state = {
            minReloadAmount: formatAmount(parseFloat(props.formatedDonationAmount.replace(/,/g, ''))),
            addNewCCButtonClicked: false,
            addNewTRButtonClicked: false,
            currentModalStep: 0,
            isDefaultCard: false,
            isDefaultTaxReceiptChecked:!props.taxReceiptsOptions,
            inValidCardNameValue: true,
            inValidCardNumber: true,
            inValidCvv: true,
            inValidExpirationDate: true,
            inValidNameOnCard: true,
            reloadObject: { ...reloadObject,},
            reloadButtonClicked: false,
            selectedTaxReceiptProfile: this.intializeTRFormData,
            validity: this.intializeValidations(),
            tRFormValidity:this.initializeTRFormValidations()
        };
        if (!_.isEmpty(this.props.donationMatchData)) {
            const [
                defaultMatch,
            ] = populateDonationMatch(this.props.donationMatchData, props.formatMessage, props.language);
            this.state.reloadObject.giveData.donationMatch = defaultMatch;
        }

        this.renderModalContent = this.renderModalContent.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleAddNewButtonClicked = this.handleAddNewButtonClicked.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAddNewCreditCard = this.handleAddNewCreditCard.bind(this);
        this.validateStripeCreditCardNo = this.validateStripeCreditCardNo.bind(this);
        this.validateStripeExpirationDate = this.validateStripeExpirationDate.bind(this);
        this.validateCreditCardCvv = this.validateCreditCardCvv.bind(this);
        this.validateCreditCardName = this.validateCreditCardName.bind(this);
        this.getStripeCreditCard = this.getStripeCreditCard.bind(this);
        this.handleChildInputChange = this.handleChildInputChange.bind(this)
        this.handleChildOnBlurChange = this.handleChildOnBlurChange.bind(this);
        this.handleAddNewTaxReceipt = this.handleAddNewTaxReceipt.bind(this);
        this.validateReloadAccountForm = this.validateReloadAccountForm.bind(this);
        this.renderTRModal = this.renderTRModal.bind(this);
        this.renderCCModal = this.renderCCModal.bind(this);
        this.handleSetPrimaryClick = this.handleSetPrimaryClick.bind(this);
    }

    intializeTRFormData = {
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
                    id: this.props.giveTo.id,
                    type: this.props.giveTo.type,
                },
            },
        },
        type: 'taxReceiptProfiles',
    };

    componentDidUpdate(oldProps) {
        let {
            currentModalStep,
            reloadObject:{
                giveData,
            },
            minReloadAmount,
        } = this.state
        let changeState = false;
        if (!_.isEqual(this.props, oldProps)) {
            if(!_.isEqual(this.props.formatedDonationAmount, oldProps.formatedDonationAmount)){
                giveData.formatedDonationAmount = this.props.formatedDonationAmount
                giveData.donationAmount = formatAmount(parseFloat(this.props.formatedDonationAmount.replace(/,/g, '')));
                minReloadAmount = formatAmount(parseFloat(this.props.formatedDonationAmount.replace(/,/g, '')));
                changeState = true;
            }
            if(!_.isEqual(this.props.paymentInstrumentOptions, oldProps.paymentInstrumentOptions)){
                giveData.creditCard = getDefaultCreditCard(
                    this.props.paymentInstrumentOptions,
                );
                changeState = true;
            }
            if(!_.isEqual(this.props.taxReceiptsOptions, oldProps.taxReceiptsOptions)){
                giveData.taxReceipt = getTaxReceiptById(
                    this.props.taxReceiptsOptions,
                    this.props.defaultTaxReceiptProfile.id
                );
                changeState = true;
            }
            if(!_.isEqual(this.props.giveTo, oldProps.giveTo)){
                giveData.giveTo = this.props.giveTo
                changeState = true;
            }
            if(!_.isEqual(this.props.reloadModalOpen, oldProps.reloadModalOpen)) {
                currentModalStep = this.props.reloadModalOpen;
                changeState = true;
            }
            if (changeState) {
                this.setState({
                    ...this.state,
                    currentModalStep,
                    minReloadAmount,
                    reloadObject: {
                        ...this.state.reloadObject,
                        giveData:{
                            ...this.state.reloadObject.giveData,
                            ...giveData,
                        }
                    }
                })
            }
        }
    }
    
    componentWillUnmount() {
        const defaultPropsData = _.merge({}, reloadDefaultProps);
        this.setState({
            ...this.state,
            reloadObject:_.cloneDeep(defaultPropsData),
        })
    }

    intializeValidations() {
        this.validity = {
            doesAmountExist: true,
            isAmountLessThanOneBillion: true,
            isAmountMoreThanOneDollor: true,
            isValidPositiveNumber: true,
            isAmountEnoughForAllocation: true,
            isTaxReceiptSelected: true,
            isCreditCardSelected: true,
        };
        return this.validity;
    }
    
    initializeTRFormValidations() {
        this.tRFormValidity = {
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
        }
        return this.tRFormValidity;
    }

    /**
     * validateStripeElements
     * @param {boolean} inValidCardNumber credit card number
     * @return {void}
     */
    validateStripeCreditCardNo(inValidCardNumber) {
        this.setState({ inValidCardNumber });
    }

    /**
     * validateStripeElements
     * @param {boolean} inValidExpirationDate credit card expiry date
     * @return {void}
     */
    validateStripeExpirationDate(inValidExpirationDate) {
        this.setState({ inValidExpirationDate });
    }

    /**
     * validateStripeElements
     * @param {boolean} inValidCvv credit card CVV
     * @return {void}
     */
    validateCreditCardCvv(inValidCvv) {
        this.setState({ inValidCvv });
    }

    /**     
     * @param {boolean} inValidNameOnCard credit card Name
     * @param {boolean} inValidCardNameValue credit card Name Value
     * @param {string} cardHolderName credit card Name Data
     * @return {void}
     */
    validateCreditCardName(inValidNameOnCard, inValidCardNameValue, cardHolderName) {
        let cardNameValid = inValidNameOnCard;
        if (cardHolderName.trim() === '' || cardHolderName.trim() === null) {
            cardNameValid = true;
        } else {
            this.setState({
                reloadObject: {
                    ...this.state.reloadObject,
                    cardHolderName,
                },
            });
        }
        this.setState({
            inValidCardNameValue,
            inValidNameOnCard: cardNameValid,
        });
    }

    getStripeCreditCard(data, cardHolderName) {
        this.setState({
            reloadObject: {
                ...this.state.reloadObject,
                cardHolderName,
                stripeCreditCard: data,
            }
        });
    }

    isValidCC(
        creditCard,
        inValidCardNumber,
        inValidExpirationDate,
        inValidNameOnCard,
        inValidCvv,
        inValidCardNameValue,
    ) {
        let validCC = true;
        if (creditCard.value === 0) {
            this.CreditCard.handleOnLoad(
                inValidCardNumber,
                inValidExpirationDate,
                inValidNameOnCard,
                inValidCvv,
                inValidCardNameValue,
            );
            validCC = (
                !inValidCardNumber &&
                !inValidExpirationDate &&
                !inValidNameOnCard &&
                !inValidCvv &&
                !inValidCardNameValue
            );
        }
        return validCC;
    }

    handleAddNewButtonClicked(e) {
        if (e.target.id === "addNewCreditCard") {
            this.setState({
                currentModalStep: 2,
                isDefaultCard:false,
            })
        } else if (e.target.id === "addFirstCreditCard") {
            this.setState({
                currentModalStep: 2,
                isDefaultCard: true,
            })
        } else if (e.target.id === "addNewTaxReceipt") {
            this.setState({
                currentModalStep: 3,
            });
        }
    }

    handleInputChange(event, data) {
        const {
            name,
            options,
            value,
        } = data;
        let {
            reloadObject: {
                giveData,
            },
        } = this.state;
        let newValue = (!_.isEmpty(options)) ? _.find(options, { value }) : value;
        if (giveData[name] !== newValue) {
            if (!((name === "taxReceipt" || name === "creditCard") && newValue.value === 0)) {
                giveData[name] = newValue;
                giveData.userInteracted = true;
            }
            switch (name) {
                case 'donationAmount':
                    giveData.formatedDonationAmount = newValue;
                    break;
                case 'creditCard':
                    if (newValue.value === 0) {
                        this.setState({
                            currentModalStep: 2,
                        });
                    }
                    break;
                case 'taxReceipt':
                    if (newValue.value === 0) {
                        this.setState({
                            currentModalStep: 3,
                        });
                    }
                    break;
                default: break;
            }
            this.setState({
                reloadObject: {
                    ...this.state.reloadObject,
                    giveData,
                },
            });
        }
    }

        /**
     * Synchronise form data with React state
     * @param  {Event} event The Event instance object.
     * @param  {object} options The Options of event
     * @return {Void} { void } The return nothing.
     */
    handleInputOnBlur = (event, data) => {
        event.preventDefault();
        const {
            name,
            value,
        } = !_.isEmpty(data) ? data : event.target;
        const {
            reloadObject: {
                giveData,
            },
        } = this.state;
        let {
            validity,
            minReloadAmount,
        } = this.state;
        let inputValue = value;
        const isValidNumber = /^(?:[0-9]+,)*[0-9]+(?:\.[0-9]*)?$/;
        if (name === 'donationAmount') {
            if (!_.isEmpty(value) && value.match(isValidNumber)) {
                inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
                giveData[name] = inputValue;
                giveData.formatedDonationAmount = _.replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
            }
            validity = validateDonationForm('donationAmount', inputValue, validity, giveData);
            validity = validateForMinReload(inputValue, minReloadAmount, validity)
        }
        this.setState({
            reloadObject: {
                ...this.state.reloadObject,
                giveData,
            },
            validity,
        });
    };

    handleReloadSubmit = () => {
        const {
            dispatch,
            language,
            taxReceiptsOptions,
        } =this.props;
        let {
            reloadObject,
        } = this.state;
        let {
            giveData:{
                taxReceipt,
                donationAmount,
                giveTo,
            }
        } = reloadObject;
        if(this.validateReloadAccountForm()) {
            this.setState({
                reloadButtonClicked: true,
            });
            reloadObject.selectedTaxReceiptProfile = _.find(taxReceiptsOptions, {
                'id': taxReceipt.id
            });
            const topUpAmount = formatCurrency(donationAmount, language, reloadObject.currency);
            const succesToast = (giveTo.type === 'user') ? `${topUpAmount} has been added to your Impact Account`
                : `${topUpAmount} has been added to ${giveTo.name}'s Account`;
            dispatch(walletTopUp(reloadObject, succesToast)).then(()=>{
                this.setState({
                    currentModalStep: 0,
                    reloadButtonClicked: false,
                })
            }).catch(()=> {
                this.setState({
                    reloadButtonClicked:false,
                })
            });
        }
            
    }

    handleModalClose(currentModalStep) {
        let {
            addNewCCButtonClicked,
            addNewTRButtonClicked,
            reloadButtonClicked,
        } = this.state;
        if(!addNewCCButtonClicked && !addNewTRButtonClicked && !reloadButtonClicked) {
            if (currentModalStep !== 1) {
                this.setState({
                    currentModalStep: 1,
                });
            } else if (currentModalStep === 1) {
                this.setState({
                    currentModalStep: 0,
                });
            }
        }

    }

    modalContentChange(nextStep) {
        this.setState({
            currentModalStep: nextStep,
        });
    }

    handleSetPrimaryClick(event, data) {   
        let {
            isDefaultCard,
        } = this.state;      
        isDefaultCard = data.checked;
        this.setState({ isDefaultCard });
    }

    handleAddNewCreditCard() {
        const {
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
            isDefaultCard,
        } = this.state;
        let {
            reloadObject: {
                giveData: {
                    creditCard,
                },
            },
        } = this.state;
        const {
            reloadObject,
        } = this.state;
        
        const validateCC = this.isValidCC(
            creditCard,
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
        );
        if (validateCC) {
            this.setState({
                addNewCCButtonClicked: true,
            });
            const {
                dispatch,
            } = this.props;
            dispatch(addNewCardAndLoad(reloadObject, isDefaultCard)).then((result) => {
                const {
                    data: {
                        attributes: {
                            description,
                        },
                        id,
                    },
                } = result;
                creditCard =  _.find( this.props.paymentInstrumentOptions, {
                    'id': id
                });
                const statusMessageProps = {
                    message: 'New Credit Card Added',
                    type: 'success',
                };
                dispatch({
                    payload: {
                        errors: [
                            statusMessageProps,
                        ],
                    },
                    type: 'TRIGGER_UX_CRITICAL_ERROR',
                });
                this.setState({
                    ...this.state,
                    currentModalStep: 1,
                    addNewCCButtonClicked: false,
                    reloadObject: {
                        ...this.state.reloadObject,
                        giveData: {
                            ...this.state.reloadObject.giveData,
                            creditCard: creditCard,
                        }
                    },
                    validity: {
                        ...this.state.validity,
                        isCreditCardSelected: true,
                    }
                });
            }).catch(() => {
                this.setState({
                    addNewCCButtonClicked: false,
                });
            });
        }
    }

    validateTRForm() {
        let {
            tRFormValidity,
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
        tRFormValidity = validateTaxReceiptProfileForm('fullName', fullName, tRFormValidity);
        tRFormValidity = validateTaxReceiptProfileForm('addressOne', addressOne, tRFormValidity);
        tRFormValidity = validateTaxReceiptProfileForm('city', city, tRFormValidity);
        tRFormValidity = validateTaxReceiptProfileForm('postalCode', postalCode, tRFormValidity);
        tRFormValidity = validateTaxReceiptProfileForm('province', province, tRFormValidity);
        this.setState({
            tRFormValidity,
        });

        return _.every(tRFormValidity);
    }

    validateReloadAccountForm() {
        const {
            reloadObject: {
                giveData: {
                    creditCard,
                    donationAmount,
                    noteToSelf,
                    taxReceipt,
                },
            },
            minReloadAmount,
        } = this.state;
        let {
            validity,
        } = this.state;
        validity = validateDonationForm('donationAmount', donationAmount, validity);
        validity = validateDonationForm('noteToSelf', noteToSelf, validity);
        validity = validateForMinReload(donationAmount, minReloadAmount, validity);
        validity = validateDonationForm('taxReceipt', taxReceipt, validity );
        validity = validateDonationForm('creditCard', creditCard, validity);
        this.setState({ validity });
        return _.every(validity);
    }

    handleAddNewTaxReceipt() {
        const {
            reloadObject,
            isDefaultTaxReceiptChecked,
            selectedTaxReceiptProfile,
        } = this.state;
        const {
            dispatch,
        } = this.props;
        const isValid = this.validateTRForm();
        if (isValid) {
            this.setState({
                addNewTRButtonClicked: true,
            });
            dispatch(addNewTaxReceiptProfileAndLoad(reloadObject, selectedTaxReceiptProfile, isDefaultTaxReceiptChecked)).then((result) => {
                const {
                    data: {
                        id,
                    },
                } = result;
                let newtaxReceipt = getTaxReceiptById(this.props.taxReceiptsOptions, id);
                const statusMessageProps = {
                    message: 'New Tax receipt Added',
                    type: 'success',
                };
                
                dispatch({
                    payload: {
                        errors: [
                            statusMessageProps,
                        ],
                    },
                    type: 'TRIGGER_UX_CRITICAL_ERROR',
                });
                this.setState({
                    ...this.state,
                    reloadObject: {
                        ...this.state.reloadObject,
                        giveData: {
                            ...this.state.reloadObject.giveData,
                            taxReceipt: { ...newtaxReceipt }
                        }
                    },
                    currentModalStep: 1,
                    addNewTRButtonClicked: false,
                    validity: {
                        ...this.state.validity,
                        isTaxReceiptSelected: true,
                    }
                });
            })
            .catch((error)=>{
                this.setState({
                    addNewTRButtonClicked: false,
                });
            })
        }
    }

    renderReloadComponent(allocationGiftType, reviewBtnFlag) {
        if (allocationGiftType === 0 && !reviewBtnFlag) {
            return (
                // eslint-disable-next-line react/jsx-filename-extension
                <div className="noteDefault">
                    <div className="noteWraper">
                        <span className="leftImg">
                            <span className="notifyDefaultIcon" />
                        </span>
                        <span className="noteContent">
                            <span onClick={()=> {this.modalContentChange(1)}} className="hyperLinks-style">Reload </span>
                            your Impact Account to send this gift.
                        </span>
                    </div>
                </div>
            );
        }
        if (reviewBtnFlag) {
            return (
                <div><p className="errorNote"><Icon name="exclamation circle" />There's not enough money in your account to send this gift.<span onClick={()=> {this.modalContentChange(1)}} className="hyperLinks-style"> Add money</span> to continue.</p></div>
            );
        }
        return null;
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
            tRFormValidity,
        } = this.state;
        tRFormValidity = validateTaxReceiptProfileForm(name, value, tRFormValidity);
        this.setState({
            tRFormValidity,
        });
    }

    renderdonationMatchOptions(
        formData,
        options,
        formatMessage,
        donationMatchData,
        language,
        currency,
    ) {
        let donationMatchField = null;
        if (formData.giveTo.type === 'user' && !_.isEmpty(options)) {
            let donationMatchedData = {};
            let convertedPolicyPeriod = formatMessage('policyPeriodYear');
            const currentDate = new Date();
            let donationMonth = currentDate.getFullYear();
            if (formData.donationMatch.value > 0) {
                donationMatchedData = _.find(
                    donationMatchData, (item) => item.attributes.employeeRoleId == formData.donationMatch.value,
                );
                if (donationMatchedData.attributes.policyPeriod === 'month') {
                    convertedPolicyPeriod = formatMessage('policyPeriodMonth');
                    const months = fullMonthNames(formatMessage);
                    donationMonth = months[currentDate.getMonth()];
                }
            }
            donationMatchField = (
                <Form.Field>
                    <label htmlFor="donationMatch">
                        {formatMessage('accountTopUp:donationMatchLabel')}
                    </label>
                    <Popup
                        content={<div>{formatMessage('accountTopUp:donationsMatchPopup')}</div>}
                        position="top center"
                        trigger={
                            <Icon
                                color="blue"
                                name="question circle"
                                size="large"
                            />
                        }
                    />
                    <Form.Field
                        control={Select}
                        className="dropdownWithArrowParent"
                        id="donationMatch"
                        name="donationMatch"
                        onChange={this.handleInputChange}
                        options={options}
                        value={formData.donationMatch.value}
                    />
                    {
                        (!_.isEmpty(donationMatchedData)) ? (
                            <Form.Field>
                                <div className="recurringMsg mb-3">
                                    {formatMessage(
                                        'accountTopUp:donationMatchPolicyNote', {
                                        companyName: (!_.isEmpty(donationMatchedData.attributes.displayName))
                                            ? donationMatchedData.attributes.displayName
                                            : donationMatchedData.attributes.companyName,
                                        policyMax:
                                            formatCurrency(
                                                donationMatchedData.attributes.policyMax,
                                                language,
                                                currency,
                                            ),
                                        policyPercentage:
                                            formatCurrency((donationMatchedData.attributes.policyPercentage / 100), language, currency),
                                        policyPeriod: convertedPolicyPeriod,
                                    },
                                    )}
                                    <br />
                                    {formatMessage('accountTopUp:donationMatchNote', {
                                        companyName: (!_.isEmpty(donationMatchedData.attributes.displayName))
                                        ? donationMatchedData.attributes.displayName
                                        : donationMatchedData.attributes.companyName,
                                        donationMonth: donationMonth,
                                        totalMatched:
                                            formatCurrency(
                                                donationMatchedData.attributes.totalMatched,
                                                language,
                                                currency,
                                            ),
                                        totalRequested:
                                            formatCurrency(
                                                donationMatchedData.attributes.totalRequested,
                                                language,
                                                currency,
                                            ),
                                    })}
                                </div>
                            </Form.Field>
                        ) : (null)
                    }
                </Form.Field>
            );
        } else if (formData.giveTo.type === 'user' && _.isEmpty(options)) {
            donationMatchField = (<Form.Input fluid label="Matching Partner" placeholder="No matching partner available" disabled />)
        }
        return donationMatchField;
    }

    renderTRModal() {
        let {
            addNewTRButtonClicked,
            isDefaultTaxReceiptChecked,
            selectedTaxReceiptProfile,
            tRFormValidity,
        } = this.state;
        let { formatMessage,
        taxReceiptsOptions } = this.props;
        return (
            <Fragment>
                <Form>
                    <Form.Field>
                        <TaxReceiptFrom
                            data={selectedTaxReceiptProfile}
                            showFormData={true}
                            parentInputChange={this.handleChildInputChange}
                            parentOnBlurChange={this.handleChildOnBlurChange}
                            validity={tRFormValidity}
                        />
                    </Form.Field>
                    <Form.Field className="mt-2">
                    <div className="checkboxToRadio">
                        <Checkbox
                            className="checkboxToRadio f-weight-n"
                            type="checkbox"
                            id="checkbox"
                            checked={isDefaultTaxReceiptChecked}
                            disabled={!taxReceiptsOptions}
                            onClick={() => { this.setState({isDefaultTaxReceiptChecked: !isDefaultTaxReceiptChecked }); }}
                            label="Set as default tax receipt recipient"
                        />
                    </div>
                    </Form.Field>
                </Form>
                <Button 
                    primary 
                    onClick={() => this.handleAddNewTaxReceipt()} 
                    className="blue-btn-rounded w-120 mb-2 btn_right"
                    disabled={addNewTRButtonClicked}
                >
                    Done
                </Button>
            </Fragment>
        );
    }

    renderCCModal() {
        let {
            addNewCCButtonClicked,
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
            isDefaultCard,
        } = this.state;
        let { 
            formatMessage,
            paymentInstrumentOptions,
        } = this.props;
        return(
            <Fragment>
                <Form>
                    <StripeProvider apiKey={STRIPE_KEY}>
                        <Elements>
                            <CreditCard
                                creditCardElement={this.getStripeCreditCard}
                                creditCardValidate={inValidCardNumber}
                                creditCardExpiryValidate={inValidExpirationDate}
                                creditCardNameValidte={inValidNameOnCard}
                                creditCardNameValueValidate={inValidCardNameValue}
                                creditCardCvvValidate={inValidCvv}
                                validateCCNo={this.validateStripeCreditCardNo}
                                validateExpiraton={this.validateStripeExpirationDate}
                                validateCvv={this.validateCreditCardCvv}
                                validateCardName={this.validateCreditCardName}
                                formatMessage={formatMessage}
                                // eslint-disable-next-line no-return-assign
                                onRef={(ref) => (this.CreditCard = ref)}
                            />
                        </Elements>
                    </StripeProvider>
                    <Form.Field
                        checked={isDefaultCard}
                        control={Checkbox}
                        className="ui checkbox chkMarginBtm checkboxToRadio"
                        disabled={!paymentInstrumentOptions}
                        id="isDefaultCard"
                        label="Set as primary card"
                        name="isDefaultCard"
                        onChange={this.handleSetPrimaryClick}
                    />
                </Form>
                <div className="btn-wraper pt-3 text-right">
                    <Button
                        className="blue-btn-rounded-def sizeBig w-180"
                        onClick={this.handleAddNewCreditCard}
                        disabled={addNewCCButtonClicked}
                    >
                        Done
                    </Button>
                </div>
            </Fragment>
        );
    }

    renderModalContent() {
        const {
            currentModalStep,
            reloadObject: {
                giveData,
                currency,
            },
            validity,
            minReloadAmount,
        } = this.state;
        const {
            donationMatchData,
            formatMessage,
            language,
            paymentInstrumentOptions,
            taxReceiptsOptions
        } = this.props;
        let modalContent = null;
        const donationMatchOptions = populateDonationMatch(donationMatchData, formatMessage, language);
        if (currentModalStep === 1) {
            modalContent = (
                <>
                    <Form onSubmit={this.handleReloadSubmit}>
                    <label htmlFor="donationAmount">
                        {formatMessage('giveCommon:amountLabel')}
                    </label>
                        <Form.Field className="mb-3">
                            <Form.Field
                                control={Input}
                                id={"donationAmount"}
                                error={!isValidGiftAmount(validity) || !validity.isAmountEnoughForAllocation}
                                icon="dollar"
                                iconPosition="left"
                                name="donationAmount"
                                maxLength="8"
                                onBlur={this.handleInputOnBlur}
                                onChange={this.handleInputChange}
                                placeholder={formatMessage('giveCommon:amountPlaceHolder')}
                                size="large"
                                value={giveData.formatedDonationAmount}
                            />
                            <FormValidationErrorMessage
                                condition={!validity.doesAmountExist || !validity.isAmountMoreThanOneDollor
                                || !validity.isValidPositiveNumber || !validity.isAmountEnoughForAllocation}
                                errorMessage={formatMessage('giveCommon:errorMessages.amountLessOrInvalid', {
                                    minAmount: minReloadAmount,
                                })}
                            />
                            <FormValidationErrorMessage
                                condition={!validity.isAmountLessThanOneBillion}
                                errorMessage={ReactHtmlParser(formatMessage('giveCommon:errorMessages.invalidMaxAmountError'))}
                            />
                        </Form.Field>
                        <PaymentOptions
                            creditCard={giveData.creditCard}
                            giveTo={giveData.giveTo}
                            formatMessage={formatMessage}
                            handleAddNewButtonClicked={this.handleAddNewButtonClicked}
                            handleInputChange={this.handleInputChange}
                            options={paymentInstrumentOptions}
                            validity={validity}
                        />
                        <TaxReceiptDropDown
                            giveTo={giveData.giveTo}
                            formatMessage={formatMessage}
                            handleAddNewButtonClicked={this.handleAddNewButtonClicked}
                            handleInputChange={this.handleInputChange}
                            taxReceipt={giveData.taxReceipt}
                            taxReceiptsOptions={taxReceiptsOptions}
                            validity={validity}
                        />
                        {this.renderdonationMatchOptions(giveData, donationMatchOptions, formatMessage, donationMatchData, language, currency)}
                        <Note
                            fieldName="noteToSelf"
                            handleOnInputChange={this.handleInputChange}
                            handleOnInputBlur={this.handleInputOnBlur}
                            formatMessage={formatMessage}
                            labelText={formatMessage('noteTo:noteToSelfLabel')}
                            popupText={formatMessage('noteTo:donorNoteToSelfPopup')}
                            placeholderText={formatMessage('accountTopUp:noteToSelfPlaceHolder')}
                            text={giveData.noteToSelf}
                        />
                        <Button
                            primary
                            className="blue-btn-rounded btn_right mb-2"
                            // className={isMobile ? 'mobBtnPadding' : 'btnPadding'}
                            content="Add money"
                            disabled={this.state.reloadButtonClicked}
                            // fluid={isMobile}
                            onClick = {this.handleReloadSubmit}
                            type="button"
                        />
                    </Form>
                </>
            );
        } else if (currentModalStep === 2) {
            modalContent = (this.renderCCModal());
        } else if (currentModalStep === 3) {
            modalContent =( this.renderTRModal());
        }
        return modalContent;
    }

    render() {
        const {
            currentModalStep,
            reloadObject,
        } = this.state;
        const {
            allocationGiftType,
            reviewBtnFlag,
            language,
        } = this.props;
        let modalHeaderText = 'Add money';
        if (currentModalStep === 2) {
            modalHeaderText = 'Add new Credit Card';
        } else if (currentModalStep === 3) {
            modalHeaderText = 'Add new tax receipt recipient';
        }
        let formatedBalance = formatCurrency(this.props.giveTo.balance, language, reloadObject.currency);
        return (
            <Fragment>
                {this.renderReloadComponent(allocationGiftType, reviewBtnFlag)}
                <Modal size="tiny" dimmer="inverted" className="chimp-modal popbox addMoneyMoadal " open={currentModalStep >0} onClose={this.handleModalClose}>
                    <Modal.Header>{modalHeaderText} 
                        <span className="closebtn" onClick={() =>{this.handleModalClose(currentModalStep)}}>
                        </span>
                    </Modal.Header>
                    {(currentModalStep === 1) && (<div className="noteDefault-bg">
                        <div className="noteWraper">
                            <span className="leftImg">
                                <span className="notifyDefaultIcon"></span>
                            </span>
                            <span className="noteContent">
                                Add money to your Impact Account to send this gift. Your current Impact Account balance is <span className="amount-give">{formatedBalance}</span>
                            </span>
                        </div>    
                    </div>)}
                    <Modal.Content>
                        <Modal.Description className="font-s-16">
                            {this.renderModalContent()}
                        </Modal.Description>
                    </Modal.Content>
                </Modal>
            </Fragment>
        );
    }
}
export default ReloadAddAmount;
