import _ from 'lodash';
import ReactHtmlParser from 'react-html-parser';

import {
    hasMinFiveChars,
    hasMinTwoChars,
    isAmountCoverGive,
    isEmailListContainsSenderEmail,
    isInputLengthLessThanOneThousand,
    isValidPositiveNumber,
    isAmountMoreThanOneDollor,
    isAmountLessThanOneBillion,
    isAmountMoreOrEqualToOneDollor,
    isInputBlank,
    isLessThanNChars,
    isNumberOfEmailsLessThanMax,
    isUniqueArray,
    isValidDecimalAmount,
    isValidEmailList,
    isValidNoteData,
    parseEmails,
} from '../give/giving-form-validation';
import placeholderUser from '../../static/images/no-data-avatar-user-profile.png';
import { actionTypes } from '../../actions/give';
import {
    beneficiaryDefaultProps,
    donationDefaultProps,
    groupDefaultProps,
    // p2pDefaultProps,
} from '../../helpers/give/defaultProps';
import visaIcon from '../../static/images/icons/icon-cc-visa-colour.png';
import mastercardIcon from '../../static/images/icons/icon-cc-mastercard-colour.png';
import expressCard from '../../static/images/icons/icon-cc-american-express-colour.png';

/**
 * Checks if giveData contains any credit card information
 * @param {*} giveData state object for give page
 * @return {boolean} true if no credit card data is present, false otherwise.
 */
const isCreditCardBlank = (giveData) => {
    return (_.isEmpty(giveData.creditCard) || giveData.creditCard.value === null);
};

const formatCurrency = (value, language, currencyType) => {
    const currencyFormat = {
        currency: currencyType,
        currencyDisplay: 'symbol',
        style: 'currency',
    };
    return _.replace(new Intl.NumberFormat(
        language,
        currencyFormat,
    ).format(value), 'US', '');
};

/**
* Determine whether the supplied field is valid.
* @param  {String} field The tax receipt profile form field name
* @param  {any} value    The field's value
* @param  {object} validity    validition properties of taxereceipt profile
* @return {object} validity return validate object.
*/
const validateTaxReceiptProfileForm = (field, value, validity) => {
    const inputRegEx = new RegExp(/^[^\\<>/]+$/);
    const postalCodeRegEx = new RegExp(/[^\w-]/);
    switch (field) {
        case 'fullName':
            validity.isFullNameHas2 = hasMinTwoChars(value);
            validity.isValidFullNameFormat = !_.isEmpty(value) ? (inputRegEx).test(value) : true;
            validity.isValidFullName = _.every(
                _.pick(validity, [
                    'isFullNameHas2',
                    'isValidFullNameFormat',
                ]),
            );
            break;
        case 'addressOne':
            validity.isAddressHas2 = hasMinTwoChars(value);
            validity.isAddressLessThan128 = isLessThanNChars(value, 128);
            validity.isValidAddressFormat = !_.isEmpty(value) ? (inputRegEx).test(value) : true;
            validity.isValidAddress = _.every(
                _.pick(validity, [
                    'isAddressLessThan128',
                    'isAddressHas2',
                    'isValidAddressFormat',
                ]),
            );
            break;
        case 'addressTwo':
            validity.isValidSecondAddress = !_.isEmpty(value) ? (inputRegEx).test(value) : true;
            break;
        case 'city':
            validity.isCityHas2Chars = hasMinTwoChars(value);
            validity.isCityLessThan64 = isLessThanNChars(value, 64);
            validity.isValidCityFormat = !_.isEmpty(value) ? (inputRegEx).test(value) : true;
            validity.isValidCity = _.every(
                _.pick(validity, [
                    'isCityHas2Chars',
                    'isCityLessThan64',
                    'isValidCityFormat',
                ]),
            );
            break;
        case 'province':
            validity.isValidProvince = !isInputBlank(value);
            break;
        case 'postalCode':
            const postalValue = value.trim();
            const postalValueRex = value.replace(/ /g, '');
            validity.isPostalCodehas5Chars = hasMinFiveChars(postalValue);
            validity.isPostalCodeLessThan16 = isLessThanNChars(postalValue, 16);
            validity.isValidPostalCodeFormat = !_.isEmpty(postalValueRex) ? !(postalCodeRegEx).test(postalValueRex) : true;
            validity.isValidPostalCode = _.every(
                _.pick(validity, [
                    'isPostalCodehas5Chars',
                    'isPostalCodeLessThan16',
                    'isValidPostalCodeFormat',
                ]),
            );
            break;
        default: break;
    }
    return validity;
};


/**
 * full Month Names for donation match policies.
 * @param {*} formatMessage formatmessage
 * @return {Array} fullMonthNames
 */
const fullMonthNames = (formatMessage) => {
    const fullMonths = [
        formatMessage('giveCommon:fullMonthName.januaryLabel'),
        formatMessage('giveCommon:fullMonthName.februaryLabel'),
        formatMessage('giveCommon:fullMonthName.marchLabel'),
        formatMessage('giveCommon:fullMonthName.aprilLabel'),
        formatMessage('giveCommon:fullMonthName.mayLabel'),
        formatMessage('giveCommon:fullMonthName.juneLabel'),
        formatMessage('giveCommon:fullMonthName.julyLabel'),
        formatMessage('giveCommon:fullMonthName.augustLabel'),
        formatMessage('giveCommon:fullMonthName.septemberLabel'),
        formatMessage('giveCommon:fullMonthName.octoberLabel'),
        formatMessage('giveCommon:fullMonthName.novemberLabel'),
        formatMessage('giveCommon:fullMonthName.decemberLabel'),
    ];
    return fullMonths;
};
const monthNamesForGivingTools = (monthValue) => {
    const shortMonths = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    return shortMonths[monthValue - 1];
};
const isValidGiftAmount = (validity) => {
    const giftAmountValidity = _.pick(validity, [
        'doesAmountExist',
        'isAmountLessThanOneBillion',
        'isAmountMoreThanOneDollor',
        'isValidPositiveNumber',
    ]);

    return _.every(giftAmountValidity);
};

const isValidGivingGoalAmount = (validity) => {
    const giftAmountValidity = _.pick(validity, [
        'isAmountLessThanOneBillion',
    ]);

    return _.every(giftAmountValidity);
};

const getDefaultCreditCard = (paymentInstrumentList) => {
    let creditCard = {
        value: 0,
    };
    if (!_.isEmpty(paymentInstrumentList)) {
        const [
            firstCard,
        ] = paymentInstrumentList;
        creditCard = firstCard;
    }
    return creditCard;
};

const formatAmount = (amount) => {
    return parseFloat(amount).toFixed(2);
};

/**
* onWhatDayList array list
* @param  {object}  intl formatMessage for i18n
* @return {Array} recurringDayList
*/
const onWhatDayList = (formatMessage) => {
    const recurringDayList = [
        {
            disabled: false,
            text: formatMessage('recurringMonthlyFirstLabel'),
            value: 1,
        },
        {
            disabled: false,
            text: formatMessage('recurringMonthlyFifteenLabel'),
            value: 15,
        },
    ];
    return recurringDayList;
};

