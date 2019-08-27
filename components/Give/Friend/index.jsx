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

import {
    formatCurrency,
    resetP2pDataForOnInputChange,
    formatAmount,
    validateGiveForm,
    populateDonationMatch,
    populatePaymentInstrument,
    resetDataForAccountChange,
    getDefaultCreditCard,
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
            }
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
            buttonClicked: false,
            dropDownOptions: {
                donationMatchList: populateDonationMatch(donationMatchData, formatMessage, language),
                // giveFromList: accountOptions,
                paymentInstrumentList: populatePaymentInstrument(paymentInstruments, formatMessage),
            },
            flowObject: payload,
            // forceContinue: props.forceContinue,
            inValidCardNameValue: true,
            inValidCardNumber: true,
            inValidCvv: true,
            inValidExpirationDate: true,
            inValidNameOnCard: true,
            userEmail: email,
            validity: this.initializeValidations(),
        };
        // if (userAccountsFetched) {
        //     const giveData = Friend.setGiveFrom(
        //         this.state.flowObject.giveData,
        //         fund,
        //         id,
        //         // accountOptions,
        //         `${firstName} ${lastName}`,
        //         // props.intl,
        //         formatNumber,
        //     );
        //     this.state.flowObject.giveData.giveFrom = giveData.giveFrom;
        // }

        // this.dimissErrors();
        
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
                }
            } = this.props;
            console.log(this.props);
            const formatMessage = this.props.t;
            let paymentInstruments = null;
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
        const isNumber = /^\d+(\.\d*)?$/;
        if ((name === 'giveAmount' || name === 'donationAmount') && !_.isEmpty(value) && value.match(isNumber)) {
            giveData[name] = formatAmount(value);
            inputValue = formatAmount(value);
        }
        const coverFeesAmount = 0;
        if (name !== 'coverFees' && name !== 'giftType' && name !== 'giveFrom') {
            validity = validateGiveForm(name, inputValue, validity, giveData, coverFeesAmount);
        }
        switch (name) {
            case 'giveAmount':
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
        const newValue = (!_.isEmpty(options)) ? _.find(options, { value }) : value;
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
        } = this.props;
        // let { forceContinue } = this.state;
        const {
            giveData: {
                creditCard,
            },
        } = flowObject;
        this.setState({
            buttonClicked: true,
        });
        const validateCC = this.isValidCC(
            creditCard,
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
        );
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
            dismissAllUxCritialErrors(this.props.dispatch);
            dispatch(proceed(flowObject, flowSteps[stepIndex + 1], stepIndex));
        } else {
            this.setState({
                buttonClicked: false,
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

    static renderTotalP2pGiveAmount(totalP2pGiveAmount, giveAmount, length, formatMessage, language, currency, formatCurrency) {
        return (totalP2pGiveAmount > 0 && (
            <Form.Field>
                <label>
                    {formatMessage('friends:totalAmountLabel')}
                </label>
                {(length > 1) && (
                    formatMessage('friends:totalAmount',
                        {
                            giveAmount: formatCurrency(giveAmount, language, currency),
                            numberOfRecipients: length,
                            totalP2pGiveAmount: formatCurrency(totalP2pGiveAmount, language, currency),
                        })
                )}
                {(length === 1) && (
                    formatMessage('friends:giveAmount',
                        {
                            giveAmount: formatCurrency(giveAmount, language, currency),
                        })
                )}
            </Form.Field>
        )
        );
    }

    render() {
        const {
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
                    giveAmount,
                    giveFrom,
                    noteToRecipients,
                    noteToSelf,
                    recipients,
                    totalP2pGiveAmount,
                },
                type,
            },
            dropDownOptions: {
                donationMatchList,
                // giveFromList,
                paymentInstrumentList,
            },
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
            validity,
        } = this.state;

        let accountTopUpComponent = null;
        let stripeCardComponent = null;
        const recipientsList = recipients.join(',');

        if (
            (giveFrom.type === 'user' || giveFrom.type === 'companies')
            && (totalP2pGiveAmount > Number(giveFrom.balance))
        ) {
            const topupAmount = formatAmount((formatAmount(totalP2pGiveAmount)
            - formatAmount(giveFrom.balance)));
            accountTopUpComponent = (
                <AccountTopUp
                    creditCard={creditCard}
                    donationAmount={donationAmount}
                    donationMatch={donationMatch}
                    donationMatchList={donationMatchList}
                    formatMessage={formatMessage}
                    getStripeCreditCard={this.getStripeCreditCard}
                    handleInputChange={this.handleInputChange}
                    handleOnInputBlur={this.handleOnInputBlur}
                    isAmountFieldVisible
                    isDonationMatchFieldVisible={giveFrom.type === 'user'}
                    paymentInstrumentList={paymentInstrumentList}
                    topupAmount={topupAmount}
                    validity={validity}
                />
            );
            if ((_isEmpty(paymentInstrumentList) && giveFrom.value) || creditCard.value === 0) {
                stripeCardComponent = (
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
                );
            }
        }
        return (
            <Form onSubmit={this.handleSubmit}>
                <Fragment>
                    <Form.Field>
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
                            value={giveAmount}
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
                        errorMessage={formatMessage('giveCommon:errorMessages.invalidMaxAmountError')}
                    />
                    <FormValidationErrorMessage
                        condition={!validity.isAmountCoverGive}
                        errorMessage={formatMessage('giveCommon:errorMessages.giveAmountGreaterThanBalance')}
                    />

                    <DropDownAccountOptions
                        type={type}
                        validity={validity.isValidGiveFrom}
                        selectedValue={this.state.flowObject.giveData.giveFrom.value}
                        name="giveFrom"
                        parentInputChange={this.handleInputChange}
                        parentOnBlurChange={this.handleOnInputBlur}
                        formatMessage={formatMessage}
                    />
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
                    />
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
                    {
                        Friend.renderTotalP2pGiveAmount(
                            totalP2pGiveAmount,
                            giveAmount,
                            parseEmails(recipients).length,
                            formatMessage,
                            language,
                            currency,
                            formatCurrency,
                        )
                    }

                    {accountTopUpComponent}
                    {stripeCardComponent}
                    <Form.Field>
                        <Divider className="dividerMargin" />
                    </Form.Field>
                    <Form.Field>
                        <Header as="h3" className="f-weight-n">{formatMessage('friends:includeMessageLabel')}</Header>
                    </Form.Field>
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
                    <Divider hidden />
                    <Form.Button
                        primary
                        className="blue-btn-rounded"// {isMobile ? 'mobBtnPadding' : 'btnPadding'}
                        content={(!this.state.buttonClicked) ? formatMessage('giveCommon:continueButton')
                            : formatMessage('giveCommon:submittingButton')}
                        disabled={(this.state.buttonClicked) || !this.props.userAccountsFetched}
                        type="submit"
                    />
                </Fragment>
            </Form>
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
    };
}

export default withTranslation([
    'giveCommon',
    'friends',
    'accountTopUp',
    'dropDownAccountOptions',
])(connect(mapStateToProps)(Friend));
