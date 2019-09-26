import React, {
    Fragment,
} from 'react';
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
    Divider,
    Form,
    Icon,
    Image,
    Input,
    List,
    Popup,
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
import { Link } from '../../../routes';
import { beneficiaryDefaultProps } from '../../../helpers/give/defaultProps';
import { getDonationMatchAndPaymentInstruments } from '../../../actions/user';
import {
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
} from '../../../helpers/give/utils';
import {
    actionTypes,
    getCompanyPaymentAndTax,
    getBeneficiariesForGroup,
    getBeneficiaryFromSlug,
    proceed,
} from '../../../actions/give';
import IconCharity from '../../../static/images/chimp-icon-charity.png';
import IconGroup from '../../../static/images/chimp-icon-giving-group.png';
import IconIndividual from '../../../static/images/chimp-icon-individual.png';
import { withTranslation } from '../../../i18n';
import '../../shared/style/styles.less';
import { dismissAllUxCritialErrors } from '../../../actions/error';
import { Router } from '../../../routes';
const CreditCard = dynamic(() => import('../../shared/CreditCard'));
const FormValidationErrorMessage = dynamic(() => import('../../shared/FormValidationErrorMessage'));
const NoteTo = dynamic(() => import('../NoteTo'));
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
                    email,
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
        else{
                payload =  _merge({}, props.flowObject)
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
                    props.flowObject.giveData.giveFrom,
                    {
                        displayName,
                        email,
                    },
                    formatMessage,
                ),
                paymentInstrumentList: populatePaymentInstrument(paymentInstruments, formatMessage),
            },
            findAnotherRecipientLabel: 'Find another recipient',
            flowObject: payload,
            inValidCardNameValue: true,
            inValidCardNumber: true,
            inValidCvv: true,
            inValidExpirationDate: true,
            inValidNameOnCard: true,
            showAnotherRecipient: false,
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
            const giveToOptions = populateGiveToGroupsofUser(giveGroupBenificairyDetails);
            const donationMatchOptions = populateDonationMatch(donationMatchData, formatMessage);
            if (!_isEmpty(giveCharityDetails) && !_isEmpty(giveCharityDetails.charityDetails)) {
                groupFromUrl = false;
                giveData.giveTo = {
                    avatar: giveCharityDetails.charityDetails.attributes.avatar,
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
            } else if( !_isEqual(giveGroupBenificairyDetails, prevProps.giveGroupBenificairyDetails)){   
                if(_isEmpty(giveGroupBenificairyDetails))
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
                            displayName,
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
    static initFields(giveData, fund, id, avatar,paymentInstrumentOptions,
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
                if(!_isEmpty(defaultGroupFrom)){
                giveData.giveFrom.value = defaultGroupFrom.attributes.fundId;
                giveData.giveFrom.name = defaultGroupFrom.attributes.name;
                giveData.giveFrom.avatar = defaultGroupFrom.attributes.avatar,
                giveData.giveFrom.id = defaultGroupFrom.id;
                giveData.giveFrom.type = defaultGroupFrom.type;
                giveData.giveFrom.text = `${defaultGroupFrom.attributes.name} ($${defaultGroupFrom.attributes.balance})`;
                giveData.giveFrom.balance = defaultGroupFrom.attributes.balance;
             }
            }
            else{
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
        } = this.props;
        let inputValue = value;
        const isNumber = /^\d+(\.\d*)?$/;
        if ((name === 'giveAmount' || name === 'donationAmount') && !_isEmpty(value) && value.match(isNumber)) {
            giveData[name] = formatAmount(value);
            inputValue = formatAmount(value);
        }
        const coverFeesAmount = Charity.getCoverFeesAmount(giveData, coverFeesData);
        if (name !== 'giftType' && name !== 'giveFrom') {
            validity = validateGiveForm(name, inputValue, validity, giveData, coverFeesAmount);
        }
        switch (name) {
            case 'giveAmount':
                validity = validateGiveForm('donationAmount', giveData.donationAmount, validity, giveData, coverFeesAmount);
                break;
            case 'giveFrom':
                validity = validateGiveForm('giveAmount', giveData.giveAmount, validity, giveData, coverFeesAmount);
                validity = validateGiveForm('donationAmount', giveData.donationAmount, validity, giveData, coverFeesAmount);
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
        if (giveData[name] !== newValue) {
            giveData[name] = newValue;
            giveData.userInteracted = true;
            switch (name) {
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
            coverFeesData,
            defaultTaxReceiptProfile,
            flowSteps,
            stepIndex,
        } = this.props;
        const {
            giveData: {
                creditCard,
                coverFees,
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
                { !!showAnotherRecipient && (
                    <Form.Field className="lnk-FindAnother">
                        <List className="lstRecipient" verticalAlign="middle" horizontal>
                        <Link route = '/give'>
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
                        <Link route = {friendUrlEndpoint}>
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
                        <Link route ={groupUrlEndpoint}>
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

    renderPaymentTaxErrorMsg(paymentInstrumentList, defaultTaxReceiptProfile, giveFrom, companyDetails, giftType){
        const{
            companyAccountsFetched,
            slug,
            userAccountsFetched
        } = this.props;
        if(giftType > 0){
            if(userAccountsFetched && giveFrom.type === 'user' || companyAccountsFetched && giveFrom.type === 'companies'){
                let taxProfile = (giveFrom.type === 'companies' && companyDetails && companyDetails.companyDefaultTaxReceiptProfile) ?
                companyDetails.companyDefaultTaxReceiptProfile :
                defaultTaxReceiptProfile;
                    if(_isEmpty(paymentInstrumentList) && _isEmpty(taxProfile)){
                        return(
                            <div>
                               To send a monthly gift, first add a &nbsp;
                               {
                                   giveFrom.type === 'companies' 
                                   ?  <a href={`/companies/${slug}/payment-profiles`}>payment method </a>
                                   : <Link route = '/user/profile/settings/creditcard'>payment method</Link>
                               }
                              &nbsp; and&nbsp;
                               {
                                   giveFrom.type === 'companies' 
                                   ?  <a href={`/companies/${slug}/tax-receipt-profiles`}>tax receipt recipient</a>
                                   : <Link route = '/user/tax-receipts'>tax receipt recipient</Link>
                               }
                              &nbsp; to your account details.We won't charge your card without your permission.
                            </div>
                        ) 
                    }
                    else if(_isEmpty(paymentInstrumentList)){
                        return(
                            <div>
                                 To send a monthly gift, first add a &nbsp;
                                 {
                                   giveFrom.type === 'companies' 
                                   ?  <a href={`/companies/${slug}/payment-profiles`}>payment method </a>
                                   : <Link route = '/user/profile/settings/creditcard'>payment method</Link>
                               }
                              &nbsp;   to your account details.We won't charge your card without your permission.
                            </div>
                        ) 
                    }
                    else if( _isEmpty(taxProfile)){
                        return(
                            <div>
                            To send a monthly gift, first add a &nbsp;
                            {
                                   giveFrom.type === 'companies' 
                                   ?  <a href={`/companies/${slug}/tax-receipt-profiles`}>tax receipt recipient</a>
                                   : <Link route = '/user/tax-receipts'>tax receipt recipient</Link>
                               }
                           &nbsp; to your account details.
                            </div>
                        ) 
                    }
                 }
            }
            return null; 
    }

    render() {
        const {
            companyDetails,
            coverFeesData,
            creditCardApiCall,
            defaultTaxReceiptProfile,
        } = this.props;
        const {
            flowObject: {
                giveData: {
                    coverFees,
                    creditCard,
                    donationAmount,
                    donationMatch,
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
        let accountTopUpComponent = null;
        let stripeCardComponent = null;
        const groupUrlEndpoint = Number(sourceAccountHolderId) > 0 ? `/give/to/group/new?source_account_holder_id=${sourceAccountHolderId}` : null;
        const friendUrlEndpoint = `/give/to/friend/new`;
        const formatMessage = this.props.t;
        const giveAmountWithCoverFees = (coverFees)
            ? Number(giveAmount) + Number(coverFeesData.giveAmountFees)
            : Number(giveAmount);
        if ((giveFrom.type === 'user' || giveFrom.type === 'companies')
    && (giftType.value === 0
        && giveAmountWithCoverFees > Number(giveFrom.balance))
        ) {
            const topupAmount = formatAmount((formatAmount(giveAmountWithCoverFees)
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
            <Form onSubmit={this.handleSubmit}>
                { (Number(giveTo.value) > 0) && (
                    <Fragment>
                        {
                            !groupFromUrl && (
                                <div>
                                    <Form.Field>
                                        <label htmlFor="giveTo">
                                            {formatMessage('giveToLabel')}
                                        </label>
                                        <Form.Field
                                            control={Input}
                                            className="disabled-input"
                                            disabled
                                            id="giveTo"
                                            name="giveTo"
                                            size="large"
                                            value={giveTo.text}
                                        />
                                    </Form.Field>
                                    {
                                        (groupUrlEndpoint)
                                            && this.renderFindAnotherRecipient(
                                                showAnotherRecipient,
                                                friendUrlEndpoint,
                                                groupUrlEndpoint,
                                                findAnotherRecipientLabel,
                                                formatMessage,
                                            )
                                    }
                                </div>
                            )
                        }
                        {
                            !!groupFromUrl && (
                                <div>
                                    <Form.Field>
                                        <label htmlFor="giveTo">
                                            {formatMessage('giveToLabel')}
                                        </label>
                                        <Form.Field
                                            control={Select}
                                            error={!validity.isValidGiveFrom}
                                            id="giveToList"
                                            name="giveToList"
                                            onChange={this.handleInputChangeGiveTo}
                                            options={giveToList}
                                            placeholder="Select a Group to Give"
                                            value={giveTo.value}
                                        />
                                    </Form.Field>
                                    {this.renderFindAnotherRecipient(
                                        showAnotherRecipient,
                                        friendUrlEndpoint,
                                        groupUrlEndpoint,
                                        findAnotherRecipientLabel,
                                        formatMessage,
                                    )}
                                </div>
                            )
                        }
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
                                onBlur={this.handleInputOnBlur}
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
                                minAmount: 5,
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
                            parentOnBlurChange={this.handleInputOnBlur}
                            formatMessage={formatMessage}
                        />
                        {this.renderSpecialInstructionComponent(
                            giveFrom,
                            giftType, giftTypeList, infoToShare, infoToShareList, formatMessage,
                        )}
                        { 
                            this.renderPaymentTaxErrorMsg(paymentInstrumentList, defaultTaxReceiptProfile, giveFrom,companyDetails, giftType.value)
                        }
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
                        {accountTopUpComponent}
                        {stripeCardComponent}
                        <Divider hidden />
                        {/* { !stepsCompleted && */}
                        <Form.Button
                            className="blue-btn-rounded-def"
                            content={(!creditCardApiCall) ? formatMessage('giveCommon:continueButton') : formatMessage('giveCommon:submittingButton')}
                            disabled={(creditCardApiCall) || !this.props.userAccountsFetched}
                            type="submit"
                        />
                        {/* } */}
                    </Fragment>
                )}
            </Form>
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