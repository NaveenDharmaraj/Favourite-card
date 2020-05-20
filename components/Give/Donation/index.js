import React, {
    Fragment,
} from 'react';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import getConfig from 'next/config';
import _isEmpty from 'lodash/isEmpty';
import _merge from 'lodash/merge';
import {
    Container,
    Button,
    Checkbox,
    Dropdown,
    Form,
    Grid,
    Header,
    Icon,
    Input,
    Modal,
    Popup,
    Select,
} from 'semantic-ui-react';
import {
    connect,
} from 'react-redux';
import Note from '../../shared/Note';
import DropDownAccountOptions from '../../shared/DropDownAccountOptions';
import FlowBreadcrumbs from '../FlowBreadcrumbs';
import DonationAmountField from '../DonationAmountField';
import { getDonationMatchAndPaymentInstruments, } from '../../../actions/user';
import { proceed, getCompanyPaymentAndTax } from '../../../actions/give';
import {
    addNewCardAndLoad,
    addNewTaxReceiptProfileAndLoad,
} from '../../../actions/give';
import DonationFrequency from '../DonationFrequency';
import PaymentOptions from '../../shared/PaymentInstruments';
import TaxReceiptDropDown from '../../shared/TaxReceiptDropDown'
import { withTranslation } from '../../../i18n';
import { dismissAllUxCritialErrors } from '../../../actions/error';
import '../../shared/style/styles.less';
import {
    Elements,
    StripeProvider
} from 'react-stripe-elements';
import TaxReceiptModal from '../../shared/TaxReceiptModal';

const { publicRuntimeConfig } = getConfig();

const {
    STRIPE_KEY
} = publicRuntimeConfig;

import {
    donationDefaultProps,
} from '../../../helpers/give/defaultProps';
import {
    populateDonationMatch,
    populatePaymentInstrument,
    populateTaxReceipts,
    formatAmount,
    getDefaultCreditCard,
    getTaxReceiptById,
    validateDonationForm,
    fullMonthNames,
    formatCurrency,
} from '../../../helpers/give/utils';

import CreditCard from '../../shared/CreditCard';

class Donation extends React.Component {
    constructor(props) {
        super(props);
        const flowType = _.replace(props.baseUrl, /\//, '');
        let payload = null;
        //Initialize the flowObject to default value when got switched from other flows
        if (props.flowObject.type !== flowType) {
            const defaultPropsData = _merge({}, donationDefaultProps);
            payload = {
                ...defaultPropsData.flowObject,
                nextStep: props.step,
            };
        }
        else {
            const defaultPropsData = _merge({}, props.flowObject);
            payload = {
                ...defaultPropsData,
                nextStep: props.step,
            }
        }
        let flowObject = _.cloneDeep(payload);
        this.state = {
            buttonClicked: false,
            flowObject: { ...flowObject, },
            disableButton: !props.userAccountsFetched,
            inValidCardNameValue: true,
            inValidCardNumber: true,
            inValidCvv: true,
            inValidExpirationDate: true,
            inValidNameOnCard: true,
            isCreditCardModalOpen: false,
            isDefaultCard: false,
            isTaxReceiptModelOpen: false,
            validity: this.intializeValidations(),
            dropDownOptions: {},
        }
        if (props.recurringType) {
            this.state.flowObject.giveData.automaticDonation = true;
            this.state.flowObject.giveData.giftType.value = 1;
        }
        this.validateStripeCreditCardNo = this.validateStripeCreditCardNo.bind(this);
        this.validateStripeExpirationDate = this.validateStripeExpirationDate.bind(this);
        this.validateCreditCardCvv = this.validateCreditCardCvv.bind(this);
        this.validateCreditCardName = this.validateCreditCardName.bind(this);
        this.getStripeCreditCard = this.getStripeCreditCard.bind(this);
        this.handleCCAddClose = this.handleCCAddClose.bind(this);
        this.handleTaxReceiptModalClose = this.handleTaxReceiptModalClose.bind(this);
        this.handleAddNewCreditCard = this.handleAddNewCreditCard.bind(this);
        this.handleAddNewButtonClicked = this.handleAddNewButtonClicked.bind(this);
        this.handleAddNewTaxReceipt = this.handleAddNewTaxReceipt.bind(this);
        this.handleSetPrimaryClick = this.handleSetPrimaryClick.bind(this);
        dismissAllUxCritialErrors(props.dispatch);
    }
    componentDidMount() {
        const {
            dispatch,
            currentUser: {
                id,
            }
        } = this.props;
        dispatch(getDonationMatchAndPaymentInstruments(id, 'donations'));
    }

    intializeValidations() {
        this.validity = {
            doesAmountExist: true,
            isAmountLessThanOneBillion: true,
            isAmountMoreThanOneDollor: true,
            isNoteToSelfInLimit: true,
            isNoteToSelfValid: true,
            isValidAddingToSource: true,
            isValidNoteSelfText: true,
            isValidPositiveNumber: true,
            isTaxReceiptSelected: true,
            isCreditCardSelected: true,
        };
        return this.validity;
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
            flowObject: {
                giveData,
            },
        } = this.state;
        let {
            validity,
        } = this.state;
        let inputValue = value;
        const isValidNumber = /^(?:[0-9]+,)*[0-9]+(?:\.[0-9]*)?$/;
        if ((name === 'donationAmount') && !_.isEmpty(value) && value.match(isValidNumber)) {
                inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
                giveData[name] = inputValue;
                giveData.formatedDonationAmount = _.replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
        }
        if (name !== 'giveTo') {
            validity = validateDonationForm(name, inputValue, validity, giveData);
        }
        if (name === 'noteToSelf') {
            giveData[name] = inputValue.trim();
        }
        this.setState({
            flowObject: {
                ...this.state.flowObject,
                giveData,
            },
            validity,
        });
    };

