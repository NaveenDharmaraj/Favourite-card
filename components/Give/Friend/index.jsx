import React, {
    Fragment,
} from 'react';
import {
    connect,
} from 'react-redux';
import {
    Divider,
    Form,
    Header,
    Icon,
    Input,
    Placeholder,
    Popup,
    Select,
    Container,
    Grid,
} from 'semantic-ui-react';
import dynamic from 'next/dynamic';
import getConfig from 'next/config';
import {
    Elements,
    StripeProvider,
} from 'react-stripe-elements';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import _merge from 'lodash/merge';
import _replace from 'lodash/replace';
import _cloneDeep from 'lodash/cloneDeep';
import ReactHtmlParser from 'react-html-parser';
import _ from 'lodash';

import {
    formatCurrency,
    resetP2pDataForOnInputChange,
    formatAmount,
    validateGiveForm,
    populateDonationMatch,
    populatePaymentInstrument,
    populateTaxReceipts,
    resetDataForAccountChange,
    getDefaultCreditCard,
    getSelectedFriendList,
    validateForReload,
    calculateP2pTotalGiveAmount,
    setDonationAmount,
} from '../../../helpers/give/utils';
import { getDonationMatchAndPaymentInstruments } from '../../../actions/user';
import {
    getCompanyPaymentAndTax,
    proceed,
} from '../../../actions/give';
import {
    storeEmailIdToGive,
} from '../../../actions/dashboard';
import { withTranslation } from '../../../i18n';
import { parseEmails } from '../../../helpers/give/giving-form-validation';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import DropDownAccountOptions from '../../shared/DropDownAccountOptions';
import Note from '../../shared/Note';
import AccountTopUp from '../AccountTopUp';
import { p2pDefaultProps } from '../../../helpers/give/defaultProps';
import { dismissAllUxCritialErrors } from '../../../actions/error';
const { publicRuntimeConfig } = getConfig();
import '../../shared/style/styles.less';
import FlowBreadcrumbs from '../FlowBreadcrumbs';
import DonationAmountField from '../DonationAmountField';
import FriendsDropDown from '../../shared/FriendsDropDown';
import ReloadAddAmount from '../ReloadAddAmount';
const {
    STRIPE_KEY
} = publicRuntimeConfig;

const CreditCard = dynamic(() => import('../../shared/CreditCard'), {
    ssr: false
});

const actionTypes = {
    SHOW_FRIENDS_DROPDOWN: 'SHOW_FRIENDS_DROPDOWN',
};