const createDonationMatchString = (attributes, formatMessage, language) => {
    let policyPeriodText = `${attributes.policyPeriod}`;
    switch (attributes.policyPeriod) {
        case 'month':
            policyPeriodText = formatMessage('giveCommon:forMonth');
            break;
        case 'year':
            policyPeriodText = formatMessage('giveCommon:forYear');
            break;
        default:
            break;
    }
    return `${attributes.displayName}: ${formatCurrency(attributes.policyMax, language, 'USD')} ${formatMessage('giveCommon:forPer')} ${policyPeriodText}`;

};

/**
* Prepare dropdown options list from API dat
* @param  {object} data API data
* @param getValue function to call for getting the value
* @param textFormat function to call for getting the text
* @param isDisabled function to call for getting disabled flag
* @param {object[]} field list to be added to the option
* @return {object[]} drop down options array
*/

const getDropDownOptionFromApiData = (data, formatMessage, getValue, textFormat, isDisabled, extraField, language = 'en') => {
    const options = [];
    data.map((item) => {
        const { attributes } = item;
        const eachOption = {
            disabled: isDisabled(attributes),
            id: item.id,
            text: textFormat(attributes, formatMessage),
            type: item.type,
            value: getValue(item),
        };
        if (!_.isEmpty(extraField)) {
            extraField.map((field) => {
                eachOption[field.key] = field.getValue(attributes);
            });
        }
        options.push(eachOption);
    });
    return options;
};

/**
* Populate account drop down options
* @param  {object} data API data
* @param {string} giveToId giveTo Id
* @param {string} allocationType Type of allocation
* @param {boolean} isGiveFromGroupUrl IS it a group from url
* @return {object[]} drop down options array
*/
const populateAccountOptions = (data, translate, giveToId = null, allocationType = null, isGiveFromGroupUrl = false) => {
    const {
        companiesAccountsData,
        avatar,
        firstName,
        fund,
        id,
        lastName,
        userCampaigns,
        userGroups,
    } = data;
    const {
        formatMessage,
        language,
    } = translate;
    const currency = 'USD';
    if ((!_.isEmpty(companiesAccountsData)
        || !_.isEmpty(userCampaigns)
        || !_.isEmpty(userGroups))
    ) {
        const personalAccount = [
            {
                className: 'ddlGroup',
                disabled: true,
                text: formatMessage('personalAccountLabel'),
                value: 'user',
            },
            {
                avatar,
                balance: fund.attributes.balance,
                data: {
                    fundName: fund.attributes.name,
                    fundType: 'user',
                },
                disabled: false,
                id,
                name: `${firstName} ${lastName}`,
                text: `${fund.attributes.name}: ${formatCurrency(fund.attributes.balance, language, currency)}`,
                type: 'user',
                value: fund.id,
            },
        ];
        const companiesAccountLabel = [
            {
                className: 'ddlGroup',
                disabled: true,
                text: formatMessage('companiesAccountLabel'),
                value: 'company',
            },
        ];
        const groupAccountLabel = [
            {
                className: 'ddlGroup',
                disabled: true,
                text: formatMessage('groupHeader'),
                value: 'group',
            },
        ];
        const campaignAccountLabel = [
            {
                className: 'ddlGroup',
                disabled: true,
                text: formatMessage('campaignHeader'),
                value: 'campaign',
            },
        ];
        let accountOptionsArray = personalAccount;

        if (!_.isEmpty(userGroups)) {
            if (!isGiveFromGroupUrl) {
                _.remove(userGroups, {
                    attributes: {
                        fundId: giveToId,
                    },
                });
            }

            // Removing the activeDonationMatch groups from the giveFrom list for group and p2p
            if (allocationType === 'give/to/friend' || allocationType === 'give/to/group') {
                _.remove(userGroups, {
                    attributes: {
                        hasActiveMatch: true,
                    },
                });
            }

            accountOptionsArray = _.concat(accountOptionsArray, groupAccountLabel,
                getDropDownOptionFromApiData(
                    userGroups,
                    null,
                    (item) => item.attributes.fundId,
                    (attributes) => `${attributes.fundName}: ${formatCurrency(attributes.balance, language, currency)}`,
                    (attributes) => false,
                    [
                        {
                            getValue: (attributes) => attributes.avatar,
                            key: 'avatar',
                        },
                        {
                            getValue: (attributes) => attributes.balance,
                            key: 'balance',
                        },
                        {
                            getValue: (attributes) => attributes.name,
                            key: 'name',
                        },
                        {
                            getValue: (attributes) => attributes.slug,
                            key: 'slug',
                        },
                    ],
                ));
        }

        if (!_.isEmpty(userCampaigns)) {
            _.remove(userCampaigns, {
                attributes: {
                    fundId: giveToId,
                },
            });

            // Removing the activeDonationMatch campaigns from the giveFrom list for group and p2p
            if (allocationType === 'give/to/friend' || allocationType === 'give/to/group') {
                _.remove(userCampaigns, {
                    attributes: {
                        hasActiveMatch: true,
                    },
                });
            }

            accountOptionsArray = _.concat(accountOptionsArray, campaignAccountLabel,
                getDropDownOptionFromApiData(
                    userCampaigns,
                    null,
                    (item) => item.attributes.fundId,
                    (attributes) => `${attributes.fundName}: ${formatCurrency(attributes.balance, language, currency)}`,
                    (attributes) => false,
                    [
                        {
                            getValue: (attributes) => attributes.avatar,
                            key: 'avatar',
                        },
                        {
                            getValue: (attributes) => attributes.balance,
                            key: 'balance',
                        },
                        {
                            getValue: (attributes) => attributes.name,
                            key: 'name',
                        },
                        {
                            getValue: (attributes) => attributes.slug,
                            key: 'slug',
                        },
                    ],
                ));
        }
        if (!_.isEmpty(companiesAccountsData)) {
            accountOptionsArray = _.concat(accountOptionsArray, companiesAccountLabel,
                getDropDownOptionFromApiData(
                    companiesAccountsData,
                    null,
                    (item) => item.attributes.companyFundId,
                    (attributes) => `${attributes.companyFundName}: ${formatCurrency(attributes.balance, language, currency)}`,
                    (attributes) => false,
                    [
                        {
                            getValue: (attributes) => attributes.avatar,
                            key: 'avatar',
                        },
                        {
                            getValue: (attributes) => attributes.balance,
                            key: 'balance',
                        },
                        {
                            getValue: (attributes) => attributes.name,
                            key: 'name',
                        },
                        {
                            getValue: (attributes) => attributes.slug,
                            key: 'slug',
                        },
                    ],
                ));
        }
        return accountOptionsArray;
    }
    return null;
};

const populateGroupsOfUser = (giveToGroupsData) => {
    if (!_.isEmpty(giveToGroupsData)) {
        return (
            getDropDownOptionFromApiData(
                giveToGroupsData.userGroups,
                null,
                (item) => item.attributes.fundId,
                (attributes) => `${attributes.name}`,
                (attributes) => false,
            )
        );
    }
    return null;
};

const populateDonationMatch = (donationMatchData, formatMessage, language) => {
    if (!_.isEmpty(donationMatchData)) {
        const noDonationMatch = {
            disabled: false,
            text: formatMessage('giveCommon:doNotMatchLabel'),
            type: '',
            value: 0,
        };
        return (
            _.sortBy(
                _.concat(
                    getDropDownOptionFromApiData(
                        donationMatchData,
                        formatMessage,
                        (item) => item.attributes.employeeRoleId,
                        (attributes) => {
                            if (attributes.policyPercentage === null
                                || attributes.policyMax === 0) {
                                return `${attributes.displayName} (${formatMessage('forNoMatchingPolicy')})`;
                            }
                            return createDonationMatchString(attributes, formatMessage, language);
                        },
                        (attributes) => !!(attributes.policyPercentage === null || attributes.policyMax === 0),
                        null,
                        language,
                    ),
                    noDonationMatch,
                ),
                'disabled',
            )
        );
    }
    return null;
};

