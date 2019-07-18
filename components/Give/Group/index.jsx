import React, {
  Fragment,
} from 'react';
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
import {
  Divider,
  Form,
  Icon,
  Input,
  Popup,
  Select,
} from 'semantic-ui-react';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import NoteTo from '../NoteTo';
import AccountTopUp from '../AccountTopUp';
import PrivacyOptions from '../PrivacyOptions';
import DropDownAccountOptions from '../../shared/DropDownAccountOptions';
import { beneficiaryDefaultProps } from '../../../helpers/give/defaultProps';
import { getDonationMatchAndPaymentInstruments } from '../../../actions/user';
import {
    formatAmount,
    getDefaultCreditCard,
    getDropDownOptionFromApiData,
    populateDonationMatch,
    populateGiveToGroupsofUser,
    populateGiftType,
    populatePaymentInstrument,
    populateInfoToShare,
    resetDataForGiveAmountChange,
    resetDataForAccountChange,
    resetDataForGiftTypeChange,
    validateGiveForm
} from '../../../helpers/give/utils';
import {
    getBeneficiariesForGroup,
    getCompanyPaymentAndTax,
    getGroupsFromSlug,
    proceed,
} from '../../../actions/give';

import { groupDefaultProps } from '../../../helpers/give/defaultProps';
// import { stat } from 'fs';