class Friend extends React.Component {
    constructor(props) {
        super(props);
        const {
            companyDetails,
            companiesAccountsData,
            donationMatchData,
            paymentInstrumentsData,
            defaultTaxReceiptProfile,
            fund,
            userAccountsFetched,
            userCampaigns,
            userGroups,
            currentUser: {
                id,
                attributes: {
                    email,
                    firstName,
                    lastName,
                },
            },
            t:formatMessage,
            i18n: {
                language,
            },
            userFriendEmail,
            dispatch,
        } = props;
        const paymentInstruments = Friend.constructPaymentInstruments(
            props,
            companyDetails,
            paymentInstrumentsData,
        );
        const flowType = _replace(props.baseUrl, /\//, '');
        let payload = null;
        // Initialize the flowObject to default value when got switched from other flows
        if (props.flowObject.type !== flowType) {
            const defaultPropsData = _merge({}, p2pDefaultProps);
            payload = {
                ...defaultPropsData.flowObject,
                nextStep: props.step,
            };
        } else {
            payload = _merge({}, props.flowObject);
        }
        this.state = {
            dropDownOptions: {
                donationMatchList: populateDonationMatch(donationMatchData, formatMessage, language),
                // giveFromList: accountOptions,
                paymentInstrumentList: populatePaymentInstrument(paymentInstruments, formatMessage),
            },
            flowObject: _cloneDeep(payload),
            // forceContinue: props.forceContinue,
            inValidCardNameValue: true,
            inValidCardNumber: true,
            inValidCvv: true,
            inValidExpirationDate: true,
            inValidNameOnCard: true,
            userEmail: email,
            validity: this.initializeValidations(),
            showGiveToEmail: false,
            reloadModalOpen:0,
            reviewBtnFlag: false,
        };
        if(!_isEmpty(userFriendEmail) && this.state.flowObject.giveData.recipients.length === 0) {
            this.state.flowObject.giveData.recipients = [userFriendEmail.email];
            this.state.flowObject.giveData.recipientName = userFriendEmail.name;
            this.state.flowObject.giveData.recipientImage = userFriendEmail.image;
            this.state.flowObject.giveData.emailMasked = true;
            dispatch({
                payload: {
                },
                type: 'USER_FRIEND_EMAIL',
            });
        }
        dispatch({
            payload: {
                showFriendDropDown: true,
            },
            type: actionTypes.SHOW_FRIENDS_DROPDOWN,
        });
        
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleOnInputBlur = this.handleOnInputBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);

        this.validateStripeCreditCardNo = this.validateStripeCreditCardNo.bind(this);
        this.validateStripeExpirationDate = this.validateStripeExpirationDate.bind(this);
        this.validateCreditCardCvv = this.validateCreditCardCvv.bind(this);
        this.validateCreditCardName = this.validateCreditCardName.bind(this);
        this.getStripeCreditCard = this.getStripeCreditCard.bind(this);
        dismissAllUxCritialErrors(props.dispatch);
        this.handleGiveToEmail = this.handleGiveToEmail.bind(this);
        this.renderReloadAddAmount = this.renderReloadAddAmount.bind(this);
        this.handleAddMoneyModal = this.handleAddMoneyModal.bind(this); 
    }


    static constructPaymentInstruments(props, companyDetails, paymentInstrumentsData) {
        return (
            (!_.isEmpty(props.flowObject.giveData.giveFrom) &&
            props.flowObject.giveData.giveFrom.type === 'companies') ?
                companyDetails.companyPaymentInstrumentsData
                : paymentInstrumentsData
        );
    }

    // static setGiveFrom(giveData, fund, id, accountOptions, name, formatNumber) {
    //     if (_.isEmpty(accountOptions) && !giveData.userInteracted) {
    //         giveData.giveFrom.id = id;
    //         giveData.giveFrom.value = fund.id;
    //         giveData.giveFrom.type = 'user';
    //         giveData.giveFrom.text = `${fund.attributes.name} (${currencyFormatting(fund.attributes.balance, formatNumber, 'USD')})`;
    //         giveData.giveFrom.balance = fund.attributes.balance;
    //         giveData.giveFrom.name = name;
    //     } else if (!_.isEmpty(accountOptions) && !giveData.userInteracted) {
    //         giveData.giveFrom = {
    //             value: '',
    //         };
    //     }
    //     return giveData;
    // }