/**
* Populate gift type drop down options
* @param {object} intl for getting intl text
* @return {object[]} drop down options array
*/

const populateGiftType = (formatMessage) => {
    //const { formatMessage } = intl;
    return [
        {
            disabled: false,
            text: formatMessage('giftTypeSingle'),
            value: 0,
        },
        {
            disabled: false,
            text: formatMessage('specialInstruction:giftTypeRecurring1'),
            value: 1,
        },
        {
            disabled: false,
            text: formatMessage('specialInstruction:giftTypeRecurring15'),
            value: 15,
        },
    ];
};

const populateCardData = (selectCardDetails, cardAmount) => {
    const isEnglishCard = selectCardDetails.indexOf(' ending ');
    const cardData = {
        amount: cardAmount,
        type: 'card',
    };
    const selectedCardName = _.split(selectCardDetails, ' ');
    if (isEnglishCard !== -1) {
        const dispName = selectedCardName ? selectedCardName[0] : '';
        cardData.displayName = _.replace(dispName, '\'s', '');
        cardData.processor = selectedCardName[selectedCardName.indexOf('ending') - 1].toLowerCase().trim();
        cardData.truncatedPaymentId = selectedCardName[selectedCardName.length - 1];
    } else {
        cardData.displayName = _.replace(selectedCardName[2], '\'s', '');
        cardData.processor = selectedCardName[0].toLowerCase().trim();
        cardData.truncatedPaymentId = selectedCardName[selectedCardName.length - 1];
    }
    return cardData;
};

/**
* Populate payment instrument drop down options
* @param  {object} paymentInstrumentsData API data
* @param {object} intl for getting intl text
* @return {object[]} drop down options array
*/

const populatePaymentInstrument = (paymentInstrumentsData, formatMessage) => {
    if (!_.isEmpty(paymentInstrumentsData)) {
        const newCreditCard = [
            {
                disabled: false,
                text: 'Add new card',
                value: 0,
            },
        ];
        return _.concat(
            getDropDownOptionFromApiData(
                paymentInstrumentsData,
                null,
                (item) => item.id,
                (attributes) => `${attributes.description}`,
                (attributes) => false,
                [
                    {

                        getValue: (attributes) => {
                            const returnObj = {
                                avatar: false,
                            };
                            const cardProcessors = {
                                amex: expressCard,
                                discover: visaIcon,
                                mastercard: mastercardIcon,
                                stripe: visaIcon,
                                visa: visaIcon,
                            };
                            const {
                                processor,
                            } = populateCardData(attributes.description, 0);
                            returnObj.src = cardProcessors[processor];
                            return returnObj;
                        },
                        key: 'image',
                    },
                    {
                        getValue: (attributes) => {
                            const {
                                processor,
                            } = populateCardData(attributes.description, 0);
                            return processor;
                        },
                        key: 'processor',
                    },
                ],
            ),
            newCreditCard,
        );
    }
    return null;
};

const populateTaxReceipts = (taxReceiptData, formatMessage) => {
    if (!_.isEmpty(taxReceiptData)) {
        const newTaxReceipt = [
            {
                disabled: false,
                text: 'Add new tax receipt',
                value: 0,
            },
        ];
        return _.concat(
            getDropDownOptionFromApiData(
                taxReceiptData,
                null,
                (item) => item.id,
                (attributes) => {
                    return ReactHtmlParser(`<span class="attributes"><b>${attributes.fullName}</b></span>
                                    <span class="attributes"> ${attributes.addressOne} ${attributes.addressTwo} </span>
                                    <span class="attributes">${attributes.city}, ${attributes.province} ${attributes.postalCode}</span>`);
                },
                (attributes) => false,
            ),
            newTaxReceipt,
        );
    }
    return null;
};

const getTaxReceiptById = (taxReceiptProfiles, selectedTaxReceiptProfile) => {
    const selectedProfile = _.find(taxReceiptProfiles, ['id', selectedTaxReceiptProfile]);
    return selectedProfile;
};

/**
* calculating percentage for selected donation match
* @param  {Object}  donationMatch recurringDonation date
* @return {Number} donation match amount
*/
const percentage = (donationMatch) => {
    let matchAmount = {};
    if (!_.isEmpty(donationMatch)) {
        matchAmount = (donationMatch.donationAmount / 100) * donationMatch.policyPercentage;
        const matchRemainingAmount =
            Number(donationMatch.policyMax) - Number(donationMatch.totalMatched);
        if (Number(matchRemainingAmount) < Number(matchAmount)) {
            matchAmount = Number(matchRemainingAmount);
        }
    }
    return matchAmount;
};

const setDateFormat = (nextTuesday, monthNames) => `${monthNames[nextTuesday.getMonth()]} ${nextTuesday.getDate()}`;

const getNextTuesday = (currentDateUTC, monthNames) => {
    const day = currentDateUTC.getDay();
    const normalizedDay = (day + 5) % 7;
    const daysForward = 7 - normalizedDay;
    const nextTuesday = new Date(+currentDateUTC + (daysForward * 24 * 60 * 60 * 1000));
    return setDateFormat(nextTuesday, monthNames);
};

const getFirstThirdTuesday = (currentDateUTC, monthNames) => {
    // To Find 1st and 3rd Tuesdays
    const tuesdays = [];
    const refDate = new Date();
    const refDateUTC = new Date(refDate.getTime() + (refDate.getTimezoneOffset() * 60000));
    refDateUTC.setHours(refDateUTC.getHours() - 8);
    const month = refDateUTC.getMonth();
    refDateUTC.setDate(1);
    // Get the first Monday in the month
    while (refDateUTC.getDay() !== 2) {
        refDateUTC.setDate(refDateUTC.getDate() + 1);
    }
    // Get all the other Tuesdays in the month
    while (refDateUTC.getMonth() === month) {
        tuesdays.push(new Date(refDateUTC.getTime()));
        refDateUTC.setDate(refDateUTC.getDate() + 7);
    }

    if (currentDateUTC.getDate() >= 1 && currentDateUTC.getDate() < tuesdays[0].getDate()) {
        return setDateFormat(tuesdays[0], monthNames);
    }
    // Checking Condition for 3rd week Tuesday
    if (currentDateUTC.getDate() >= tuesdays[0].getDate() &&
        currentDateUTC.getDate() < tuesdays[2].getDate()) {
        return setDateFormat(tuesdays[2], monthNames);
    }
    const nextMonthTuesday = new Date(tuesdays[tuesdays.length - 1].getTime()
        + (7 * 24 * 60 * 60 * 1000));
    return setDateFormat(nextMonthTuesday, monthNames);
};

/**
* get date for single allocation to sent.
* @param {object} intl react-intl
* @return {string} recurring full date format
*/