    /**
     * validateForm() when click on continue on AddMoney view
     * @return {void}
     */
    validateForm() {
        const {
            flowObject: {
                giveData: {
                    creditCard,
                    giveTo,
                    donationAmount,
                    noteToSelf,
                    taxReceipt,
                },
            },
        } = this.state;
        let { validity } = this.state;
        validity = validateDonationForm('donationAmount', donationAmount, validity);
        validity = validateDonationForm('noteToSelf', noteToSelf, validity);
        validity = validateDonationForm('giveTo', giveTo.value, validity);
        validity = validateDonationForm('taxReceipt', taxReceipt, validity );
        validity = validateDonationForm('creditCard', creditCard, validity);
        this.setState({ validity });
        return _.every(validity);
    }

    handleInputChange = (event, data) => {
        const {
            name,
            options,
            value,
        } = data;
        let {
            flowObject: {
                giveData,
            },
            validity,
        } = this.state;
        const {
            i18n: {
                language,
            },
        } = this.props;
        const formatMessage = this.props.t;
        let newValue = (!_.isEmpty(options)) ? _.find(options, { value }) : value;
        let setDisableFlag = this.state.disableButton;
        if (giveData[name] !== newValue) {
            if (!((name === "taxReceipt" || name === "creditCard") && newValue.value === 0)) {
                giveData[name] = newValue;
                giveData.userInteracted = true;
            }
            switch (name) {
                case 'giveTo':
                    if (giveData.giveTo.type === 'companies') {
                        setDisableFlag = true;
                        const { dispatch } = this.props;
                        getCompanyPaymentAndTax(dispatch, Number(giveData.giveTo.id));
                        giveData.creditCard = {
                            value: null,
                        };
                        giveData.donationMatch = {
                            value: null,
                        };
                    } else {
                        giveData.creditCard = getDefaultCreditCard(populatePaymentInstrument(this.props.paymentInstrumentsData, formatMessage));
                        const [
                            defaultMatch,
                        ] = populateDonationMatch(this.props.donationMatchData, formatMessage, language);
                        giveData.donationMatch = defaultMatch;
                        setDisableFlag = false;
                        giveData.taxReceipt = getTaxReceiptById(populateTaxReceipts(this.props.userTaxReceiptProfiles, formatMessage), this.props.defaultTaxReceiptProfile.id);
                    }
                    validity = validateDonationForm(name, newValue, validity, giveData);
                    break;
                case 'donationAmount':
                    giveData.formatedDonationAmount = newValue;
                    break;
                case 'creditCard':
                    if (newValue.value === 0) {
                        this.setState({
                            isCreditCardModalOpen: true
                        })
                    }
                    break
                case 'taxReceipt':
                    if (newValue.value === 0) {
                        this.setState({ isTaxReceiptModelOpen: true });
                    }
                    break;
                default: break;
            }
            this.setState({
                disableButton: setDisableFlag,
                flowObject: {
                    ...this.state.flowObject,
                    giveData,
                },
                validity: {
                    ...this.state.validity,
                    validity,
                },
            });
        }
    }