    componentDidMount() {
        const {
            currentUser: {
                id,
            },
            dispatch,
        } = this.props;
        dispatch(getDonationMatchAndPaymentInstruments(id));
    }
    handleAddMoneyModal() {
        this.setState({
            reloadModalOpen:1,
        })
    }
    componentDidUpdate(prevProps) {
        if (!_isEqual(this.props, prevProps)) {
            const {
                dropDownOptions,
            } = this.state;
            let {
                flowObject: {
                    currency,
                    giveData,
                },
                reviewBtnFlag,
                reloadModalOpen,
            } = this.state;

            const {
                companyDetails,
                companiesAccountsData,
                currentUser: {
                    id,
                    attributes: {
                        avatar,
                        displayName,
                        email,
                        firstName,
                        lastName,
                    },
                },
                donationMatchData,
                fund,
                paymentInstrumentsData,
                userCampaigns,
                userGroups,                
                slug,
                i18n: {
                    language,
                },
            } = this.props;
            const formatMessage = this.props.t;
            let paymentInstruments = paymentInstrumentsData;
            let companyPaymentInstrumentChanged = false;
            if (giveData.giveFrom.type === 'companies' && !_isEmpty(companyDetails)) {
                const companyIndex = _.findIndex(companiesAccountsData, {'id': giveData.giveFrom.id});
                giveData.giveFrom.balance = companiesAccountsData[companyIndex].attributes.balance;
                giveData.giveFrom.text = `${companiesAccountsData[companyIndex].attributes.companyFundName}: ${formatCurrency(companiesAccountsData[companyIndex].attributes.balance, language, currency)}`;
                if (_isEmpty(prevProps.companyDetails)
                     || !_isEqual(companyDetails.companyPaymentInstrumentsData,
                         prevProps.companyDetails.companyPaymentInstrumentsData)
                ) {
                    companyPaymentInstrumentChanged = true;
                }
                paymentInstruments = companyDetails.companyPaymentInstrumentsData;
            } else if (giveData.giveFrom.type === 'user') {
                giveData.giveFrom.balance = fund.attributes.balance;
                giveData.giveFrom.text = `${fund.attributes.name}: ${formatCurrency(fund.attributes.balance, language, currency)}`
                paymentInstruments = paymentInstrumentsData;
            }
            const paymentInstrumentOptions = populatePaymentInstrument(
                paymentInstruments, formatMessage,
            );
            if(reviewBtnFlag && (giveData.giveFrom.balance >= giveData.giveAmount)) {
                reviewBtnFlag = false;
                reloadModalOpen = 0;
            }
            const donationMatchOptions = populateDonationMatch(donationMatchData, formatMessage);
            if (!_isEmpty(fund)) {
                giveData = Friend.initFields(
                    giveData, fund, id, avatar, paymentInstrumentOptions,
                    companyPaymentInstrumentChanged,
                    `${firstName} ${lastName}`, companiesAccountsData, userGroups, userCampaigns,
                );
            }
            this.setState({
                dropDownOptions: {
                    ...dropDownOptions,
                    donationMatchList: donationMatchOptions,
                    paymentInstrumentList: paymentInstrumentOptions,
                },
                flowObject: {
                    ...this.state.flowObject,
                    giveData,
                },
                reloadModalOpen,
                reviewBtnFlag,
            });
        }
    }

    static initFields(giveData, fund, id, avatar,paymentInstrumentOptions,
        companyPaymentInstrumentChanged, name, companiesAccountsData, userGroups, userCampaigns) {
        if (
            (giveData.giveFrom.type === 'user' || giveData.giveFrom.type === 'companies')
            && (giveData.creditCard.value === null || companyPaymentInstrumentChanged)
            && (giveData.giftType.value > 0
            || Number(giveData.giveAmount) > Number(giveData.giveFrom.balance))
        ) {
            giveData.creditCard = getDefaultCreditCard(
                paymentInstrumentOptions,
            );
        }
        if (_isEmpty(companiesAccountsData) && _isEmpty(userGroups) && _isEmpty(userCampaigns) && !giveData.userInteracted) {
            giveData.giveFrom.avatar = avatar,
            giveData.giveFrom.id = id;
            giveData.giveFrom.value = fund.id;
            giveData.giveFrom.type = 'user';
            giveData.giveFrom.text = `${fund.attributes.name} (${fund.attributes.balance})`;
            giveData.giveFrom.balance = fund.attributes.balance;
            giveData.giveFrom.name = name;
        } else if (!_isEmpty(companiesAccountsData) && !_isEmpty(userGroups) && !_isEmpty(userCampaigns) && !giveData.userInteracted) {
            giveData.giveFrom = {
                value: '',
            };
        }
        return giveData;
    }