const getNextAllocationMonth = (formatMessage, eftEnabled) => {
    const currentDate = new Date();
    const currentDateUTC = new Date(currentDate.getTime() +
        (currentDate.getTimezoneOffset() * 60000));
    currentDateUTC.setHours(currentDateUTC.getHours() - 8);
    const monthNames = fullMonthNames(formatMessage);
    if (eftEnabled) {
        return getNextTuesday(currentDateUTC, monthNames);
    }
    return getFirstThirdTuesday(currentDateUTC, monthNames);
};


/**
 * Determine whether the supplied field is valid.
 * @param  {String} field The add money form field name
 * @param  {any} value    The field's value
 * @param  {object} validity  The validaty object contains properties of addMoney form validations
 * @return {object}  validity Return the validity object.
 */
const validateDonationForm = (field, value, validity) => {
    switch (field) {
        case 'donationAmount':
            validity.doesAmountExist = !isInputBlank(value);
            validity.isAmountLessThanOneBillion = isAmountLessThanOneBillion(value);
            validity.isAmountMoreThanOneDollor = isAmountMoreThanOneDollor(value);
            validity.isValidPositiveNumber = isValidPositiveNumber(value);
            break;
        case 'noteToSelf':
            validity.isNoteToSelfInLimit = isInputLengthLessThanOneThousand(value);
            validity.isValidNoteSelfText = isValidNoteData(value);
            validity.isNoteToSelfValid = _.every(
                _.pick(validity, [
                    'isNoteToSelfInLimit',
                    'isValidNoteSelfText',
                ]),
            );
            break;
        case 'giveTo':
            validity.isValidAddingToSource = !isInputBlank(value);
            break;
        default: break;
    }
    return validity;
};


const populateGiveToGroupsofUser = (giveToGroupsData) => {
    if (!_.isEmpty(giveToGroupsData)) {
        return (
            getDropDownOptionFromApiData(
                giveToGroupsData.benificiaryDetails,
                null,
                (item) => item.attributes.fundId,
                (attributes) => `${attributes.name}`,
                (attributes) => false,
            )
        );
    }
    return null;
};
/**
* Populate info to share drop down options
* @param {object[]} taxReceiptProfile tax receipt profile list
* @param {object[]} companyDetails company deteils
* @param {object} intl for getting intl text
* @param {object} giveFrom selected account details
* @param {object} userDetails user details like name & email
* @return {object[]} drop down options array
*/

