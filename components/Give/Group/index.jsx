import React, {
  Fragment,
} from 'react';
import getConfig from 'next/config';
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
import {
    Elements,
    StripeProvider,
} from 'react-stripe-elements';
import {
  Divider,
  Form,
  Icon,
  Input,
  Popup,
  Select,
} from 'semantic-ui-react';
import { Link } from '../../../routes';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import NoteTo from '../NoteTo';
import AccountTopUp from '../AccountTopUp';
// import CreditCard from '../../shared/CreditCard';
import PrivacyOptions from '../PrivacyOptions';
import DropDownAccountOptions from '../../shared/DropDownAccountOptions';
import { 
    getDonationMatchAndPaymentInstruments,
    getGroupsForUser,
 } from '../../../actions/user';
import {
    formatAmount,
    getDefaultCreditCard,
    getDropDownOptionFromApiData,
    populateDonationMatch,
    populateGiveToGroupsofUser,
    populateGiftType,
    populateGroupsOfUser,
    populatePaymentInstrument,
    populateInfoToShare,
    resetDataForGiveAmountChange,
    resetDataForAccountChange,
    resetDataForGiftTypeChange,
    validateGiveForm
} from '../../../helpers/give/utils';
import {
    getCompanyPaymentAndTax,
    getGroupsFromSlug,
    proceed,
} from '../../../actions/give';
import { groupDefaultProps } from '../../../helpers/give/defaultProps';
import { dismissAllUxCritialErrors } from '../../../actions/error';
                          
const { publicRuntimeConfig } = getConfig();

const {
    STRIPE_KEY
} = publicRuntimeConfig;
const DedicateType = dynamic(() => import('../DedicateGift'), { ssr: false });
const CreditCard = dynamic(() => import('../../shared/CreditCard'), {
    ssr: false
});