    initializeValidations() {
        this.validity = {
            doesAmountExist: true,
            isAmountCoverGive: true,
            isAmountLessThanOneBillion: true,
            isAmountMoreThanOneDollor: true,
            isNoteToCharityInLimit: true,
            isNoteToSelfInLimit: true,
            isNumberOfEmailsLessThanMax: true,
            isRecipientHaveSenderEmail: true,
            isRecipientListUnique: true,
            isValidDecimalAmount: true,
            isValidEmailList: true,
            isValidGiveAmount: true,
            isValidGiveFrom: true,
            isValidNoteSelfText: true,
            isValidNoteToCharityText: true,
            isValidNoteToRecipients: true,
            isValidNoteToSelf: true,
            isValidPositiveNumber: true,
            isReloadRequired:true,
            isRecepientSelected: true,
        };
        return this.validity;
    }
    /**
     * Validates the give amount, give from fields.
     * @param {*} event The even object.
     * @param {*} data The data belong to the event.
     * @return {void} Sets the valid state of the page.
     */

    handleOnInputBlur(event, data) {
        const {
            name,
            value,
        } = !_.isEmpty(data) ? data : event.target;
        const {
            flowObject: {
                giveData,
            },
            userEmail,
        } = this.state;
        let {
            validity,
        } = this.state;
        let inputValue = value;
        const isNumber = /^(?:[0-9]+,)*[0-9]+(?:\.[0-9]*)?$/;
        if ((name === 'giveAmount') && !_.isEmpty(value) && value.match(isNumber)) {
            inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
            giveData[name] = inputValue;
            giveData['formatedP2PAmount'] = _.replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
        }
        const coverFeesAmount = 0;
        if (name !== 'coverFees' && name !== 'giftType' && name !== 'friendsList' && name !== 'giveFrom' && name !== 'recipients') {
            validity = validateGiveForm(name, inputValue, validity, giveData, coverFeesAmount);
        }
        switch (name) {
            case 'giveFrom':
                validity = validateGiveForm(
                    'giveAmount',
                    giveData.giveAmount,
                    validity,
                    giveData,
                    coverFeesAmount,
                );
                break;
            case 'recipients':
                validity = validateGiveForm(
                    'recipients',
                    giveData.recipients,
                    validity,
                    giveData,
                    coverFeesAmount,
                    userEmail,
                );
                break;
            case 'friendsList':
                validity = validateGiveForm(
                    'recipients',
                    giveData.recipients,
                    validity,
                    giveData,
                    coverFeesAmount,
                    userEmail,
                );
                break;
            default: break;
        }
        this.setState({
            flowObject: {
                ...this.state.flowObject,
                giveData,
            },
            validity,
        });
    }

    /**
     * This is a basic parse of the recipients without modifying the user's input.
     * We do this so it makes it easier for the user to enter a list of emails
     * @param {string} recipients A comma separated list of emails
     * @return {array} An array of emails
     */
    static parseRecipients(recipients) {
        return _.trim(recipients).length > 0
            ? _.split(recipients, ',')
            : [];
    }