const populateInfoToShare = (taxReceiptProfile,
    companyDetails, giveFrom, userDetails, formatMessage) => {
    //const { formatMessage } = intl;
    let infoToShareList = null;
    switch (giveFrom.type) {
        case 'user':
            const {
                displayName,
                email,
            } = userDetails;
            const userTaxProfileData = !_.isEmpty(taxReceiptProfile)
                ? getDropDownOptionFromApiData(taxReceiptProfile, null, (item) => `name_address_email|${item.id}`,
                    (attributes) => {
                        return ReactHtmlParser(`<span class="attributes"><b>${attributes.fullName}</b></span>
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
                {
                    disabled: false,
                    text: ReactHtmlParser(`<span class="attributes"><b>${displayName}</b></span>`),
                    value: 'name',
                },
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
            break;
        case 'companies':
            const companyTaxProfileData = (!_.isEmpty(companyDetails)
                && !_.isEmpty(companyDetails.taxReceiptProfiles))
                ? getDropDownOptionFromApiData(
                    companyDetails.taxReceiptProfiles,
                    null,
                    (item) => `name_address_email|${item.id}`,
                    (attributes) => {
                        return ReactHtmlParser(`<span class="attributes"><b>${attributes.fullName}</b></span>
                        <span class="attributes"> ${attributes.addressOne} ${attributes.addressTwo} </span>
                        <span class="attributes">${attributes.city}, ${attributes.province} ${attributes.postalCode}</span>`);
                    },
                    (attributes) => false,
                ) : null;
            infoToShareList = [
                {
                    disabled: false,
                    text: ReactHtmlParser(`<span class="attributes">${formatMessage('giveCommon:infoToShareAnonymous')}</span>`),
                    value: 'anonymous',
                },
                {
                    disabled: false,
                    text: ReactHtmlParser(`<span class="attributes"><b>${giveFrom.name}</b></span>`),
                    value: 'name',
                },
            ];
            if (!_.isEmpty(companyTaxProfileData)) {
                infoToShareList = _.concat(
                    infoToShareList,
                    companyTaxProfileData,
                );
            }
            break;
        default:
            infoToShareList = [
                {
                    disabled: false,
                    text: ReactHtmlParser(`<span class="attributes">${formatMessage('giveCommon:infoToShareAnonymous')}</span>`),
                    value: 'anonymous',
                },
                {
                    disabled: false,
                    text: ReactHtmlParser(`<span class="attributes"><b>${giveFrom.name}</b></span>`),
                    value: 'name',
                },
            ];
            break;
    }
    return infoToShareList;
};

/**
* Set donation amount
* @param {object} giveData state object for give page
* @return {object} selected credit card option
*/

const setDonationAmount = (giveData, coverFeesData) => {
    let donationAmount = '';
    const coverFeesGreaterThan0 = (!_.isEmpty(coverFeesData)
        && !_.isEmpty(coverFeesData.coverFees)
        && Number(coverFeesData.coverFees.giveAmountFees) > 0
    );
    const giveAmount = (giveData.coverFees && coverFeesGreaterThan0)
        ? (Number(giveData.giveAmount) + Number(coverFeesData.coverFees.giveAmountFees))
        : Number(giveData.giveAmount);
    if (Number(giveAmount) > Number(giveData.giveFrom.balance)
        && giveData.giftType.value === 0
    ) {
        donationAmount = (formatAmount(giveData.giveAmount) - formatAmount(giveData.giveFrom.balance));
        donationAmount = formatAmount(donationAmount);
        if (Number(donationAmount) < 5) {
            donationAmount = formatAmount(5);
        }
    }
    return donationAmount;
};


/**
* Reset give page data for give amount change
* @param {object} giveData state object for give page
* @param {object} dropDownOptions full drop down options for give page
* @return {object} selected credit card option
*/

const resetDataForGiveAmountChange = (giveData, dropDownOptions, coverFeesData) => {
    giveData.coverFees = false;
    if ((giveData.giveFrom.type === 'user' || giveData.giveFrom.type === 'companies')
        && giveData.giftType.value === 0) {
        giveData.donationAmount = setDonationAmount(giveData, coverFeesData);
        giveData.formatedDonationAmount = _.replace(formatCurrency(giveData.donationAmount, 'en', 'USD'), '$', '');
        if (Number(giveData.donationAmount) > 0 && isCreditCardBlank(giveData)
        ) {
            giveData.creditCard = getDefaultCreditCard(
                dropDownOptions.paymentInstrumentList,
            );
        } else if (giveData.donationAmount === '') {
            giveData.creditCard = {
                value: null,
            };
        }
        if (giveData.giveFrom.type === 'user'
            && !_.isEmpty(dropDownOptions.donationMatchList)
            && (_.isEmpty(giveData.donationMatch)
                || giveData.donationMatch.value === null)
            && giveData.donationAmount > 0
        ) {
            const [
                defaultMatch,
            ] = dropDownOptions.donationMatchList;
            giveData.donationMatch = defaultMatch;
        } else if (giveData.donationAmount === '') {
            giveData.donationMatch = {
                value: null,
            };
        }
    }
    return giveData;
};

/**
* Reset give page data for account change
* @param {object} giveData state object for give page
* @param {object} dropDownOptions full drop down options for give page
* @param {object} props props for give page
* @return {object} selected credit card option
*/

const resetDataForAccountChange = (giveData, dropDownOptions, props, type) => {
    const {
        companyDetails,
        coverFeesData,
        currentUser: {
            attributes: {
                displayName,
                firstName,
                email,
                lastName,
            },
        },
        paymentInstrumentsData,
        taxReceiptProfile,
    } = props;
    const formatMessage = props.t;
    // irrespective of the seletion coverFees should be reset
    giveData.coverFees = false;
    if (giveData.giveFrom.type === 'groups' || giveData.giveFrom.type === 'campaigns') {
        giveData.giftType = {
            value: 0,
        };
        giveData.donationAmount = '';
        giveData.donationMatch = {
            value: null,
        };
        giveData.creditCard = {
            value: null,
        };
    } else if (giveData.giveFrom.type === 'companies') {
        giveData.donationAmount = setDonationAmount(giveData, coverFeesData);
        giveData.donationMatch = {
            value: null,
        };
        giveData.creditCard = {
            value: null,
        };
        giveData.formatedDonationAmount = _.replace(formatCurrency(giveData.donationAmount, 'en', 'USD'), '$', '');
        if (!_.isEmpty(companyDetails)
            && companyDetails.companyId === Number(giveData.giveFrom.id)) {
            dropDownOptions.paymentInstrumentList = populatePaymentInstrument(
                (!_.isEmpty(companyDetails)
                    && !_.isEmpty(companyDetails.companyPaymentInstrumentsData))
                    ? companyDetails.companyPaymentInstrumentsData : null,
                formatMessage,
            );
            if ((giveData.giftType.value > 0
                || Number(giveData.giveAmount) > Number(giveData.giveFrom.balance))) {
                giveData.creditCard = getDefaultCreditCard(
                    dropDownOptions.paymentInstrumentList,
                );
            }
        }
    } else if (giveData.giveFrom.type === 'user') {
        giveData.donationAmount = setDonationAmount(giveData, coverFeesData);
        giveData.donationMatch = {
            value: null,
        };
        giveData.formatedDonationAmount = _.replace(formatCurrency(giveData.donationAmount, 'en', 'USD'), '$', '');
        if (!_.isEmpty(dropDownOptions.donationMatchList)
            && (giveData.giftType.value > 0
                || Number(giveData.giveAmount) > Number(giveData.giveFrom.balance))
        ) {
            const [
                defaultMatch,
            ] = dropDownOptions.donationMatchList;
            giveData.donationMatch = defaultMatch;
        }
        giveData.creditCard = {
            value: null,
        };
        dropDownOptions.paymentInstrumentList = populatePaymentInstrument(
            paymentInstrumentsData,
            formatMessage,
        );
        if ((giveData.giftType.value > 0
            || Number(giveData.giveAmount) > Number(giveData.giveFrom.balance))) {
            giveData.creditCard = getDefaultCreditCard(
                dropDownOptions.paymentInstrumentList,
            );
        }
    }
    if (type === 'give/to/charity') {
        giveData.infoToShare = {
            value: 'anonymous',
        };
        dropDownOptions.infoToShareList = populateInfoToShare(
            taxReceiptProfile,
            companyDetails,
            giveData.giveFrom,
            {
                displayName: `${firstName} ${lastName}`,
                email,
            },
            formatMessage,
        );
    } else if (type === 'give/to/group') {
        giveData.privacyShareEmail = false;
        giveData.privacyShareAddress = false;
    }
    return {
        modifiedDropDownOptions: dropDownOptions,
        modifiedGiveData: giveData,
    };
};

/**
 * Determine whether the supplied field is valid.
 * @param  {String} field The add money form field name
 * @param  {any} value    The field's value
 * @param  {object} validity  The validaty object contains properties of addMoney form validations
 * @param {object} giveData give page state object
 * @param {String} coverFeesAmount fee amount for give
 * @param {String} senderEmail email of the sender
 * @return {object}  validity Return the validity object.
 */
const validateGiveForm = (field, value, validity, giveData, coverFeesAmount = null, senderEmail = null) => {
    const giveAmount = giveData.totalP2pGiveAmount
        ? giveData.totalP2pGiveAmount
        : giveData.giveAmount;
    switch (field) {
        case 'giveAmount':
            validity.doesAmountExist = !isInputBlank(value);
            validity.isAmountLessThanOneBillion = (giveData.giftType.value > 0)
                ? isAmountLessThanOneBillion(value) : true;
            validity.isAmountMoreThanOneDollor = (giveData.giveTo.type === 'beneficiaries') || giveData.giftType.value > 0
                ? isAmountMoreThanOneDollor(value) : isAmountMoreOrEqualToOneDollor(value);
            validity.isValidPositiveNumber = isValidPositiveNumber(value);
            validity.isAmountCoverGive = (giveData.giveFrom.type === 'groups'
                || giveData.giveFrom.type === 'campaigns')
                ? isAmountCoverGive(
                    0,
                    giveData.coverFees,
                    coverFeesAmount,
                    giveAmount,
                    giveData.giveFrom.balance,
                ) : true;
            validity.isValidDecimalAmount = isValidDecimalAmount(value);
            validity.isValidGiveAmount = _.every(
                _.pick(validity, [
                    'doesAmountExist',
                    'isAmountLessThanOneBillion',
                    'isAmountMoreThanOneDollor',
                    'isValidPositiveNumber',
                    'isAmountCoverGive',
                ]),
            );
            break;
        case 'giveFrom':
            validity.isValidGiveFrom = !isInputBlank(value);
            validity.isValidGiveTo = !((value.type === giveData.giveTo.type)
                && (giveData.giveTo.value === value.value));
            break;
        case 'dedicateType':
            if (giveData.dedicateGift && !_.isEmpty(giveData.dedicateGift.dedicateType)) {
                if (_.isEmpty(giveData.dedicateGift.dedicateValue)) {
                    validity.isDedicateGiftEmpty = false;
                }
            }
            break;
        case 'noteToSelf':
            validity.isNoteToSelfInLimit = isInputLengthLessThanOneThousand(value);
            validity.isValidNoteSelfText = isValidNoteData(value);
            validity.isValidNoteToSelf = _.every(
                _.pick(validity, [
                    'isNoteToSelfInLimit',
                    'isValidNoteSelfText',
                ]),
            );
            break;
        case 'noteToCharity':
        case 'noteToRecipients':
            validity.isNoteToCharityInLimit = isInputLengthLessThanOneThousand(value);
            validity.isValidNoteToCharityText = isValidNoteData(value);
            validity.isValidNoteToCharity = _.every(
                _.pick(validity, [
                    'isNoteToCharityInLimit',
                    'isValidNoteToCharityText',
                ]),
            );
            break;
        case 'donationAmount':
            const isDonationAmountApplicable = (
                Number(giveAmount) > Number(giveData.giveFrom.balance)
                || (giveData.coverFees
                    && (Number(giveAmount) + Number(coverFeesAmount))
                    > Number(giveData.giveFrom.balance))
            );
            const eligibleForTopup = ((giveData.giveFrom.type === 'user' || giveData.giveFrom.type === 'companies')
                && giveData.giftType.value === 0 && isDonationAmountApplicable
            );
            validity.isDonationAmountBlank = (eligibleForTopup) ? !isInputBlank(value) : true;
            validity.isDonationAmountLessThan1Billion = (eligibleForTopup)
                ? isAmountLessThanOneBillion(value) : true;
            validity.isDonationAmountMoreThan1Dollor = (eligibleForTopup)
                ? isAmountMoreThanOneDollor(value) : true;
            validity.isDonationAmountPositive = (eligibleForTopup)
                ? isValidPositiveNumber(value) : true;
            validity.isDonationAmountCoverGive = (eligibleForTopup)
                ? isAmountCoverGive(
                    value,
                    giveData.coverFees,
                    coverFeesAmount, giveAmount, giveData.giveFrom.balance,
                ) : true;
            validity.isValidDecimalDonationAmount = (eligibleForTopup)
                ? isValidDecimalAmount(value) : true;
            validity.isValidDonationAmount = _.every(
                _.pick(validity, [
                    'isDonationAmountBlank',
                    'isDonationAmountLessThan1Billion',
                    'isDonationAmountMoreThan1Dollor',
                    'isDonationAmountPositive',
                    'isDonationAmountCoverGive',
                ]),
            );
            break;
        case 'recipients':
            if (!_.isEmpty(value)) {
                validity.isValidEmailList = isValidEmailList(value);
            }
            validity.isRecepientSelected = !(_.isEmpty(value) && _.isEmpty(giveData.friendsList));
            validity.isRecipientListUnique = isUniqueArray(value);
            validity.isRecipientHaveSenderEmail = isEmailListContainsSenderEmail(value, senderEmail);
            validity.isNumberOfEmailsLessThanMax = ((value.length + giveData.friendsList.length) <= 25);
            break;
        default: break;
    }
    return validity;
};
/**
* Reset give page data for gift type change
* @param {object} giveData state object for give page
* @param {object} dropDownOptions full drop down options for give page
* @return {object} selected credit card option
*/

const resetDataForGiftTypeChange = (giveData, dropDownOptions, coverFeesData) => {
    giveData.coverFees = false;
    if (giveData.giftType.value > 0) {
        giveData.donationAmount = '';
        if (isCreditCardBlank(giveData)) {
            giveData.creditCard = getDefaultCreditCard(
                dropDownOptions.paymentInstrumentList,
            );
        }
        if (giveData.giveFrom.type === 'user' &&
            !_.isEmpty(dropDownOptions.donationMatchList) &&
            (_.isEmpty(giveData.donationMatch) ||
                giveData.donationMatch.value === null)
        ) {
            const [
                defaultMatch,
            ] = dropDownOptions.donationMatchList;
            giveData.donationMatch = defaultMatch;
        }
    } else if (giveData.giftType.value === 0) {
        giveData.donationAmount = setDonationAmount(giveData, coverFeesData);
        if (Number(giveData.donationAmount) > 0 && isCreditCardBlank(giveData)) {
            giveData.creditCard = getDefaultCreditCard(
                dropDownOptions.paymentInstrumentList,
            );
        } else if (giveData.donationAmount === '') {
            giveData.creditCard = {
                value: null,
            };
        }
        if (Number(giveData.donationAmount) > 0 &&
            giveData.giveFrom.type === 'user' &&
            !_.isEmpty(dropDownOptions.donationMatchList) &&
            (_.isEmpty(giveData.donationMatch) ||
                giveData.donationMatch.value === null)
        ) {
            const [
                defaultMatch,
            ] = dropDownOptions.donationMatchList;
            giveData.donationMatch = defaultMatch;
        } else if (giveData.donationAmount === '') {
            giveData.donationMatch = {
                value: null,
            };
        }
    }
    return giveData;
};

/**
* set date for recurring danations
* @param  {Date}  date recurringDonation date
* @param {function} formatMessage react-intl
* @param {object} lang language
* @return {string} recurring full date format
*/
const setDateForRecurring = (date, formatMessage, lang = 'en') => {
    const currentDate = new Date();
    const monthNames = fullMonthNames(formatMessage);
    let month = currentDate.getDate() < date
        ? monthNames[currentDate.getMonth()] : monthNames[currentDate.getMonth() + 1];
    let year = currentDate.getFullYear();
    if (!month) {
        month = monthNames[0];
        year = currentDate.getFullYear() + 1;
    }
    // Now considering french only.
    return (lang === 'fr') ? `${date}er ${month} ${year}` : `${month} ${date}, ${year}`;
};

const formatDateForGivingTools = (date) => {
    let unformattedDate = new Date(date);
    // Need to use the original function, using this now as we need to integrate translaction for that
    const day = unformattedDate.getDate();
    const month = monthNamesForGivingTools(unformattedDate.getMonth() + 1);
    const year = unformattedDate.getFullYear();

    return `${month} ${day}, ${year}`;
};

const getDonationMatchedData = (donationMatchId, donationAmount, donationMatchData) => {
    const donationMatchedData = _.find(
        donationMatchData, (item) => item.attributes.employeeRoleId == donationMatchId,
    );
    if (!_.isEmpty(donationMatchedData)) {
        const {
            attributes: {
                automaticMatching,
                companyName,
                policyMax,
                policyPercentage,
                policyPeriod,
                totalMatched,
            },
            id,
        } = donationMatchedData;
        const donationMatchedAmount = percentage({
            donationAmount,
            policyMax,
            policyPercentage,
            totalMatched,
        });
        const matchedData = {
            automaticMatching,
            accountId: id,
            amount: donationMatchedAmount,
            displayName: companyName,
            type: 'donationMatch',
            periodType: policyPeriod,
            maxMatch: policyMax,
        };
        return matchedData;
    }
    return null;
};

const populateDonationReviewPage = (giveData, data, currency, formatMessage, language) => {
    const {
        creditCard,
        donationAmount,
        donationMatch,
        giftType,
        giveTo,
        noteToSelf,
    } = giveData;
    const {
        companiesAccountsData,
        donationMatchData,
        selectedTaxReceiptProfile,
    } = data;
    const state = {
        buttonText: formatMessage('reviewAddMoney'),
        editUrl: '/donations/new',
        headingText: formatMessage('donationHeadingText'),
        isRecurring: !(giftType.value === 0),
        mainDisplayAmount: formatCurrency(
            Number(donationAmount),
            language,
            currency,
        ),
        mainDisplayImage: '',
        mainDisplayText: 'To Impact Account',
    };

    const {
        attributes,
    } = selectedTaxReceiptProfile;

    const listingData = [];
    if (!_.isEmpty(giveTo)) {
        state.mainDisplayImage = giveTo.avatar;
        if (giveTo.type === 'user') {
            state.accountType = giveTo.type;
        } else {
            const selectedData = _.find(companiesAccountsData, { id: giveTo.id });
            if (!_.isEmpty(selectedData)) {
                state.mainDisplayText = selectedData.attributes.companyFundName;
                state.accountType = 'company';
            }
        }

        let frequencyMessage = formatMessage('reviewAddOnce');
        if (giftType.value === 1) {
            frequencyMessage = `${formatMessage('reviewAddMonthly')} <br/> ${formatMessage('onFirstMessage')}`;
        } else if (giftType.value === 15) {
            frequencyMessage = `${formatMessage('reviewAddMonthly')} <br/> ${formatMessage('onFifteenthMessage')}`;
        }

        listingData.push({
            name: 'reviewFrequency',
            value: ReactHtmlParser(frequencyMessage),
        });

        if (creditCard.value > 0) {
            listingData.push({
                name: 'reviewPaymentMethod',
                value: creditCard.text,
            });
        }
        const taxData = `${attributes.fullName} <br/> ${attributes.addressOne},  ${(attributes.addressTwo) ? attributes.addressTwo : ''} <br/> ${attributes.city}, ${attributes.province} ${attributes.postalCode}`;
        listingData.push({
            name: 'reviewTaxReceipt',
            value: ReactHtmlParser(taxData),
        });

        let matchingDetails = formatMessage('reviewNoMatchingDetails');
        if (donationMatch.value > 0) {
            const matchedData = getDonationMatchedData(donationMatch.id, donationAmount, donationMatchData);
            if (!_.isEmpty(matchedData)) {
                matchingDetails = `${formatMessage('reviewMatchingDetails', {
                    companyName: matchedData.displayName,
                    matchedAmount: formatCurrency(
                        Number(matchedData.amount),
                        language,
                        currency,
                    ),
                    periodType: matchedData.periodType,
                })}`;
            }
        }
        listingData.push({
            name: 'reviewMatchingPartner',
            value: matchingDetails,
        });

        listingData.push({
            name: 'reviewNoteToSelf',
            value: (!_.isEmpty(noteToSelf)) ? noteToSelf : formatMessage('reviewEmptyNoteToSelf')
        });
        state.listingData = listingData;
        return (state);
    }
};

/**
* Setup the display parameters for review page
* @param {object} giveData state object for give page
* @param {object[]} data with all details like tax, payment,donationmatch etc
* @param {object} intl format message and format number
* @param {string} language language
* @return {string} currency
*/

const populateGiveReviewPage = (giveData, data, currency, formatMessage, language) => {
    const {
        giveGroupDetails,
        toURL,
        type,
    } = data;
    const {
        dedicateGift,
        infoToShare,
        giftType,
        giveAmount,
        giveFrom,
        giveTo,
        nameToShare,
        noteToCharity,
        noteToSelf,
        privacyShareAddress,
        privacyShareAmount,
        privacyShareEmail,
        privacyShareName,
    } = giveData;

    // Create this constant to not conflict with recipient constant.
    const state = {
        editUrl: toURL,
        buttonText: formatMessage('reviewSendGift'),
        headingText: `${formatMessage('reviewGiveToText')} ${giveTo.name}`,
        isRecurring: !(giftType.value === 0),
        mainDisplayAmount: formatCurrency(
            Number(giveAmount),
            language,
            currency,
        ),
        mainDisplayImage: giveTo.avatar,
        mainDisplayText: `${formatMessage('reviewGiveToText')} ${giveTo.name}`,
    };
    const listingData = [];

    if (!_.isEmpty(giveFrom)) {
        let frequencyMessage = formatMessage('reviewSendOnce');
        if (giftType.value === 1) {
            frequencyMessage = `${formatMessage('reviewSendMonthly')} <br/> ${formatMessage('onFirstMessage')}`;
        } else if (giftType.value === 15) {
            frequencyMessage = `${formatMessage('reviewSendMonthly')} <br/> ${formatMessage('onFifteenthMessage')}`;
        }
        listingData.push({
            name: 'reviewFrequency',
            value: ReactHtmlParser(frequencyMessage),
        });

        listingData.push({
            name: 'reviewGiveFrom',
            value: giveFrom.text,
        });

        if (!_.isEmpty(giveGroupDetails)) {
            const {
                attributes: {
                    activeMatch,
                    hasActiveMatch,
                },
            } = giveGroupDetails;
            if (!_.isEmpty(activeMatch) && hasActiveMatch) {
                const {
                    company,
                    maxMatchAmount,
                    balance,
                } = activeMatch;
                const maxMatchedAmount = (Number(maxMatchAmount) <= Number(balance)) ?
                    Number(maxMatchAmount) : Number(balance);
                const activeMatchedAmount = (Number(giveAmount) > maxMatchedAmount) ?
                    maxMatchedAmount : Number(giveAmount);
                listingData.push({
                    name: 'giftToGroupMatchedBy',
                    value: `${company}: ${formatCurrency(activeMatchedAmount, language, currency)}`,
                });
            }
        }
        if (type === 'give/to/charity') {
            let infoToShareMessage = formatMessage('reviewGiveAnonymously');
            if (infoToShare.value !== 'anonymous') {
                infoToShareMessage = infoToShare.text;
            }
            listingData.push({
                name: 'reviewInfoToCharity',
                value: infoToShareMessage,
            });
        } else {
            let privacyShareNameMessage = (nameToShare.value === 0) ? formatMessage('reviewGiveAnonymously') : nameToShare.text;
            if (privacyShareAmount) {
                privacyShareNameMessage = `${privacyShareNameMessage} <br/> ${formatMessage('reviewGiftAmount')} ${state.mainDisplayAmount}`;
            }

            let privacyShareEmailMessage = formatMessage("notApplicable");
            if(giveFrom.type === 'user') {
                privacyShareEmailMessage = infoToShare.text;
            }

            const giveToType = (giveTo.isCampaign) ? 'Campaign' : 'Group';
            listingData.push({
                name: `privacyShareGiving${giveToType}Label`,
                value: ReactHtmlParser(privacyShareNameMessage),
            });

            listingData.push({
                name: `privacyShareOrganizers${giveToType}Label`,
                value: privacyShareEmailMessage,
            });
        }

        const dedicatedDetails = {
            name: 'reviewGiftDedication',
            value: formatMessage('reviewNoGift'),
        };

        if (!_.isEmpty(dedicateGift) && !_.isEmpty(dedicateGift.dedicateType)) {
            dedicatedDetails.value = `${(dedicateGift.dedicateType === 'inHonorOf')
                ? 'In honour of' : 'In memory of'} ${dedicateGift.dedicateValue}`;
        }

        listingData.push(dedicatedDetails);

        listingData.push({
            name: (type === 'give/to/charity') ? 'reviewMessageToCharityLabel' : 'reviewMessageToGroupLabel',
            value: (!_.isEmpty(noteToCharity)) ? noteToCharity : formatMessage('reviewDefaultMessage'),
        });

        listingData.push({
            name: 'reviewNoteToSelf',
            value: (!_.isEmpty(noteToSelf)) ? noteToSelf : formatMessage('reviewEmptyNoteToSelf'),
        });
    }

    state.listingData = listingData;
    return (state);
};

/**
* Setup the display parameters for review page
* @param {object} giveData state object for give page
* @param {object[]} data with all details like tax, payment,donationmatch etc
* @param {object} intl format message and format number
* @param {string} language language
* @return {string} currency
*/

const populateP2pReviewPage = (giveData, data, currency, formatMessage, language) => {
    const {
        toURL,
    } = data;
    const {
        emailMasked,
        giveAmount,
        giveFrom,
        noteToRecipients,
        noteToSelf,
        recipientImage,
        recipientName,
        selectedFriendsList,
        totalP2pGiveAmount,
    } = giveData;

    const emails = giveData.recipients;
    const state = {
        buttonText: formatMessage('reviewP2pGive'),
        editUrl: toURL,
        headingText: formatMessage('reviewP2pText'),
        isRecurring: false,
        mainDisplayAmount: formatCurrency(
            Number(totalP2pGiveAmount),
            language,
            currency,
        ),
    };

    const listingData = [];
    listingData.push({
        name: 'reviewGiveFrom',
        value: giveFrom.text
    });

    if (emails || selectedFriendsList) {
        if (emails.length === 1 && _.isEmpty(selectedFriendsList)) {
            state.mainDisplayImage = (recipientImage) || placeholderUser;
            state.mainDisplayText = `${formatMessage('reviewGiveToText')} ${(recipientName) || emails[0]}`;

        } else if(selectedFriendsList.length === 1 &&  _.isEmpty(emails)) {
            state.mainDisplayImage = (selectedFriendsList[0].avatar) || placeholderUser;
            state.mainDisplayText = `${formatMessage('reviewGiveToText')} ${(selectedFriendsList[0].displayName)}`;
        } else {
            state.recipients = [];
            state.showP2pList = true;
            const fomatedAmount = formatCurrency(Number(giveAmount), language, currency);
            _.each(selectedFriendsList, (friend) => {
                const recipientData = {
                    displayName: friend.displayName,
                    type: 'user',
                    amount: fomatedAmount,
                };
                state.recipients.push(recipientData);
            });
            _.each(emails, (email) => {
                const recipientData = {
                    displayName: email,
                    type: 'email',
                    amount: fomatedAmount,
                };
                state.recipients.push(recipientData);
            });
        }
    }

    listingData.push({
        name: 'reviewP2pMessage',
        value: (!_.isEmpty(noteToRecipients)) ? noteToRecipients : formatMessage('reviewDefaultMessage')
    });
    listingData.push({
        name: 'reviewNoteToSelf',
        value: (!_.isEmpty(noteToSelf)) ? noteToSelf : formatMessage('reviewEmptyNoteToSelf')
    });
    state.listingData = listingData;
    return (state);
}

/**
 * Calculates what we need to give in total to all of our recipients.
 * @param {number} numberOfRecipients The number of recipients.
 * @param {number} amountEachRecipient The give amount for each recipient
 * @return {number} The total amount we are giving
 */
const calculateP2pTotalGiveAmount = (numberOfRecipients, amountEachRecipient) => (
    numberOfRecipients * amountEachRecipient
);

/**
* Set donation amount we need to give in order to give the total P2P give amount.
* @param {object} giveData state object for give page
* @return {object} selected credit card option
*/
const setP2pDonationAmount = (giveData) => {
    let donationAmount = '';

    if (Number(giveData.totalP2pGiveAmount) > Number(giveData.giveFrom.balance)) {
        donationAmount = (formatAmount(giveData.totalP2pGiveAmount)
            - formatAmount(giveData.giveFrom.balance));

        donationAmount = formatAmount(donationAmount);

        if (Number(donationAmount) < 5) {
            donationAmount = 5;
        }
    }
    return donationAmount;
};

/**
* Reset P2P Give data for give amount or recipients change
* @param {object} giveData state object for give page
* @param {object} dropDownOptions full drop down options for give page
* @return {object} The resetted Give Data
*/
const resetP2pDataForOnInputChange = (giveData, dropDownOptions) => {
    giveData.totalP2pGiveAmount = calculateP2pTotalGiveAmount(
        parseEmails(giveData.recipients).length,
        giveData.giveAmount,
    );

    if ((giveData.giveFrom.type !== 'user' && giveData.giveFrom.type !== 'companies')) {
        return giveData;
    }

    giveData.donationAmount = setP2pDonationAmount(giveData);
    giveData.formatedDonationAmount = _.replace(formatCurrency(giveData.donationAmount, 'en', 'USD'), '$', '');

    if (Number(giveData.donationAmount) > 0 && isCreditCardBlank(giveData)) {
        giveData.creditCard = getDefaultCreditCard(
            dropDownOptions.paymentInstrumentList,
        );
    } else if (giveData.donationAmount === '') {
        giveData.creditCard = {
            value: null,
        };
    }

    if (giveData.giveFrom.type === 'user'
        && !_.isEmpty(dropDownOptions.donationMatchList)
        && (_.isEmpty(giveData.donationMatch)
            || giveData.donationMatch.value === null)
        && giveData.donationAmount > 0
    ) {
        const [
            defaultMatch,
        ] = dropDownOptions.donationMatchList;
        giveData.donationMatch = defaultMatch;
    } else if (giveData.donationAmount === '') {
        giveData.donationMatch = {
            value: null,
        };
    }

    return giveData;
};

const populateFriendsList = (friendsList) => {
    const formattedFriendsList = [];
    let singleObject = {};
    if (!_.isEmpty(friendsList)) {
        friendsList.map((friend) => {
            singleObject = {
                displayName: friend.attributes.display_name,
                id: friend.attributes.user_id,
                image: {
                    avatar: true,
                    src: friend.attributes.avatar,
                },
                key: friend.attributes.user_id,
                text: ReactHtmlParser(`<span class="textFirst">${friend.attributes.display_name}</span><span class="secondFirst"></span>`),
                type: friend.type,
                value: friend.attributes.user_id,
            };
            formattedFriendsList.push(singleObject);
        });
        return formattedFriendsList;
    }
    return null;
};

const validateForReload = (validity, type, giveAmount, balance) => {
    validity.isReloadRequired =  (type === 'user' || type === 'companies') && Number(giveAmount) > Number(balance) ? false : true; 
    return validity;
};

const validateForMinReload = (donationAmount, minReload, validity) => {
    validity.isAmountEnoughForAllocation = (Number(donationAmount) >= Number(minReload));
    return validity;
};

const getSelectedFriendList = (options, values) => {
    const selectedFriendsList = [];
    let index = null;
    let preparedFriendList = {};
    values.map((value) => {
        index = _.findIndex(options, (opt) => {
            return opt.attributes.user_id === value;
        });
        preparedFriendList = {
            avatar: options[index].attributes.avatar,
            displayName: options[index].attributes.display_name,
            email: Buffer.from(options[index].attributes.email_hash, 'base64').toString('ascii'),
            type: 'users',
            userId: options[index].attributes.user_id,
        };
        selectedFriendsList.push(preparedFriendList);
    });
    return selectedFriendsList;
};

export {
    percentage,
    fullMonthNames,
    monthNamesForGivingTools,
    validateTaxReceiptProfileForm,
    onWhatDayList,
    isValidGiftAmount,
    isValidGivingGoalAmount,
    getDropDownOptionFromApiData,
    populateAccountOptions,
    populateDonationMatch,
    populateGiveToGroupsofUser,
    populateGroupsOfUser,
    populatePaymentInstrument,
    populateP2pReviewPage,
    populateGiftType,
    populateInfoToShare,
    populateTaxReceipts,
    formatAmount,
    getDefaultCreditCard,
    getTaxReceiptById,
    getDonationMatchedData,
    getNextAllocationMonth,
    setDateForRecurring,
    validateDonationForm,
    resetDataForGiveAmountChange,
    resetDataForAccountChange,
    resetDataForGiftTypeChange,
    setDonationAmount,
    validateGiveForm,
    populateDonationReviewPage,
    populateGiveReviewPage,
    populateCardData,
    formatCurrency,
    formatDateForGivingTools,
    resetP2pDataForOnInputChange,
    calculateP2pTotalGiveAmount,
    populateFriendsList,
    validateForReload,
    validateForMinReload,
    getSelectedFriendList,
};