    handleSubmit = () => {
        const {
            dispatch,
            stepIndex,
            flowSteps,
            companyDetails: {
                companyDefaultTaxReceiptProfile,
            },
            defaultTaxReceiptProfile,
        } = this.props
        const {
            flowObject,
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
        } = this.state;
        const {
            giveData: {
                giveTo,
                creditCard,
                taxReceipt,
            },
        } = flowObject;
        if(this.validateForm()) {
            const validateCC = this.isValidCC(
                creditCard,
                inValidCardNumber,
                inValidExpirationDate,
                inValidNameOnCard,
                inValidCvv,
                inValidCardNameValue,
            );
            if (validateCC) {
                let allTaxReceiptProfiles = null
                if (giveTo.type === "user") {
                    allTaxReceiptProfiles = this.props.userTaxReceiptProfiles;
                } else {
                    allTaxReceiptProfiles = this.props.companyDetails.taxReceiptProfiles
                }
                flowObject.selectedTaxReceiptProfile = _.find(allTaxReceiptProfiles, {
                    'id': taxReceipt.id
                });
                flowObject.stepsCompleted = false;
                dismissAllUxCritialErrors(this.props.dispatch);
                dispatch(proceed({
                    ...flowObject
                }, flowSteps[stepIndex + 1], stepIndex));
            }
        }
    }