    /**
     * Handle inputt changes to give from, give amount fields.
     * @param {*} event The event object.
     * @param {*} data The data related to the event.
     * @return {void} Sets the state of the page.
     */
    handleInputChange(event, data) {
        const {
            name,
            options,
            value,
        } = data;
        let {
            flowObject: {
                giveData,
                type,
            },
            dropDownOptions,
            validity,
            reloadModalOpen,
            reviewBtnFlag,
        } = this.state;
        const {
            userEmail,
        } = this.state;
        const {
            dispatch,
        } = this.props;
        const newValue = (name !== 'friendsList' && !_.isEmpty(options)) ? _.find(options, { value }) : value;
        if (giveData[name] !== newValue) {
            giveData[name] = newValue;
            giveData.userInteracted = true;
            switch (name) {
                case 'giveFrom':
                    const {
                        modifiedDropDownOptions,
                        modifiedGiveData,
                    } = resetDataForAccountChange(
                        giveData,
                        dropDownOptions,
                        this.props,
                        type,
                    );
                    reviewBtnFlag = false;
                    dropDownOptions = modifiedDropDownOptions;
                    if (giveData.giveFrom.type === 'companies') {
                        getCompanyPaymentAndTax(dispatch, Number(giveData.giveFrom.id));
                    }
                    break;
                case 'giveAmount':
                    reviewBtnFlag = false;
                    reloadModalOpen = 0;
                    giveData['formatedP2PAmount'] = newValue;
                    giveData['totalP2pGiveAmount'] = calculateP2pTotalGiveAmount((giveData.friendsList.length + giveData.recipients.length),giveData.giveAmount);
                    break;
                case 'recipients':
                    reviewBtnFlag = false;
                    reloadModalOpen = 0;
                    giveData[name] = Friend.parseRecipients(newValue);
                    giveData['totalP2pGiveAmount'] = calculateP2pTotalGiveAmount((giveData.friendsList.length + giveData.recipients.length),giveData.giveAmount);
                    break;
                case 'friendsList':
                    reviewBtnFlag = false;
                    reloadModalOpen = 0;
                    giveData['totalP2pGiveAmount'] = calculateP2pTotalGiveAmount((giveData.friendsList.length + giveData.recipients.length),giveData.giveAmount);
                    break;
                default: break;
            }

            this.setState({
                flowObject: {
                    ...this.state.flowObject,
                    giveData,
                },
                dropDownOptions: {
                    ...this.state.dropDownOptions,
                    dropDownOptions,
                },
                validity: {
                    ...this.state.validity,
                    validity,
                },
                reviewBtnFlag,
            });
        }
    }

