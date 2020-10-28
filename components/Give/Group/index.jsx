import React, {
    Fragment,
} from 'react';
import dynamic from 'next/dynamic';
import {
    connect
} from 'react-redux';
import { withTranslation } from '../../../i18n';
import _find from 'lodash/find';
import _includes from 'lodash/includes';
import _isEmpty from 'lodash/isEmpty';
import _isEqual from 'lodash/isEqual';
import _every from 'lodash/every';
import _map from 'lodash/map';
import _merge from 'lodash/merge';
import _replace from 'lodash/replace';
import _ from 'lodash';
import {
    Container,
    Form,
    Grid,
    Header,
    Placeholder,
    Select,
    Modal,
} from 'semantic-ui-react';
import ReactHtmlParser from 'react-html-parser';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import NoteTo from '../NoteTo';
import ReloadAddAmount from '../ReloadAddAmount';
import FlowBreadcrumbs from '../FlowBreadcrumbs';
import DonationFrequency from '../DonationFrequency';
import GroupAmountField from '../DonationAmountField';
import PrivacyOptions from '../PrivacyOptions';
import DropDownAccountOptions from '../../shared/DropDownAccountOptions';
import {
    getDonationMatchAndPaymentInstruments,
    getGroupsForUser,
} from '../../../actions/user';
import {
    formatAmount,
    getDropDownOptionFromApiData,
    populateGroupsOfUser,
    populatePaymentInstrument,
    populateTaxReceipts,
    resetDataForAccountChange,
    validateGiveForm,
    formatCurrency,
    setDonationAmount,
    validateForReload,
    populateInfoToShareAccountName,
    checkMatchPolicy,
    findingErrorElement,
} from '../../../helpers/give/utils';
import {
    getCompanyPaymentAndTax,
    getGroupsFromSlug,
    proceed,
    fetchGroupMatchAmount,
} from '../../../actions/give';
import { groupDefaultProps } from '../../../helpers/give/defaultProps';
import { populateDropdownInfoToShare } from '../../../helpers/users/utils';
import { getGroupCampaignAdminInfoToShare } from '../../../actions/userProfile';
import MatchingPolicyModal from '../../shared/MatchingPolicyModal';

const DedicateType = dynamic(() => import('../DedicateGift'), { ssr: false });