    handlePresetAmountClick = (event, data) => {
        const {
            value,
        } = data;
        const inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
        const formatedDonationAmount = _.replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
        let {
            validity,
            giveData,
        } = this.state

        validity = validateDonationForm("donationAmount", inputValue, validity, giveData);

        this.setState({
            ...this.state,
            flowObject: {
                ...this.state.flowObject,
                giveData: {
                    ...this.state.flowObject.giveData,
                    donationAmount: inputValue,
                    formatedDonationAmount,
                }
            },
            validity,
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
                        {formatMessage('donationMatchLabel')}
                    </label>
                    <Popup
                        content={<div>{formatMessage('donationsMatchPopup')}</div>}
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
                                <div className="recurringMsg">
                                    {formatMessage(
                                        'donationMatchPolicyNote', {
                                        companyName:
                                            donationMatchedData.attributes.companyName,
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
                                    {formatMessage('donationMatchNote', {
                                        companyName:
                                            donationMatchedData.attributes.companyName,
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

    componentDidUpdate(oldProps) {
        let {
            flowObject,
        } = this.state;
        let {
            currency,
            giveData,
        } = flowObject
        const {
            i18n: {
                language,
            },
            defaultTaxReceiptProfile,
        } = this.props;
        const formatMessage = this.props.t;
        let doSetState = false;
        if (this.props.userAccountsFetched !== oldProps.userAccountsFetched) {
            doSetState = true;
        }
        if (giveData.giveTo.type === 'companies' && !_.isEqual(this.props.companyDetails, oldProps.companyDetails)) {
            giveData.creditCard = getDefaultCreditCard(
                populatePaymentInstrument(
                    this.props.companyDetails.companyPaymentInstrumentsData,
                    formatMessage
                ));
            giveData.taxReceipt = getTaxReceiptById(
                populateTaxReceipts(
                    this.props.companyDetails.taxReceiptProfiles,
                    formatMessage),
                this.props.companyDetails.companyDefaultTaxReceiptProfile.id
            );
            doSetState = true;
        } else if (giveData.giveTo.type === 'user') {
            if (!_.isEqual(this.props.paymentInstrumentsData, oldProps.paymentInstrumentsData)) {
                giveData.creditCard = getDefaultCreditCard(populatePaymentInstrument(this.props.paymentInstrumentsData, formatMessage));
                doSetState = true;
            }
            if (!_.isEqual(this.props.userTaxReceiptProfiles, oldProps.userTaxReceiptProfiles)) {
                giveData.taxReceipt = getTaxReceiptById(populateTaxReceipts(this.props.userTaxReceiptProfiles, formatMessage), defaultTaxReceiptProfile.id);
                doSetState = true;
            }
        }
        if ((!_.isEqual(this.props.companiesAccountsData, oldProps.companiesAccountsData)
            || _.isEmpty(this.props.companiesAccountsData)) && giveData.giveTo.value === null) {
            if (_.isEmpty(this.props.companiesAccountsData) && !_.isEmpty(this.props.fund)) {
                const {
                    fund,
                    currentUser: {
                        id,
                        attributes: {
                            avatar,
                            firstName,
                            lastName,
                        }
                    },
                } = this.props;
                giveData.giveTo = {
                    avatar,
                    balance: fund.attributes.balance,
                    disabled: false,
                    id: id,
                    name: `${firstName} ${lastName}`,
                    text: `${fund.attributes.name} (${formatCurrency(fund.attributes.balance, language, currency)})`,
                    type: 'user',
                    value: fund.id,
                };
                giveData.creditCard = getDefaultCreditCard(populatePaymentInstrument(this.props.paymentInstrumentsData, formatMessage));
                giveData.taxReceipt = getTaxReceiptById(populateTaxReceipts(this.props.userTaxReceiptProfiles, formatMessage), defaultTaxReceiptProfile.id);
                if (!_.isEmpty(this.props.donationMatchData)) {
                    const [
                        defaultMatch,
                    ] = populateDonationMatch(this.props.donationMatchData, formatMessage, language);
                    giveData.donationMatch = defaultMatch;
                }
                doSetState = true;
            }
        }
        if (doSetState) {
            this.setState({
                buttonClicked: false,
                disableButton: false,
                flowObject: {
                    ...this.state.flowObject,
                    giveData: {
                        ...this.state.flowObject.giveData,
                        ...giveData,
                    },
                },
            });
        }
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
                flowObject: {
                    ...this.state.flowObject,
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
            flowObject: {
                ...this.state.flowObject,
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

    handleAddNewButtonClicked(e, data) {
        if (e.target.id === "addNewCreditCard") {
            this.setState({
                isCreditCardModalOpen: true,
                isDefaultCard:false,
            })
        } else if (e.target.id === "addFirstCreditCard") {
            this.setState({
                isCreditCardModalOpen: true,
                isDefaultCard: true,
            })
        } else if (e.target.id === "addNewTaxReceipt") {
            this.setState({
                isTaxReceiptModelOpen: true
            })
        }
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
            flowObject: {
                giveData: {
                    creditCard,
                    giveTo
                },
            },
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
            isDefaultCard,
        } = this.state;
        const {
            flowObject,
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
                buttonClicked: true,
            });
            const {
                dispatch,
            } = this.props;
            let formatMessage = this.props.t;
            let newCreditCard = {};
            dispatch(addNewCardAndLoad(flowObject, isDefaultCard)).then((result) => {
                const {
                    data: {
                        attributes: {
                            description,
                        },
                        id,
                    },
                } = result;
                let paymentInstruments;
                if(giveData.giveTo.type === 'users') {
                    paymentInstruments = this.props.paymentInstrumentsData;
                } else if(giveData.giveTo.type === 'companies'){
                    paymentInstruments = this.props.companyDetails.companyPaymentInstrumentsData
                }
                let paymentList = populatePaymentInstrument(paymentInstruments,formatMessage);
                newCreditCard =  _.find(paymentList, {
                    'id': id
                });
                const statusMessageProps = {
                    message: 'Payment method added',
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
                    isCreditCardModalOpen: false,
                    flowObject: {
                        ...this.state.flowObject,
                        giveData: {
                            ...this.state.flowObject.giveData,
                            creditCard: newCreditCard,
                        }
                    },
                    validity:{
                        ...this.state.validity,
                        isCreditCardSelected:true,
                    }
                });
            }).catch((error) => {
                this.setState({
                    buttonClicked: false,
                });
            });
        }
    }

    handleCCAddClose() {
        this.setState({
            isCreditCardModalOpen: false
        });
    }

    handleTaxReceiptModalClose() {
        this.setState({
            isTaxReceiptModelOpen: false,
        });
    }

    handleAddNewTaxReceipt(flowObject, newTaxReceiptProfile, isDefaultChecked) {
        const {
            dispatch,
        } = this.props;
        const formatMessage = this.props.t;

        return dispatch(addNewTaxReceiptProfileAndLoad(flowObject, newTaxReceiptProfile, isDefaultChecked)).then((result) => {
            const {
                data: {
                    id,
                },
            } = result;
            let newtaxReceipt = getTaxReceiptById(populateTaxReceipts(this.props.userTaxReceiptProfiles, formatMessage), id);
            const statusMessageProps = {
                message: 'Tax receipt recipient added',
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
                flowObject: {
                    ...this.state.flowObject,
                    giveData: {
                        ...this.state.flowObject.giveData,
                        taxReceipt: { ...newtaxReceipt }
                    }
                },
                validity:{
                    ...this.state.validity,
                    isTaxReceiptSelected:true,
                }
            })
            this.handleTaxReceiptModalClose();
        }).then(() => {
            Promise.resolve('success')
        })
    }

    handlegiftTypeButtonClick = (e, { value }) => {
        this.setState({
            flowObject: {
                ...this.state.flowObject,
                giveData: {
                    ...this.state.flowObject.giveData,
                    giftType: {
                        value: value
                    },
                },
            },
        })
    }

    render() {
        const {
            buttonClicked,
            disableButton,
            dispatch,
            flowObject,
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
            isCreditCardModalOpen,
            isDefaultCard,
            isTaxReceiptModelOpen,
            validity,
        } = this.state;
        const {
            currency,
            giveData,
            type,
        } = flowObject;
        const {
            currentStep,
            donationMatchData,
            flowSteps,
            paymentInstrumentsData,
            companyDetails,
            i18n: {
                language,
            },
            userTaxReceiptProfiles,
        } = this.props;
        const formatMessage = this.props.t;
        const donationMatchOptions = populateDonationMatch(donationMatchData, formatMessage, language);
        let paymentInstruments = paymentInstrumentsData;
        let taxReceiptList = userTaxReceiptProfiles;
        if (giveData.giveTo.type === 'companies') {
            paymentInstruments = !_.isEmpty(companyDetails.companyPaymentInstrumentsData) ? companyDetails.companyPaymentInstrumentsData : [];
            taxReceiptList = !_.isEmpty(companyDetails.taxReceiptProfiles) ? companyDetails.taxReceiptProfiles : [];
        }
        const paymentInstrumenOptions = populatePaymentInstrument(paymentInstruments, formatMessage);
        const taxReceiptsOptions = populateTaxReceipts(taxReceiptList, formatMessage);
        return (
            <Fragment>
                <div className="flowReviewbanner">
                    <Container>
                        <div className="flowReviewbannerText">
                            <Header as='h2'>Add money</Header>
                        </div>
                    </Container>
                </div>
                <div className="flowReview">
                    <Container>
                        <Grid centered verticalAlign="middle">
                            <Grid.Row>
                                <Grid.Column mobile={16} tablet={14} computer={12}>
                                    <div className="flowBreadcrumb flowPadding">
                                        <FlowBreadcrumbs
                                            currentStep={currentStep}
                                            formatMessage={formatMessage}
                                            steps={flowSteps}
                                            flowType={type} />
                                    </div>
                                    <div className="flowFirst">
                                        <Form onSubmit={this.handleSubmit}>
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column mobile={16} tablet={12} computer={10}>
                                                        <DonationAmountField
                                                            amount={giveData.formatedDonationAmount}
                                                            formatMessage={formatMessage}
                                                            handleInputChange={this.handleInputChange}
                                                            handleInputOnBlur={this.handleInputOnBlur}
                                                            handlePresetAmountClick={this.handlePresetAmountClick}
                                                            validity={validity}
                                                        />

                                                        <DropDownAccountOptions
                                                            formatMessage={formatMessage}
                                                            type={type}
                                                            validity={validity.isValidAddingToSource}
                                                            selectedValue={this.state.flowObject.giveData.giveTo.value}
                                                            name="giveTo"
                                                            parentInputChange={this.handleInputChange}
                                                            parentOnBlurChange={this.handleInputOnBlur}
                                                        />
                                                        <DonationFrequency
                                                            formatMessage={formatMessage}
                                                            giftType={giveData.giftType}
                                                            handlegiftTypeButtonClick={this.handlegiftTypeButtonClick}
                                                            language={language}
                                                        />
                                                        <PaymentOptions
                                                            creditCard={giveData.creditCard}
                                                            giveTo={giveData.giveTo}
                                                            formatMessage={formatMessage}
                                                            disableField={disableButton}
                                                            handleAddNewButtonClicked={this.handleAddNewButtonClicked}
                                                            handleInputChange={this.handleInputChange}
                                                            options={paymentInstrumenOptions}
                                                            validity={validity}
                                                        />
                                                        {
                                                            <Modal
                                                                size="tiny"
                                                                dimmer="inverted"
                                                                className="chimp-modal"
                                                                closeIcon
                                                                open={isCreditCardModalOpen}
                                                                onClose={this.handleCCAddClose}
                                                            >
                                                                <Modal.Header>Add new card</Modal.Header>
                                                                <Modal.Content>
                                                                    <Modal.Description className="font-s-16">
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
                                                                                disabled={!paymentInstrumenOptions}
                                                                                id="isDefaultCard"
                                                                                label="Set as primary card"
                                                                                name="isDefaultCard"
                                                                                onChange={this.handleSetPrimaryClick}
                                                                            />
                                                                        </Form>
                                                                    </Modal.Description>
                                                                    <div className="btn-wraper pt-3 text-right">
                                                                        <Button
                                                                            className="blue-btn-rounded-def sizeBig w-180"
                                                                            onClick={this.handleAddNewCreditCard}
                                                                            disabled={buttonClicked}
                                                                        >
                                                                            Done
                                                                            </Button>
                                                                    </div>
                                                                </Modal.Content>
                                                            </Modal>
                                                        }
                                                        
                                                        <TaxReceiptDropDown
                                                            giveTo={giveData.giveTo}
                                                            formatMessage={formatMessage}
                                                            disableField={disableButton}
                                                            handleAddNewButtonClicked={this.handleAddNewButtonClicked}
                                                            handleInputChange={this.handleInputChange}
                                                            taxReceipt={giveData.taxReceipt}
                                                            taxReceiptsOptions={taxReceiptsOptions}
                                                            validity={validity}
                                                        />    
                                                        {
                                                            isTaxReceiptModelOpen && (
                                                                <TaxReceiptModal
                                                                    name="Add new tax receipt recipient"
                                                                    isTaxReceiptModelOpen={isTaxReceiptModelOpen}
                                                                    dispatch={dispatch}
                                                                    flowObject={flowObject}
                                                                    handleAddNewTaxReceipt={this.handleAddNewTaxReceipt}
                                                                    handleModalClose={this.handleTaxReceiptModalClose}
                                                                    action="add"
                                                                    isFirstTaxReciept={!taxReceiptsOptions}
                                                                />
                                                            )
                                                        }
                                                        {this.renderdonationMatchOptions(giveData, donationMatchOptions, formatMessage, donationMatchData, language, currency)}
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                            <Grid className="to_space">
                                                <Grid.Row className="to_space">
                                                    <Grid.Column mobile={16} tablet={16} computer={16}>
                                                        <Note
                                                            fieldName="noteToSelf"
                                                            handleOnInputChange={this.handleInputChange}
                                                            handleOnInputBlur={this.handleInputOnBlur}
                                                            formatMessage={formatMessage}
                                                            labelText={formatMessage('noteToSelfLabel')}
                                                            popupText={formatMessage('donorNoteToSelfPopup')}
                                                            placeholderText={formatMessage('noteToSelfPlaceHolder')}
                                                            text={giveData.noteToSelf}
                                                        />
                                                        <Form.Button
                                                            primary
                                                            className="blue-btn-rounded btn_right"
                                                            // className={isMobile ? 'mobBtnPadding' : 'btnPadding'}
                                                            content={formatMessage('giveCommon:reviewButton')}
                                                            disabled={disableButton}
                                                            // fluid={isMobile}
                                                            type="submit"
                                                        />
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </Form>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                </div>
            </Fragment>
        )
    }
}

Donation.defaultProps = {
    ...donationDefaultProps,
    companyDetails: [],
};

const mapStateToProps = (state) => {
    return {
        companyDetails: state.give.companyData,
        currentUser: state.user.info,
        userTaxReceiptProfiles: state.user.taxReceiptProfiles,
        userAccountsFetched: state.user.userAccountsFetched,
    };
}
export default withTranslation(['donation', 'giveCommon'])(connect(mapStateToProps)(Donation));
