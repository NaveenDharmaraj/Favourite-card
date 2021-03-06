import React, {
    Fragment,
} from 'react';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import _isEmpty from 'lodash/isEmpty';
import _merge from 'lodash/merge';
import _replace from 'lodash/replace';
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import {
    Container,
    Form,
    Grid,
    Header,
    Modal,
    Placeholder,
    Select,
} from 'semantic-ui-react';
import _find from 'lodash/find';
import _isEqual from 'lodash/isEqual';
import _every from 'lodash/every';
import { connect, } from 'react-redux';
import { Link } from '../../../routes';
import CharityAmountField from '../DonationAmountField';
import { beneficiaryDefaultProps } from '../../../helpers/give/defaultProps';
import { getDonationMatchAndPaymentInstruments } from '../../../actions/user';
import {
    formatCurrency,
    formatAmount,
    populateDonationMatch,
    populateGiveToGroupsofUser,
    populateGiftType,
    populatePaymentInstrument,
    populateTaxReceipts,
    resetDataForGiveAmountChange,
    resetDataForAccountChange,
    resetDataForGiftTypeChange,
    setDonationAmount,
    validateGiveForm,
    validateForReload,
    findingErrorElement,
} from '../../../helpers/give/utils';
import {
    getCoverAmount,
    getCompanyPaymentAndTax,
    getBeneficiariesForGroup,
    getBeneficiaryFromSlug,
    proceed,
} from '../../../actions/give';
import FlowBreadcrumbs from '../FlowBreadcrumbs';
import ReloadAddAmount from '../ReloadAddAmount';
import { withTranslation } from '../../../i18n';
import { Router } from '../../../routes';
import { getCharityInfoToShare } from '../../../actions/userProfile';
import { populateDropdownInfoToShare } from '../../../helpers/users/utils';
const FormValidationErrorMessage = dynamic(() => import('../../shared/FormValidationErrorMessage'));
const NoteTo = dynamic(() => import('../NoteTo'));
const DedicateType = dynamic(() => import('../DedicateGift'), { ssr: false });
const SpecialInstruction = dynamic(() => import('../SpecialInstruction'));
const DropDownAccountOptions = dynamic(() => import('../../shared/DropDownAccountOptions'));

class Charity extends React.Component {
    constructor(props) {
        super(props);
        const {
            campaignId,
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
            id,
            //paymentInstrumentsData,
            userCampaigns,
            userGroups,
            giveGroupBenificairyDetails,
            giveCharityDetails,
            taxReceiptProfiles,
            i18n: {
                language,
            }
        } = props;
        //const paymentInstruments = (!_isEmpty(props.flowObject.giveData.giveFrom) && props.flowObject.giveData.giveFrom.type === 'companies') ? companyDetails.companyPaymentInstrumentsData : paymentInstrumentsData;
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
            dropDownOptions: {
                donationMatchList: populateDonationMatch(donationMatchData, formatMessage),
                giftTypeList: populateGiftType(formatMessage),
                giveToList: populateGiveToGroupsofUser(giveGroupBenificairyDetails),
                //paymentInstrumentList: populatePaymentInstrument(paymentInstruments, formatMessage),

            },
            findAnotherRecipientLabel: 'Find another recipient',
            flowObject: _.cloneDeep(payload),
            showModal: false,
            reloadModalOpen: 0,
            reviewBtnFlag: false,
            validity: this.intializeValidations(),
        };
        if (!_isEmpty(groupId)
            && Number(groupId) > 0) {
            this.state.flowObject.groupId = groupId;
            this.state.giveFromType = 'groups';
        } else if (!_isEmpty(campaignId)
            && Number(campaignId) > 0) {
            this.state.flowObject.campaignId = campaignId;
            this.state.giveFromType = 'campaigns'
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChangeGiveTo = this.handleInputChangeGiveTo.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.handleAddMoneyModal = this.handleAddMoneyModal.bind(this);
        this.renderReloadAddAmount = this.renderReloadAddAmount.bind(this);
    }

