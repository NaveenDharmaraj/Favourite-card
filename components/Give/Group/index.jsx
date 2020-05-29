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
    populateInfoToShare,
    populateShareName,
    resetDataForAccountChange,
    validateGiveForm,
    formatCurrency,
    setDonationAmount,
    validateForReload,
} from '../../../helpers/give/utils';
import {
    getCompanyPaymentAndTax,
    getGroupsFromSlug,
    proceed,
} from '../../../actions/give';
import { groupDefaultProps } from '../../../helpers/give/defaultProps';

const DedicateType = dynamic(() => import('../DedicateGift'), { ssr: false });

class Group extends React.Component {
    constructor(props) {
        super(props);
        const {
            campaignId,
            companyDetails,
            currentUser: {
                attributes:{
                    displayName,
                    email,
                },
            },
            groupId,
            paymentInstrumentsData,
            taxReceiptProfiles,
        } = props;
        const paymentInstruments = (!_isEmpty(props.flowObject.giveData.giveFrom) && props.flowObject.giveData.giveFrom.type === 'companies') ? companyDetails.companyPaymentInstrumentsData : paymentInstrumentsData;
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
            payload =  _merge({}, props.flowObject)
        }
        this.state = {
            flowObject:_.cloneDeep(payload),
            benificiaryIndex: 0,
            buttonClicked: false,
            dropDownOptions: {
                privacyNameOptions:populateShareName(displayName),
                infoToShareList: populateInfoToShare(
                    taxReceiptProfiles,
                    companyDetails,
                    payload.giveData.giveFrom,
                    {
                        displayName,
                        email,
                    },
                    formatMessage,
                ),
                paymentInstrumentList: populatePaymentInstrument(paymentInstruments),
            },
            inValidCardNameValue: true,
            inValidCardNumber: true,
            inValidCvv: true,
            inValidExpirationDate: true,
            inValidNameOnCard: true,
            reloadModalOpen:0,
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
            currentUser:{
                id,
            },
            groupId,
            campaignId,
        } = this.props;
        if (Number(groupId) > 0 || Number(campaignId) > 0) {
            getGroupsForUser(dispatch,id);
        }  
        else if (slug !== null) {
            getGroupsFromSlug(dispatch, slug);
        }
        dispatch(getDonationMatchAndPaymentInstruments(id));

    }

    componentDidUpdate(prevProps) {
        if(!_isEqual(this.props, prevProps)) {
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
                currentUser:{
                    attributes:{
                        displayName,
                        email,
                        firstName,
                        lastName,

                    },
                    id,
                },
                i18n: {
                    language,
                },
                fund,
                groupId,
                paymentInstrumentsData,
                userCampaigns,
                userGroups,
                taxReceiptProfiles,
                giveGroupDetails,
                userMembershipGroups
            } = this.props;
            let paymentInstruments = paymentInstrumentsData;
            let companyPaymentInstrumentChanged = false;
            const formatMessage = this.props.t;
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
                paymentInstruments = paymentInstrumentsData;
                giveData.giveFrom.text = `${fund.attributes.name}: ${formatCurrency(fund.attributes.balance, language, currency)}`
            }
            if(reviewBtnFlag && (giveData.giveFrom.balance >= giveData.giveAmount)) {
                reviewBtnFlag = false;
                reloadModalOpen = 0;
            }
            const paymentInstrumentOptions = populatePaymentInstrument(
                paymentInstruments, formatMessage,
            );
            const giveToOptions = populateGroupsOfUser(userMembershipGroups);
            
            if (!_isEmpty(giveGroupDetails) && _isEmpty(giveFromType)) {
                groupFromUrl = false;
                giveData.giveTo = {
                    id: giveGroupDetails.id,
                    isCampaign: giveGroupDetails.attributes.isCampaign,
                    name: giveGroupDetails.attributes.name,
                    recurringEnabled: giveGroupDetails.attributes.recurringEnabled,
                    text: giveGroupDetails.attributes.name,
                    type: giveGroupDetails.type,
                    value: giveGroupDetails.attributes.fundId,
                };
            } 
            else if (!_isEmpty(userMembershipGroups) && !_isEmpty(giveFromType)) {
                groupFromUrl = true;
                const groupIndex = this.state.flowObject.groupIndex;
                giveData.giveTo = {
                    id: userMembershipGroups.userGroups[groupIndex].id,
                    isCampaign: userMembershipGroups.userGroups[groupIndex].attributes.isCampaign,
                    name: userMembershipGroups.userGroups[groupIndex].attributes.name,
                    recurringEnabled: userMembershipGroups.userGroups[groupIndex]
                        .attributes.recurringEnabled,
                    text: userMembershipGroups.userGroups[groupIndex].attributes.name,
                    type: userMembershipGroups.userGroups[groupIndex].type,
                    value: userMembershipGroups.userGroups[groupIndex].attributes.fundId,
                };
            }
            
            if (!_isEmpty(fund)) {
                const addressToShareList = Group.populateShareAddress(
                    taxReceiptProfiles, {
                        displayName,
                        email,
                    },
                    formatMessage
                );
                let privacyNameOptions = populateShareName(giveData.giveFrom.name);
                const giveFromId = (giveFromType === 'campaigns') ? campaignId : groupId;
                giveData = Group.initFields(
                    giveData, fund, id,
                    `${firstName} ${lastName}`, companiesAccountsData, userGroups, userCampaigns,
                    addressToShareList, privacyNameOptions, giveFromId, giveFromType, language, currency,
                );
            }
            this.setState({
                buttonClicked: false,
                dropDownOptions: {
                    ...dropDownOptions,
                    giveToList: giveToOptions,
                    privacyNameOptions : populateShareName(giveData.giveFrom.name),
                    infoToShareList: Group.populateShareAddress(
                        taxReceiptProfiles,
                        {
                            displayName,
                            email
                        },
                        formatMessage
                    ),
                    paymentInstrumentList: paymentInstrumentOptions,
                },
                flowObject:{
                    ...this.state.flowObject,
                    giveData:{
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

    static populateShareAddress(taxReceiptProfile, userDetails, formatMessage) {
        let infoToShareList = null;
            const {
                displayName,
                email,
            } = userDetails;
            const userTaxProfileData = !_.isEmpty(taxReceiptProfile)
                ? getDropDownOptionFromApiData(
                    taxReceiptProfile,
                    null,
                    (item) => `name_address_email|${item.id}`,
                    (attributes) => { return ReactHtmlParser(`<span class="attributes"><b>${attributes.fullName}</b></span>
                    <span class="attributes">${email}</span>
                    <span class="attributes"> ${attributes.addressOne} ${attributes.addressTwo} </span>
                    <span class="attributes">${attributes.city}, ${attributes.province} ${attributes.postalCode}</span>`);
                    },
                    (attributes) => false) : null;
            infoToShareList = [
                {
                    disabled: false,
                    text: ReactHtmlParser(`<span class="attributes">${formatMessage('giveCommon:infoToShareAnonymous')}</span>`),
                    value: 'anonymous',
                },
                // {
                //     disabled: false,
                //     text: ReactHtmlParser(`<span class="attributes"><b>${displayName}</b></span>`),
                //     value: 'name',
                // },
                {
                    disabled: false,
                    text: ReactHtmlParser(`<span class="attributes"><b>${displayName}</b></span>
                           <span class="attributes">${email}</span>`),
                    value: 'name_email',
                },
            ];
            if (!_.isEmpty(userTaxProfileData)) {
                infoToShareList = _.concat(
                    infoToShareList,
                    userTaxProfileData,
                );
            }
            return infoToShareList
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
        name, companiesAccountsData, userGroups, userCampaigns, addressToShareList, privacyNameOptions, groupId, giveFromType, language, currency) {
        if (_isEmpty(companiesAccountsData) && _isEmpty(userGroups) && _isEmpty(userCampaigns) && !giveData.userInteracted) {
            giveData.giveFrom.id = id;
            giveData.giveFrom.value = fund.id;
            giveData.giveFrom.type = 'user';

            giveData.giveFrom.text = `${fund.attributes.name} ($${fund.attributes.balance})`;
            giveData.giveFrom.balance = fund.attributes.balance;
            giveData.giveFrom.name = name;
        } else if (!_isEmpty(companiesAccountsData) && !_isEmpty(userGroups) && !_isEmpty(userCampaigns) && !giveData.userInteracted) {
            if (groupId){
                const giveFromGroup = (giveFromType === 'campaigns')
                    ? userCampaigns.find((userCampaign) => userCampaign.id === groupId)
                    : userGroups.find((userGroup) => userGroup.id === groupId)
                if(!_isEmpty(giveFromGroup)) {
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
            }
            else {
                giveData.giveFrom = {
                    value: '',
                };
            }
        }
        if (!_isEmpty(addressToShareList) && addressToShareList.length > 0
        && !giveData.userInteracted) {
            const [
                defaultAddress,
            ] = addressToShareList;
            giveData.infoToShare = defaultAddress;
        }
        if (!_isEmpty(privacyNameOptions) && privacyNameOptions.length > 0
        && !giveData.userInteracted) {
        const [
            defaultName,
        ] = privacyNameOptions
        giveData.nameToShare = defaultName;
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
        validity = validateForReload(validity, giveData.giveFrom.type, giveData.giveAmount, giveData.giveFrom.balance);
        if (giveData.giveTo.value === giveData.giveFrom.value) {
            validity.isValidGiveTo = false;
        } else {
            validity.isValidGiveTo = true;
        }
        this.setState({
            validity,
            reviewBtnFlag: !validity.isReloadRequired
        });
        return _every(validity);
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
            isValidGiveTo:true,
            isValidNoteSelfText: true,
            isValidNoteToCharity: true,
            isValidNoteToCharityText: true,
            isValidNoteToSelf: true,
            isValidPositiveNumber: true,
            isReloadRequired:true
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
            validity,
        } = this.state;
        const inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
        giveData.giveAmount = inputValue;
        giveData.formatedGroupAmount = _.replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
        validity = validateGiveForm("giveAmount", inputValue, validity, giveData);
        this.setState({
            ...this.state,
            flowObject: {
                ...this.state.flowObject,
                giveData: {
                    ...this.state.flowObject.giveData,
                    ...giveData,
                }
            },
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
            giveData:{
                infoToShare,
                nameToShare,
            },
        } = flowObject;
        this.setState({
            buttonClicked: true,
        });
        if (this.validateForm()) {
            if(infoToShare.value !== 'anonymous') {
                flowObject.giveData.privacyShareEmail = true;
                if(infoToShare.value !=='name_email'){
                    flowObject.giveData.privacyShareAddress = true;
                } else{
                    flowObject.giveData.privacyShareAddress = false;
                }
            } else{
                flowObject.giveData.privacyShareEmail = false;
                flowObject.giveData.privacyShareAddress = false;
            }
            if(nameToShare.value !== 0) {
                flowObject.giveData.privacyShareName = true;
            } else{
                flowObject.giveData.privacyShareName = false;
            }
            if(flowObject.giveData.giveFrom.type !== 'user') {
                flowObject.giveData.infoToShare = {
                    value: null,
                };
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

    handlegiftTypeButtonClick = (e, { value }) =>{
        this.setState({ 
            flowObject: {
                ...this.state.flowObject,
                giveData:{
                    ...this.state.flowObject.giveData,
                    giftType:{
                        value:value
                    },
                },
            },
        })
    }

    handleInputChange(event, data) {
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
        if(name === 'inHonorOf' || name ==='inMemoryOf'){
            if(newIndex === -1){
                giveData.dedicateGift.dedicateType = '';
                giveData.dedicateGift.dedicateValue = '';
            }
            else{
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
        if (name !== 'inHonorOf' && name !=='inMemoryOf') {
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
                    validity = validateGiveForm(
                        name, giveData[name], validity, giveData, 0,
                    );
                    reviewBtnFlag = false;
                    reloadModalOpen = 0;
                    if (giveData.giveFrom.type === 'companies') {
                        getCompanyPaymentAndTax(dispatch,Number(giveData.giveFrom.id));
                    }
                    break;
                case 'giveAmount':
                    giveData['formatedGroupAmount'] = newValue;
                    reviewBtnFlag = false;
                    reloadModalOpen = 0;
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
                reloadModalOpen,
                reviewBtnFlag,
                validity: {
                    ...this.state.validity,
                    validity,
                },
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
                    giveFrom,
                    giveTo,
                },
            },
            validity,
        } = this.state;
        const {
            userMembershipGroups,
        } = this.props;
        const dataUsers = userMembershipGroups.userGroups;
        const groupId = options[data.options.findIndex((p) => p.value === value)].id;
        const benificiaryIndex = dataUsers.findIndex((p) => p.id === groupId);
        const benificiaryData = dataUsers[benificiaryIndex];
        giveTo.id = benificiaryData.id;
        giveTo.isCampaign = benificiaryData.attributes.isCampaign;
        giveTo.name = benificiaryData.attributes.name;
        giveTo.recurringEnabled = benificiaryData.attributes.recurringEnabled;
        giveTo.text = benificiaryData.attributes.name;
        giveTo.type = benificiaryData.type;
        giveTo.value = value;
        validity.isValidGiveTo = !((giveTo.type === giveFrom.type)
        && (giveTo.value === giveFrom.value));
        this.setState({
            flowObject: {
                ...this.state.flowObject,
                giveData: {
                    ...this.state.flowObject.giveData,
                    giveTo,
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
            reloadModalOpen:1,
        })
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
            giveAmount,
            giftType,
        } = giveData
        const formatMessage = this.props.t;
        if ((giveFrom.type === 'user' || giveFrom.type === 'companies') && (Number(giveAmount) > Number(giveFrom.balance))) {
            if ((userAccountsFetched && giveFrom.type === 'user') || (companyAccountsFetched && giveFrom.type === 'companies')) {
            let taxReceiptList = taxReceiptProfiles;
            let defaultTaxReceiptProfileForReload = defaultTaxReceiptProfile;
            if (giveFrom.type === 'companies' && companyDetails) {
                taxReceiptList = !_.isEmpty(companyDetails.taxReceiptProfiles) ? companyDetails.taxReceiptProfiles : [];
                defaultTaxReceiptProfileForReload = companyDetails.companyDefaultTaxReceiptProfile;
            }
            let coverFeesData = {};
            let AmountToDonate = setDonationAmount(giveData, coverFeesData);
            const taxReceiptsOptions = populateTaxReceipts(taxReceiptList, formatMessage);
            return (
                <ReloadAddAmount
                    defaultTaxReceiptProfile={defaultTaxReceiptProfileForReload}
                    dispatch={dispatch}
                    donationMatchData={donationMatchData}
                    formatedDonationAmount={AmountToDonate}
                    formatMessage={formatMessage}
                    allocationGiftType={giftType.value}
                    giveTo={giveData.giveFrom}
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
            dropDownOptions:{
                giveToList,
                infoToShareList,
                privacyNameOptions,
            },
            reviewBtnFlag,
        } = this.state;
        const {
            currentStep,
            currentUser: {
                attributes:{
                    displayName,
                },
            },
            flowSteps,
            giveGroupDetails,
            i18n:{
                language,
            },
        } = this.props;
        const formatMessage = this.props.t;
        const giveToType = (giveTo.isCampaign) ? 'Campaign' : 'Group';
        let privacyOptionComponent = null;
        let hasCampaign = false;
        if(!_.isEmpty(giveGroupDetails)){
            hasCampaign = (giveGroupDetails.attributes.campaignId) ? true : false ;
        }
        if ( giveFrom.value > 0) {
            privacyOptionComponent = (
                <PrivacyOptions
                    displayName={displayName}
                    formatMessage={formatMessage}
                    handleInputChange={this.handleInputChange}
                    hasCampaign={hasCampaign}
                    giveFrom={giveFrom}
                    giveToType={giveToType}
                    infoToShare={infoToShare}
                    infoToShareList={infoToShareList}
                    nameToShare={nameToShare}
                    privacyShareAmount={privacyShareAmount}
                    privacyNameOptions={privacyNameOptions}
                />
            );
        }
        let submtBtn = (reviewBtnFlag)?(
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
            />)
            let giveBannerHeader;
            if(!!groupFromUrl) {
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
                                    <div className="flowBreadcrumb flowPadding">
                                        <FlowBreadcrumbs
                                            currentStep={currentStep}
                                            formatMessage={formatMessage}
                                            steps={flowSteps}
                                            flowType={type}/>
                                    </div>
                                    <div className="flowFirst">
                                        <Form onSubmit={this.handleSubmit}>
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column mobile={16} tablet={12} computer={10}>
                                                         {/* Give From Scenario */}
                                                        {
                                                        (  !!groupFromUrl && (
                                                                <Fragment>
                                                                    <Form.Field>
                                                                        <label htmlFor="giveTo">
                                                                            {formatMessage('giveToLabel')}
                                                                        </label>
                                                                        <Form.Field
                                                                            className="dropdownWithArrowParent"
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
                                                        { (!this.props.currentUser.userAccountsFetched || !_isEmpty(giveFromList)) && (
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
                                                        {this.renderRepeatGift(giveTo, giftType, giveFrom, formatMessage, language)}
                                                        {privacyOptionComponent}
                                                        <Form.Field>
                                                        </Form.Field>
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
                                                            allocationType="Group"// {type}
                                                            formatMessage={formatMessage}
                                                            giveFrom= {giveFrom}
                                                            giveToType= {giveToType}
                                                            noteToCharity= {noteToCharity}
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

Group.defaultProps = Object.assign({}, groupDefaultProps);

const  mapStateToProps = (state, props) => {

  return {
    giveGroupDetails: state.give.groupSlugDetails,
    companiesAccountsData: state.user.companiesAccountsData,
    companyDetails: state.give.companyData,
    companyAccountsFetched: state.give.companyAccountsFetched,
    currentUser: state.user.info,
    giveGroupBenificairyDetails: state.give.benificiaryForGroupDetails,
    taxReceiptProfiles: state.user.taxReceiptProfiles,
    userAccountsFetched: state.user.userAccountsFetched,
    userCampaigns: state.user.userCampaigns,
    userGroups: state.user.userGroups,
    userMembershipGroups:state.user.userMembershipGroups,
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

