import React, {
    Fragment,
} from 'react';
import {
    connect,
} from 'react-redux';
import {
    Form,
    Header,
    Icon,
    Input,
    Placeholder,
    Popup,
    Container,
    Grid,
    Radio,
} from 'semantic-ui-react';
import dynamic from 'next/dynamic';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import _merge from 'lodash/merge';
import _replace from 'lodash/replace';
import _cloneDeep from 'lodash/cloneDeep';
import _findIndex from 'lodash/findIndex';
import _find from 'lodash/find';
import _trim from 'lodash/trim';
import _split from 'lodash/split';
import _remove from 'lodash/remove';
import _every from 'lodash/every';

import {
    formatCurrency,
    formatAmount,
    validateGiveForm,
    populateDonationMatch,
    populatePaymentInstrument,
    populateTaxReceipts,
    resetDataForAccountChange,
    getSelectedFriendList,
    validateForReload,
    calculateP2pTotalGiveAmount,
    findingErrorElement,
    populateFrequenyOptions,
} from '../../../helpers/give/utils';
import { getDonationMatchAndPaymentInstruments } from '../../../actions/user';
import { getEmailList } from '../../../actions/userProfile';
import {
    getCompanyPaymentAndTax,
    proceed,
} from '../../../actions/give';
import { withTranslation } from '../../../i18n';
import { parseEmails } from '../../../helpers/give/giving-form-validation';
import FormValidationErrorMessage from '../../shared/FormValidationErrorMessage';
import DropDownAccountOptions from '../../shared/DropDownAccountOptions';
import Note from '../../shared/Note';
import { p2pDefaultProps } from '../../../helpers/give/defaultProps';
import '../../shared/style/styles.less';
import FlowBreadcrumbs from '../FlowBreadcrumbs';
import DonationAmountField from '../DonationAmountField';
import FriendsDropDown from '../../shared/FriendsDropDown';
import { dateFormatConverter } from '../../../helpers/utils';

const ReloadAddAmount = dynamic(() => import('../ReloadAddAmount'), { ssr: false });
const ChimpDatePicker = dynamic(() => import('./p2pDatePicker.js'), { ssr: false });
const P2pReasons = dynamic(() => import('./p2pReasons.js'), { ssr: false });
const P2pFrequency = dynamic(() => import('./p2pFrequency.js'), { ssr: false });

const actionTypes = {
    SHOW_FRIENDS_DROPDOWN: 'SHOW_FRIENDS_DROPDOWN',
};