    componentDidMount() {
        const {
            campaignId,
            currentAccount,
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
            giveFromType,
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
        if (Number(groupId) > 0 || Number(campaignId) > 0) {
            const id = (campaignId) ? campaignId : groupId;
            getBeneficiariesForGroup(dispatch, id, giveFromType);
        } else if (slug != null) {
            getBeneficiaryFromSlug(dispatch, slug);
        } else {
            Router.pushRoute('/dashboard');
        }
        if (_isEmpty(giveFromType) && currentAccount.accountType === 'company') {
            getCompanyPaymentAndTax(dispatch, Number(currentAccount.id));
        }
        window.scrollTo(0, 0);
        dispatch(getDonationMatchAndPaymentInstruments(id));
        dispatch(getCharityInfoToShare(id));
    }

    componentDidUpdate(prevProps) {
        if (!_isEqual(this.props, prevProps)) {
            const {
                dropDownOptions,
            } = this.state;
            let {
                flowObject: {
                    benificiaryIndex,
                    currency,
                    giveData,
                },
                giveFromType,
                groupFromUrl,
                reviewBtnFlag,
                reloadModalOpen,
            } = this.state;
            const {
                campaignId,
                charityShareInfoOptions,
                companyDetails,
                companiesAccountsData,
                currentAccount,
                currentUser: {
                    id,
                    attributes: {
                        avatar,
                        displayName,
                        email,
                        firstName,
                        lastName,
                        preferences,
                    },
                },
                donationMatchData,
                fund,
                //paymentInstrumentsData,
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
            //let paymentInstruments = paymentInstrumentsData;
            let companyPaymentInstrumentChanged = false;
            if (giveData.giveFrom.type === 'companies' && !_isEmpty(companyDetails)) {
                const companyIndex = _.findIndex(companiesAccountsData, { 'id': giveData.giveFrom.id });
                giveData.giveFrom.balance = companiesAccountsData[companyIndex].attributes.balance;
                giveData.giveFrom.text = `${companiesAccountsData[companyIndex].attributes.companyFundName}: ${formatCurrency(companiesAccountsData[companyIndex].attributes.balance, language, currency)}`;
                if (_isEmpty(prevProps.companyDetails)
                    || !_isEqual(companyDetails.companyPaymentInstrumentsData,
                        prevProps.companyDetails.companyPaymentInstrumentsData)
                ) {
                    companyPaymentInstrumentChanged = true;
                }
                //paymentInstruments = companyDetails.companyPaymentInstrumentsData;
            } else if (giveData.giveFrom.type === 'user') {
                giveData.giveFrom.balance = fund.attributes.balance;
                giveData.giveFrom.text = `${fund.attributes.name}: ${formatCurrency(fund.attributes.balance, language, currency)}`
                //paymentInstruments = paymentInstrumentsData;
            }
            if (reviewBtnFlag && (giveData.giveFrom.balance >= giveData.giveAmount)) {
                reviewBtnFlag = false;
                reloadModalOpen = 0;
            }
            // const paymentInstrumentOptions = populatePaymentInstrument(
            //     paymentInstruments, formatMessage,
            // );
            const giveToOptions = populateGiveToGroupsofUser(giveGroupBenificairyDetails);
            const donationMatchOptions = populateDonationMatch(donationMatchData, formatMessage);
            if (!_isEmpty(giveCharityDetails) && !_isEmpty(giveCharityDetails.charityDetails) && _isEmpty(giveFromType)) {
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
            } else if (!_isEmpty(giveGroupBenificairyDetails) && !_isEmpty(giveGroupBenificairyDetails.benificiaryDetails) && !_isEmpty(giveFromType)) {
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
                const giveFromId = (giveFromType === 'campaigns') ? campaignId : groupId;
                giveData = Charity.initFields(
                    giveData, fund, id, avatar,
                    `${firstName} ${lastName}`, companiesAccountsData, userGroups, userCampaigns,
                    giveGroupBenificairyDetails, giveFromId, giveFromType, language, currency, preferences, charityShareInfoOptions, formatMessage, currentAccount,
                );
            }
            this.setState({
                dropDownOptions: {
                    ...dropDownOptions,
                    donationMatchList: donationMatchOptions,
                    giftTypeList: populateGiftType(formatMessage),
                    giveToList: giveToOptions,
                    //paymentInstrumentList: paymentInstrumentOptions,
                },
                flowObject: {
                    ...this.state.flowObject,
                    giveData: {
                        ...giveData,
                    },
                    groupFromUrl,
                    slugValue: slug,
                },
                reloadModalOpen,
                reviewBtnFlag,
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
     * @param {String} name user name from API.
     * @return {object} full form data.
     */

    // eslint-disable-next-line react/sort-comp
    static initFields(giveData, fund, id, avatar,
        name, companiesAccountsData, userGroups, userCampaigns, giveGroupBenificairyDetails, groupId, giveFromType, language, currency, preferences, charityShareInfoOptions, formatMessage, currentAccount) {
        if (_isEmpty(companiesAccountsData) && _isEmpty(userGroups) && _isEmpty(userCampaigns) && !giveData.userInteracted) {
            giveData.giveFrom.avatar = avatar;
            giveData.giveFrom.id = id;
            giveData.giveFrom.value = fund.id;
            giveData.giveFrom.type = 'user';
            giveData.giveFrom.text = `${fund.attributes.name} ($${fund.attributes.balance})`;
            giveData.giveFrom.balance = fund.attributes.balance;
            giveData.giveFrom.name = name;
        } else if ((!_isEmpty(companiesAccountsData) || !_isEmpty(userGroups) || !_isEmpty(userCampaigns)) && (!giveData.userInteracted || _isEmpty(giveData.giveFrom.id))) {
            if (!_isEmpty(giveGroupBenificairyDetails) && !_isEmpty(giveGroupBenificairyDetails.benificiaryDetails)) {
                const defaultGroupFrom = (giveFromType === 'campaigns')
                    ? userCampaigns.find((userCampaign) => userCampaign.id === groupId)
                    : userGroups.find((userGroup) => userGroup.id === groupId)
                if (!_isEmpty(defaultGroupFrom)) {
                    giveData.giveFrom.value = defaultGroupFrom.attributes.fundId;
                    giveData.giveFrom.name = defaultGroupFrom.attributes.name;
                    giveData.giveFrom.avatar = defaultGroupFrom.attributes.avatar;
                    giveData.giveFrom.id = defaultGroupFrom.id;
                    giveData.giveFrom.type = defaultGroupFrom.type;
                    giveData.giveFrom.text = `${defaultGroupFrom.attributes.fundName}: ${formatCurrency(defaultGroupFrom.attributes.balance, language, currency)}`;
                    giveData.giveFrom.balance = defaultGroupFrom.attributes.balance;
                    giveData.giveFrom.slug = defaultGroupFrom.attributes.slug;
                }
            }
            if (_isEmpty(giveFromType) && currentAccount.accountType === 'company') {
                companiesAccountsData.find(company => {
                    if (currentAccount.id == company.id) {
                        const {
                            attributes: {
                                avatar,
                                balance,
                                name,
                                companyFundId,
                                companyFundName,
                                slug,
                                displayName
                            },
                            type,
                            id
                        } = company;
                        giveData.giveFrom.value = companyFundId;
                        giveData.giveFrom.name = name;
                        giveData.giveFrom.avatar = avatar;
                        giveData.giveFrom.id = id;
                        giveData.giveFrom.type = type;
                        giveData.giveFrom.text = `${companyFundName} (${formatCurrency(balance, language, currency)})`;
                        giveData.giveFrom.balance = balance;
                        giveData.giveFrom.slug = slug;
                        giveData.giveFrom.displayName = displayName;
                        return true;
                    }
                })
            }
            if (_isEmpty(giveFromType) && currentAccount.accountType === 'personal') {
                giveData.giveFrom.avatar = avatar;
                giveData.giveFrom.id = id;
                giveData.giveFrom.value = fund.id;
                giveData.giveFrom.type = 'user';
                giveData.giveFrom.text = `${fund.attributes.name} ($${fund.attributes.balance})`;
                giveData.giveFrom.balance = fund.attributes.balance;
                giveData.giveFrom.name = name;
            }
        } else if (!_isEmpty(companiesAccountsData) && !_isEmpty(userGroups) && !_isEmpty(userCampaigns) && !giveData.userInteracted) {
            giveData.giveFrom = {
                value: '',
            };
        }
        if ((!giveData.userInteracted || _isEmpty(giveData.defaultInfoToShare)) && !_isEmpty(charityShareInfoOptions) && charityShareInfoOptions.length > 0) {
            const name = 'charities_info_to_share';
            const preference = preferences[name].includes('address')
                ? `${preferences[name]}-${preferences[`${name}_address`]}` : preferences[name];
            const { infoToShareList } = populateDropdownInfoToShare(charityShareInfoOptions);
            const defaultInfoToShare = infoToShareList.find(opt => (
                opt.value === preference
            ));
            giveData.defaultInfoToShare = defaultInfoToShare;
            if (giveFromType === 'groups' || giveFromType === 'campaigns' || currentAccount.accountType === 'company') {
                giveData.infoToShare = {
                    disabled: false,
                    text: ReactHtmlParser(`<span class="attributes">${formatMessage('giveCommon:infoToShareAnonymous')}</span>`),
                    value: 'anonymous',
                };
            } else {
                giveData.infoToShare = defaultInfoToShare
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
            isNoteToCharityInLimit: true,
            isNoteToSelfInLimit: true,
            isValidAddingToSource: true,
            isValidDecimalAmount: true,
            isValidGiveAmount: true,
            isValidGiveFrom: true,
            isValidNoteSelfText: true,
            isValidNoteToCharity: true,
            isValidNoteToCharityText: true,
            isValidNoteToSelf: true,
            isValidPositiveNumber: true,
            isReloadRequired: true,
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
        } = this.state;
        let {
            validity,
        } = this.state;
        const {
            coverFeesData,
        } = this.props;
        const coverFeesAmount = Charity.getCoverFeesAmount(giveData, coverFeesData);
        validity = validateGiveForm('giveAmount', giveData.giveAmount, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('giveFrom', giveData.giveFrom.value, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('noteToSelf', giveData.noteToSelf, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('noteToCharity', giveData.noteToCharity, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('dedicateType', null, validity, giveData);
        if (giveData.giftType.value === 0) {
            validity = validateForReload(validity, giveData.giveFrom.type, giveData.giveAmount, giveData.giveFrom.balance);
        } else {
            validity.isReloadRequired = true;
        }
        this.setState({
            validity,
            reviewBtnFlag: !validity.isReloadRequired
        });
        const validationsResponse = _every(validity);
        if (!validationsResponse) {
            const errorNode = findingErrorElement(validity, 'allocation');
            !_isEmpty(errorNode) && document.querySelector(`${errorNode}`).scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return validationsResponse;
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
        const isNumber = /^(?:[0-9]+,)*[0-9]+(?:\.[0-9]*)?$/;
        if ((name === 'giveAmount') && !_isEmpty(value) && value.match(isNumber)) {
            inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
            giveData[name] = inputValue;
            giveData['formatedCharityAmount'] = _.replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
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
            case 'giveFrom':
                if (giveData.giveFrom.type === 'companies' || giveData.giveFrom.type === 'campaigns') {
                    giveData['noteToSelf'] = '';
                }
                validity = validateGiveForm('giveAmount', giveData.giveAmount, validity, giveData, coverFeesAmount);
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
            reloadModalOpen,
            reviewBtnFlag,
            validity,
        } = this.state;
        const {
            flowObject: {
                type,
            },
        } = this.state;
        const {
            charityShareInfoOptions,
            coverFeesData,
            currentUser: {
                attributes: {
                    preferences,
                },
            },
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
                case 'giveFrom':
                    const {
                        modifiedDropDownOptions,
                        modifiedGiveData,
                    } = resetDataForAccountChange(
                        giveData, dropDownOptions, this.props, type,
                    );
                    giveData = modifiedGiveData;
                    if (giveData.giveFrom.type === 'user') {
                        giveData.infoToShare = giveData.defaultInfoToShare;
                        if (_isEmpty(giveData.defaultInfoToShare)) {
                            const name = 'charities_info_to_share';
                            const preference = preferences[name].includes('address')
                                ? `${preferences[name]}-${preferences[`${name}_address`]}` : preferences[name];
                            const { infoToShareList } = populateDropdownInfoToShare(charityShareInfoOptions);
                            const defaultInfoToShare = infoToShareList.find(opt => (
                                opt.value === preference
                            ));
                            giveData.defaultInfoToShare = giveData.infoToShare = defaultInfoToShare;
                        }
                    } else {
                        const formatMessage = this.props.t;
                        const defaultDropDownOption = {
                            disabled: false,
                            text: ReactHtmlParser(`<span class="attributes">${formatMessage('giveCommon:infoToShareAnonymous')}</span>`),
                            value: 'anonymous',
                        };
                        giveData.infoToShare = defaultDropDownOption;
                    }
                    if (giveData.giveFrom.type === 'companies' || giveData.giveFrom.type === 'campaigns') {
                        giveData.noteToSelf = '';
                    }
                    dropDownOptions = modifiedDropDownOptions;
                    const coverFeesAmount = Charity.getCoverFeesAmount(giveData, coverFeesData);
                    validity = validateGiveForm(
                        name, giveData[name], validity, giveData, coverFeesAmount,
                    );
                    reviewBtnFlag = false;
                    reloadModalOpen = 0;
                    if (giveData.giveFrom.type === 'companies') {
                        getCompanyPaymentAndTax(dispatch, Number(giveData.giveFrom.id));
                    }
                    break;
                case 'giveAmount':
                    giveData['formatedCharityAmount'] = newValue;
                    reviewBtnFlag = false;
                    reloadModalOpen = 0;
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
                reloadModalOpen,
                reviewBtnFlag,
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
        let {
            flowObject: {
                giveData
            },
            reviewBtnFlag,
            validity,
        } = this.state;
        const {
            coverFeesData,
            dispatch,
        } = this.props;
        const inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
        giveData.giveAmount = inputValue;
        giveData.formatedCharityAmount = _.replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
        const coverFeesAmount = Charity.getCoverFeesAmount(giveData, coverFeesData);
        if (Number(giveData.giveFrom.value) > 0 && Number(giveData.giveAmount) > 0) {
            getCoverAmount(giveData.giveFrom.value, giveData.giveAmount, dispatch);
        } else {
            getCoverAmount(giveData.giveFrom.value, 0, dispatch);
        }
        validity = validateGiveForm("giveAmount", inputValue, validity, giveData, coverFeesAmount);
        reviewBtnFlag = false;
        this.setState({
            ...this.state,
            flowObject: {
                ...this.state.flowObject,
                giveData: {
                    ...this.state.flowObject.giveData,
                    ...giveData,
                }
            },
            reviewBtnFlag,
            validity,
        });
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
                coverFees,
                giveFrom,
                giveAmount,
            },
        } = flowObject;
        if (this.validateForm()) {
            flowObject.giveData.coverFeesAmount = (coverFees) ?
                coverFeesData.giveAmountFees : null;
            flowObject.stepsCompleted = false;
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
            flowObject: {
                ...this.state.flowObject,
                benificiaryIndex,
                giveData: {
                    ...this.state.flowObject.giveData,
                    giveTo,
                },
            },

        });
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
            reviewBtnFlag: false,
        })
    }

    handleAddMoneyModal() {
        this.setState({
            reloadModalOpen: 1,
        })
    }
    handleReloadModalClose = () => {
        this.setState({
            reloadModalOpen: 0,
        });
    }
    /**
     * Render the SpecialInstruction component.
     * @param {object} giveFrom give from field data.
     * @param {function} formatMessage I18 formatting.
     * @param {object} giftType gift type value.
     * @param {object[]} giftTypeList the list of gift type options.
     * @return {JSX} JSX representing payment fields.
     */
    renderSpecialInstructionComponent(
        giveFrom, giftType, giftTypeList, formatMessage
    ) {
        if (!_isEmpty(giveFrom) && giveFrom.value > 0) {
            const {
                charityShareInfoOptions,
            } = this.props;
            const {
                flowObject: {
                    giveData: {
                        infoToShare
                    }
                }
            } = this.state;
            return (
                <SpecialInstruction
                    giftType={giftType}
                    giftTypeList={giftTypeList}
                    giveFrom={giveFrom}
                    handleInputChange={this.handleInputChange}
                    formatMessage={formatMessage}
                    handlegiftTypeButtonClick={this.handlegiftTypeButtonClick}
                    charityShareInfoOptions={charityShareInfoOptions}
                    infoDefaultValue={!_isEmpty(infoToShare) && infoToShare.value}
                />
            );
        }
        return null;
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
            paymentInstrumentsData,
            userAccountsFetched,
            companyAccountsFetched,
        } = this.props
        const {
            // dropDownOptions: {
            //     paymentInstrumentList,
            // },
            flowObject: {
                giveData,
            },
            reloadModalOpen,
            reviewBtnFlag,
        } = this.state;
        let {
            giveFrom,
            giveAmount,
            giftType,
        } = giveData
        const formatMessage = this.props.t;
        if ((giveFrom.type === 'user' || giveFrom.type === 'companies') && (Number(giveAmount) > Number(giveFrom.balance))) {
            if ((userAccountsFetched && giveFrom.type === 'user') || (companyAccountsFetched && giveFrom.type === 'companies')) {
                let taxReceiptList = taxReceiptProfiles;
                let defaultTaxReceiptProfileForReload = defaultTaxReceiptProfile;
                let paymentInstruments = paymentInstrumentsData;
                if (giveFrom.type === 'companies' && companyDetails) {
                    taxReceiptList = !_.isEmpty(companyDetails.taxReceiptProfiles) ? companyDetails.taxReceiptProfiles : [];
                    defaultTaxReceiptProfileForReload = companyDetails.companyDefaultTaxReceiptProfile;
                    paymentInstruments = companyDetails.companyPaymentInstrumentsData;
                }
                const paymentInstrumentOptions = populatePaymentInstrument(
                    paymentInstruments, formatMessage,
                );
                let coverFeesData = {};
                let AmountToDonate = setDonationAmount(giveData, coverFeesData);
                const taxReceiptsOptions = populateTaxReceipts(taxReceiptList, formatMessage);
                return (
                    <ReloadAddAmount
                        defaultTaxReceiptProfile={defaultTaxReceiptProfileForReload}
                        dispatch={dispatch}
                        donationMatchData={(giveFrom.type === 'user') ? donationMatchData : {}}
                        formatedDonationAmount={AmountToDonate}
                        formatMessage={formatMessage}
                        allocationGiftType={giftType.value}
                        giveTo={giveData.giveFrom}
                        language={language}
                        paymentInstrumentOptions={paymentInstrumentOptions}
                        reloadModalOpen={reloadModalOpen}
                        reviewBtnFlag={reviewBtnFlag}
                        taxReceiptsOptions={taxReceiptsOptions}
                        handleParentModalState={this.handleReloadModalClose}
                    />
                )
            } else {
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
            companyDetails,
            coverAmountDisplay,
            coverFeesData,
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
                    noteToCharity,
                    noteToSelf,
                },
                groupFromUrl,
                stepsCompleted,
                type,
            },
            dropDownOptions: {
                donationMatchList,
                giftTypeList,
                giveFromList,
                giveToList,
                paymentInstrumentList,
            },
            validity,
        } = this.state;
        const formatMessage = this.props.t;
        const { reviewBtnFlag } = this.state;
        let submtBtn = (reviewBtnFlag && giftType.value === 0) ? (
            <Form.Button
                primary
                className="blue-btn-rounded btn_right rivewbtnp2p"
                content={formatMessage('giveCommon:reviewButtonFlag')}
                disabled={!this.props.userAccountsFetched}
                onClick={this.handleAddMoneyModal}
                type="button"
            />) : (<Form.Button
                primary
                className="blue-btn-rounded btn_right rivewbtnp2p"
                content={formatMessage('giveCommon:reviewButton')}
                disabled={!this.props.userAccountsFetched}
                type="button"
                onClick={this.handleSubmit}
            />);
        let giveBannerHeader;
        if (!!groupFromUrl) {
            giveBannerHeader = (giveFrom.name) ? `Give From ${giveFrom.name}` : '';
        } else {
            giveBannerHeader = (giveTo.text) ? `Give to ${giveTo.text}` : '';
        }
        return (
            <Fragment>
                <div className="charityallocationbanner">
                    <Container>
                        <div className="flowReviewbannerText">
                            <Header as='h2'>{giveBannerHeader}</Header>
                        </div>
                    </Container>
                </div>
                <div className="flowReview">
                    <Container>
                        <Grid centered verticalAlign="middle">
                            <Grid.Row>
                                <Grid.Column mobile={16} tablet={14} computer={12}>
                                    <div className="flowBreadcrumb">
                                        <FlowBreadcrumbs
                                            currentStep={currentStep}
                                            formatMessage={formatMessage}
                                            steps={flowSteps}
                                            flowType={type} />
                                    </div>
                                    <div className="flowFirst">
                                        <Form>
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column mobile={16} tablet={12} computer={10}>
                                                        {
                                                            !!groupFromUrl && (
                                                                <Fragment>
                                                                    <div className="give_flow_field_bottom">
                                                                        <Form.Field>
                                                                            <label htmlFor="giveTo">
                                                                                {formatMessage('giveToLabel')}
                                                                            </label>
                                                                            <Form.Field
                                                                                className="dropdownWithArrowParent"
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
                                                                    </div>
                                                                </Fragment>
                                                            )
                                                        }
                                                        <CharityAmountField
                                                            isGiveFlow={true}
                                                            amount={formatedCharityAmount}
                                                            formatMessage={formatMessage}
                                                            handleInputChange={this.handleInputChange}
                                                            handleInputOnBlur={this.handleInputOnBlur}
                                                            handlePresetAmountClick={this.handlePresetAmountClick}
                                                            validity={validity}
                                                            fromCharity
                                                        />
                                                        <p className="coverFeeLabel">
                                                            {(!_isEmpty(coverAmountDisplay) && coverAmountDisplay > 0) ? formatMessage('coverFeeLabelWithAmount', {
                                                                amount: formatCurrency(coverAmountDisplay, language, 'USD'),
                                                            }) : formatMessage('coverFeeLabel')
                                                            }
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
                                                        <div className="give_flow_field">
                                                            <DropDownAccountOptions
                                                                reviewBtnFlag={this.state.reviewBtnFlag}
                                                                type={type}
                                                                validity={validity.isValidGiveFrom}
                                                                selectedValue={giveFrom.value}
                                                                name="giveFrom"
                                                                parentInputChange={this.handleInputChange}
                                                                parentOnBlurChange={this.handleInputOnBlur}
                                                                formatMessage={formatMessage}
                                                            />
                                                            {this.renderReloadAddAmount()}
                                                        </div>
                                                        {this.renderSpecialInstructionComponent(
                                                            giveFrom,
                                                            giftType, giftTypeList, formatMessage
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
                                                            allocationType="Charity"
                                                            formatMessage={formatMessage}
                                                            giveFrom={giveFrom}
                                                            noteToCharity={noteToCharity}
                                                            handleInputChange={this.handleInputChange}
                                                            handleInputOnBlur={this.handleInputOnBlur}
                                                            noteToSelf={noteToSelf}
                                                            validity={validity}
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
Charity.propTypes = {
    dispatch: PropTypes.func,
    stepIndex: PropTypes.number,
};

Charity.defaultProps = Object.assign({}, beneficiaryDefaultProps, {
    charityShareInfoOptions: [
        {
            text: 'Give anonymously',
            value: 'anonymous',
            privacySetting: 'anonymous'
        },
    ]
});

function mapStateToProps(state) {
    return {
        charityShareInfoOptions: state.userProfile.charityShareInfoOptions,
        companiesAccountsData: state.user.companiesAccountsData,
        companyDetails: state.give.companyData,
        companyAccountsFetched: state.give.companyAccountsFetched,
        coverAmountDisplay: state.give.coverAmountDisplay,
        coverFeesData: state.give.coverFeesData,
        currentAccount: state.user.currentAccount,
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
