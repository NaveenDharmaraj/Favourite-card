import React, {
    Fragment,
} from 'react';
import dynamic from 'next/dynamic';
import _isEmpty from 'lodash/isEmpty';
import _merge from 'lodash/merge';
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
import _map from 'lodash/map';
import {
    connect,
} from 'react-redux';

//import { Link } from '../../../routes';
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
    getCompanyPaymentAndTax,
    getCoverFees,
    getBeneficiariesForGroup,
    getBeneficiaryFromSlug,
    proceed,
} from '../../../actions/give';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import NoteTo from '../NoteTo';
import SpecialInstruction from '../SpecialInstruction';
import AccountTopUp from '../AccountTopUp';
import DropDownAccountOptions from '../../shared/DropDownAccountOptions';
import IconCharity from '../../../static/images/chimp-icon-charity.png';
import IconGroup from '../../../static/images/chimp-icon-giving-group.png';
import IconIndividual from '../../../static/images/chimp-icon-individual.png';
import { withTranslation } from '../../../i18n';

const CreditCardWrapper = dynamic(() => import('../../shared/CreditCardWrapper'), {
    ssr: false
});

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
        this.state = {
            benificiaryIndex: 0,
            buttonClicked: false,
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
            flowObject: _merge({}, props.flowObject),
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
        this.handleCoverFees = this.handleCoverFees.bind(this);
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
            //Redirect to dashboard need to be taken care
            console.log('redirect to dashboard');
        }
        dispatch(getDonationMatchAndPaymentInstruments(id));
    }

    componentDidUpdate(prevProps)  {
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
                slug,
                taxReceiptProfiles,
                i18n: {
                    language,
                }
            } = this.props;
            const formatMessage = this.props.t;
            let paymentInstruments = null;
            let companyPaymentInstrumentChanged = false;
            if (giveData.giveFrom.type === 'companies' && !_isEmpty(companyDetails)) {
                if (_isEmpty(this.props.companyDetails)
                     || !_isEqual(companyDetails.companyPaymentInstrumentsData,
                         this.props.companyDetails.companyPaymentInstrumentsData)
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
            } else if (!_isEmpty(giveGroupBenificairyDetails)) {
                groupFromUrl = true;
                giveData.giveTo = {
                    avatar:  giveGroupBenificairyDetails.benificiaryDetails[benificiaryIndex].attributes.avatar,
                    eftEnabled: giveGroupBenificairyDetails.benificiaryDetails[benificiaryIndex].attributes.eftEnabled,
                    id: giveGroupBenificairyDetails.benificiaryDetails[benificiaryIndex].attributes.fundId,
                    name: giveGroupBenificairyDetails.benificiaryDetails[benificiaryIndex].attributes.name,
                    text: giveGroupBenificairyDetails.benificiaryDetails[benificiaryIndex].attributes.name,
                    type: 'beneficiaries',
                    value: giveGroupBenificairyDetails.benificiaryDetails[benificiaryIndex].attributes.fundId,
                };
            }
            if (!_isEmpty(fund)) {
                giveData = Charity.initFields(
                    giveData, fund, id, avatar, paymentInstrumentOptions,
                    companyPaymentInstrumentChanged,
                    `${firstName} ${lastName}`, companiesAccountsData, userGroups, userCampaigns,
                );
            }
            this.setState({
                buttonClicked: false,
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
            giveData.giveFrom.text = `${fund.attributes.name} ($${fund.attributes.balance})`;
            giveData.giveFrom.balance = fund.attributes.balance;
            giveData.giveFrom.name = name;
        } else if (!_isEmpty(companiesAccountsData) && !_isEmpty(userGroups) && !_isEmpty(userCampaigns) && !giveData.userInteracted) {
            giveData.giveFrom = {
                value: '',
            };
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
     * Reset data for coverfees field change.
     * @param {object} giveData full form data.
     * @param {boolean} newValue changing value of coverfees.
     * @param {object} coverFeesData coverfees data from API.
     * @param {object} dropDownOptions full dropdown options in the page.
     * @return {object} full form data.
     */

    static resetDataForCoverFeesChange(giveData, newValue, coverFeesData, dropDownOptions) {
        if (newValue) {
            if (giveData.giveFrom.type === 'user' || giveData.giveFrom.type === 'companies') {
                giveData.donationAmount = setDonationAmount(giveData, coverFeesData);
                if (Number(giveData.donationAmount) > 0) {
                    giveData.creditCard = getDefaultCreditCard(
                        dropDownOptions.paymentInstrumentList,
                    );
                    if (giveData.giveFrom.type === 'user'
                        && !_isEmpty(dropDownOptions.donationMatchList)
                        && (_isEmpty(giveData.donationMatch)
                            || giveData.donationMatch.value === null)
                    ) {
                        const [
                            defaultMatch,
                        ] = dropDownOptions.donationMatchList;
                        giveData.donationMatch = defaultMatch;
                    }
                }
            }
        } else if (Number(giveData.giveAmount) <= Number(giveData.giveFrom.balance)) {
            giveData.donationAmount = '';
            if (giveData.giftType.value === 0) {
                giveData.donationMatch = {
                    value: null,
                };
                giveData.creditCard = {
                    value: null,
                };
            }
        }
        return giveData;
    }


    getStripeCreditCard(data, cardHolderName) {
        const {
            flowObject,
        } = this.state;
        this.setState({
            flowObject: {
                ...flowObject,
                cardHolderName,
                stripeCreditCard: data,
            },
        });
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
            // this.StripeCreditCard.handleOnLoad(
            //     inValidCardNumber, inValidExpirationDate, inValidNameOnCard,
            //     inValidCvv, inValidCardNameValue,
            // );
            // validateCC = (!inValidCardNumber && !inValidExpirationDate &&
            //     !inValidNameOnCard && !inValidCvv && !inValidCardNameValue);
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
        if (name !== 'coverFees' && name !== 'giftType' && name !== 'giveFrom') {
            validity = validateGiveForm(name, inputValue, validity, giveData, coverFeesAmount);
        }
        switch (name) {
            case 'giveAmount':
                this.handleCoverFees();
                validity = validateGiveForm('donationAmount', giveData.donationAmount, validity, giveData, coverFeesAmount);
                break;
            case 'giveFrom':
                this.handleCoverFees();
                validity = validateGiveForm('giveAmount', giveData.giveAmount, validity, giveData, coverFeesAmount);
                validity = validateGiveForm('donationAmount', giveData.donationAmount, validity, giveData, coverFeesAmount);
                break;
            case 'coverFees':
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
     * handleCoverFees calls action for fetching the fees
     * @return {void}
     */

    handleCoverFees() {
        const {
            flowObject: {
                giveData: {
                    giveAmount,
                    giveFrom,
                },
            },
        } = this.state;
        const {
            coverFeesData,
            dispatch,
        } = this.props;
        if (Number(giveFrom.value) > 0) {
            // GIVEB-1912 with recent updates given we don't need 2 versions of text
            // hence no need to calculate fees for balance
            getCoverFees(coverFeesData, giveFrom.value, giveAmount, dispatch);
        }
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
        if (name === 'coverFees') {
            const {
                target,
            } = event;
            newValue = target.checked;
        }
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
                case 'coverFees':
                    giveData = Charity.resetDataForCoverFeesChange(
                        giveData, newValue, coverFeesData, dropDownOptions,
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
        this.setState({
            buttonClicked: true,
        });
        if (this.validateForm()) {
            if (creditCard.value > 0) {
                flowObject.selectedTaxReceiptProfile = (flowObject.giveData.giveFrom.type === 'companies') ?
                    companyDetails.companyDefaultTaxReceiptProfile :
                    defaultTaxReceiptProfile;
            }
            // if (_isEqual(allocation, this.props.allocation)) {
            //     forceContinue = (forceContinue === this.props.nextStep.path) ?
            //         this.props.currentStep.path : this.props.nextStep.path;
            // }
            flowObject.giveData.coverFeesAmount = (coverFees) ?
                coverFeesData.giveAmountFees : null;
            // allocation.stepsCompleted = false;
            // allocation.nextSteptoProceed = nextStep;
            // this.dimissErrors();
            // this.props.proceed({
            //     ...allocation,
            // }, forceContinue);
            dispatch(proceed(flowObject, flowSteps[stepIndex + 1]));
        } else {
            this.setState({
                buttonClicked: false,
            });
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
                            <List.Item className="lstitm" path="/give">
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
                            <List.Item className="lstitm" to={friendUrlEndpoint}>
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
                            <List.Item className="lstitm" to={groupUrlEndpoint}>
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
                        </List>
                    </Form.Field>
                )
                }
            </Fragment>
        );
    }

    
    /**
     * Render the cover fees fields.
     * @param {object} giveFrom give from field data.
     * @param {object} giveAmount give amount entered by user.
     * @param {object} coverFeesData cover fees API response.
     * @param {function} formatMessage I18 formatting.
     * @param {boolean} coverFees cover fees checkbox value.
     * @return {JSX} JSX representing payment fields.
     */

    renderCoverFees(giveFrom, giveAmount, coverFeesData, coverFees, formatMessage) {
        if (Number(giveFrom.value) > 0 && Number(giveAmount) > 0 &&
            !_isEmpty(coverFeesData)
        ) {
            let coverNoteText = null;
            // GIVEB-1912 with recent updates given we don't need 2 versions of text
            if (Number(coverFeesData.giveAmountFees) > 0) {
                const feeAmount = formatAmount(coverFeesData.giveAmountFees);
                const totalAmount = formatAmount(Number(giveAmount) +
                Number(coverFeesData.giveAmountFees));
                coverNoteText = formatMessage('feeAmountCoverageNote', {
                    feeAmount,
                    totalAmount,
                });
            }
            if (!_isEmpty(coverNoteText)) {
                return (
                    <Form.Field className="checkbox-display">
                        <Form.Field
                            checked={coverFees}
                            className="ui checkbox checkbox-text"
                            control={Checkbox}
                            id="coverFees"
                            label={coverNoteText}
                            name="coverFees"
                            onChange={this.handleInputChange}
                        />
                        <Popup
                            content={formatMessage('feeAmountCoveragePopup')}
                            position="top center"
                            trigger={(
                                <Icon
                                    color="blue"
                                    name="question circle"
                                    size="large"
                                />
                            )}
                        />
                    </Form.Field>
                );
            }
        }
        return null;
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

    render() {
        const {
            coverFeesData,
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
    && (giftType.value > 0 || (giftType.value === 0
        && giveAmountWithCoverFees > Number(giveFrom.balance)))
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
                                            //className="disabled-input"
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
                        {this.renderCoverFees(
                            giveFrom, giveAmount, coverFeesData, coverFees, formatMessage,
                        )}
                        {this.renderSpecialInstructionComponent(
                            giveFrom,
                            giftType, giftTypeList, infoToShare, infoToShareList, formatMessage,
                        )}
                        {accountTopUpComponent}
                        {
                            (_isEmpty(paymentInstrumentList) || creditCard.value === 0) && (
                                    <Form.Field>
                                        <CreditCardWrapper />
                                    </Form.Field>
                            )
                        }                      
                        <Form.Field>
                            <Divider className="dividerMargin" />
                        </Form.Field>
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
                        <Divider hidden />
                        {/* { !stepsCompleted && */}
                        <Form.Button
                            content={(!this.state.buttonClicked) ? formatMessage('giveCommon:continueButton') : formatMessage('giveCommon:submittingButton')}
                            disabled={(this.state.buttonClicked) || !this.props.userAccountsFetched}
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
const defProps = {
    currentUser: {
        displayName: "Demo",
        email:"chimp.net",
    },
    giveData: {
        giveFrom: {
            type: 'user'
        },
    },
    groupId: null,
    id: '888000',
    slug: null,
};

Charity.defaultProps = Object.assign({}, beneficiaryDefaultProps, defProps);

function mapStateToProps(state) {
    return {
        companiesAccountsData: state.user.companiesAccountsData,
        companyDetails: state.give.companyData,
        coverFeesData: state.give.coverFeesData,
        currentUser: state.user.info,
        giveCharityDetails: state.give.charityDetails,
        giveGroupBenificairyDetails: state.give.benificiaryForGroupDetails,
        taxReceiptProfiles: state.user.taxReceiptProfiles,
        userAccountsFetched: state.user.userAccountsFetched,
        userCampaigns: state.user.userCampaigns,
        userGroups: state.user.userGroups,
    };
}
export default withTranslation([
    'charity',
    'giveCommon',
    'accountTopUp',
    'noteTo',
    'specialInstruction',
])(connect(mapStateToProps)(Charity));
