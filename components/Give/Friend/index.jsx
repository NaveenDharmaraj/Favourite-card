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
    resetDataForAccountChange,
    getDefaultCreditCard,
    getSelectedFriendList,
    validateDonationForm,
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
const {
    STRIPE_KEY
} = publicRuntimeConfig;

const CreditCard = dynamic(() => import('../../shared/CreditCard'), {
    ssr: false
});

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
                attributes: {
                    email: userEmailId,
                },
                id,
            },
            dispatch,
        } = this.props;
        dispatch(getDonationMatchAndPaymentInstruments(id));
    }

    componentDidUpdate(prevProps) {
        if (!_isEqual(this.props, prevProps)) {
            const {
                dropDownOptions,
            } = this.state;
            let {
                flowObject: {
                    giveData,
                },
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
                if (_isEmpty(prevProps.companyDetails)
                     || !_isEqual(companyDetails.companyPaymentInstrumentsData,
                         prevProps.companyDetails.companyPaymentInstrumentsData)
                ) {
                    companyPaymentInstrumentChanged = true;
                }
                paymentInstruments = companyDetails.companyPaymentInstrumentsData;
            } else if (giveData.giveFrom.type === 'user') {
                paymentInstruments = paymentInstrumentsData;
            }
            const paymentInstrumentOptions = populatePaymentInstrument(
                paymentInstruments, formatMessage,
            );
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
            isDonationAmountBlank: true,
            isDonationAmountCoverGive: true,
            isDonationAmountLessThan1Billion: true,
            isDonationAmountMoreThan1Dollor: true,
            isDonationAmountPositive: true,
            isNoteToCharityInLimit: true,
            isNoteToSelfInLimit: true,
            isNumberOfEmailsLessThanMax: true,
            isRecipientHaveSenderEmail: true,
            isRecipientListUnique: true,
            isValidDecimalAmount: true,
            isValidDecimalDonationAmount: true,
            isValidDonationAmount: true,
            isValidEmailList: true,
            isValidGiveAmount: true,
            isValidGiveFrom: true,
            isValidNoteSelfText: true,
            isValidNoteToCharityText: true,
            isValidNoteToRecipients: true,
            isValidNoteToSelf: true,
            isValidPositiveNumber: true,
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
        const isNumber = /^(?:[0-9]+,)*[0-9]+(?:\.[0-9]+)?$/;
        if ((name === 'giveAmount' || name === 'donationAmount') && !_.isEmpty(value) && value.match(isNumber)) {
            inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
            giveData[name] = inputValue;
        }
        const coverFeesAmount = 0;
        if (name !== 'coverFees' && name !== 'giftType' && name !== 'giveFrom') {
            validity = validateGiveForm(name, inputValue, validity, giveData, coverFeesAmount);
        }
        switch (name) {
            case 'giveAmount':
                giveData['formatedP2PAmount'] = _.replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
                validity = validateGiveForm(
                    'donationAmount',
                    giveData.donationAmount,
                    validity,
                    giveData,
                    coverFeesAmount,
                );
                break;
            case 'giveFrom':
                validity = validateGiveForm(
                    'giveAmount',
                    giveData.giveAmount,
                    validity,
                    giveData,
                    coverFeesAmount,
                );
                validity = validateGiveForm(
                    'donationAmount',
                    giveData.donationAmount,
                    validity,
                    giveData,
                    coverFeesAmount,
                );
                break;
            case 'donationAmount':
                    giveData['formatedDonationAmount'] = _.replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
                break;
            case 'recipients':
                validity = validateGiveForm(
                    'donationAmount',
                    giveData.donationAmount,
                    validity,
                    giveData,
                    coverFeesAmount,
                );
                validity = validateGiveForm(
                    'recipients',
                    giveData.donationAmount,
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
                case 'donationAmount':
                        giveData['formatedDonationAmount'] =  newValue;
                    break;
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

                    giveData = resetP2pDataForOnInputChange(modifiedGiveData, dropDownOptions);
                    dropDownOptions = modifiedDropDownOptions;
                    validity = validateGiveForm(
                        name, giveData[name], validity, giveData, 0,
                    );
                    if (giveData.giveFrom.type === 'companies') {
                        getCompanyPaymentAndTax(dispatch, Number(giveData.giveFrom.id));
                    }
                    break;
                case 'giveAmount':
                    giveData['formatedP2PAmount'] = newValue;
                    giveData[name]=formatAmount(parseFloat(newValue.replace(/,/g, '')));
                    giveData = resetP2pDataForOnInputChange(giveData, dropDownOptions);
                    break;
                case 'recipients':
                    giveData[name] = Friend.parseRecipients(newValue);
                    giveData = resetP2pDataForOnInputChange(giveData, dropDownOptions);
                    validity = validateGiveForm(
                        'donationAmount',
                        giveData.donationAmount,
                        validity,
                        giveData,
                        0,
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
                dropDownOptions: {
                    ...this.state.dropDownOptions,
                    dropDownOptions,
                },
                validity: {
                    ...this.state.validity,
                    validity,
                },
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
        const validateCC = this.isValidCC(
            creditCard,
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
        );
        let selectedValue = [];
        if(!_.isEmpty(friendsList)) {
            selectedValue = getSelectedFriendList(friendsListData, friendsList);
            flowObject.giveData.selectedFriendsList = selectedValue;
        }
        if (this.validateForm() && validateCC) {
            if (creditCard.value > 0) {
                flowObject.selectedTaxReceiptProfile = (flowObject.giveData.giveFrom.type === 'companies') ?
                    companyDetails.companyDefaultTaxReceiptProfile
                    : defaultTaxReceiptProfile;
            }
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
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
        } = this.state;
        let {
            validity,
        } = this.state;
        const coverFeesAmount = 0;
        validity = validateGiveForm('donationAmount', giveData.donationAmount, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('giveAmount', giveData.giveAmount, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('giveFrom', giveData.giveFrom.value, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('noteToSelf', giveData.noteToSelf, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('noteToRecipients', giveData.noteToRecipients, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('recipients', giveData.noteToRecipients, validity, giveData, coverFeesAmount, userEmail);

        this.setState({ validity });
        let validateCC = true;
        // if (giveData.creditCard.value === 0) {
        //     this.StripeCreditCard.handleOnLoad(
        //         inValidCardNumber, inValidExpirationDate, inValidNameOnCard,
        //         inValidCvv, inValidCardNameValue,
        //     );
        //     validateCC = (!inValidCardNumber && !inValidExpirationDate &&
        //         !inValidNameOnCard && !inValidCvv && !inValidCardNameValue);
        // }
        return _.every(validity) && validateCC;
    }

    // static renderTotalP2pGiveAmount(totalP2pGiveAmount, giveAmount, length, formatMessage, language, currency, formatCurrency) {
    //     return (totalP2pGiveAmount > 0 && (
    //         <Form.Field>
    //             <label>
    //                 {formatMessage('friends:totalAmountLabel')}
    //             </label>
    //             {(length > 1) && (
    //                 formatMessage('friends:totalAmount',
    //                     {
    //                         giveAmount: formatCurrency(giveAmount, language, currency),
    //                         numberOfRecipients: length,
    //                         totalP2pGiveAmount: formatCurrency(totalP2pGiveAmount, language, currency),
    //                     })
    //             )}
    //             {(length === 1) && (
    //                 formatMessage('friends:giveAmount',
    //                     {
    //                         giveAmount: formatCurrency(giveAmount, language, currency),
    //                     })
    //             )}
    //         </Form.Field>
    //     )
    //     );
    // }

    handleGiveToEmail() {
        this.setState({
            showGiveToEmail: true,
        });
    }

    handlePresetAmountClick = (event, data) => {
        const {
            value,
        } = data;
        const inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
        const formatedP2PAmount = _.replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
        let {
            validity,
            flowObject: {
                giveData,
            },
        } = this.state

        validity = validateDonationForm("giveAmount", inputValue, validity, giveData);

        this.setState({
            ...this.state,
            flowObject: {
                ...this.state.flowObject,
                giveData: {
                    ...this.state.flowObject.giveData,
                    giveAmount: inputValue,
                    formatedP2PAmount,
                }
            },
            validity,
        });
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
        } = this.state;

        let accountTopUpComponent = null;
        const recipientsList = recipients.join(',');

        // if (
        //     (giveFrom.type === 'user' || giveFrom.type === 'companies')
        //     && (totalP2pGiveAmount > Number(giveFrom.balance))
        // ) {
        //     const topupAmount = formatAmount((formatAmount(totalP2pGiveAmount)
        //     - formatAmount(giveFrom.balance)));
        //     accountTopUpComponent = (
        //         <AccountTopUp
        //             creditCard={creditCard}
        //             donationAmount={formatedDonationAmount}
        //             donationMatch={donationMatch}
        //             donationMatchList={donationMatchList}
        //             formatMessage={formatMessage}
        //             getStripeCreditCard={this.getStripeCreditCard}
        //             handleInputChange={this.handleInputChange}
        //             handleInputOnBlur={this.handleOnInputBlur}
        //             isAmountFieldVisible
        //             isDonationMatchFieldVisible={giveFrom.type === 'user'}
        //             paymentInstrumentList={paymentInstrumentList}
        //             topupAmount={topupAmount}
        //             validity={validity}
        //         />
        //     );
        // }

        return (
            <Fragment>
            <div className="flowReviewbanner">
                <Container>
                    <div className="flowReviewbannerText">
                        <Header as='h2'>Give to a friend</Header>
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
                                                            <FriendsDropDown
                                                                handleOnInputChange={this.handleInputChange}
                                                                values={friendsList}
                                                            />
                                                            <p>
                                                                <a onClick={this.handleGiveToEmail}>
                                                                    {formatMessage('friends:giveToEmailsText')}
                                                                </a>
                                                            </p>
                                                            {(showGiveToEmail || !_.isEmpty(recipients))
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
                                                        </Fragment>
                                                    }
                                                    {/* {
                                                        Friend.renderTotalP2pGiveAmount(
                                                            totalP2pGiveAmount,
                                                            giveAmount,
                                                            parseEmails(recipients).length,
                                                            formatMessage,
                                                            language,
                                                            currency,
                                                            formatCurrency,
                                                        )
                                                    } */}
                                                    <DonationAmountField
                                                        amount={formatedP2PAmount}
                                                        formatMessage={formatMessage}
                                                        handleInputChange={this.handleInputChange}
                                                        handleInputOnBlur={this.handleOnInputBlur}
                                                        handlePresetAmountClick={this.handlePresetAmountClick}
                                                        validity={validity}
                                                        isGiveFlow
                                                    />
                                                    <p>
                                                        {formatMessage('friends:multipleFriendAmountFieldText')}
                                                    </p>
                                                    {/* <Form.Field>
                                                        <label htmlFor="giveAmount">
                                                            {formatMessage('giveCommon:amountLabel')}
                                                        </label>
                                                        <Form.Field
                                                            control={Input}
                                                            error={!validity.isValidGiveAmount}
                                                            icon="dollar"
                                                            iconPosition="left"
                                                            id="giveAmount"
                                                            maxLength="20"
                                                            name="giveAmount"
                                                            onBlur={this.handleOnInputBlur}
                                                            onChange={this.handleInputChange}
                                                            placeholder={formatMessage('giveCommon:amountPlaceHolder')}
                                                            size="large"
                                                            value={formatedP2PAmount}
                                                        />
                                                    </Form.Field>
                                                    <FormValidationErrorMessage
                                                        condition={!validity.doesAmountExist || !validity.isAmountMoreThanOneDollor
                                                        || !validity.isValidPositiveNumber}
                                                        errorMessage={formatMessage('giveCommon:errorMessages.amountLessOrInvalid', {
                                                            minAmount: 1,
                                                        })}
                                                    />
                                                    <FormValidationErrorMessage
                                                        condition={!validity.isAmountLessThanOneBillion}
                                                        errorMessage={ReactHtmlParser(formatMessage('giveCommon:errorMessages.invalidMaxAmountError'))}
                                                    />
                                                    <FormValidationErrorMessage
                                                        condition={!validity.isAmountCoverGive}
                                                        errorMessage={formatMessage('giveCommon:errorMessages.giveAmountGreaterThanBalance')}
                                                    /> */}
                                                    <DropDownAccountOptions
                                                        type={type}
                                                        validity={validity.isValidGiveFrom}
                                                        selectedValue={this.state.flowObject.giveData.giveFrom.value}
                                                        name="giveFrom"
                                                        parentInputChange={this.handleInputChange}
                                                        parentOnBlurChange={this.handleOnInputBlur}
                                                        formatMessage={formatMessage}
                                                    />
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
                                                    {/* {accountTopUpComponent}
                                                    {stripeCardComponent} */}
                                                    <Form.Button
                                                        primary
                                                        className="blue-btn-rounded btn_right"// {isMobile ? 'mobBtnPadding' : 'btnPadding'}
                                                        // content={(!creditCardApiCall) ? formatMessage('giveCommon:continueButton')
                                                        //     : formatMessage('giveCommon:submittingButton')}
                                                        content="Review"
                                                        disabled={(creditCardApiCall) || !this.props.userAccountsFetched}
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
        );
    }
}

Friend.defaultProps = Object.assign({}, p2pDefaultProps);

function mapStateToProps(state) {
    return {
        companiesAccountsData: state.user.companiesAccountsData,
        companyDetails: state.give.companyData,
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
    };
}

export default withTranslation([
    'giveCommon',
    'friends',
    'accountTopUp',
    'dropDownAccountOptions',
])(connect(mapStateToProps)(Friend));
