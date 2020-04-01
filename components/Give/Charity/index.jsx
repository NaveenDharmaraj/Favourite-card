import React, {
    Fragment,
} from 'react';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import getConfig from 'next/config';
import _isEmpty from 'lodash/isEmpty';
import _merge from 'lodash/merge';
import _replace from 'lodash/replace';
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import {
    Checkbox,
    Container,
    Divider,
    Form,
    Grid,
    Header,
    Icon,
    Image,
    Input,
    List,
    Modal,
    Select,
} from 'semantic-ui-react';
import _find from 'lodash/find';
import _isEqual from 'lodash/isEqual';
import _every from 'lodash/every';
import {
    Elements,
    StripeProvider,
} from 'react-stripe-elements';
import {
    connect,
} from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import { Link } from '../../../routes';
import CharityAmountField from '../DonationAmountField';
import { beneficiaryDefaultProps } from '../../../helpers/give/defaultProps';
import { getDonationMatchAndPaymentInstruments } from '../../../actions/user';
import {
    formatCurrency,
    formatAmount,
    getDefaultCreditCard,
    populateDonationMatch,
    populateGiveToGroupsofUser,
    populateGiftType,
    populatePaymentInstrument,
    populateInfoToShare,
    resetDataForGiveAmountChange,
    resetDataForAccountChange,
    resetDataForGiftTypeChange,
    setDonationAmount,
    validateGiveForm,
    validateDonationForm,
} from '../../../helpers/give/utils';
import {
    actionTypes,
    getCoverAmount,
    getCompanyPaymentAndTax,
    getBeneficiariesForGroup,
    getBeneficiaryFromSlug,
    proceed,
} from '../../../actions/give';
import '../../../static/less/giveFlows.less';
import IconCharity from '../../../static/images/no-data-avatar-charity-profile.png';
import IconGroup from '../../../static/images/no-data-avatar-giving-group-profile.png';
import IconIndividual from '../../../static/images/no-data-avatar-group-chat-profile.png';
import FlowBreadcrumbs from '../FlowBreadcrumbs';
import ReloadAddAmount from '../ReloadAddAmount';
import { withTranslation } from '../../../i18n';
import '../../shared/style/styles.less';
import { dismissAllUxCritialErrors } from '../../../actions/error';
import { Router } from '../../../routes';
const CreditCard = dynamic(() => import('../../shared/CreditCard'));
const FormValidationErrorMessage = dynamic(() => import('../../shared/FormValidationErrorMessage'));
const NoteTo = dynamic(() => import('../NoteTo'));
const DedicateType = dynamic(() => import('../DedicateGift'), { ssr: false });
const SpecialInstruction = dynamic(() => import('../SpecialInstruction'));
const AccountTopUp = dynamic(() => import('../AccountTopUp'));
const DropDownAccountOptions = dynamic(() => import('../../shared/DropDownAccountOptions'));

const { publicRuntimeConfig } = getConfig();

const {
    STRIPE_KEY,
} = publicRuntimeConfig;