class Group extends React.Component {
    constructor(props) {
        super(props);
        const {
            companyDetails,
            currentUser: {
                displayName,
                email,
            },
            donationMatchData,
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
        else{
                payload =  _merge({}, props.flowObject)
            }
        this.state = {
            flowObject:_.cloneDeep(payload),
            benificiaryIndex: 0,
            buttonClicked: false,
            dropDownOptions: {
                donationMatchList: populateDonationMatch(donationMatchData, formatMessage),
                giftTypeList: populateGiftType(formatMessage),
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
            validity: this.intializeValidations(),
        };
        this.state.flowObject.groupFromUrl = false;
        if(props.sourceAccountHolderId ){
        this.state.flowObject.sourceAccountHolderId = props.sourceAccountHolderId;
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputOnBlur = this.handleInputOnBlur.bind(this)
        this.handleInputChangeGiveTo = this.handleInputChangeGiveTo.bind(this);

        this.validateStripeCreditCardNo = this.validateStripeCreditCardNo.bind(this);
        this.validateStripeExpirationDate = this.validateStripeExpirationDate.bind(this);
        this.validateCreditCardCvv = this.validateCreditCardCvv.bind(this);
        this.validateCreditCardName = this.validateCreditCardName.bind(this);
        this.getStripeCreditCard = this.getStripeCreditCard.bind(this);
        dismissAllUxCritialErrors(props.dispatch);
    }

    componentDidMount() {
        const {
            slug,
            dispatch,
            currentUser:{
                id,
            },
            sourceAccountHolderId,
        } = this.props;
        if (Number(sourceAccountHolderId) > 0) {
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
                    giveData,
                },
                groupFromUrl,
            } = this.state;
            const {
                companyDetails,
                companiesAccountsData,
                donationMatchData,
                currentUser:{
                    attributes:{
                        firstName,
                        lastName,

                    },
                    id,
                },
                fund,
                paymentInstrumentsData,
                userCampaigns,
                userGroups,
                taxReceiptProfiles,
                giveGroupDetails,
                userMembershipGroups
            } = this.props;
            let paymentInstruments = null;
            let companyPaymentInstrumentChanged = false;
            const formatMessage = this.props.t;
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
            const giveToOptions = populateGroupsOfUser(userMembershipGroups);
            
            if (!_isEmpty(giveGroupDetails)) {
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
            else if (!_isEmpty(userMembershipGroups)) {
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
                    taxReceiptProfiles,
                );
                giveData = Group.initFields(
                    giveData, fund, id, paymentInstrumentOptions,
                    companyPaymentInstrumentChanged,
                    `${firstName} ${lastName}`, companiesAccountsData, userGroups, userCampaigns,
                    addressToShareList
                );
            }

            this.setState({
                buttonClicked: false,
                dropDownOptions: {
                    ...dropDownOptions,
                    donationMatchList: donationMatchOptions,
                    giftTypeList: populateGiftType(formatMessage),
                    giveToList: giveToOptions,
                    infoToShareList: Group.populateShareAddress(
                        taxReceiptProfiles,
                    ),
                    paymentInstrumentList: paymentInstrumentOptions,
                },
                flowObject:{
                    ...this.state.flowObject,
                    giveData:{
                        ...this.state.flowObject.giveData,
                        ...giveData,
                    },
                    groupFromUrl,
                }
            });        
        }        
    }

    static populateShareAddress(taxReceiptProfile) {
        return !_isEmpty(taxReceiptProfile) ? getDropDownOptionFromApiData(taxReceiptProfile, null, (item) => `name_address_email|${item.id}`,
            (attributes) => `${attributes.fullName}, ${attributes.addressOne}, ${attributes.city}, ${attributes.province}, ${attributes.postalCode}`,
            (attributes) => false) : null;
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
    static initFields(giveData, fund, id, paymentInstrumentOptions,
        companyPaymentInstrumentChanged, name, companiesAccountsData, userGroups, userCampaigns, addressToShareList) {
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
        if (!_isEmpty(addressToShareList) && addressToShareList.length > 0
        && !giveData.userInteracted) {
            const [
                defaultAddress,
            ] = addressToShareList;
            giveData.infoToShare = defaultAddress;
        }
        return giveData;
    }

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

        validity = validateGiveForm('donationAmount', giveData.donationAmount, validity, giveData, 0);
        validity = validateGiveForm('giveAmount', giveData.giveAmount, validity, giveData, 0);
        validity = validateGiveForm('giveFrom', giveData.giveFrom.value, validity, giveData, 0);
        validity = validateGiveForm('noteToSelf', giveData.noteToSelf, validity, giveData, 0);
        validity = validateGiveForm('noteToCharity', giveData.noteToCharity, validity, giveData, 0);
        validity = validateGiveForm('dedicateType', null, validity, giveData);
        if (giveData.giveTo.value === giveData.giveFrom.value) {
            validity.isValidGiveTo = false;
        } else {
            validity.isValidGiveTo = true;
        }
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
        const isNumber = /^\d+(\.\d*)?$/;
        if ((name === 'giveAmount' || name === 'donationAmount') && !_isEmpty(value) && value.match(isNumber)) {
            giveData[name] = formatAmount(value);
            inputValue = formatAmount(value);
        }
        if (name !== 'giftType' && name !== 'giveFrom') {
            validity = validateGiveForm(name, inputValue, validity, giveData, 0);
        }
        switch (name) {
            case 'giveAmount':
                validity = validateGiveForm('donationAmount', giveData.donationAmount, validity, giveData, 0);
                break;
            case 'giveFrom':
                validity = validateGiveForm('giveAmount', giveData.giveAmount, validity, giveData, 0);
                validity = validateGiveForm('donationAmount', giveData.donationAmount, validity, giveData, 0);
                break;
            case 'inHonorOf':
            case 'inMemoryOf':
                validity = validateGiveForm('dedicateType', null, validity, giveData);
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
            isDonationAmountBlank: true,
            isDonationAmountCoverGive: true,
            isDonationAmountLessThan1Billion: true,
            isDonationAmountMoreThan1Dollor: true,
            isDonationAmountPositive: true,
            isNoteToCharityInLimit: true,
            isNoteToSelfInLimit: true,
            isValidDecimalAmount: true,
            isValidDecimalDonationAmount: true,
            isValidDonationAmount: true,
            isValidGiveAmount: true,
            isValidGiveFrom: true,
            isValidGiveTo:true,
            isValidNoteSelfText: true,
            isValidNoteToCharity: true,
            isValidNoteToCharityText: true,
            isValidNoteToSelf: true,
            isValidPositiveNumber: true,
        };
        return this.validity;
    }

    handleSubmit = () => {
        const {
            flowObject,
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
        } = this.state;
        const {
            nextStep,
            companyDetails,
            defaultTaxReceiptProfile,
            dispatch,
            flowSteps,
            stepIndex
        } = this.props;
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
                    companyDetails.companyDefaultTaxReceiptProfile :
                    defaultTaxReceiptProfile;
            }
            flowObject.stepsCompleted = false;
            flowObject.nextSteptoProceed = nextStep;
            dismissAllUxCritialErrors(this.props.dispatch);
            dispatch(proceed(flowObject, flowSteps[stepIndex + 1], stepIndex));
        } else {
            this.setState({
                buttonClicked: false,
            });
        }
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
                    if (giveData.giveFrom.type === 'companies') {
                        getCompanyPaymentAndTax(dispatch,Number(giveData.giveFrom.id));
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
                               }&nbsp;
                               and &nbsp;
                               {
                                   giveFrom.type === 'companies' 
                                   ?  <a href={`/companies/${slug}/tax-receipt-profiles`}>tax receipt recipient</a>
                                   : <Link route = '/user/tax-receipts'>tax receipt recipient</Link>
                               }&nbsp;
                               to your account details.We won't charge your card without your permission.
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
                             &nbsp; to your account details.We won't charge your card without your permission.
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
        let {
            flowObject: {
                giveData:{
                    creditCard,
                    dedicateGift: {
                        dedicateType,
                        dedicateValue, 
                    },
                    donationAmount,
                    donationMatch,
                    giftType,
                    giveAmount,
                    giveTo,
                    giveFrom,
                    infoToShare,
                    noteToCharity,
                    noteToSelf,
                    privacyShareAddress,
                    privacyShareAmount,
                    privacyShareEmail,
                    privacyShareName,
                },
                groupFromUrl,
            },
            validity,
            inValidCardNumber,
            inValidExpirationDate,
            inValidNameOnCard,
            inValidCvv,
            inValidCardNameValue,
            dropDownOptions:{
                giftTypeList,
                giveToList,
                paymentInstrumentList,
                donationMatchList,
                infoToShareList
            },
        } = this.state;
        const {
            companyDetails,
            defaultTaxReceiptProfile,
        } = this.props;
        const formatMessage = this.props.t;
        const giveToType = (giveTo.isCampaign) ? 'Campaign' : 'Group';
        let accountTopUpComponent = null;
        let stripeCardComponent = null;
        let privacyOptionComponent = null;
        if ((giveFrom.type === 'user' || giveFrom.type === 'companies')
        && (giftType.value > 0 || (giftType.value === 0 &&
            Number(giveAmount) > Number(giveFrom.balance)))
        ) {
            const topupAmount = formatAmount((formatAmount(giveAmount) -
                formatAmount(giveFrom.balance)));
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

        if ( giveFrom.value > 0) {
            privacyOptionComponent = (
                <PrivacyOptions
                    formatMessage={formatMessage}
                    handleInputChange={this.handleInputChange}
                    giveFrom={giveFrom}
                    giveToType={giveToType}
                    infoToShare={infoToShare}
                    infoToShareList={infoToShareList}
                    privacyShareAddress={privacyShareAddress}
                    privacyShareAmount={privacyShareAmount}
                    privacyShareEmail={privacyShareEmail}
                    privacyShareName={privacyShareName}
                />
            );
        }

        let repeatGift = null;
            if ( (giveFrom.type === 'user' || giveFrom.type === 'companies') &&
                 !!giveTo.recurringEnabled
            ) {
                repeatGift = (
                    <Form.Field>
                        <label htmlFor="giftType">
                            { formatMessage('repeatThisGiftLabel') }
                        </label>
                        <Form.Field
                            control={Select}
                            id="giftType"
                            name="giftType"
                            options= {giftTypeList}
                            onChange={this.handleInputChange}
                            value={giftType.value}
                        />
                    </Form.Field>
                );
            }
        return (
        <Form onSubmit={this.handleSubmit}>
                    <Fragment>
                        {
                             ( !groupFromUrl && (
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
                                        value={_.isEmpty(giveTo.text) ? '' : giveTo.text}
                                    />
                                </Form.Field>
                                )
                            )
                        }
                        {
                         (  !!groupFromUrl && (
                                <Fragment>
                                    <Form.Field>
                                        <label htmlFor="giveTo">
                                            {formatMessage('giveToLabel')}
                                        </label>
                                        <Form.Field
                                            control={Select}
                                            error={!validity.isValidGiveTo}
                                            id="giveToList"
                                            name="giveToList"
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
                        <Form.Field>
                            <label htmlFor="giveAmount">
                                {formatMessage('amountLabel')}
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
                                placeholder={formatMessage('amountPlaceHolder')}
                                size="large"
                                value={giveAmount}
                            />
                        </Form.Field>
                        
                        <FormValidationErrorMessage
                            condition={!validity.doesAmountExist || !validity.isAmountMoreThanOneDollor
                            || !validity.isValidPositiveNumber}
                            errorMessage={formatMessage('amountLessOrInvalid', {
                                minAmount:  giftType.value > 0 ? 5 : 1,
                            })}
                        />
                        <FormValidationErrorMessage
                            condition={!validity.isAmountLessThanOneBillion}
                            errorMessage={formatMessage('invalidMaxAmountError')}
                        />
                        <FormValidationErrorMessage
                            condition={!validity.isAmountCoverGive}
                            errorMessage={formatMessage('giveCommon:errorMessages.giveAmountGreaterThanBalance')}
                        />
                        { (!this.props.currentUser.userAccountsFetched || !_isEmpty(giveFromList)) && (
                        <DropDownAccountOptions
                            type="group"
                            validity={validity.isValidGiveFrom}
                            selectedValue={this.state.flowObject.giveData.giveFrom.value}
                            name="giveFrom"
                            formatMessage={formatMessage}
                            parentInputChange={this.handleInputChange}
                            giveTo={giveTo}
                            giveFromUrl={!groupFromUrl}
                            parentOnBlurChange={this.handleInputOnBlur}
                        />
                        )}
                        {repeatGift}
                        { 
                            this.renderPaymentTaxErrorMsg(paymentInstrumentList, defaultTaxReceiptProfile, giveFrom,companyDetails, giftType.value)
                        }
                        <Form.Field>
                            <Divider className="dividerMargin" />
                        </Form.Field>
                        <DedicateType 
                            handleInputChange={this.handleInputChange}
                            handleInputOnBlur={this.handleInputOnBlur}
                            dedicateType={dedicateType}
                            dedicateValue={dedicateValue}
                            validity={validity}
                        />
                        <NoteTo
                            allocationType=""// {type}
                            formatMessage={formatMessage}
                            giveFrom= {giveFrom}
                            giveToType= {giveToType}
                            noteToCharity= {noteToCharity}
                            handleInputChange={this.handleInputChange}
                            handleInputOnBlur={this.handleInputOnBlur}
                            noteToSelf={noteToSelf}
                            validity={validity}
                        />
                        {privacyOptionComponent}
                        {accountTopUpComponent}
                        {stripeCardComponent}
                        <Divider hidden />
                        {/* { !stepsCompleted && */}
                            <Form.Button
                                primary
                                className='blue-btn-rounded' // {isMobile ? 'mobBtnPadding' : 'btnPadding'}
                                content={(!this.state.buttonClicked) ?
                                    formatMessage('giveCommon:continueButton')
                                    : formatMessage('giveCommon:submittingButton')}
                                disabled={(this.state.buttonClicked) }
                                type="submit"
                            />
                        {/* } */}
                    </Fragment>
                </Form>
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
    creditCardApiCall: state.give.creditCardApiCall,
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