class Group extends React.Component {
    constructor(props) {
        props.flowObject.giveData.giveTo.type = 'user';
        super(props)
        const {
            companyDetails,
            companiesAccountsData,
            currentUser: {
                displayName,
                email,
                firstName,
                lastName,
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
            flowObject: _merge({}, props.flowObject),
            benificiaryIndex: 0,
            buttonClicked: false,
            dropDownOptions: {
                donationMatchList: populateDonationMatch(donationMatchData, formatMessage),
                giftTypeList: populateGiftType(formatMessage),
                // giveFromList: populateAccountOptions({
                //     companiesAccountsData,
                //     firstName,
                //     fund,
                //     id,
                //     lastName,
                //     userCampaigns,
                //     userGroups,
                // }),
                // giveToList: populateGiveToGroupsofUser(giveGroupBenificairyDetails),
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
                paymentInstrumentList: populatePaymentInstrument(paymentInstruments),
            },
            findAnotherRecipientLabel: 'Find another recipient',
            inValidCardNameValue: true,
            inValidCardNumber: true,
            inValidCvv: true,
            inValidExpirationDate: true,
            inValidNameOnCard: true,
            showAnotherRecipient: false,
            validity: this.intializeValidations(),
        };
        console.log(paymentInstruments)
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputOnBlur = this.handleInputOnBlur.bind(this)
        this.getStripeCreditCard = this.getStripeCreditCard.bind(this);

    }

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
            validity,
        } = this.state;
        const {
            flowObject: {
                type,
            },
        } = this.state;
        const {
            coverFeesData,
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
                    validity = validateGiveForm(
                        name, giveData[name], validity, giveData, 0,
                    );
                    if (giveData.giveFrom.type === 'companies') {
                        getCompanyPaymentAndTax(Number(giveData.giveFrom.id));
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

    handleSubmit = () => {
    const {dispatch, stepIndex, flowSteps} = this.props
    dispatch(proceed(this.state.flowObject, flowSteps[stepIndex+1]))
    }

    componentDidMount() {
        const {
        slug,
        dispatch
        } = this.props;
        if(slug !== null) {
        getGroupsFromSlug(dispatch, slug);
        }
        dispatch(getDonationMatchAndPaymentInstruments());

    }

    componentDidUpdate(prevProps) {
        console.log('props');
        console.log(this.props);
        if(!_isEqual(this.props, prevProps)) {
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
                    displayName,
                    email,
                },
                donationMatchData,
                firstName,
                fund,
                id,
                lastName,
                paymentInstrumentsData,
                userCampaigns,
                userGroups,
                giveCharityDetails,
                giveGroupBenificairyDetails,
                slug,
                taxReceiptProfiles,
                giveGroupDetails,
            } = this.props;
            let paymentInstruments = null;
            let companyPaymentInstrumentChanged = false;
            const formatMessage = this.props.t;
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
            const donationMatchOptions = populateDonationMatch(donationMatchData, formatMessage);
            const giveToOptions = populateGiveToGroupsofUser(giveGroupBenificairyDetails);
            console.log(giveGroupDetails)
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
            // else if (!_isEmpty(giveUserGroups)) {
            //     groupFromUrl = true;
            //     giveData.giveTo = {
            //         id: giveUserGroups.userGroups[groupIndex].id,
            //         isCampaign: giveUserGroups.userGroups[groupIndex].attributes.isCampaign,
            //         name: giveUserGroups.userGroups[groupIndex].attributes.name,
            //         recurringEnabled: giveUserGroups.userGroups[groupIndex]
            //             .attributes.recurringEnabled,
            //         text: giveUserGroups.userGroups[groupIndex].attributes.name,
            //         type: giveUserGroups.userGroups[groupIndex].type,
            //         value: giveUserGroups.userGroups[groupIndex].attributes.fundId,
            //     };
            // }
            console.log('fund', fund);
            
            const paymentInstrumentOptions = populatePaymentInstrument(
                paymentInstruments, formatMessage,
            );
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
                    giveData:{
                        ...this.state.flowObject.giveData,
                        ...giveData,
                    }
                }
            });        }        
    }

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

    static populateShareAddress(taxReceiptProfile) {
        return !_isEmpty(taxReceiptProfile) ? getDropDownOptionFromApiData(taxReceiptProfile, null, (item) => `name_address_email|${item.id}`,
            (attributes) => `${attributes.fullName}, ${attributes.addressOne}, ${attributes.city}, ${attributes.province}, ${attributes.postalCode}`,
            (attributes) => false) : null;
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

    validateForm() {
        const {
            allocation: {
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
        if (giveData.giveTo.value === giveData.giveFrom.value) {
            validity.isValidGiveTo = false;
        } else {
            validity.isValidGiveTo = true;
        }
        this.setState({ validity });
        let validateCC = true;
        if (giveData.creditCard.value === 0) {
            this.StripeCreditCard.handleOnLoad(
                inValidCardNumber, inValidExpirationDate, inValidNameOnCard,
                inValidCvv, inValidCardNameValue,
            );
            validateCC = (!inValidCardNumber && !inValidExpirationDate &&
                !inValidNameOnCard && !inValidCvv && !inValidCardNameValue);
        }
        return _every(validity) && validateCC;
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

    getStripeCreditCard(data, cardHolderName) {
        this.setState({
            allocation: {
                ...this.state.allocation,
                cardHolderName,
                stripeCreditCard: data,
            },
        });
    }

    render() {
        let {
            flowObject: {
                giveData:{
                    creditCard,
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
            },
            validity,
            dropDownOptions:{
                giftTypeList,
                paymentInstrumentList,
                donationMatchList,
                infoToShareList
            },
        } = this.state;
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
            // if (_isEmpty(paymentInstrumentList) || creditCard.value === 0) {
            //     stripeCardComponent = (
            //         <Form.Field>
            //             <StripeProvider apiKey={stripeKey}>
            //                 <Elements>
            //                     <StripeCreditCard
            //                         creditCardElement={this.getStripeCreditCard}
            //                         creditCardValidate={inValidCardNumber}
            //                         creditCardExpiryValidate={inValidExpirationDate}
            //                         creditCardNameValidte={inValidNameOnCard}
            //                         creditCardNameValueValidate={inValidCardNameValue}
            //                         creditCardCvvValidate={inValidCvv}
            //                         // eslint-disable-next-line no-return-assign
            //                         onRef={(ref) => (this.StripeCreditCard = ref)}
            //                         validateCCNo={this.validateStripeCreditCardNo}
            //                         validateExpiraton={this.validateStripeExpirationDate}
            //                         validateCvv={this.validateCreditCardCvv}
            //                         validateCardName={this.validateCreditCardName}
            //                     />
            //                 </Elements>
            //             </StripeProvider>
            //         </Form.Field>
            //     );
            // }
        }

        if (true){// giveFrom.value > 0) {
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
            if (true// (giveFrom.type === 'user' || giveFrom.type === 'companies') &&
                // !!giveTo.recurringEnabled
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
                            true && (// !groupFromUrl && (
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
                            )
                        }
                        {
                        false && ( // !!groupFromUrl && (
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
                                            options='' // {giveToList}
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
                                minAmount: 1,
                            })}
                        />
                        <FormValidationErrorMessage
                            condition={!validity.isAmountLessThanOneBillion}
                            errorMessage={formatMessage('invalidMaxAmountError')}
                        />
                        <FormValidationErrorMessage
                            condition={!validity.isAmountCoverGive}
                            errorMessage={formatMessage('giveAmountGreaterThanBalance')}
                        />
                        {true && (// (!this.props.currentUser.userAccountsFetched || !_isEmpty(giveFromList)) && (
                        <DropDownAccountOptions
                            type="group"
                            validity={validity.isValidAddingToSource}
                            selectedValue={this.state.flowObject.giveData.giveFrom.value}
                            name="giveFrom"
                            parentInputChange={this.handleInputChange}
                            parentOnBlurChange={this.handleInputOnBlur}
                        />
                        )}
                        {repeatGift}
                        {accountTopUpComponent}
                        {/* {stripeCardComponent} */}
                        <Form.Field>
                            <Divider className="dividerMargin" />
                        </Form.Field>
                        <NoteTo
                            allocationType=""// {type}
                            formatMessage={formatMessage}
                            giveFrom='' // {giveFrom}
                            giveToType='' // {giveToType}
                            noteToCharity= {noteToCharity}
                            handleInputChange={this.handleInputChange}
                            handleInputOnBlur={this.handleInputOnBlur}
                            noteToSelf={noteToSelf}
                            validity={validity}
                        />
                        {privacyOptionComponent}
                        <Divider hidden />
                        { true && // !stepsCompleted &&
                            <Form.Button
                                className='btnPadding' // {isMobile ? 'mobBtnPadding' : 'btnPadding'}
                                // content={(!this.state.buttonClicked) ?
                                //     formatMessage('continueButton')
                                //     : formatMessage('submitingButton')}
                                content='Continue'
                                // disabled={(this.state.buttonClicked) ||
                                //     !this.props.currentUser.userAccountsFetched}
                                // fluid={isMobile}
                                type="submit"
                            />
                        }
                    </Fragment>
                </Form>
        )
    }
}

const defProps = {
    currentUser: {
        displayName: "Demo",
        email:"chimp.net",
    },
    giveData: {
        giveFrom: {
            type: 'user',
        },
    },
    groupId: null,
    id: '888000',
    slug: null,
};


Group.defaultProps = Object.assign({}, groupDefaultProps, defProps);

const  mapStateToProps = (state, props) => {


  // if(props.flowObject && props.flowObject.giveData.giveTo.type === 'user') {
  //   return {
  //     taxReceiptProfiles: state.user.taxReceiptProfiles,
  //     taxReceiptGetApiStatus:state.user.taxReceiptGetApiStatus
  //   }
  // }
  // return {
  //   taxReceiptProfiles: state.give.companyData.taxReceiptProfiles,
  //   taxReceiptGetApiStatus:state.give.companyData.taxReceiptGetApiStatus
  // }
  return {
    giveGroupDetails: state.give.groupSlugDetails,
    companiesAccountsData: state.user.companiesAccountsData,
    companyDetails: state.give.companyData,
    giveGroupBenificairyDetails: state.give.benificiaryForGroupDetails,
    taxReceiptProfiles: state.user.taxReceiptProfiles,
    userAccountsFetched: state.user.userAccountsFetched,
    userCampaigns: state.user.userCampaigns,
    userGroups: state.user.userGroups,
  }
}

export default withTranslation(['group','noteTo','accountTopUp','privacyOptions'])(connect(mapStateToProps)(Group))