    handleSubmit() {
        const {
            flowObject,
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
        } = this.state;
        const {
            dispatch,
            nextStep,
            companyDetails,
            defaultTaxReceiptProfile,
            flowSteps,
            stepIndex,
            friendsListData,
        } = this.props;
        // let { forceContinue } = this.state;
        const {
            giveData: {
                creditCard,
                friendsList,
            },
        } = flowObject;
        if (this.validateForm()) {
            if (creditCard.value > 0) {
                flowObject.selectedTaxReceiptProfile = (flowObject.giveData.giveFrom.type === 'companies') ?
                    companyDetails.companyDefaultTaxReceiptProfile
                    : defaultTaxReceiptProfile;
            }
            flowObject.giveData.selectedFriendsList = (!_.isEmpty(friendsList))
                ? getSelectedFriendList(friendsListData, friendsList)
                : [];
            flowObject.giveData.selectedFriendsList.map((friendData) => {
            _.remove(flowObject.giveData.recipients,(recepientData) => {
                    return recepientData == friendData.email;
                });
            })
            flowObject.giveData.totalP2pGiveAmount = calculateP2pTotalGiveAmount(
                (flowObject.giveData.selectedFriendsList.length + flowObject.giveData.recipients.length),
                flowObject.giveData.giveAmount);
            // Emails need to be prepared for API call
            flowObject.giveData.recipients = parseEmails(
                flowObject.giveData.recipients,
            );
            flowObject.stepsCompleted = false;
            dismissAllUxCritialErrors(this.props.dispatch);
            dispatch(proceed(flowObject, flowSteps[stepIndex + 1], stepIndex));
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
            },
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

    validateForm() {
        const {
            flowObject: {
                giveData,
            },
            userEmail,
        } = this.state;
        let {
            validity,
        } = this.state;
        const coverFeesAmount = 0;
        validity = validateGiveForm('giveAmount', giveData.giveAmount, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('giveFrom', giveData.giveFrom.value, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('noteToSelf', giveData.noteToSelf, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('noteToRecipients', giveData.noteToRecipients, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('recipients', giveData.recipients, validity, giveData, coverFeesAmount, userEmail);
        validity = validateForReload(validity,giveData.giveFrom.type,giveData.totalP2pGiveAmount,giveData.giveFrom.balance);
        this.setState({
            validity,
            reviewBtnFlag: !validity.isReloadRequired,
        });
        return _.every(validity);
    }

    handleGiveToEmail() {
        this.setState({
            showGiveToEmail: true,
        });
    }

    handlePresetAmountClick = (event, data) => {
        const {
            value,
        } = data;
        let {
            validity,
            flowObject: {
                giveData,
            },
            reviewBtnFlag,
        } = this.state;
        const inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
        const formatedP2PAmount = _.replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');

        giveData.totalP2pGiveAmount = calculateP2pTotalGiveAmount((giveData.friendsList.length + giveData.recipients.length), inputValue);
        validity = validateGiveForm("giveAmount", inputValue, validity, giveData);
        reviewBtnFlag = false;
        this.setState({
            ...this.state,
            flowObject: {
                ...this.state.flowObject,
                giveData: {
                    ...giveData,
                    giveAmount: inputValue,
                    formatedP2PAmount,
                }
            },
            validity,
            reviewBtnFlag,
        });
    }

    renderReloadAddAmount = () => {
        let {
            defaultTaxReceiptProfile,
            dispatch,
            donationMatchData,
            taxReceiptProfiles,
            companyDetails,
            i18n: {
                language,
            },
            userAccountsFetched,
            companyAccountsFetched,
        } = this.props
        const {
            dropDownOptions:{
                paymentInstrumentList,
            },
            flowObject: {
                giveData,
            },
            reloadModalOpen,
            reviewBtnFlag,
        } = this.state;
        let {
            giveFrom,
            totalP2pGiveAmount,
            giftType,
        } = giveData
        const formatMessage = this.props.t;
        console.log(giveAmount);
        console.log(this.state.flowObject);
        if ((giveFrom.type === 'user' || giveFrom.type === 'companies') && (Number(totalP2pGiveAmount) > Number(giveFrom.balance))) {
            if ((userAccountsFetched && giveFrom.type === 'user') || (companyAccountsFetched && giveFrom.type === 'companies')) {
            let taxReceiptList = taxReceiptProfiles;
            let defaultTaxReceiptProfileForReload = defaultTaxReceiptProfile;
            if (giveFrom.type === 'companies' && companyDetails) {
                taxReceiptList = !_.isEmpty(companyDetails.taxReceiptProfiles) ? companyDetails.taxReceiptProfiles : [];
                defaultTaxReceiptProfileForReload = companyDetails.companyDefaultTaxReceiptProfile;
            }
            let AmountToDonate = formatAmount((formatAmount(totalP2pGiveAmount)
            - formatAmount(giveFrom.balance)));
            const taxReceiptsOptions = populateTaxReceipts(taxReceiptList, formatMessage);
            return (
                <ReloadAddAmount
                    defaultTaxReceiptProfile={defaultTaxReceiptProfileForReload}
                    dispatch={dispatch}
                    donationMatchData={donationMatchData}
                    formatedDonationAmount={AmountToDonate}
                    formatMessage={formatMessage}
                    allocationGiftType={giftType.value}
                    giveTo={giveFrom}
                    language={language}
                    paymentInstrumentOptions={paymentInstrumentList}
                    reloadModalOpen={reloadModalOpen}
                    reviewBtnFlag={reviewBtnFlag}
                    taxReceiptsOptions={taxReceiptsOptions}
                />
            )
            } else{
                return (
                    <Placeholder>
                    <Placeholder.Header>
                      <Placeholder.Line />
                      <Placeholder.Line />
                    </Placeholder.Header>
                  </Placeholder>
                );
            }

        }
    }


    render() {
        const {
            currentStep,
            creditCardApiCall,
            flowSteps,
            i18n:{
                language,
            },
            t: formatMessage,
            showDropDown,
        } = this.props;
        const {
            flowObject: {
                currency,
                giveData: {
                    creditCard,
                    donationAmount,
                    donationMatch,
                    emailMasked,
                    formatedDonationAmount,
                    formatedP2PAmount,
                    friendsList,
                    giftType,
                    giveAmount,
                    giveFrom,
                    noteToRecipients,
                    noteToSelf,
                    recipients,
                    recipientName,
                    totalP2pGiveAmount,
                },
                type,
            },
            dropDownOptions: {
                donationMatchList,
                // giveFromList,
                paymentInstrumentList,
            },
            validity,
            showGiveToEmail,
            reviewBtnFlag,
        } = this.state;

        const recipientsList = recipients.join(',');
        let submtBtn = (reviewBtnFlag)?(
            <Form.Button
                primary
                className="blue-btn-rounded btn_right"
                content={formatMessage('giveCommon:reviewButtonFlag')}
                disabled={!this.props.userAccountsFetched}
                onClick={this.handleAddMoneyModal}
                type="button"
            />) : (<Form.Button
                primary
                className="blue-btn-rounded btn_right"
                content={formatMessage('giveCommon:reviewButton')}
                disabled={!this.props.userAccountsFetched}
                type="submit"
            />)
        return (
            <Fragment>
                <div className="flowReviewbanner">
                    <Container>
                        <div className="flowReviewbannerText">
                            <Header as='h2'>{formatMessage('friends:giveToFriendText')}</Header>
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
                                            flowType={type}
                                        />
                                    </div>
                                    <div className="flowFirst">
                                        <Form onSubmit={this.handleSubmit}>
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column mobile={16} tablet={12} computer={10}>
                                                        {
                                                            (emailMasked) &&
                                                            <Form.Field>
                                                                <label htmlFor="recipientName">
                                                                    {formatMessage('friends:recipientsLabel')}
                                                                </label>
                                                                <Form.Field
                                                                    control={Input}
                                                                    disabled
                                                                    id="recipientName"
                                                                    maxLength="20"
                                                                    name="recipientName"
                                                                    size="large"
                                                                    value={recipientName}
                                                                />
                                                            </Form.Field>
                                                        }
                                                        {
                                                            (!emailMasked) &&
                                                            <Fragment>
                                                                <label htmlFor="recipients">
                                                                    {formatMessage('friends:recipientsLabel')}
                                                                </label>
                                                                <Popup
                                                                    content={formatMessage('friends:recipientsPopup')}
                                                                    position="top center"
                                                                    trigger={
                                                                        <Icon
                                                                            color="blue"
                                                                            name="question circle"
                                                                            size="large"
                                                                        />
                                                                    }
                                                                />
                                                                {showDropDown
                                                                && (
                                                                    <Fragment>
                                                                        <FriendsDropDown
                                                                    handleOnInputBlur={this.handleOnInputBlur}
                                                                    handleOnInputChange={this.handleInputChange}
                                                                    values={friendsList}
                                                                />
                                                                <p>
                                                                    <a className="giveToEmailsText" onClick={this.handleGiveToEmail}>
                                                                        {formatMessage('friends:giveToEmailsText')}
                                                                    </a>
                                                                </p>
                                                                    </Fragment>
                                                                )
                                                                }
                                                                {(showGiveToEmail || !_.isEmpty(recipients) || (typeof showDropDown !== 'undefined' && !showDropDown))
                                                                && (
                                                                    <Note
                                                                        enableCharacterCount={false}
                                                                        fieldName="recipients"
                                                                        formatMessage={formatMessage}
                                                                        handleOnInputChange={this.handleInputChange}
                                                                        handleOnInputBlur={this.handleOnInputBlur}
                                                                        labelText={formatMessage('friends:recipientsLabel')}
                                                                        popupText={formatMessage('friends:recipientsPopup')}
                                                                        placeholderText={formatMessage('friends:recipientsPlaceholderText')}
                                                                        text={recipients.join(',')}
                                                                        hideLabel={true}
                                                                    />
                                                                )}
                                                                <FormValidationErrorMessage
                                                                    condition={!validity.isValidEmailList}
                                                                    errorMessage={formatMessage('friends:invalidEmailError')}
                                                                />
                                                                <FormValidationErrorMessage
                                                                    condition={!validity.isRecipientListUnique}
                                                                    errorMessage={formatMessage('friends:duplicateEmail')}
                                                                />
                                                                <FormValidationErrorMessage
                                                                    condition={!validity.isRecipientHaveSenderEmail}
                                                                    errorMessage={formatMessage('friends:haveSenderEmail')}
                                                                />
                                                                <FormValidationErrorMessage
                                                                    condition={!validity.isNumberOfEmailsLessThanMax}
                                                                    errorMessage={formatMessage('friends:maxEmail')}
                                                                />
                                                                <FormValidationErrorMessage
                                                                    condition={!validity.isRecepientSelected}
                                                                    errorMessage="Select friends or enter emailaddress separated by comma"
                                                                />
                                                            </Fragment>
                                                        }
                                                        <DonationAmountField
                                                            amount={formatedP2PAmount}
                                                            formatMessage={formatMessage}
                                                            handleInputChange={this.handleInputChange}
                                                            handleInputOnBlur={this.handleOnInputBlur}
                                                            handlePresetAmountClick={this.handlePresetAmountClick}
                                                            validity={validity}
                                                            isGiveFlow
                                                        />
                                                        <p className="multipleFriendAmountFieldText">
                                                            {formatMessage('friends:multipleFriendAmountFieldText')}
                                                        </p>
                                                        <DropDownAccountOptions
                                                            type={type}
                                                            validity={validity.isValidGiveFrom}
                                                            selectedValue={this.state.flowObject.giveData.giveFrom.value}
                                                            name="giveFrom"
                                                            parentInputChange={this.handleInputChange}
                                                            parentOnBlurChange={this.handleOnInputBlur}
                                                            formatMessage={formatMessage}
                                                        />
                                                        {this.renderReloadAddAmount()}
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                            <Grid className="to_space">
                                                <Grid.Row className="to_space">
                                                    <Grid.Column mobile={16} tablet={16} computer={16}>
                                                        <Note
                                                            fieldName="noteToRecipients"
                                                            formatMessage={formatMessage}
                                                            handleOnInputChange={this.handleInputChange}
                                                            handleOnInputBlur={this.handleOnInputBlur}
                                                            labelText={formatMessage('friends:noteToRecipientsLabel')}
                                                            popupText={formatMessage('friends:noteToRecipientsPopup')}
                                                            placeholderText={formatMessage('friends:noteToRecipientsPlaceholderText')}
                                                            text={noteToRecipients}
                                                        />
                                                        <Note
                                                            fieldName="noteToSelf"
                                                            formatMessage={formatMessage}
                                                            handleOnInputChange={this.handleInputChange}
                                                            handleOnInputBlur={this.handleOnInputBlur}
                                                            labelText={formatMessage('friends:noteToSelfLabel')}
                                                            popupText={formatMessage('friends:noteToSelfPopup')}
                                                            placeholderText={formatMessage('friends:noteToSelfPlaceholderText')}
                                                            text={noteToSelf}
                                                        />
                                                        {submtBtn}
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
        );
    }
}

Friend.defaultProps = Object.assign({}, p2pDefaultProps);

function mapStateToProps(state) {
    return {
        companiesAccountsData: state.user.companiesAccountsData,
        companyDetails: state.give.companyData,
        companyAccountsFetched: state.give.companyAccountsFetched,
        currentUser: state.user.info,
        donationMatchData: state.user.donationMatchData,
        fund: state.user.fund,
        paymentInstrumentsData: state.user.paymentInstrumentsData,
        userAccountsFetched: state.user.userAccountsFetched,
        userCampaigns: state.user.userCampaigns,
        userGroups: state.user.userGroups,
        creditCardApiCall: state.give.creditCardApiCall,
        userFriendEmail: state.dashboard.userFriendEmail,
        friendsListData: state.user.friendsList,
        showDropDown: state.user.showFriendDropDown,
    };
}

export default withTranslation([
    'giveCommon',
    'friends',
    'accountTopUp',
    'dropDownAccountOptions',
])(connect(mapStateToProps)(Friend));