class Friend extends React.Component {
    constructor(props) {
        super(props);
        const {
            campaignId,
            companyDetails,
            companiesAccountsData,
            donationMatchData,
            paymentInstrumentsData,
            defaultTaxReceiptProfile,
            fund,
            groupId,
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
            t: formatMessage,
            i18n: {
                language,
            },
            userFriendEmail,
            dispatch,
        } = props;
        // const paymentInstruments = Friend.constructPaymentInstruments(
        //     props,
        //     companyDetails,
        //     paymentInstrumentsData,
        // );
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
                //paymentInstrumentList: populatePaymentInstrument(paymentInstruments, formatMessage),
            },
            flowObject: _cloneDeep(payload),
            userEmail: email,
            validity: this.initializeValidations(),
            showGiveToEmail: false,
            reloadModalOpen: 0,
            reviewBtnFlag: false,
        };
        if (!_isEmpty(groupId) && Number(groupId) > 0) {
            this.state.flowObject.groupId = groupId;
            this.state.giveFromType = 'groups';
        } else if (!_isEmpty(campaignId) && Number(campaignId) > 0) {
            this.state.flowObject.campaignId = campaignId;
            this.state.giveFromType = 'campaigns'
        }
        dispatch({
            payload: {
                showFriendDropDown: true,
            },
            type: actionTypes.SHOW_FRIENDS_DROPDOWN,
        });

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleOnInputBlur = this.handleOnInputBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);

        this.handleGiveToEmail = this.handleGiveToEmail.bind(this);
        this.renderReloadAddAmount = this.renderReloadAddAmount.bind(this);
        this.handleAddMoneyModal = this.handleAddMoneyModal.bind(this);
    }

    // static constructPaymentInstruments(props, companyDetails, paymentInstrumentsData) {
    //     return (
    //         (!_.isEmpty(props.flowObject.giveData.giveFrom) &&
    //             props.flowObject.giveData.giveFrom.type === 'companies') ?
    //             companyDetails.companyPaymentInstrumentsData
    //             : paymentInstrumentsData
    //     );
    // }

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
            currentAccount,
            currentUser: {
                id,
            },
            userFriendEmail,
            dispatch,
        } = this.props;
        if (!_isEmpty(userFriendEmail)) {
            this.setState({
                flowObject: {
                    ...this.state.flowObject,
                    giveData: {
                        ...this.state.flowObject.giveData,
                        emailMasked: true,
                        friendsList: [],
                        recipients: [userFriendEmail.email],
                        recipientName: userFriendEmail.name,
                        recipientImage: userFriendEmail.image,
                        selectedFriendsList: [],
                    }
                },
            })
            dispatch({
                payload: {
                },
                type: 'USER_FRIEND_EMAIL',
            });
        }
        if (_isEmpty(this.state.giveFromType) && currentAccount.accountType === 'company') {
            getCompanyPaymentAndTax(dispatch, Number(currentAccount.id));
        }
        getEmailList(dispatch, id);
        dispatch(getDonationMatchAndPaymentInstruments(id));
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
    componentDidUpdate(prevProps) {
        if (!_isEqual(this.props, prevProps)) {
            const {
                dropDownOptions,
            } = this.state;
            let {
                flowObject: {
                    campaignId,
                    currency,
                    giveData,
                    groupId,
                },
                giveFromType,
                reviewBtnFlag,
                reloadModalOpen,
            } = this.state;

            const {
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
            //let paymentInstruments = paymentInstrumentsData;
            let companyPaymentInstrumentChanged = false;
            if (giveData.giveFrom.type === 'companies' && !_isEmpty(companyDetails)) {
                const companyIndex = _findIndex(companiesAccountsData, { 'id': giveData.giveFrom.id });
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
            // const paymentInstrumentOptions = populatePaymentInstrument(
            //     paymentInstruments, formatMessage,
            // );
            if (reviewBtnFlag && (giveData.giveFrom.balance >= giveData.giveAmount)) {
                reviewBtnFlag = false;
                reloadModalOpen = 0;
            }
            const donationMatchOptions = populateDonationMatch(donationMatchData, formatMessage);
            if (!_isEmpty(fund)) {
                const giveFromId = (giveFromType === 'campaigns') ? campaignId : groupId;
                giveData = Friend.initFields(
                    giveData, fund, id, avatar,
                    `${firstName} ${lastName}`, companiesAccountsData, userGroups, userCampaigns, giveFromId, giveFromType, language, currency, currentAccount
                );
            }
            this.setState({
                dropDownOptions: {
                    ...dropDownOptions,
                    donationMatchList: donationMatchOptions,
                    //paymentInstrumentList: paymentInstrumentOptions,
                },
                flowObject: {
                    ...this.state.flowObject,
                    giveData,
                },
                reloadModalOpen,
                reviewBtnFlag,
            });
        }
    }

    static initFields(giveData, fund, id, avatar,
        name, companiesAccountsData, userGroups, userCampaigns, giveFromId, giveFromType, language, currency, currentAccount) {
        if (_isEmpty(companiesAccountsData) && _isEmpty(userGroups) && _isEmpty(userCampaigns) && !giveData.userInteracted) {
            giveData.giveFrom.avatar = avatar;
            giveData.giveFrom.id = id;
            giveData.giveFrom.value = fund.id;
            giveData.giveFrom.type = 'user';
            giveData.giveFrom.text = `${fund.attributes.name} (${fund.attributes.balance})`;
            giveData.giveFrom.balance = fund.attributes.balance;
            giveData.giveFrom.name = name;
        } else if ((!_isEmpty(companiesAccountsData) || !_isEmpty(userGroups) || !_isEmpty(userCampaigns)) && (!giveData.userInteracted || _isEmpty(giveData.giveFrom.id))) {
            if (giveFromType) {
                const defaultGroupFrom = (giveFromType === 'campaigns')
                    ? userCampaigns.find((userCampaign) => userCampaign.id === giveFromId)
                    : userGroups.find((userGroup) => userGroup.id === giveFromId);
                if (!_isEmpty(defaultGroupFrom)) {
                    giveData.giveFrom.value = defaultGroupFrom.attributes.fundId;
                    giveData.giveFrom.name = defaultGroupFrom.attributes.name;
                    giveData.giveFrom.avatar = defaultGroupFrom.attributes.avatar;
                    giveData.giveFrom.id = defaultGroupFrom.id;
                    giveData.giveFrom.type = defaultGroupFrom.type;
                    giveData.giveFrom.text = `${defaultGroupFrom.attributes.fundName}: ${formatCurrency(defaultGroupFrom.attributes.balance, language, currency)}`,
                        giveData.giveFrom.balance = defaultGroupFrom.attributes.balance;
                    giveData.giveFrom.slug = defaultGroupFrom.attributes.slug;
                }
            }
            if (currentAccount.accountType === 'company' && _isEmpty(giveFromType)) {
                companiesAccountsData.find(company => {
                    if (currentAccount.id == company.id) {
                        const {
                            attributes: {
                                avatar,
                                balance,
                                name,
                                companyFundId,
                                companyFundName,
                                slug
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
                        return true;
                    }
                })
            }
            if (currentAccount.accountType === 'personal' && _isEmpty(giveFromType)) {
                giveData.giveFrom.avatar = avatar;
                giveData.giveFrom.id = id;
                giveData.giveFrom.value = fund.id;
                giveData.giveFrom.type = 'user';
                giveData.giveFrom.text = `${fund.attributes.name} (${fund.attributes.balance})`;
                giveData.giveFrom.balance = fund.attributes.balance;
                giveData.giveFrom.name = name;
            }
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
            isNoteToCharityInLimit: true,
            isNoteToSelfInLimit: true,
            isNumberOfEmailsLessThanMax: true,
            isRecipientHaveSenderEmail: true,
            isRecipientListUnique: true,
            isValidDecimalAmount: true,
            isValidEmailList: true,
            isValidGiveAmount: true,
            isValidGiveFrom: true,
            isValidNoteSelfText: true,
            isValidNoteToCharityText: true,
            isValidNoteToRecipients: true,
            isValidNoteToSelf: true,
            isValidPositiveNumber: true,
            isReloadRequired: true,
            isRecepientSelected: true,
            isValidDate: true
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
            emailDetailList,
        } = this.props;
        const {
            name,
            value,
        } = !_isEmpty(data) ? data : event.target;
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
        let userEmailList = [];
        if (!_isEmpty(emailDetailList)) {
            emailDetailList.map((data) => {
                userEmailList.push(data.attributes.email);
            });
        }
        const isNumber = /^(?:[0-9]+,)*[0-9]+(?:\.[0-9]*)?$/;
        if ((name === 'giveAmount') && !_isEmpty(value) && value.match(isNumber)) {
            inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
            giveData[name] = inputValue;
            giveData['formatedP2PAmount'] = _replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
        }
        const coverFeesAmount = 0;
        if (name !== 'coverFees' && name !== 'giftType' && name !== 'friendsList' && name !== 'giveFrom' && name !== 'recipients') {
            validity = validateGiveForm(name, inputValue, validity, giveData, coverFeesAmount);
        }
        switch (name) {
            case 'giveFrom':
                if (giveData.giveFrom.type === 'companies' || giveData.giveFrom.type === 'campaigns') {
                    giveData['noteToSelf'] = '';
                }
                validity = validateGiveForm(
                    'giveAmount',
                    giveData.giveAmount,
                    validity,
                    giveData,
                    coverFeesAmount,
                );
                break;
            case 'recipients':
                validity = validateGiveForm(
                    'recipients',
                    giveData.recipients,
                    validity,
                    giveData,
                    coverFeesAmount,
                    userEmailList,
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
        return _trim(recipients).length > 0
            ? _split(recipients, ',')
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
            reloadModalOpen,
            reviewBtnFlag,
        } = this.state;
        const {
            userEmail,
        } = this.state;
        const {
            dispatch,
        } = this.props;
        const coverFeesAmount = 0;
        const newValue = (name !== 'friendsList' && !_isEmpty(options)) ? _find(options, { value }) : value;
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
                    reviewBtnFlag = false;
                    dropDownOptions = modifiedDropDownOptions;
                    if (giveData.giveFrom.type === 'companies' || giveData.giveFrom.type === 'campaigns') {
                        giveData['noteToSelf'] = '';
                    }
                    if (giveData.giveFrom.type === 'companies') {
                        getCompanyPaymentAndTax(dispatch, Number(giveData.giveFrom.id));
                    }
                    break;
                case 'giveAmount':
                    reviewBtnFlag = false;
                    reloadModalOpen = 0;
                    giveData['formatedP2PAmount'] = newValue;
                    giveData['totalP2pGiveAmount'] = calculateP2pTotalGiveAmount((giveData.friendsList.length + _.compact(giveData.recipients).length), giveData.giveAmount);
                    debugger
                    break;
                case 'recipients':
                    reviewBtnFlag = false;
                    reloadModalOpen = 0;
                    giveData[name] = Friend.parseRecipients(newValue);
                    giveData['totalP2pGiveAmount'] = calculateP2pTotalGiveAmount((giveData.friendsList.length + _.compact(giveData.recipients).length), giveData.giveAmount);
                    break;
                case 'friendsList':
                    reviewBtnFlag = false;
                    reloadModalOpen = 0;
                    giveData['totalP2pGiveAmount'] = calculateP2pTotalGiveAmount((giveData.friendsList.length + _.compact(giveData.recipients).length), giveData.giveAmount);
                    validity = validateGiveForm(
                        'recipients',
                        giveData.recipients,
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
                dropDownOptions,
                validity,
                reviewBtnFlag,
            });
        }
    }

    handleSubmit() {
        const {
            flowObject,
        } = this.state;
        const {
            dispatch,
            flowSteps,
            stepIndex,
            friendsListData,
        } = this.props;
        const {
            giveData: {
                friendsList,
            },
        } = flowObject;
        if (this.validateForm()) {
            flowObject.giveData.selectedFriendsList = (!_isEmpty(friendsList))
                ? getSelectedFriendList(friendsListData, friendsList)
                : [];
            flowObject.giveData.selectedFriendsList.map((friendData) => {
                _remove(flowObject.giveData.recipients, (recepientData) => {
                    return recepientData == friendData.email;
                });
            })

            flowObject.giveData.totalP2pGiveAmount = calculateP2pTotalGiveAmount(
                (flowObject.giveData.selectedFriendsList.length + _.compact(flowObject.giveData.recipients).length),
                flowObject.giveData.giveAmount);
            // Emails need to be prepared for API call
            flowObject.giveData.recipients = parseEmails(
                flowObject.giveData.recipients,
            );
            flowObject.stepsCompleted = false;
            dispatch(proceed(flowObject, flowSteps[stepIndex + 1], stepIndex));
        }
    }

    validateForm() {
        const {
            emailDetailList,
        } = this.props;
        const {
            flowObject: {
                giveData,
            },
            userEmail,
        } = this.state;
        let {
            validity,
        } = this.state;
        const coverFeesAmount = 0;
        let userEmailList = [];
        if (!_isEmpty(emailDetailList)) {
            emailDetailList.map((data) => {
                userEmailList.push(data.attributes.email);
            });
        }
        let allocationGiftType = giveData.giftType.value;
        if(giveData.sendGift !== 'now' && giveData.sendDate && giveData.sendDate.getTime()){
            let today = new Date()
            today.setHours(0, 0, 0, 0);
            if(today.getTime() !== giveData.sendDate.getTime()){
                allocationGiftType = 1;
            }
        } else if(giveData.sendGift!== 'now' && !giveData.sendDate) {
            allocationGiftType = 1;
        }
        validity = validateGiveForm('giveAmount', giveData.giveAmount, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('giveFrom', giveData.giveFrom.value, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('noteToSelf', giveData.noteToSelf, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('noteToRecipients', giveData.noteToRecipients, validity, giveData, coverFeesAmount);
        validity = validateGiveForm('recipients', giveData.recipients, validity, giveData, coverFeesAmount, userEmailList);
        if(allocationGiftType  === 0){
            validity = validateForReload(validity, giveData.giveFrom.type, giveData.totalP2pGiveAmount, giveData.giveFrom.balance);
        }
        if(giveData.sendGift !== 'now'){
            // Change for safari.
            const convertIncomingDate = new Date(giveData.sendDate) && dateFormatConverter(new Date(giveData.sendDate), '/');
            const currentDate = dateFormatConverter(new Date(), '/');
            const checkCurrentDate = new Date(convertIncomingDate) >= new Date(currentDate);
            validity.isValidDate= checkCurrentDate;
        }
        this.setState({
            validity,
            reviewBtnFlag: !validity.isReloadRequired,
        });
        const validationsResponse = _every(validity);
        if (!validationsResponse) {
            const errorNode = findingErrorElement(validity, 'allocation');
            !_isEmpty(errorNode) && document.querySelector(`${errorNode}`).scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return validationsResponse;
    }

    handleGiveToEmail() {
        this.setState({
            showGiveToEmail: true,
        });
    }

    handlePresetAmountClick = (event, data) => {
        const {
            value,
        } = data;
        let {
            validity,
            flowObject: {
                giveData,
            },
            reviewBtnFlag,
        } = this.state;
        const inputValue = formatAmount(parseFloat(value.replace(/,/g, '')));
        const formatedP2PAmount = _replace(formatCurrency(inputValue, 'en', 'USD'), '$', '');
        giveData.giveAmount = inputValue;
        giveData.totalP2pGiveAmount = calculateP2pTotalGiveAmount((giveData.friendsList.length + _compact(giveData.recipients).length), inputValue);
        validity = validateGiveForm("giveAmount", inputValue, validity, giveData);
        reviewBtnFlag = false;
        this.setState({
            ...this.state,
            flowObject: {
                ...this.state.flowObject,
                giveData: {
                    ...giveData,
                    formatedP2PAmount,
                }
            },
            validity,
            reviewBtnFlag,
        });
    }
    handleDateChange = (date) => {
        try {
            const convertIncomingDate = new Date(date) && dateFormatConverter(new Date(date), '/');
            const currentDate = dateFormatConverter(new Date(), '/');
            const checkCurrentDate = new Date(convertIncomingDate) >= new Date(currentDate);
            if (checkCurrentDate) {
                const frequencyOptions = populateFrequenyOptions(new Date(date), this.props.t);
                this.setState({
                    flowObject: {
                        ...this.state.flowObject,
                        giveData: {
                            ...this.state.flowObject.giveData,
                            frequencyObject: {
                                ...this.state.flowObject.giveData.frequencyObject,
                                options: frequencyOptions,
                            },
                            sendDate: new Date(date),
                        },
                    },
                    validity: {
                        ...this.state.validity,
                        isValidDate: true,
                    }
                })
            } else {
                this.setState({
                    validity: {
                        ...this.state.validity,
                        isValidDate: false,
                    }
                })
            }
        }
        catch (err) {
            // handle error
        }
    }

    handleSendMoneyInputChange = (event, data) => {
        const {
            name,
            value,
        } = data || event.target;
        const {
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
            fund,
        } = this.props;
        let {
            flowObject: {
                giveData: {
                    frequencyObject,
                    reason,
                    reasonOther,
                    sendDate,
                    sendGift,
                    giveFrom,
                },
            },
            validity,
        } = this.state;
        let defaultGiveFrom = {};
        if (!_isEmpty(fund)) {
            defaultGiveFrom = {
                avatar,
                id,
                value: fund.id,
                type: 'user',
                text: `${fund.attributes.name} (${fund.attributes.balance})`,
                balance: fund.attributes.balance,
                name: `${firstName} ${lastName}`,
            }
        }
        if (name === 'sendGift') {
            sendGift = value;
            if (sendGift === 'now') {
                frequencyObject = {};
                sendDate = null;
                validity.isValidDate = true;
            } else {
                // sendDate = new Date();
                sendDate = null
                frequencyObject = {
                    options: populateFrequenyOptions(sendDate, this.props.t),
                    value: 'once'
                }
            }
            if (giveFrom.type !== 'companies') {
                giveFrom = defaultGiveFrom;
            }
        } else if (name === 'frequency') {
            frequencyObject = {
                ...this.state.flowObject.giveData.frequencyObject,
                value,
            }
        } else if (name === 'reason' || name === 'reasonOther') {
            reason = name === 'reason' ? value : 'Other';
            reasonOther = name === 'reason' ? null : value;
        }
        this.setState({
            flowObject: {
                ...this.state.flowObject,
                giveData: {
                    ...this.state.flowObject.giveData,
                    frequencyObject,
                    reason,
                    reasonOther,
                    sendDate,
                    sendGift,
                    giveFrom,
                },
            },
            validity,
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
            flowObject: {
                giveData,
            },
            reloadModalOpen,
            reviewBtnFlag,
        } = this.state;
        let {
            giveFrom,
            totalP2pGiveAmount,
            giftType,
        } = giveData
        const formatMessage = this.props.t;
        if ((giveFrom.type === 'user' || giveFrom.type === 'companies') && (Number(totalP2pGiveAmount) > Number(giveFrom.balance))) {
            if ((userAccountsFetched && giveFrom.type === 'user') || (companyAccountsFetched && giveFrom.type === 'companies')) {
                let taxReceiptList = taxReceiptProfiles;
                let defaultTaxReceiptProfileForReload = defaultTaxReceiptProfile;
                let paymentInstruments = paymentInstrumentsData;
                if (giveFrom.type === 'companies' && companyDetails) {
                    taxReceiptList = !_isEmpty(companyDetails.taxReceiptProfiles) ? companyDetails.taxReceiptProfiles : [];
                    defaultTaxReceiptProfileForReload = companyDetails.companyDefaultTaxReceiptProfile;
                    paymentInstruments = companyDetails.companyPaymentInstrumentsData;
                }
                const paymentInstrumentOptions = populatePaymentInstrument(
                    paymentInstruments, formatMessage,
                );
                let amountToDonate = formatAmount((formatAmount(totalP2pGiveAmount)
                    - formatAmount(giveFrom.balance)));
                if (Number(amountToDonate) < 5) {
                    amountToDonate = formatAmount(5);
                }
                const taxReceiptsOptions = populateTaxReceipts(taxReceiptList, formatMessage);
                let allocationGiftType = giftType.value;
                if(giveData.sendGift !== 'now' && giveData.sendDate && giveData.sendDate.getTime()){
                    let today = new Date()
                    today.setHours(0, 0, 0, 0);
                    if(today.getTime() !== giveData.sendDate.getTime()){
                        allocationGiftType = 1;
                    }
                } else if(giveData.sendGift!== 'now' && !giveData.sendDate) {
                    allocationGiftType = 1;
                }
                return (
                    <ReloadAddAmount
                        defaultTaxReceiptProfile={defaultTaxReceiptProfileForReload}
                        dispatch={dispatch}
                        donationMatchData={(giveFrom.type === 'user') ? donationMatchData : {}}
                        formatedDonationAmount={(amountToDonate > 9999) ? formatAmount(9999) : amountToDonate}
                        formatMessage={formatMessage}
                        allocationGiftType={allocationGiftType}
                        giveTo={giveFrom}
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
            currentStep,
            flowSteps,
            i18n: {
                language,
            },
            t: formatMessage,
            showDropDown,
        } = this.props;
        const {
            flowObject: {
                currency,
                giveData: {
                    emailMasked,
                    formatedP2PAmount,
                    friendsList,
                    frequencyObject,
                    giftType,
                    giveAmount,
                    giveFrom,
                    noteToRecipients,
                    noteToSelf,
                    reason,
                    reasonOther,
                    recipients,
                    recipientName,
                    sendGift,
                    sendDate,
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
            reviewBtnFlag,
        } = this.state;
        const recipientsList = recipients.join(',');
        let submtBtn = (reviewBtnFlag) ? (
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
        const giveFromType = (!_isEmpty(giveFrom.type)) ? giveFrom.type : 'user';
        return (
            <Fragment>
                <div className="flowReviewbanner">
                    <Container>
                        <div className="flowReviewbannerText">
                            <Header as='h2'>{formatMessage('friends:giveToFriendText')}</Header>
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
                                            flowType={type}
                                        />
                                    </div>
                                    <div className="flowFirst">
                                        <Form onSubmit={this.handleSubmit}>
                                            <Grid>
                                                <Grid.Row>
                                                    {
                                                        (emailMasked) &&
                                                        <Grid.Column className="friends-error" mobile={16} tablet={12} computer={10}>
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
                                                        </Grid.Column>
                                                    }
                                                    {
                                                        (!emailMasked) &&
                                                        <Fragment>
                                                            <Grid.Column className="friends-error" mobile={16} tablet={12} computer={10}>
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
                                                                {showDropDown
                                                                    && (
                                                                        <FriendsDropDown
                                                                            handleOnInputBlur={this.handleOnInputBlur}
                                                                            handleOnInputChange={this.handleInputChange}
                                                                            values={friendsList}
                                                                        />
                                                                    )
                                                                }
                                                                {!showDropDown
                                                                    && (
                                                                        <div className="disabled-giveto">
                                                                            <Form.Field>
                                                                                <Form.Field
                                                                                    control={Input}
                                                                                    disabled
                                                                                    id="recipientName"
                                                                                    maxLength="20"
                                                                                    name="recipientName"
                                                                                    size="large"
                                                                                    placeholder="You're not connected to friends on Charitable Impact yet"
                                                                                />
                                                                            </Form.Field>
                                                                            <span class="givetoInfoText">You can find friends to give to on Charitable Impact under your profile.</span>
                                                                        </div>
                                                                    )
                                                                }
                                                            </Grid.Column>
                                                            <Grid.Column mobile={16} tablet={16} computer={16}>
                                                                {showDropDown
                                                                    && (
                                                                        <p>
                                                                            <a className="giveToEmailsText" onClick={this.handleGiveToEmail}>
                                                                                {formatMessage('friends:giveToEmailsText')}
                                                                            </a>
                                                                        </p>
                                                                    )
                                                                }
                                                                {(showGiveToEmail || !_isEmpty(recipients) || (typeof showDropDown !== 'undefined' && !showDropDown))
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
                                                                <FormValidationErrorMessage
                                                                    condition={showDropDown && !validity.isRecepientSelected}
                                                                    errorMessage={formatMessage('friends:userWithFriendsError')}
                                                                />
                                                                <FormValidationErrorMessage
                                                                    condition={!showDropDown && !validity.isRecepientSelected}
                                                                    errorMessage={formatMessage('friends:userWithoutFriendsError')}
                                                                />
                                                            </Grid.Column>
                                                        </Fragment>
                                                    }
                                                    <Grid.Column mobile={16} tablet={12} computer={10}>
                                                        <div className="give_flow_field">
                                                            <DonationAmountField
                                                                amount={formatedP2PAmount}
                                                                formatMessage={formatMessage}
                                                                handleInputChange={this.handleInputChange}
                                                                handleInputOnBlur={this.handleOnInputBlur}
                                                                handlePresetAmountClick={this.handlePresetAmountClick}
                                                                validity={validity}
                                                                isGiveFlow
                                                            />
                                                        </div>
                                                        <p className="multipleFriendAmountFieldText">
                                                            {formatMessage('friends:multipleFriendAmountFieldText')}
                                                        </p>

                                                        <div className="p2pCalenderWrapper">
                                                            <div className="p2p_gift">
                                                                <label className="label_gift">When would you like to send this gift?</label>

                                                                <Form.Field className="radio_btn">
                                                                    <Radio
                                                                        label='Send now'
                                                                        name='sendGift'
                                                                        className='checkbox chimpRadio'
                                                                        value='now'
                                                                        onChange={this.handleSendMoneyInputChange}
                                                                        checked={sendGift === 'now'}
                                                                    />
                                                                </Form.Field>
                                                                <Form.Field className="radio_btn">
                                                                    <Radio
                                                                        label='Schedule gift'
                                                                        name='sendGift'
                                                                        className='checkbox chimpRadio'
                                                                        value='schedule'
                                                                        onChange={this.handleSendMoneyInputChange}
                                                                        checked={sendGift === 'schedule'}
                                                                    />
                                                                </Form.Field>

                                                            </div>
                                                            {sendGift === 'schedule' &&
                                                                <>
                                                                    <div className="Send_date">
                                                                        <label className="label_gift">Send date</label>
                                                                        <ChimpDatePicker
                                                                            dateValue={sendDate}
                                                                            onChangeValue={date => this.handleDateChange(date)}
                                                                        />
                                                                    </div>
                                                                    {!validity.isValidDate && <FormValidationErrorMessage
                                                                        condition={!validity.isValidDate}
                                                                        errorMessage={'Select a date to send your gift.'}
                                                                    />
                                                                    }
                                                                    <div>
                                                                        <P2pFrequency
                                                                            frequencyObject={frequencyObject}
                                                                            handleSendMoneyInputChange={this.handleSendMoneyInputChange}
                                                                        />
                                                                    </div>
                                                                </>
                                                            }
                                                            <div>
                                                                <P2pReasons
                                                                    reason={reason}
                                                                    reasonOther={reasonOther}
                                                                    handleSendMoneyInputChange={this.handleSendMoneyInputChange}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="give_flow_field">
                                                            <DropDownAccountOptions
                                                                type={type}
                                                                validity={validity.isValidGiveFrom}
                                                                selectedValue={this.state.flowObject.giveData.giveFrom.value}
                                                                name="giveFrom"
                                                                parentInputChange={this.handleInputChange}
                                                                parentOnBlurChange={this.handleOnInputBlur}
                                                                formatMessage={formatMessage}
                                                                reviewBtnFlag={reviewBtnFlag}
                                                                isScheduledP2P={sendGift === 'schedule'}
                                                            />
                                                            {this.renderReloadAddAmount()}
                                                        </div>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                            <Grid className="to_space">
                                                <Grid.Row className="to_space">
                                                    <Grid.Column mobile={16} tablet={16} computer={16}>
                                                        <div className="give_flow_field">
                                                            <Note
                                                                fieldName="noteToRecipients"
                                                                formatMessage={formatMessage}
                                                                handleOnInputChange={this.handleInputChange}
                                                                handleOnInputBlur={this.handleOnInputBlur}
                                                                labelText={formatMessage('friends:noteToRecipientsLabel')}
                                                                popupText={formatMessage('friends:noteToRecipientsPopup')}
                                                                placeholderText={formatMessage('friends:noteToRecipientsPlaceholderText')}
                                                                text={noteToRecipients}
                                                                fromP2P
                                                            />
                                                        </div>
                                                        <div className="give_flow_field">
                                                            {(giveFromType === 'groups' || giveFromType === 'user') && (
                                                                <Note
                                                                    fieldName="noteToSelf"
                                                                    formatMessage={formatMessage}
                                                                    handleOnInputChange={this.handleInputChange}
                                                                    handleOnInputBlur={this.handleOnInputBlur}
                                                                    labelText={formatMessage(`friends:noteToSelfLabel${giveFromType}`)}
                                                                    popupText={formatMessage(`friends:noteToSelfPopup${giveFromType}`)}
                                                                    placeholderText={formatMessage(`friends:noteToSelfPlaceholderText${giveFromType}`)}
                                                                    text={noteToSelf}
                                                                />
                                                            )}
                                                        </div>
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

Friend.defaultProps = Object.assign({}, p2pDefaultProps);

function mapStateToProps(state) {
    return {
        companiesAccountsData: state.user.companiesAccountsData,
        companyDetails: state.give.companyData,
        companyAccountsFetched: state.give.companyAccountsFetched,
        currentAccount: state.user.currentAccount,
        currentUser: state.user.info,
        donationMatchData: state.user.donationMatchData,
        emailDetailList: state.userProfile.emailDetailList,
        fund: state.user.fund,
        paymentInstrumentsData: state.user.paymentInstrumentsData,
        userAccountsFetched: state.user.userAccountsFetched,
        userCampaigns: state.user.userCampaigns,
        userGroups: state.user.userGroups,
        creditCardApiCall: state.give.creditCardApiCall,
        userFriendEmail: state.dashboard.userFriendEmail,
        friendsListData: state.user.friendsList,
        showDropDown: state.user.showFriendDropDown,
        taxReceiptProfiles: state.user.taxReceiptProfiles,
    };
}

export default withTranslation([
    'giveCommon',
    'friends',
    'accountTopUp',
    'dropDownAccountOptions',
    'noteTo',
])(connect(mapStateToProps)(Friend));