class Charity extends React.Component {
    constructor(props) {
        super(props);
        const {
            companyDetails,
            companiesAccountsData,
            currentUser: {
                attributes: {
                    displayName,
                    firstName,
                    email,
                    lastName,
                },
            },
            donationMatchData,
            fund,
            groupId,
            sourceAccountHolderId,
            id,
            paymentInstrumentsData,
            userCampaigns,
            userGroups,
            giveGroupBenificairyDetails,
            giveCharityDetails,
            taxReceiptProfiles,
            i18n: {
                language,
            }
        } = props;
        let currentSourceAccountHolderId = null;
        let currentGroupId = null;
        if (!_isEmpty(sourceAccountHolderId)
            && Number(sourceAccountHolderId) > 0) {
            currentSourceAccountHolderId = sourceAccountHolderId;
        }
        if (!_isEmpty(groupId)
            && Number(groupId) > 0) {
            currentGroupId = groupId;
        }
        const paymentInstruments = (!_isEmpty(props.flowObject.giveData.giveFrom) && props.flowObject.giveData.giveFrom.type === 'companies') ? companyDetails.companyPaymentInstrumentsData : paymentInstrumentsData;
        const formatMessage = props.t;
        const flowType = _replace(props.baseUrl, /\//, '');
        let payload = null;
        //Initialize the flowObject to default value when got switched from other flows
        if (props.flowObject.type !== flowType) {
            const defaultPropsData = _.merge({}, beneficiaryDefaultProps);
            payload = {
                ...defaultPropsData.flowObject,
                nextStep: props.step,
            };
        }
        else {
            payload = _merge({}, props.flowObject);
        }
        this.state = {
            benificiaryIndex: 0,
            dropDownOptions: {
                donationMatchList: populateDonationMatch(donationMatchData, formatMessage),
                giftTypeList: populateGiftType(formatMessage),
                giveToList: populateGiveToGroupsofUser(giveGroupBenificairyDetails),
                infoToShareList: populateInfoToShare(
                    taxReceiptProfiles,
                    companyDetails,
                    payload.giveData.giveFrom,
                    {
                        displayName: `${firstName} ${lastName}`,
                        email,
                    },
                    formatMessage,
                ),
                paymentInstrumentList: populatePaymentInstrument(paymentInstruments, formatMessage),

            },
            findAnotherRecipientLabel: 'Find another recipient',
            flowObject: _.cloneDeep(payload),
            inValidCardNameValue: true,
            inValidCardNumber: true,
            inValidCvv: true,
            inValidExpirationDate: true,
            inValidNameOnCard: true,
            showAnotherRecipient: false,
            showModal: false,
            reviewBtnFlag: false,
            validity: this.intializeValidations(),
        };
        if (this.state.flowObject.giveData.giveTo.value === null) {
            if (!_isEmpty(giveCharityDetails) && !_isEmpty(giveCharityDetails.charityDetails)) {
                this.state.flowObject.groupFromUrl = false;
                this.state.flowObject.giveData.giveTo = {
                    eftEnabled: giveCharityDetails.charityDetails.attributes.eftEnabled,
                    id: giveCharityDetails.charityDetails.id,
                    name: giveCharityDetails.charityDetails.attributes.name,
                    text: giveCharityDetails.charityDetails.attributes.name,
                    type: giveCharityDetails.charityDetails.type,
                    value: giveCharityDetails.charityDetails.attributes.fundId,
                };
            } else if (!_isEmpty(giveGroupBenificairyDetails)) {
                const benIndex = this.state.benificiaryIndex;
                this.state.flowObject.giveData.giveTo = {
                    eftEnabled:
                        giveGroupBenificairyDetails.benificiaryDetails[benIndex].attributes.eftEnabled,
                    id: giveGroupBenificairyDetails.benificiaryDetails[benIndex].attributes.fundId,
                    name: giveGroupBenificairyDetails.benificiaryDetails[benIndex].attributes.name,
                    text: giveGroupBenificairyDetails.benificiaryDetails[benIndex].attributes.name,
                    type: 'beneficiaries',
                    value:
                        giveGroupBenificairyDetails.benificiaryDetails[benIndex].attributes.fundId,
                };
                this.state.flowObject.groupFromUrl = true;
            }
        }
        this.state.flowObject.sourceAccountHolderId = currentSourceAccountHolderId;
        this.state.flowObject.groupId = currentGroupId;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChangeGiveTo = this.handleInputChangeGiveTo.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFindAnotherRecipient = this.handleFindAnotherRecipient.bind(this);
        this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.getStripeCreditCard = this.getStripeCreditCard.bind(this);

        this.validateStripeCreditCardNo = this.validateStripeCreditCardNo.bind(this);
        this.validateStripeExpirationDate = this.validateStripeExpirationDate.bind(this);
        this.validateCreditCardCvv = this.validateCreditCardCvv.bind(this);
        this.validateCreditCardName = this.validateCreditCardName.bind(this);
        this.getStripeCreditCard = this.getStripeCreditCard.bind(this);
        dismissAllUxCritialErrors(props.dispatch);
    }

    componentDidMount() {
        const {
            currentUser: {
                id,
            },
            dispatch,
            groupId,
            slug,
        } = this.props;
        const {
            flowObject: {
                giveData,
            },
        } = this.state;
        if (!_isEmpty(giveData) && !_isEmpty(giveData.giveFrom) &&
            _isEmpty(giveData.giveFrom.value)) {
            dispatch({
                payload: {
                    coverAmountDisplay: 0,
                },
                type: 'COVER_AMOUNT_DISPLAY',
            });
        }
        if (Number(groupId) > 0) {
            getBeneficiariesForGroup(dispatch, Number(groupId));
        } else if (slug != null) {
            getBeneficiaryFromSlug(dispatch, slug);
        } else {
            Router.pushRoute('/dashboard');
        }
        window.scrollTo(0, 0);
        dispatch(getDonationMatchAndPaymentInstruments(id));
    }

    componentDidUpdate(prevProps) {
        if (!_isEqual(this.props, prevProps)) {
            const {
                benificiaryIndex,
                dropDownOptions,
            } = this.state;
            let {
                flowObject: {
                    giveData,
                },
                groupFromUrl,
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
                giveCharityDetails,
                giveGroupBenificairyDetails,
                groupId,
                slug,
                taxReceiptProfiles,
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
            const giveToOptions = populateGiveToGroupsofUser(giveGroupBenificairyDetails);
            const donationMatchOptions = populateDonationMatch(donationMatchData, formatMessage);
            if (!_isEmpty(giveCharityDetails) && !_isEmpty(giveCharityDetails.charityDetails)) {
                groupFromUrl = false;
                giveData.giveTo = {
                    avatar: giveCharityDetails.charityDetails.attributes.avatar,
                    eftEnabled: giveCharityDetails.charityDetails.attributes.eftEnabled,
                    id: giveCharityDetails.charityDetails.id,
                    name: giveCharityDetails.charityDetails.attributes.name,
                    text: giveCharityDetails.charityDetails.attributes.name,
                    type: giveCharityDetails.charityDetails.type,
                    value: giveCharityDetails.charityDetails.attributes.fundId,
                };
            } else if (!_isEmpty(giveGroupBenificairyDetails) && !_isEmpty(giveGroupBenificairyDetails.benificiaryDetails)) {
                groupFromUrl = true;
                giveData.giveTo = {
                    avatar: giveGroupBenificairyDetails.benificiaryDetails[benificiaryIndex].attributes.avatar,
                    eftEnabled: giveGroupBenificairyDetails.benificiaryDetails[benificiaryIndex].attributes.eftEnabled,
                    id: giveGroupBenificairyDetails.benificiaryDetails[benificiaryIndex].attributes.fundId,
                    name: giveGroupBenificairyDetails.benificiaryDetails[benificiaryIndex].attributes.name,
                    text: giveGroupBenificairyDetails.benificiaryDetails[benificiaryIndex].attributes.name,
                    type: 'beneficiaries',
                    value: giveGroupBenificairyDetails.benificiaryDetails[benificiaryIndex].attributes.fundId,
                };
            } else if (!_isEqual(giveGroupBenificairyDetails, prevProps.giveGroupBenificairyDetails)) {
                if (_isEmpty(giveGroupBenificairyDetails))
                    Router.pushRoute('/dashboard');
            }
            if (!_isEmpty(fund)) {
                giveData = Charity.initFields(
                    giveData, fund, id, avatar, paymentInstrumentOptions,
                    companyPaymentInstrumentChanged,
                    `${firstName} ${lastName}`, companiesAccountsData, userGroups, userCampaigns,
                    giveGroupBenificairyDetails, groupId
                );
            }
            this.setState({
                dropDownOptions: {
                    ...dropDownOptions,
                    donationMatchList: donationMatchOptions,
                    giftTypeList: populateGiftType(formatMessage),
                    giveToList: giveToOptions,
                    infoToShareList: populateInfoToShare(
                        taxReceiptProfiles,
                        companyDetails,
                        giveData.giveFrom,
                        {
                            displayName: `${firstName} ${lastName}`,
                            email,
                        },
                        formatMessage,
                    ),
                    paymentInstrumentList: paymentInstrumentOptions,
                },
                flowObject: {
                    ...this.state.flowObject,
                    giveData,
                    groupFromUrl,
                    slugValue: slug,
                },
            });
            if (!_isEmpty(this.props.appErrors) && this.props.appErrors.length > 0) {
                window.scrollTo(0, 0);
            }
        }
    }

    /**
     * Init feilds on componentWillReceiveProps.
     * @param {object} giveData full form data.
     * @param {object} fund user fund details from API.
     * @param {String} id user id from API.
     * @param {object[]} paymentInstrumentOptions creditcard list.
     * @param {boolean} companyPaymentInstrumentChanged creditcard changed or not.
     * @param {String} name user name from API.
     * @return {object} full form data.
     */

    // eslint-disable-next-line react/sort-comp
    static initFields(giveData, fund, id, avatar, paymentInstrumentOptions,
        companyPaymentInstrumentChanged, name, companiesAccountsData, userGroups, userCampaigns, giveGroupBenificairyDetails, groupId) {
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
            giveData.giveFrom.text = `${fund.attributes.name} ($${fund.attributes.balance})`;
            giveData.giveFrom.balance = fund.attributes.balance;
            giveData.giveFrom.name = name;
        } else if (!_isEmpty(companiesAccountsData) && !_isEmpty(userGroups) && !_isEmpty(userCampaigns) && !giveData.userInteracted) {
            if (!_isEmpty(giveGroupBenificairyDetails) && !_isEmpty(giveGroupBenificairyDetails.benificiaryDetails)) {
                const defaultGroupFrom = userGroups.find((userGroup) => userGroup.id === groupId);
                if (!_isEmpty(defaultGroupFrom)) {
                    giveData.giveFrom.value = defaultGroupFrom.attributes.fundId;
                    giveData.giveFrom.name = defaultGroupFrom.attributes.name;
                    giveData.giveFrom.avatar = defaultGroupFrom.attributes.avatar,
                        giveData.giveFrom.id = defaultGroupFrom.id;
                    giveData.giveFrom.type = defaultGroupFrom.type;
                    giveData.giveFrom.text = `${defaultGroupFrom.attributes.name} ($${defaultGroupFrom.attributes.balance})`;
                    giveData.giveFrom.balance = defaultGroupFrom.attributes.balance;
                    giveData.giveFrom.slug = defaultGroupFrom.attributes.slug;
                }
            }
            else {
                giveData.giveFrom = {
                    value: '',
                };
            }

        }
        return giveData;
    }

    /**
     * Get cover fees amount from props.
     * @param {object} giveData full form data.
     * @param {object} coverFeesData coverfees data from API.
     * @return {Number} Fees amount.
     */
    static getCoverFeesAmount(giveData, coverFeesData) {
        return (giveData.coverFees && !_isEmpty(coverFeesData)
            && !_isEmpty(coverFeesData) && coverFeesData.giveAmountFees
        ) ? coverFeesData.giveAmountFees : 0;
    }

    /**
     * intializeValidations set validity status to true
     * @return {void}
     */
    intializeValidations() {
        this.validity = {
            doesAmountExist: true,
            isAmountCoverGive: true,
            isAmountLessThanOneBillion: true,
            isAmountMoreThanOneDollor: true,
            isDedicateGiftEmpty: true,
            isDonationAmountBlank: true,
            isDonationAmountCoverGive: true,
            isDonationAmountLessThan1Billion: true,
            isDonationAmountMoreThan1Dollor: true,
            isDonationAmountPositive: true,
            isNoteToCharityInLimit: true,
            isNoteToSelfInLimit: true,
            isValidAddingToSource: true,
            isValidDecimalAmount: true,
            isValidDecimalDonationAmount: true,
            isValidDonationAmount: true,
            isValidGiveAmount: true,
            isValidGiveFrom: true,
            isValidNoteSelfText: true,
            isValidNoteToCharity: true,
            isValidNoteToCharityText: true,
            isValidNoteToSelf: true,
            isValidPositiveNumber: true,
        };
        return this.validity;
    }

    /**
     * Validate the entire form fields.
     * @return {boolean}
     */
    validateForm() {
        const {
            flowObject: {
                giveData,
            },
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
        } = this.state;
        let {
            validity,
        } = this.state;
        const {
            coverFeesData,
        } = this.props;
        const coverFeesAmount = Charity.getCoverFeesAmount(giveData, coverFeesData);
        validity = validateGiveForm('donationAmount', giveData.donationAmount, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('giveAmount', giveData.giveAmount, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('giveFrom', giveData.giveFrom.value, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('noteToSelf', giveData.noteToSelf, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('noteToCharity', giveData.noteToCharity, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('dedicateType', null, validity, giveData);
        this.setState({ validity });
        let validateCC = true;
        if (giveData.creditCard.value === 0) {
            this.CreditCard.handleOnLoad(
                inValidCardNumber, inValidExpirationDate, inValidNameOnCard,
                inValidCvv, inValidCardNameValue,
            );
            validateCC = (!inValidCardNumber && !inValidExpirationDate &&
                !inValidNameOnCard && !inValidCvv && !inValidCardNameValue);
        }
        return _every(validity) && validateCC;
    }

    /**
     * Validate the input in which the blur event triggered,
     * and calls coverfees API if it is giveAmount or giveFrom
     * @param  {Event} event The Event instance object.
     * @param  {object} data The Options of event
     * @return {Void} { void } The return nothing.
     */
    handleInputOnBlur(event, data) {
        const {
            name,
            value,
        } = !_isEmpty(data) ? data : event.target;
        const {
            flowObject: {
                giveData,
            },
        } = this.state;
        let {
            validity,
        } = this.state;
        const {
            coverFeesData,
            dispatch,
        } = this.props;
        let inputValue = value;
        const isNumber = /^(?:[0-9]+,)*[0-9]+(?:\.[0-9]+)?$/;
        if ((name === 'giveAmount' || name === 'donationAmount') && !_isEmpty(value) && value.match(isNumber)) {
            inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
            giveData[name] = inputValue;
        }
        const coverFeesAmount = Charity.getCoverFeesAmount(giveData, coverFeesData);
        if (Number(giveData.giveFrom.value) > 0 && Number(giveData.giveAmount) > 0) {
            getCoverAmount(giveData.giveFrom.value, giveData.giveAmount, dispatch);
        } else {
            getCoverAmount(giveData.giveFrom.value, 0, dispatch);
        }
        if (name !== 'giftType' && name !== 'giveFrom') {
            validity = validateGiveForm(name, inputValue, validity, giveData, coverFeesAmount);
        }
        switch (name) {
            case 'giveAmount':
                validity = validateGiveForm('donationAmount', giveData.donationAmount, validity, giveData, coverFeesAmount);
                giveData['formatedCharityAmount'] = _.replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
                break;
            case 'giveFrom':
                validity = validateGiveForm('giveAmount', giveData.giveAmount, validity, giveData, coverFeesAmount);
                validity = validateGiveForm('donationAmount', giveData.donationAmount, validity, giveData, coverFeesAmount);
                break;
            case 'donationAmount':
                giveData['formatedDonationAmount'] = _.replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
                break;
            case 'inHonorOf':
            case 'inMemoryOf':
                validity = validateGiveForm('dedicateType', null, validity, giveData);
                break;
            case 'noteToCharity':
                giveData[name] = inputValue.trim();
                validity = validateGiveForm('noteToCharity', giveData.noteToCharity, validity, giveData, coverFeesAmount);
                break;
            case 'noteToSelf':
                giveData[name] = inputValue.trim();
                validity = validateGiveForm('noteToSelf', giveData.noteToSelf, validity, giveData, coverFeesAmount);
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
     * Synchronise form data with React state
     * @param  {Event} event The Event instance object.
     * @param  {object} data The Options of event
     * @return {Void} { void } The return nothing.
     */
    handleInputChange(event, data) {
        const {
            name,
            newIndex,
            options,
            value,
        } = data;
        let {
            flowObject: {
                giveData,
            },
            dropDownOptions,
            selectedCreditCard,
            validity,
        } = this.state;
        const {
            flowObject: {
                type,
            },
        } = this.state;
        const {
            coverFeesData,
            dispatch,
        } = this.props;
        let newValue = (!_isEmpty(options)) ? _find(options, { value }) : value;
        if (name === 'coverFees') {
            const {
                target,
            } = event;
            newValue = target.checked;
        }
        if (name === 'inHonorOf' || name === 'inMemoryOf') {
            if (newIndex === -1) {
                giveData.dedicateGift.dedicateType = '';
                giveData.dedicateGift.dedicateValue = '';
            }
            else {
                giveData.dedicateGift.dedicateType = name;
                giveData.dedicateGift.dedicateValue = value;
            }
            validity.isDedicateGiftEmpty = true;
            this.setState({

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
        if (name !== 'inHonorOf' && name !== 'inMemoryOf') {
            giveData[name] = newValue;
            giveData.userInteracted = true;
            switch (name) {
                case 'donationAmount':
                    giveData['formatedDonationAmount'] = newValue;
                    break;
                case 'giveFrom':
                    const {
                        modifiedDropDownOptions,
                        modifiedGiveData,
                    } = resetDataForAccountChange(
                        giveData, dropDownOptions, this.props, type,
                    );
                    giveData = modifiedGiveData;
                    dropDownOptions = modifiedDropDownOptions;
                    const coverFeesAmount = Charity.getCoverFeesAmount(giveData, coverFeesData);
                    validity = validateGiveForm(
                        name, giveData[name], validity, giveData, coverFeesAmount,
                    );
                    if (giveData.giveFrom.type === 'companies') {
                        getCompanyPaymentAndTax(dispatch, Number(giveData.giveFrom.id));
                    }
                    break;
                case 'giftType':
                    giveData = resetDataForGiftTypeChange(giveData, dropDownOptions, coverFeesData);
                    break;
                case 'giveAmount':
                    giveData[name] = formatAmount(parseFloat(newValue.replace(/,/g, '')));
                    giveData['formatedCharityAmount'] = newValue;
                    giveData = resetDataForGiveAmountChange(
                        giveData, dropDownOptions, coverFeesData,
                    );
                    break;
                default: break;
            }
            this.setState({
                dropDownOptions: {
                    ...this.state.dropDownOptions,
                    dropDownOptions,
                },
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

    handlePresetAmountClick = (event, data) => {
        const {
            value,
        } = data;
        const inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
        const formatedCharityAmount = _.replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
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
                    giveAmount: inputValue,
                    formatedCharityAmount,
                }
            },
            validity,
        });
    }

    handleSubmit() {
        debugger;
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
            coverFeesData,
            defaultTaxReceiptProfile,
            flowSteps,
            stepIndex,
        } = this.props;
        const {
            giveData: {
                creditCard,
                coverFees,
                giveFrom,
                giveAmount,
            },
        } = flowObject;
        const { giveData } = flowObject;
        const validateCC = this.isValidCC(
            creditCard,
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
        );
        if ((giveData.giveFrom.type === 'user' || giveData.giveFrom.type === 'companies') && Number(giveData.giveAmount) > Number(giveFrom.balance)) {
            this.setState({
                reviewBtnFlag: true
            })
        }
        else {
            if (this.validateForm() && validateCC) {
                if (creditCard.value > 0) {
                    flowObject.selectedTaxReceiptProfile = (flowObject.giveData.giveFrom.type === 'companies') ?
                        companyDetails.companyDefaultTaxReceiptProfile :
                        defaultTaxReceiptProfile;
                }
                flowObject.giveData.coverFeesAmount = (coverFees) ?
                    coverFeesData.giveAmountFees : null;
                flowObject.stepsCompleted = false;
                dismissAllUxCritialErrors(this.props.dispatch);
                dispatch(proceed(flowObject, flowSteps[stepIndex + 1], stepIndex));
            }
            this.setState({
                reviewBtnFlag: false
            })
        }
       
    }

        handleInputChangeGiveTo(event, data) {
            const {
                options,
                value,
            } = data;
            const {
                flowObject: {
                    giveData: {
                        giveTo,
                    },
                },
            } = this.state;
            const {
                giveGroupBenificairyDetails,
            } = this.props;

            const dataBenificairies = giveGroupBenificairyDetails.benificiaryDetails;
            const arrayId = options[data.options.findIndex((p) => p.value === value)].id;
            const benificiaryIndex = dataBenificairies.findIndex((p) => p.id === arrayId);
            const benificiaryData = dataBenificairies[benificiaryIndex];
            giveTo.id = benificiaryData.id;
            giveTo.name = benificiaryData.attributes.name;
            giveTo.text = benificiaryData.attributes.name;
            giveTo.type = 'beneficiaries';
            giveTo.value = value;

            this.setState({
                benificiaryIndex,
                flowObject: {
                    ...this.state.flowObject,
                    giveData: {
                        ...this.state.flowObject.giveData,
                        giveTo,
                    },
                },

            });
        }

        handleFindAnotherRecipient() {
            const {
                showAnotherRecipient,
            } = this.state;
            const formatMessage = this.props.t;
            this.setState({
                findAnotherRecipientLabel: showAnotherRecipient
                    ? formatMessage('findAnotherRecipientMessage')
                    : formatMessage('findAnotherRecipientCancel'),
                showAnotherRecipient: !showAnotherRecipient,
            });
        }

        /**
         * Render find another recipent.
         * @param {boolean} showAnotherRecipient for toggling.
         * @param {string} friendUrlEndpoint end point for user.
         * @param {string} groupUrlEndpoint group end point.
         * @param {function} formatMessage I18 formatting.
         * @param {string} findAnotherRecipientLabel lable text.
         * @return {JSX} JSX representing  find another recipent fields.
         */
        renderFindAnotherRecipient(
            showAnotherRecipient,
            friendUrlEndpoint,
            groupUrlEndpoint,
            findAnotherRecipientLabel,
            formatMessage,
        ) {
            return (
                <Fragment>
                    <Form.Field className="lnk-FindAnother">
                        <div
                            className="achPointer"
                            onClick={this.handleFindAnotherRecipient}
                        >
                            {findAnotherRecipientLabel}
                        </div>
                    </Form.Field>
                    {!!showAnotherRecipient && (
                        <Form.Field className="lnk-FindAnother">
                            <List className="lstRecipient" verticalAlign="middle" horizontal>
                                <Link route='/give'>
                                    <List.Item className="lstitm">
                                        <Image
                                            className="imgCls lst-img"
                                            src={IconCharity}
                                        />
                                        <List.Content className="lst-cnt">
                                            {formatMessage('goToCharityFirstLabel')}
                                            <br />
                                            {formatMessage('goToCharitySecondLabel')}
                                        </List.Content>
                                    </List.Item>
                                </Link>
                                <Link route={friendUrlEndpoint}>
                                    <List.Item className="lstitm">
                                        <Image
                                            className="imgCls"
                                            src={IconIndividual}
                                        />
                                        <List.Content className="lst-cnt">
                                            {formatMessage('goToFriendsFirstLabel')}
                                            <br />
                                            {formatMessage('goToFriendsSecondLabel')}
                                        </List.Content>
                                    </List.Item>
                                </Link>
                                <Link route={groupUrlEndpoint}>
                                    <List.Item className="lstitm">
                                        <Image
                                            className="imgCls"
                                            src={IconGroup}
                                        />
                                        <List.Content className="lst-cnt">
                                            {formatMessage('goToGroupFirstLabel')}
                                            <br />
                                            {formatMessage('goToGroupSecondLabel')}
                                        </List.Content>
                                    </List.Item>
                                </Link>
                            </List>
                        </Form.Field>
                    )
                    }
                </Fragment>
            );
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

        /**
         * Render the SpecialInstruction component.
         * @param {object} giveFrom give from field data.
         * @param {function} formatMessage I18 formatting.
         * @param {object} giftType gift type value.
         * @param {object[]} giftTypeList the list of gift type options.
         * @param {object} infoToShare selected info to share.
         * @param {object[]} infoToShareList info to share options.
         * @return {JSX} JSX representing payment fields.
         */
        renderSpecialInstructionComponent(
            giveFrom, giftType, giftTypeList, infoToShare, infoToShareList, formatMessage
            , paymentInstrumentList, defaultTaxReceiptProfile, companyDetails, giveData
        ) {
            if (!_isEmpty(giveFrom) && giveFrom.value > 0) {
                return (
                    <SpecialInstruction
                        giftType={giftType}
                        giftTypeList={giftTypeList}
                        giveFrom={giveFrom}
                        handleInputChange={this.handleInputChange}
                        infoToShare={infoToShare}
                        infoToShareList={infoToShareList}
                        formatMessage={formatMessage}
                        paymentInstrumentList={paymentInstrumentList}
                        defaultTaxReceiptProfile={defaultTaxReceiptProfile}
                        companyDetails={companyDetails}
                        companyAccountsFetched={this.props.companyAccountsFetched}
                        userAccountsFetched={this.props.userAccountsFetched}
                        slug={this.props.slug}
                        giveData={giveData}
                        handlegiftTypeButtonClick={this.handlegiftTypeButtonClick}
                    />
                );
            }
            return null;
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

        render() {
            const {
                companyDetails,
                coverAmountDisplay,
                coverFeesData,
                creditCardApiCall,
                defaultTaxReceiptProfile,
                currentStep,
                flowSteps,
                i18n: {
                    language,
                }
            } = this.props;
            const {
                flowObject: {
                    giveData: {
                        coverFees,
                        creditCard,
                        dedicateGift: {
                            dedicateType,
                            dedicateValue,
                        },
                        donationAmount,
                        donationMatch,
                        formatedCharityAmount,
                        formatedDonationAmount,
                        giftType,
                        giveTo,
                        giveAmount,
                        giveFrom,
                        infoToShare,
                        noteToCharity,
                        noteToSelf,
                    },
                    groupFromUrl,
                    sourceAccountHolderId,
                    stepsCompleted,
                    type,
                },
                dropDownOptions: {
                    donationMatchList,
                    giftTypeList,
                    giveFromList,
                    giveToList,
                    infoToShareList,
                    paymentInstrumentList,
                },
                findAnotherRecipientLabel,
                inValidCardNumber,
                inValidExpirationDate,
                inValidNameOnCard,
                inValidCvv,
                inValidCardNameValue,
                showAnotherRecipient,
                validity,
            } = this.state;
            const { flowObject } = this.state;
            const { giveData } = flowObject;
            let accountTopUpComponent = null;
            let reloadAddAmount = null;
            let stripeCardComponent = null;
            const groupUrlEndpoint = Number(sourceAccountHolderId) > 0 ? `/give/to/group/new?source_account_holder_id=${sourceAccountHolderId}` : null;
            const friendUrlEndpoint = `/give/to/friend/new`;
            const formatMessage = this.props.t;
            const { reviewBtnFlag } = this.state;
            const giveAmountWithCoverFees = (coverFees)
                ? Number(giveAmount) + Number(coverFeesData.giveAmountFees)
                : Number(giveAmount);

            if ((giveFrom.type === 'user' || giveFrom.type === 'companies')
                && Number(giveData.giveAmount) > Number(giveFrom.balance)
                && (giftType.value === 0 && !reviewBtnFlag)) {
                reloadAddAmount = (<ReloadAddAmount />)
            }

            if ((giveFrom.type === 'user' || giveFrom.type === 'companies')
                && Number(giveData.giveAmount) > Number(giveFrom.balance) && reviewBtnFlag) {
                reloadAddAmount = (<p className="errorNote">There is not enough money in your account to send this gift.<a href="#"> Add money</a> to continue</p>)
            }

            if ((giveFrom.type === 'user' || giveFrom.type === 'companies')
                && (giftType.value === 0
                    && giveAmountWithCoverFees > Number(giveFrom.balance))
            ) {
                const topupAmount = formatAmount((formatAmount(giveAmountWithCoverFees)
                    - formatAmount(giveFrom.balance)));
                accountTopUpComponent = (
                    <AccountTopUp
                        creditCard={creditCard}
                        donationAmount={formatedDonationAmount}
                        donationMatch={donationMatch}
                        donationMatchList={donationMatchList}
                        formatMessage={formatMessage}
                        getStripeCreditCard={this.getStripeCreditCard}
                        handleInputChange={this.handleInputChange}
                        handleInputOnBlur={this.handleInputOnBlur}
                        isAmountFieldVisible={giftType.value === 0}
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
                <Fragment>
                    <div className="flowReviewbanner">
                        <Container>
                            <div className="flowReviewbannerText">
                                <Header as='h2'>Give To {giveTo.text}</Header>
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
                                                            <CharityAmountField
                                                                isGiveToCharity={true}
                                                                amount={giveData.formatedCharityAmount}
                                                                formatMessage={formatMessage}
                                                                handleInputChange={this.handleInputChange}
                                                                handleInputOnBlur={this.handleInputOnBlur}
                                                                handlePresetAmountClick={this.handlePresetAmountClick}
                                                                validity={validity}
                                                            />

                                                            <FormValidationErrorMessage
                                                                condition={!validity.isAmountLessThanOneBillion}
                                                                errorMessage={ReactHtmlParser(formatMessage('giveCommon:errorMessages.invalidMaxAmountError'))}
                                                            />
                                                            <FormValidationErrorMessage
                                                                condition={!validity.isAmountCoverGive}
                                                                errorMessage={formatMessage('giveCommon:errorMessages.giveAmountGreaterThanBalance')}
                                                            />

                                                            {
                                                                (!_isEmpty(coverAmountDisplay) && coverAmountDisplay > 0) &&
                                                                <p>
                                                                    {formatMessage('coverFeeLabel', {
                                                                        amount: formatCurrency(coverAmountDisplay, language, 'USD'),
                                                                    })}
                                                                    <Modal
                                                                        size="tiny"
                                                                        dimmer="inverted"
                                                                        closeIcon
                                                                        className="chimp-modal"
                                                                        open={this.state.showModal}
                                                                        onClose={() => { this.setState({ showModal: false }) }}
                                                                        trigger={
                                                                            <a
                                                                                onClick={() => this.setState({ showModal: true })}
                                                                                className="link border bold"
                                                                            >
                                                                                &nbsp;{formatMessage('learnMore')}
                                                                            </a>
                                                                        }
                                                                    >
                                                                        <Modal.Header>{formatMessage('coverFeeModalHeader')}</Modal.Header>
                                                                        <Modal.Content className="pb-2">
                                                                            {formatMessage('coverFeeModalContentFirst')}
                                                                            <br /><br />
                                                                            {formatMessage('coverFeeModalContentSecond')}
                                                                            <br /><br />
                                                                        </Modal.Content>
                                                                    </Modal>
                                                                </p>
                                                            }
                                                            <DropDownAccountOptions
                                                                type={type}
                                                                validity={validity.isValidGiveFrom}
                                                                selectedValue={this.state.flowObject.giveData.giveFrom.value}
                                                                name="giveFrom"
                                                                parentInputChange={this.handleInputChange}
                                                                parentOnBlurChange={this.handleInputOnBlur}
                                                                formatMessage={formatMessage}
                                                            />
                                                            {reloadAddAmount}

                                                            {this.renderSpecialInstructionComponent(
                                                                giveFrom,
                                                                giftType, giftTypeList, infoToShare, infoToShareList, formatMessage,
                                                                paymentInstrumentList, defaultTaxReceiptProfile, companyDetails, giveData, language
                                                            )}

                                                            <DedicateType
                                                                handleInputChange={this.handleInputChange}
                                                                handleInputOnBlur={this.handleInputOnBlur}
                                                                dedicateType={dedicateType}
                                                                dedicateValue={dedicateValue}
                                                                validity={validity}
                                                            />

                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                                <Grid className="to_space">
                                                    <Grid.Row className="to_space">
                                                        <Grid.Column mobile={16} tablet={16} computer={16}>
                                                            <NoteTo
                                                                allocationType={type}
                                                                formatMessage={formatMessage}
                                                                giveFrom={giveFrom}
                                                                noteToCharity={noteToCharity}
                                                                handleInputChange={this.handleInputChange}
                                                                handleInputOnBlur={this.handleInputOnBlur}
                                                                noteToSelf={noteToSelf}
                                                                validity={validity}
                                                            />
                                                            <Form.Button
                                                                primary
                                                                className="blue-btn-rounded btn_right"
                                                                content={reviewBtnFlag ? formatMessage('giveCommon:reviewButtonFlag') 
                                                                            :   formatMessage('giveCommon:reviewButton') }
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
    Charity.propTypes = {
        dispatch: PropTypes.func,
        stepIndex: PropTypes.number,
    };

    Charity.defaultProps = Object.assign({}, beneficiaryDefaultProps);

function mapStateToProps(state) {
    return {
        companiesAccountsData: state.user.companiesAccountsData,
        companyDetails: state.give.companyData,
        companyAccountsFetched: state.give.companyAccountsFetched,
        coverAmountDisplay: state.give.coverAmountDisplay,
        coverFeesData: state.give.coverFeesData,
        currentUser: state.user.info,
        giveCharityDetails: state.give.charityDetails,
        giveGroupBenificairyDetails: state.give.benificiaryForGroupDetails,
        taxReceiptProfiles: state.user.taxReceiptProfiles,
        userAccountsFetched: state.user.userAccountsFetched,
        userCampaigns: state.user.userCampaigns,
        userGroups: state.user.userGroups,
        creditCardApiCall: state.give.creditCardApiCall,
    };
}
export default withTranslation([
    'charity',
    'giveCommon',
    'accountTopUp',
    'noteTo',
    'specialInstruction',
])(connect(mapStateToProps)(Charity));