class Group extends React.Component {
    constructor(props) {
        super(props);
        const {
            campaignId,
            companyDetails,
            currentUser: {
                attributes: {
                    displayName,
                    email,
                },
            },
            groupCampaignId,
            groupId,
            infoOptions: {
                groupMemberInfoToShare,
            },
            //paymentInstrumentsData,
            taxReceiptProfiles,
        } = props;
        //const paymentInstruments = (!_isEmpty(props.flowObject.giveData.giveFrom) && props.flowObject.giveData.giveFrom.type === 'companies') ? companyDetails.companyPaymentInstrumentsData : paymentInstrumentsData;
        const formatMessage = props.t;
        const flowType = _replace(props.baseUrl, /\//, '');
        let payload = null;
        //Initialize the flowObject to default value when got switched from other flows
        if (props.flowObject.type !== flowType) {
            const defaultPropsData = _merge({}, groupDefaultProps);
            payload = {
                ...defaultPropsData.flowObject,
                nextStep: props.step,
            };
        }
        else {
            payload = _merge({}, props.flowObject)
        }
        let privacyNameOptions = [];
        if (props.flowObject.giveData.giveFrom.type) {
            if (props.flowObject.giveData.giveFrom.type === 'user' && !_isEmpty(groupMemberInfoToShare)) {
                const {
                    infoToShareList,
                } = populateDropdownInfoToShare(groupMemberInfoToShare);
                privacyNameOptions = infoToShareList;
            } else {
                const name = (props.flowObject.giveData.giveFrom.type === 'companies' && props.flowObject.giveData.giveFrom.displayName) ? props.flowObject.giveData.giveFrom.displayName
                    : props.flowObject.giveData.giveFrom.name;
                privacyNameOptions = populateInfoToShareAccountName(name, formatMessage);
            }
        }

        this.state = {
            flowObject: _.cloneDeep(payload),
            benificiaryIndex: 0,
            buttonClicked: false,
            dropDownOptions: {
                privacyNameOptions,
                //paymentInstrumentList: populatePaymentInstrument(paymentInstruments),
            },
            inValidCardNameValue: true,
            inValidCardNumber: true,
            inValidCvv: true,
            inValidExpirationDate: true,
            inValidNameOnCard: true,
            reloadModalOpen: 0,
            reviewBtnFlag: false,
            validity: this.intializeValidations(),
        };
        this.state.flowObject.groupFromUrl = false;
        if (!_isEmpty(groupId)
            && Number(groupId) > 0) {
            this.state.flowObject.groupId = groupId;
            this.state.giveFromType = 'groups';
        } else if (!_isEmpty(campaignId)
            && Number(campaignId) > 0) {
            this.state.flowObject.campaignId = campaignId;
            this.state.giveFromType = 'campaigns'
        } else if (!_isEmpty(groupCampaignId)
            && Number(groupCampaignId) > 0) {
            this.state.flowObject.groupCampaignId = groupCampaignId;
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputOnBlur = this.handleInputOnBlur.bind(this)
        this.handleInputChangeGiveTo = this.handleInputChangeGiveTo.bind(this);
        this.handleAddMoneyModal = this.handleAddMoneyModal.bind(this);
    }

    componentDidMount() {
        const {
            slug,
            dispatch,
            currentAccount,
            currentUser: {
                id,
            },
            groupId,
            campaignId,
        } = this.props;
        dispatch(getDonationMatchAndPaymentInstruments(id));
        if (Number(groupId) > 0 || Number(campaignId) > 0) {
            getGroupsForUser(dispatch, id);
            dispatch(getGroupCampaignAdminInfoToShare(id, false))
        }
        else if (slug !== null) {
            getGroupsFromSlug(dispatch, slug)
                .then((result) => {
                    const giveGroupDetails = result.data;
                    dispatch(getGroupCampaignAdminInfoToShare(id, giveGroupDetails.attributes.isCampaign));
                })
                .catch(err => {
                })
        }
        if (_isEmpty(this.state.giveFromType) && currentAccount.accountType === 'company') {
            getCompanyPaymentAndTax(dispatch, Number(currentAccount.id));
        }
    }

    async componentDidUpdate(prevProps) {
        if (!_isEqual(this.props, prevProps)) {
            const {
                dropDownOptions,
            } = this.state;
            let {
                flowObject: {
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
                companyDetails,
                companiesAccountsData,
                currentAccount,
                currentUser: {
                    attributes: {
                        displayName,
                        email,
                        firstName,
                        lastName,
                        preferences,

                    },
                    id,
                },
                dispatch,
                i18n: {
                    language,
                },
                fund,
                groupId,
                //paymentInstrumentsData,
                userCampaigns,
                userGroups,
                taxReceiptProfiles,
                giveGroupDetails,
                infoOptions: {
                    groupMemberInfoToShare,
                    groupCampaignAdminShareInfoOptions,
                },
                userMembershipGroups
            } = this.props;
            //let paymentInstruments = paymentInstrumentsData;
            let companyPaymentInstrumentChanged = false;
            const formatMessage = this.props.t;
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
                //paymentInstruments = paymentInstrumentsData;
                giveData.giveFrom.text = `${fund.attributes.name}: ${formatCurrency(fund.attributes.balance, language, currency)}`
            }
            if (reviewBtnFlag && (giveData.giveFrom.balance >= giveData.giveAmount)) {
                reviewBtnFlag = false;
                reloadModalOpen = 0;
            }
            // const paymentInstrumentOptions = populatePaymentInstrument(
            //     paymentInstruments, formatMessage,
            // );
            const giveToOptions = populateGroupsOfUser(userMembershipGroups);

            if (!_isEmpty(giveGroupDetails) && _isEmpty(giveFromType)) {
                groupFromUrl = false;
                giveData.giveTo = {
                    avatar: giveGroupDetails.attributes.avatar,
                    id: giveGroupDetails.id,
                    isCampaign: giveGroupDetails.attributes.isCampaign,
                    name: giveGroupDetails.attributes.name,
                    recurringEnabled: giveGroupDetails.attributes.recurringEnabled,
                    text: giveGroupDetails.attributes.name,
                    type: giveGroupDetails.type,
                    value: giveGroupDetails.attributes.fundId,
                    activeMatch: giveGroupDetails.attributes.activeMatch,
                    hasActiveMatch: giveGroupDetails.attributes.hasActiveMatch,
                };
            }
            else if (!_isEmpty(userMembershipGroups) && !_isEmpty(giveFromType)) {
                groupFromUrl = true;
                const groupIndex = this.state.flowObject.groupIndex;
                giveData.giveTo = {
                    avatar: userMembershipGroups.userGroups[groupIndex].attributes.avatar,
                    id: userMembershipGroups.userGroups[groupIndex].id,
                    isCampaign: userMembershipGroups.userGroups[groupIndex].attributes.isCampaign,
                    name: userMembershipGroups.userGroups[groupIndex].attributes.name,
                    recurringEnabled: userMembershipGroups.userGroups[groupIndex]
                        .attributes.recurringEnabled,
                    text: userMembershipGroups.userGroups[groupIndex].attributes.name,
                    type: userMembershipGroups.userGroups[groupIndex].type,
                    value: userMembershipGroups.userGroups[groupIndex].attributes.fundId,
                    activeMatch: userMembershipGroups.userGroups[groupIndex].attributes.activeMatch,
                    hasActiveMatch: userMembershipGroups.userGroups[groupIndex].attributes.hasActiveMatch,
                };
            }
            if (!_isEmpty(fund)) {
                const giveFromId = (giveFromType === 'campaigns') ? campaignId : groupId;
                giveData = Group.initFields(
                    giveData, fund, id,
                    `${firstName} ${lastName}`, companiesAccountsData, userGroups, userCampaigns,
                    groupCampaignAdminShareInfoOptions, groupMemberInfoToShare, giveFromId, giveFromType, language, currency, preferences, giveGroupDetails, formatMessage,
                    this.props.groupCampaignId, currentAccount
                );
            }
            if (giveData.giveFrom.type === 'user' && !_isEmpty(groupMemberInfoToShare)) {
                const {
                    infoToShareList,
                } = populateDropdownInfoToShare(groupMemberInfoToShare);
                dropDownOptions.privacyNameOptions = infoToShareList;
            } else {
                const name = (giveData.giveFrom.type === 'companies' && giveData.giveFrom.displayName) ? giveData.giveFrom.displayName : giveData.giveFrom.name;
                dropDownOptions.privacyNameOptions = populateInfoToShareAccountName(name, formatMessage);
            }
            if (giveData.giveFrom.value && giveData.giveTo.value && giveData.giveTo.hasActiveMatch && !this.state.buttonClicked) {
                giveData.matchingPolicyDetails.matchingPolicyExpiry = await dispatch(fetchGroupMatchAmount(1, giveData.giveFrom.value, giveData.giveTo.value, false));
                giveData.matchingPolicyDetails = giveData.giveTo && checkMatchPolicy(giveData.giveTo, giveData.giftType.value, formatMessage, giveData.matchingPolicyDetails.matchingPolicyExpiry);
            }
            this.setState({
                buttonClicked: false,
                dropDownOptions: {
                    ...dropDownOptions,
                    giveToList: giveToOptions,
                    //paymentInstrumentList: paymentInstrumentOptions,
                },
                flowObject: {
                    ...this.state.flowObject,
                    giveData: {
                        // ...this.state.flowObject.giveData,
                        ...giveData,
                    },
                    groupFromUrl,
                },
                reloadModalOpen,
                reviewBtnFlag,
            });
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
    static initFields(giveData, fund, id,
        name, companiesAccountsData, userGroups, userCampaigns, groupCampaignAdminShareInfoOptions, groupMemberInfoToShare, groupId, giveFromType, language,
        currency, preferences, giveGroupDetails, formatMessage, groupCampaignId, currentAccount) {
        if (_isEmpty(companiesAccountsData) && _isEmpty(userGroups) && _isEmpty(userCampaigns) && !giveData.userInteracted) {
            giveData.giveFrom.id = id;
            giveData.giveFrom.value = fund.id;
            giveData.giveFrom.type = 'user';

            giveData.giveFrom.text = `${fund.attributes.name} ($${fund.attributes.balance})`;
            giveData.giveFrom.balance = fund.attributes.balance;
            giveData.giveFrom.name = name;
        } else if ((!_isEmpty(companiesAccountsData) || !_isEmpty(userGroups) || !_isEmpty(userCampaigns)) && (!giveData.userInteracted || _isEmpty(giveData.giveFrom.id))) {
            if (groupId) {
                const giveFromGroup = (giveFromType === 'campaigns')
                    ? userCampaigns.find((userCampaign) => userCampaign.id === groupId)
                    : userGroups.find((userGroup) => userGroup.id === groupId)
                if (!_isEmpty(giveFromGroup)) {
                    giveData.giveFrom = {
                        avatar: giveFromGroup.attributes.avatar,
                        balance: giveFromGroup.attributes.balance,
                        id: giveFromGroup.id,
                        name: giveFromGroup.attributes.name,
                        slug: giveFromGroup.attributes.slug,
                        text: `${giveFromGroup.attributes.fundName}: ${formatCurrency(giveFromGroup.attributes.balance, language, currency)}`,
                        type: giveFromGroup.type,
                        value: giveFromGroup.attributes.fundId,
                    };
                }
            } else if (groupCampaignId) {
                const giveFromGroupCampaign = userGroups.find((userGroup) => userGroup.id === groupCampaignId)
                giveData.giveFrom = {
                    avatar: giveFromGroupCampaign.attributes.avatar,
                    balance: giveFromGroupCampaign.attributes.balance,
                    id: giveFromGroupCampaign.id,
                    name: giveFromGroupCampaign.attributes.name,
                    slug: giveFromGroupCampaign.attributes.slug,
                    text: `${giveFromGroupCampaign.attributes.fundName}: ${formatCurrency(giveFromGroupCampaign.attributes.balance, language, currency)}`,
                    type: giveFromGroupCampaign.type,
                    value: giveFromGroupCampaign.attributes.fundId,
                };
            } else if (_isEmpty(giveFromType) && currentAccount.accountType === 'company') {
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
            } else if (_isEmpty(giveFromType) && currentAccount.accountType === 'personal') {
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
        if (!giveData.userInteracted && !(giveFromType === 'groups' || giveFromType === 'campaigns' || !_isEmpty(groupCampaignId))) {
            giveData.privacyShareAmount = preferences['giving_group_members_share_my_giftamount'];
        }
        if (!_isEmpty(groupCampaignAdminShareInfoOptions) && groupCampaignAdminShareInfoOptions.length > 0
            && (!giveData.userInteracted || _isEmpty(giveData.defaultInfoToShare))) {
            const prefernceName = giveData.giveTo.isCampaign ? 'campaign_admins_info_to_share' : 'giving_group_admins_info_to_share';
            const preference = preferences[prefernceName].includes('address')
                ? `${preferences[prefernceName]}-${preferences[`${prefernceName}_address`]}` : preferences[prefernceName];
            const { infoToShareList } = populateDropdownInfoToShare(groupCampaignAdminShareInfoOptions);
            const defaultInfoToShare = giveData.infoToShare = infoToShareList.find(opt => (
                opt.value === preference
            ));
            giveData.defaultInfoToShare = defaultInfoToShare;
            if (giveFromType === 'groups' || giveFromType === 'campaigns' || !_isEmpty(groupCampaignId) || currentAccount.accountType === 'company') {
                giveData.infoToShare = {
                    disabled: false,
                    text: ReactHtmlParser(`<span class="attributes">${formatMessage('giveCommon:infoToShareAnonymous')}</span>`),
                    value: 'anonymous',
                };
            } else {
                giveData.infoToShare = defaultInfoToShare
            }
            giveData.infoToShareList = infoToShareList;
        }
        if ((!giveData.userInteracted || _isEmpty(giveData.defaultNameToShare)) && !giveData.giveTo.isCampaign) {
            const { infoToShareList } = populateDropdownInfoToShare(groupMemberInfoToShare);
            const defaultNameToShare = infoToShareList.find(opt => (
                opt.value === preferences['giving_group_members_info_to_share']
            )) || {};
            giveData.defaultNameToShare = defaultNameToShare || {};
            if (giveFromType === 'groups' || giveFromType === 'campaigns' || currentAccount.accountType === 'company') {
                giveData.nameToShare = {
                    disabled: false,
                    text: ReactHtmlParser(`<span class="attributes">${formatMessage('giveCommon:infoToShareAnonymous')}</span>`),
                    value: 'anonymous',
                };
            } else {
                giveData.nameToShare = defaultNameToShare;
            }
        }
        return giveData;
    }

    validateForm() {
        const {
            flowObject: {
                giveData,
            },
        } = this.state;
        let {
            validity,
        } = this.state;
        validity = validateGiveForm('giveAmount', giveData.giveAmount, validity, giveData, 0);
        validity = validateGiveForm('giveFrom', giveData.giveFrom.value, validity, giveData, 0);
        validity = validateGiveForm('noteToSelf', giveData.noteToSelf, validity, giveData, 0);
        validity = validateGiveForm('noteToCharity', giveData.noteToCharity, validity, giveData, 0);
        validity = validateGiveForm('dedicateType', null, validity, giveData);
        if (giveData.giftType.value === 0) {
            validity = validateForReload(validity, giveData.giveFrom.type, giveData.giveAmount, giveData.giveFrom.balance);
        } else {
            validity.isReloadRequired = true;
        }

        if (giveData.giveTo.value === giveData.giveFrom.value) {
            validity.isValidGiveTo = false;
        } else {
            validity.isValidGiveTo = true;
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
        let inputValue = value;
        const isNumber = /^(?:[0-9]+,)*[0-9]+(?:\.[0-9]*)?$/;
        if ((name === 'giveAmount') && !_isEmpty(value) && value.match(isNumber)) {
            inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
            giveData[name] = inputValue;
            giveData['formatedGroupAmount'] = _.replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');

        }
        if (name !== 'giftType' && name !== 'giveFrom') {
            validity = validateGiveForm(name, inputValue, validity, giveData, 0);
        }
        switch (name) {
            case 'giveFrom':
                if (giveData.giveFrom.type === 'companies' || giveData.giveFrom.type === 'campaigns') {
                    giveData['noteToSelf'] = '';
                }
                validity = validateGiveForm('giveAmount', giveData.giveAmount, validity, giveData, 0);
                break;
            case 'inHonorOf':
            case 'inMemoryOf':
                validity = validateGiveForm('dedicateType', null, validity, giveData);
                break;
            case 'noteToCharity':
                giveData[name] = inputValue.trim();
                validity = validateGiveForm('noteToCharity', giveData.noteToCharity, validity, giveData);
                break;
            case 'noteToSelf':
                giveData[name] = inputValue.trim();
                validity = validateGiveForm('noteToSelf', giveData.noteToSelf, validity, giveData);
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

    intializeValidations() {
        this.validity = {
            doesAmountExist: true,
            isAmountCoverGive: true,
            isAmountLessThanOneBillion: true,
            isAmountMoreThanOneDollor: true,
            isDedicateGiftEmpty: true,
            isNoteToCharityInLimit: true,
            isNoteToSelfInLimit: true,
            isValidDecimalAmount: true,
            isValidGiveAmount: true,
            isValidGiveFrom: true,
            isValidGiveTo: true,
            isValidNoteSelfText: true,
            isValidNoteToCharity: true,
            isValidNoteToCharityText: true,
            isValidNoteToSelf: true,
            isValidPositiveNumber: true,
            isReloadRequired: true
        };
        return this.validity;
    }

    handlePresetAmountClick = (event, data) => {
        const {
            value,
        } = data;
        let {
            flowObject: {
                giveData
            },
            giveFromType,
            reviewBtnFlag,
            validity,
        } = this.state;
        const formatMessage = this.props.t;
        if (Number(value) && Number(value) >= 1 && giveData.giveTo.hasActiveMatch) {
            giveData.matchingPolicyDetails = giveData.giveTo &&
                checkMatchPolicy(giveData.giveTo, giveData.giftType.value, formatMessage, giveData.matchingPolicyDetails.matchingPolicyExpiry);
        }
        const inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
        giveData.giveAmount = inputValue;
        giveData.formatedGroupAmount = _.replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
        validity = validateGiveForm("giveAmount", inputValue, validity, giveData);
        reviewBtnFlag = false;
        this.setState({
            ...this.state,
            flowObject: {
                ...this.state.flowObject,
                giveData: {
                    ...this.state.flowObject.giveData,
                    ...giveData,
                },
            },
            reviewBtnFlag,
            validity,
        });
    }

    handleSubmit = () => {
        let {
            flowObject,
        } = this.state;
        const {
            nextStep,
            dispatch,
            flowSteps,
            stepIndex
        } = this.props;
        let {
            giveData: {
                infoToShare,
                nameToShare,
                giveTo: {
                    isCampaign,
                }
            },
        } = flowObject;
        this.setState({
            buttonClicked: true,
        });
        if (this.validateForm()) {
            flowObject.giveData.privacyShareAdminName = false
            flowObject.giveData.privacyShareEmail = false;
            flowObject.giveData.privacyShareAddress = false;
            if (infoToShare.value !== 'anonymous') {
                if (infoToShare.value === 'name') {
                    flowObject.giveData.privacyShareAdminName = true;
                } else if (infoToShare.value === 'name_email') {
                    flowObject.giveData.privacyShareAdminName = true;
                    flowObject.giveData.privacyShareEmail = true;
                } else if (infoToShare.value.includes('name_address_email')) {
                    flowObject.giveData.privacyShareAdminName = true;
                    flowObject.giveData.privacyShareEmail = true;
                    flowObject.giveData.privacyShareAddress = true;
                }
            }
            if (!isCampaign && nameToShare.value !== 'anonymous') {
                flowObject.giveData.privacyShareName = true;
                flowObject.giveData.privacyShareAdminName = true;
            } else {
                flowObject.giveData.privacyShareName = false;
            }
            flowObject.stepsCompleted = false;
            flowObject.nextSteptoProceed = nextStep;
            dispatch(proceed(flowObject, flowSteps[stepIndex + 1], stepIndex));
        } else {
            this.setState({
                buttonClicked: false,
            });
        }
    }

    handlegiftTypeButtonClick = (e, { value }) => {
        const {
            flowObject: {
                giveData
            },
            giveFromType,
        } = this.state;
        const formatMessage = this.props.t;
        if (giveData.giveTo.hasActiveMatch) {
            giveData.matchingPolicyDetails = giveData.giveTo && checkMatchPolicy(giveData.giveTo, value, formatMessage, giveData.matchingPolicyDetails.matchingPolicyExpiry);
        }
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

    async handleInputChange(event, data) {
        const {
            name,
            options,
            value,
            newIndex
        } = data;
        let {
            flowObject: {
                giveData,
            },
            dropDownOptions,
            giveFromType,
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
            currentUser: {
                attributes: {
                    preferences,
                },
            },
            giveGroupDetails,
            infoOptions: {
                groupMemberInfoToShare,
                groupCampaignAdminShareInfoOptions,
            },
        } = this.props;
        const formatMessage = this.props.t;
        const {
            coverFeesData,
            dispatch,
        } = this.props;
        let newValue = (!_isEmpty(options)) ? _find(options, { value }) : value;
        const privacyCheckbox = [
            'privacyShareAddress',
            'privacyShareAmount',
            'privacyShareEmail',
            'privacyShareName',
        ];
        const isValidPrivacyOption = _includes(privacyCheckbox, name);
        if (isValidPrivacyOption) {
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
                        giveData, dropDownOptions, this.props, type, groupMemberInfoToShare,
                    );
                    if (giveData.giveFrom.type === 'user') {
                        giveData.infoToShare = giveData.defaultInfoToShare;
                        giveData.nameToShare = giveData.defaultNameToShare;
                        if (_isEmpty(giveData.defaultInfoToShare)) {
                            const prefernceName = giveData.giveTo.isCampaign ? 'campaign_admins_info_to_share' : 'giving_group_admins_info_to_share';
                            const preference = preferences[prefernceName].includes('address')
                                ? `${preferences[prefernceName]}-${preferences[`${prefernceName}_address`]}` : preferences[prefernceName];
                            const { infoToShareList } = populateDropdownInfoToShare(groupCampaignAdminShareInfoOptions);
                            const defaultInfoToShare = giveData.infoToShare = infoToShareList.find(opt => (
                                opt.value === preference
                            ));
                            giveData.defaultInfoToShare = defaultInfoToShare;
                        }
                        if (_isEmpty(giveData.defaultNameToShare)) {
                            const { infoToShareList } = populateDropdownInfoToShare(groupMemberInfoToShare);
                            const defaultNameToShare = infoToShareList.find(opt => (
                                opt.value === preferences['giving_group_members_info_to_share']
                            )) || {};
                            giveData.defaultNameToShare = giveData.nameToShare = defaultNameToShare || {};
                        }
                        giveData.privacyShareAmount = preferences['giving_group_members_share_my_giftamount'];
                    } else {
                        const defaultDropDownOption = {
                            disabled: false,
                            text: ReactHtmlParser(`<span class="attributes">${formatMessage('giveCommon:infoToShareAnonymous')}</span>`),
                            value: 'anonymous',
                        };
                        giveData.infoToShare = defaultDropDownOption;
                        giveData.nameToShare = defaultDropDownOption;
                    }
                    if (giveData.giveFrom.type === 'companies' || giveData.giveFrom.type === 'campaigns') {
                        giveData.noteToSelf = '';
                    }
                    giveData = modifiedGiveData;
                    dropDownOptions = modifiedDropDownOptions;
                    validity = validateGiveForm(
                        name, giveData[name], validity, giveData, 0,
                    );
                    reviewBtnFlag = false;
                    reloadModalOpen = 0;
                    if (giveData.giveFrom.type === 'companies') {
                        getCompanyPaymentAndTax(dispatch, Number(giveData.giveFrom.id));
                    }
                    if (giveData.giveTo.hasActiveMatch) {
                        giveData.matchingPolicyDetails.matchingPolicyExpiry = await dispatch(fetchGroupMatchAmount(1, giveData.giveFrom.value, giveData.giveTo.value, false));
                        giveData.matchingPolicyDetails = giveData.giveTo && checkMatchPolicy(giveData.giveTo, giveData.giftType.value, formatMessage, giveData.matchingPolicyDetails.matchingPolicyExpiry);
                    }
                    break;
                case 'giveAmount':
                    giveData['formatedGroupAmount'] = newValue;
                    if (giveData.giveTo && giveData.giveTo.hasActiveMatch) {
                        giveData.matchingPolicyDetails = giveData.giveTo && checkMatchPolicy(giveData.giveTo, giveData.giftType.value, formatMessage, giveData.matchingPolicyDetails.matchingPolicyExpiry);
                    }
                    reviewBtnFlag = false;
                    reloadModalOpen = 0;
                    break;
                case 'nameToShare':
                    const {
                        giveFrom,
                        infoToShare,
                        infoToShareList
                    } = giveData;
                    if (newValue.value !== 'anonymous' && infoToShare.value === 'anonymous') {
                        if (giveFrom.type === 'user') {
                            giveData.infoToShare = infoToShareList.find(opt => (
                                opt.value === 'name'
                            ));
                        } else {
                            giveData.infoToShare = dropDownOptions.privacyNameOptions.find(opt => (
                                opt.value === 'name'
                            ));
                        }
                    }
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
                reloadModalOpen,
                reviewBtnFlag,
                validity: {
                    ...this.state.validity,
                    validity,
                },
            });
        }
    }

    async handleInputChangeGiveTo(event, data) {
        const {
            options,
            value,
        } = data;
        const {
            flowObject: {
                giveData: {
                    giveAmount,
                    giveFrom,
                    giveTo,
                    giftType,
                },
            },
            validity,
        } = this.state;
        let {
            flowObject: {
                giveData: {
                    matchingPolicyDetails,
                }
            },
        } = this.state;
        const {
            dispatch,
            userMembershipGroups,
        } = this.props;
        const formatMessage = this.props.t;
        const dataUsers = userMembershipGroups.userGroups;
        const groupId = options[data.options.findIndex((p) => p.value === value)].id;
        const benificiaryIndex = dataUsers.findIndex((p) => p.id === groupId);
        const benificiaryData = dataUsers[benificiaryIndex];
        giveTo.avatar = benificiaryData.attributes.avatar;
        giveTo.id = benificiaryData.id;
        giveTo.isCampaign = benificiaryData.attributes.isCampaign;
        giveTo.name = benificiaryData.attributes.name;
        giveTo.recurringEnabled = benificiaryData.attributes.recurringEnabled;
        giveTo.text = benificiaryData.attributes.name;
        giveTo.type = benificiaryData.type;
        giveTo.value = value;
        giveTo.activeMatch = benificiaryData.attributes.activeMatch;
        giveTo.hasActiveMatch = benificiaryData.attributes.hasActiveMatch;
        validity.isValidGiveTo = !((giveTo.type === giveFrom.type)
            && (giveTo.value === giveFrom.value));
        if (giveTo.hasActiveMatch) {
            matchingPolicyDetails.matchingPolicyExpiry = giveFrom.value && await dispatch(fetchGroupMatchAmount(1, giveFrom.value, giveTo.value, false));
            matchingPolicyDetails = giveTo &&
                checkMatchPolicy(giveTo, giftType.value, formatMessage, matchingPolicyDetails.matchingPolicyExpiry);
        } else {
            giveData.matchingPolicyDetails = {
                hasMatchingPolicy: false,
                isValidMatchPolicy: false,
                matchPolicyTitle: '',
                matchingPolicyExpiry: false,
            };
        }
        this.setState({
            flowObject: {
                ...this.state.flowObject,
                giveData: {
                    ...this.state.flowObject.giveData,
                    giveTo,
                    matchingPolicyDetails,
                },
                groupIndex: benificiaryIndex,
            },
            validity: {
                ...this.state.validity,
                validity,
            },
        });
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
                };
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

    renderRepeatGift(giveTo, giftType, giveFrom, formatMessage, language) {
        let repeatGift = null;
        if (giveFrom.type === 'user' || giveFrom.type === 'companies') {
            repeatGift = (
                <DonationFrequency
                    isGiveFlow={true}
                    formatMessage={formatMessage}
                    giftType={giftType}
                    handlegiftTypeButtonClick={this.handlegiftTypeButtonClick}
                    handleInputChange={this.handleInputChange}
                    language={language}
                    recurringDisabled={!giveTo.recurringEnabled}
                    isCampaign={giveTo.isCampaign}
                />
            );
        }
        return repeatGift;
    }

    render() {
        let {
            flowObject: {
                giveData: {
                    dedicateGift: {
                        dedicateType,
                        dedicateValue,
                    },
                    giftType,
                    formatedGroupAmount,
                    giveAmount,
                    giveTo,
                    giveFrom,
                    matchingPolicyDetails,
                    infoToShare,
                    nameToShare,
                    noteToCharity,
                    noteToSelf,
                    privacyShareAmount,
                },
                groupFromUrl,
                type
            },
            validity,
            dropDownOptions: {
                giveToList,
                privacyNameOptions,
            },
            reviewBtnFlag,
        } = this.state;
        const {
            currentStep,
            currentUser: {
                attributes: {
                    displayName,
                    preferences,
                },
                id,
            },
            flowSteps,
            giveGroupDetails,
            infoOptions: {
                groupCampaignAdminShareInfoOptions,
            },
            i18n: {
                language,
            },
        } = this.props;
        const formatMessage = this.props.t;
        const giveToType = (giveTo.isCampaign) ? 'Campaign' : 'Group';
        let privacyOptionComponent = null;
        let hasCampaign = false;
        if (!_.isEmpty(giveGroupDetails)) {
            //hasCampaign = (giveGroupDetails.attributes.campaignId) ? true : false;
            hasCampaign = (giveGroupDetails.attributes.campaignId && !giveGroupDetails.attributes.isCampaign) ? true : false;
        }
        if (giveFrom.value > 0) {
            privacyOptionComponent = (
                <PrivacyOptions
                    displayName={displayName}
                    formatMessage={formatMessage}
                    handleInputChange={this.handleInputChange}
                    hasCampaign={hasCampaign}
                    isCampaign={giveTo.isCampaign}
                    giveFrom={giveFrom}
                    giveToType={giveToType}
                    infoToShare={infoToShare}
                    groupCampaignAdminShareInfoOptions={groupCampaignAdminShareInfoOptions}
                    nameToShare={nameToShare}
                    privacyShareAmount={privacyShareAmount}
                    privacyNameOptions={privacyNameOptions}
                    preferences={preferences}
                    userId={id}
                />
            );
        }
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
                type="submit"
            />);
        let giveBannerHeader;
        if (!!groupFromUrl) {
            giveBannerHeader = (giveFrom.name) ? `Give From ${giveFrom.name}` : '';
        } else {
            giveBannerHeader = (giveTo.text) ? `Give to ${giveTo.text}` : '';
        }
        return (
            <Fragment>
                <div className="givinggroupbanner">
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
                                        <Form onSubmit={this.handleSubmit}>
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column mobile={16} tablet={12} computer={10}>
                                                        {/* Give From Scenario */}
                                                        {
                                                            (!!groupFromUrl && (
                                                                <Fragment>
                                                                    <div className="give_flow_field_bottom">
                                                                        <Form.Field>
                                                                            <label htmlFor="giveTo">
                                                                                {formatMessage('giveToLabel')}
                                                                            </label>
                                                                            <Form.Field
                                                                                className="dropdownWithArrowParent group-to-give"
                                                                                control={Select}
                                                                                error={!validity.isValidGiveTo}
                                                                                id="giveToList"
                                                                                name="giveToList"
                                                                                search
                                                                                onChange={this.handleInputChangeGiveTo}
                                                                                options={giveToList}
                                                                                placeholder={formatMessage('groupToGive')}
                                                                                value={giveTo.value}
                                                                            />
                                                                        </Form.Field>
                                                                        <FormValidationErrorMessage
                                                                            condition={!validity.isValidGiveTo}
                                                                            errorMessage={
                                                                                formatMessage('giveGroupToEqualGiveFrom')
                                                                            }
                                                                        />
                                                                    </div>
                                                                </Fragment>
                                                            )
                                                            )
                                                        }
                                                        <GroupAmountField
                                                            isGiveFlow={true}
                                                            amount={formatedGroupAmount}
                                                            formatMessage={formatMessage}
                                                            handleInputChange={this.handleInputChange}
                                                            handleInputOnBlur={this.handleInputOnBlur}
                                                            handlePresetAmountClick={this.handlePresetAmountClick}
                                                            validity={validity}
                                                        />
                                                    </Grid.Column>
                                                    {
                                                        (matchingPolicyDetails.hasMatchingPolicy && Number(giveAmount) >= 1 && !_isEmpty(giveFrom.id) && giveTo.id) &&
                                                        <Grid.Column mobile={16} tablet={12} computer={10}>
                                                            <MatchingPolicyModal
                                                                isCampaign={giveTo.isCampaign}
                                                                matchingDetails={giveTo.activeMatch}
                                                                matchingPolicyDetails={matchingPolicyDetails}
                                                            />
                                                        </Grid.Column>
                                                    }
                                                    <Grid.Column mobile={16} tablet={12} computer={10}>
                                                        <div className="give_flow_field">
                                                            {(!this.props.currentUser.userAccountsFetched || !_isEmpty(giveFromList)) && (
                                                                <DropDownAccountOptions
                                                                    type="group"
                                                                    validity={validity.isValidGiveFrom}
                                                                    selectedValue={giveFrom.value}
                                                                    name="giveFrom"
                                                                    formatMessage={formatMessage}
                                                                    parentInputChange={this.handleInputChange}
                                                                    giveTo={giveTo}
                                                                    giveFromUrl={!groupFromUrl}
                                                                    parentOnBlurChange={this.handleInputOnBlur}
                                                                    reviewBtnFlag={reviewBtnFlag}
                                                                />
                                                            )}
                                                            {this.renderReloadAddAmount()}
                                                        </div>
                                                        {this.renderRepeatGift(giveTo, giftType, giveFrom, formatMessage, language)}
                                                        {privacyOptionComponent}
                                                        <Form.Field className="give_flow_field">
                                                            <DedicateType
                                                                handleInputChange={this.handleInputChange}
                                                                handleInputOnBlur={this.handleInputOnBlur}
                                                                dedicateType={dedicateType}
                                                                dedicateValue={dedicateValue}
                                                                validity={validity}
                                                            />
                                                        </Form.Field>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                            <Grid className="to_space">
                                                <Grid.Row className="to_space">
                                                    <Grid.Column mobile={16} tablet={16} computer={16}>
                                                        <NoteTo
                                                            allocationType={giveToType}
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
        )
    }
}

Group.defaultProps = Object.assign({}, groupDefaultProps, {
    infoOptions: {
        groupCampaignAdminShareInfoOptions: [
            {
                text: 'Give anonymously',
                value: 'anonymous',
                privacySetting: 'anonymous'
            },
        ],
        groupMemberInfoToShare: [
            {
                text: 'Give anonymously',
                value: 'anonymous',
                privacySetting: 'anonymous'
            },
        ],
    }
});

const mapStateToProps = (state) => {

    return {
        giveGroupDetails: state.give.groupSlugDetails,
        companiesAccountsData: state.user.companiesAccountsData,
        companyDetails: state.give.companyData,
        companyAccountsFetched: state.give.companyAccountsFetched,
        currentAccount: state.user.currentAccount,
        currentUser: state.user.info,
        giveGroupBenificairyDetails: state.give.benificiaryForGroupDetails,
        infoOptions: state.userProfile.infoOptions,
        taxReceiptProfiles: state.user.taxReceiptProfiles,
        userAccountsFetched: state.user.userAccountsFetched,
        userCampaigns: state.user.userCampaigns,
        userGroups: state.user.userGroups,
        userMembershipGroups: state.user.userMembershipGroups,
    }
}

export default withTranslation([
    'group',
    'giveCommon',
    'noteTo',
    'accountTopUp',
    'privacyOptions',
    'specialInstruction',
])(connect(mapStateToProps)(Group))

