import _ from 'lodash';_
import _concat from 'lodash/concat';

import _isEmpty from 'lodash/isEmpty';
import _split from 'lodash/concat';

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
}  from '../give/giving-form-validation';
import coreApi from '../../services/coreApi';


/**
 * Checks if giveData contains any credit card information
 * @param {*} giveData state object for give page
 * @return {boolean} true if no credit card data is present, false otherwise.
 */
const isCreditCardBlank = (giveData) => {
    return (_isEmpty(giveData.creditCard) || giveData.creditCard.value === null);
};

sconst formatCurrency = (value, language, currencyType) => {
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
        formatMessage('common:fullMonthName.januaryLabel'),
        formatMessage('common:fullMonthName.februaryLabel'),
        formatMessage('common:fullMonthName.marchLabel'),
        formatMessage('common:fullMonthName.aprilLabel'),
        formatMessage('common:fullMonthName.mayLabel'),
        formatMessage('common:fullMonthName.juneLabel'),
        formatMessage('common:fullMonthName.julyLabel'),
        formatMessage('common:fullMonthName.augustLabel'),
        formatMessage('common:fullMonthName.septemberLabel'),
        formatMessage('common:fullMonthName.octoberLabel'),
        formatMessage('common:fullMonthName.novemberLabel'),
        formatMessage('common:fullMonthName.decemberLabel'),
    ];
    return fullMonths;
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

const getDefaultCreditCard = (paymentInstrumentList) => {
    let creditCard = {
        value: 0,
    };
    if (!_isEmpty(paymentInstrumentList)) {
        const [
            firstCard,
        ] = paymentInstrumentList;
        creditCard = firstCard;
    }
    return creditCard;
};

const formatAmount = (amount) => parseFloat(amount).toFixed(2);

/**
* onWhatDayList array list
* @param  {object}  intl formatMessage for i18n
* @return {Array} recurringDayList
*/
const onWhatDayList = () => {
    const recurringDayList = [
        {
            disabled: false,
            text: 'recurringMonthlyFirstLabel',
            value: 1,
        },
        {
            disabled: false,
            text: 'recurringMonthlyFifteenLabel',
            value: 15,
        },
    ];
    return recurringDayList;
};

const createDonationMatchString = (attributes) => {
    let policyPeriodText = `${attributes.policyPeriod}`;
    switch (attributes.policyPeriod) {
        case 'month':
            policyPeriodText = `forMonth`;// formatMessage({ id: 'giving.forMonth' });
            break;
        case 'year':
            policyPeriodText = `forYear`; // formatMessage({ id: 'giving.forYear' });
            break;
        default:
            break;
    }
    return `${attributes.displayName} ($forPer${policyPeriodText})`;
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

const getDropDownOptionFromApiData = (data, formatMessage, getValue, textFormat, isDisabled, extraField) => {
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
        if (!_isEmpty(extraField)) {
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
const populateAccountOptions = (data, giveToId = null, allocationType = null, isGiveFromGroupUrl = false) => {
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
    // const {
    //     formatMessage,
    //     formatNumber,
    // } = intl;
    const currency = 'USD';
    if ((!_isEmpty(companiesAccountsData)
    || !_isEmpty(userCampaigns)
    || !_isEmpty(userGroups))
    ) {
        const personalAccount = [
            {
                className: 'ddlGroup',
                disabled: true,
                text: `personal`, //formatMessage({ id: 'giving.personalAccountLabel' }),
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
                text: `${fund.attributes.name}`, // (${currencyFormatting(fund.attributes.balance, formatNumber, currency)})`,
                type: 'user',
                value: fund.id,
            },
        ];
        const companiesAccountLabel = [
            {
                className: 'ddlGroup',
                disabled: true,
                text: `company label`, //formatMessage({ id: 'giving.companiesAccountLabel' }),
                value: 'company',
            },
        ];
        const groupAccountLabel = [
            {
                className: 'ddlGroup',
                disabled: true,
                text: `groupHeader`, //formatMessage({ id: 'giving.groupHeader' }),
                value: 'group',
            },
        ];
        const campaignAccountLabel = [
            {
                className: 'ddlGroup',
                disabled: true,
                text: `campaignHeader` , //formatMessage({ id: 'giving.campaignHeader' }),
                value: 'campaign',
            },
        ];
        let accountOptionsArray = personalAccount;

        if (!_isEmpty(userGroups)) {
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

            accountOptionsArray = _concat(accountOptionsArray, groupAccountLabel,
                getDropDownOptionFromApiData(
                    userGroups,
                    null,
                    (item) => item.attributes.fundId,
                    (attributes) => `${attributes.fundName}`, // (${currencyFormatting(attributes.balance, formatNumber, currency)})`,
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

        if (!_isEmpty(userCampaigns)) {
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

            accountOptionsArray = _concat(accountOptionsArray, campaignAccountLabel,
                getDropDownOptionFromApiData(
                    userCampaigns,
                    null,
                    (item) => item.attributes.fundId,
                    (attributes) => `${attributes.fundName}`, // (${currencyFormatting(attributes.balance, formatNumber, currency)})`,
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
        if (!_isEmpty(companiesAccountsData)) {
            accountOptionsArray = _concat(accountOptionsArray, companiesAccountLabel,
                getDropDownOptionFromApiData(
                    companiesAccountsData,
                    null,
                    (item) => item.attributes.companyFundId,
                    (attributes) => `${attributes.companyFundName}`, // (${currencyFormatting(attributes.balance, formatNumber, currency)})`,
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

const populateDonationMatch = (donationMatchData) => {
    if (!_isEmpty(donationMatchData)) {
        const noDonationMatch = {
            disabled: false,
            text: `doNotMatchLabel`, // formatMessage({ id: 'giving.doNotMatchLabel' }),
            type: '',
            value: 0,
        };
        return (
            _.sortBy(
                _concat(
                    getDropDownOptionFromApiData(
                        donationMatchData,
                        null,
                        (item) => item.attributes.employeeRoleId,
                        (attributes) => {
                            if (attributes.policyPercentage === null
                                || attributes.policyMax === 0) {
                                return `${attributes.displayName} (forNoMatchingPolicy)`;
                            }
                            return createDonationMatchString(attributes);
                        },
                        (attributes) => !!(attributes.policyPercentage === null || attributes.policyMax === 0),
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

const populateGiftType = () => {
    //const { formatMessage } = intl;
    return [
        {
            disabled: false,
            text: `id: 'giving.giftTypeSingle'`,
            value: 0,
        },
        {
            disabled: false,
            text: `formatMessage({ id: 'giving.giftTypeRecurring1' })`,
            value: 1,
        },
        {
            disabled: false,
            text: `formatMessage({ id: 'giving.giftTypeRecurring15' })`,
            value: 15,
        },
    ];
};
/**
* Populate payment instrument drop down options
* @param  {object} paymentInstrumentsData API data
* @param {object} intl for getting intl text
* @return {object[]} drop down options array
*/

const populatePaymentInstrument = (paymentInstrumentsData) => {
    if (!_isEmpty(paymentInstrumentsData)) {
        const newCreditCard = [
            {
                disabled: false,
                text: `useNewCreditCardLable`, // formatMessage({ id: 'giving.useNewCreditCardLable' }),
                value: 0,
            },
        ];
        return _concat(
            getDropDownOptionFromApiData(
                paymentInstrumentsData,
                null,
                (item) => item.id,
                (attributes) => `${attributes.description}`,
                (attributes) => false,
            ),
            newCreditCard,
        );
    }
    return null;
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

const setDateFormat = (nextTuesday, monthNames) => `Tuesday  ${monthNames[nextTuesday.getMonth()]} ${nextTuesday.getDate()}`;

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

const getNextAllocationMonth = (eftEnabled) => {
    const currentDate = new Date();
    const currentDateUTC = new Date(currentDate.getTime() +
                                (currentDate.getTimezoneOffset() * 60000));
    currentDateUTC.setHours(currentDateUTC.getHours() - 8);
    const monthNames = fullMonthNames();
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

<<<<<<< HEAD


const populateGiveToGroupsofUser = (giveToGroupsData) => {
    if (!_isEmpty(giveToGroupsData)) {
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
    companyDetails, giveFrom, userDetails) => {
    //const { formatMessage } = intl;
    let infoToShareList = null;
    switch (giveFrom.type) {
        case 'user':
            const {
                displayName,
                email,
            } = userDetails;
            const userTaxProfileData = !_isEmpty(taxReceiptProfile)
                ? getDropDownOptionFromApiData(taxReceiptProfile, null, (item) => `name_address_email|${item.id}`,
                    (attributes) => `${attributes.fullName}, ${attributes.addressOne}, ${attributes.city}, ${attributes.province}, ${attributes.postalCode}`,
                    (attributes) => false) : null;
            infoToShareList = [
                {
                    disabled: false,
                    text: `formatMessage({ id: 'giving.infoToShareAnonymous' })`,
                    value: 'anonymous',
                },
                {
                    disabled: false,
                    text: `${displayName}`,
                    value: 'name',
                },
                {
                    disabled: false,
                    text: `${displayName} (${email})`,
                    value: 'name_email',
                },
            ];
            if (!_isEmpty(userTaxProfileData)) {
                infoToShareList = _concat(
                    infoToShareList,
                    userTaxProfileData,
                );
            }
            break;
        case 'companies':
            const companyTaxProfileData = (!_isEmpty(companyDetails)
                && !_isEmpty(companyDetails.taxReceiptProfileData))
                ? getDropDownOptionFromApiData(
                    companyDetails.taxReceiptProfileData,
                    null,
                    (item) => `name_address_email|${item.id}`,
                    (attributes) => `${attributes.fullName}, ${attributes.addressOne}, ${attributes.city}, ${attributes.province}, ${attributes.postalCode}`,
                    (attributes) => false,
                ) : null;
            infoToShareList = [
                {
                    disabled: false,
                    text: `formatMessage({ id: 'giving.infoToShareAnonymous' })`,
                    value: 'anonymous',
                },
                {
                    disabled: false,
                    text: giveFrom.name,
                    value: 'name',
                },
            ];
            if (!_isEmpty(companyTaxProfileData)) {
                infoToShareList = _concat(
                    infoToShareList,
                    companyTaxProfileData,
                );
            }
            break;
        default:
            infoToShareList = [
                {
                    disabled: false,
                    text: `formatMessage({ id: 'giving.infoToShareAnonymous' })`,
                    value: 'anonymous',
                },
                {
                    disabled: false,
                    text: giveFrom.name,
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
    const coverFeesGreaterThan0 = (!_isEmpty(coverFeesData)
    && !_isEmpty(coverFeesData.coverFees)
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
            donationAmount = 5;
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
            && !_isEmpty(dropDownOptions.donationMatchList)
            && (_isEmpty(giveData.donationMatch)
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
            displayName,
            email,
        },
        paymentInstrumentsData,
        taxReceiptProfile,
    } = props;
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
        if (!_isEmpty(companyDetails)
            && companyDetails.companyId === Number(giveData.giveFrom.id)) {
            dropDownOptions.paymentInstrumentList = populatePaymentInstrument(
                (!_isEmpty(companyDetails)
                && !_isEmpty(companyDetails.companyPaymentInstrumentsData))
                    ? companyDetails.companyPaymentInstrumentsData : null,
                props.intl,
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
        if (!_isEmpty(dropDownOptions.donationMatchList)
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
            props.intl,
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
                displayName,
                email,
            },
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
const validateGiveForm = (field, value, validity, giveData, coverFeesAmount, senderEmail = null) => {
    const giveAmount = giveData.totalP2pGiveAmount
        ? giveData.totalP2pGiveAmount
        : giveData.giveAmount;

    switch (field) {
        case 'giveAmount':
            validity.doesAmountExist = !isInputBlank(value);
            validity.isAmountLessThanOneBillion = (giveData.giftType.value > 0)
                ? isAmountLessThanOneBillion(value) : true;
            validity.isAmountMoreThanOneDollor = (giveData.giveTo.type === 'beneficiaries')
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
            validity.isValidEmailList = isValidEmailList(giveData.recipients);
            validity.isRecipientListUnique = isUniqueArray(giveData.recipients);
            validity.isRecipientHaveSenderEmail = isEmailListContainsSenderEmail(giveData.recipients, senderEmail);
            validity.isNumberOfEmailsLessThanMax = isNumberOfEmailsLessThanMax(giveData.recipients, 25);
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
            !_isEmpty(dropDownOptions.donationMatchList) &&
            (_isEmpty(giveData.donationMatch) ||
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
            !_isEmpty(dropDownOptions.donationMatchList) &&
            (_isEmpty(giveData.donationMatch) ||
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
}

const populateCardData = (selectCardDetails, cardAmount) => {
    const isEnglishCard = selectCardDetails.indexOf(' ending ');
    const cardData = {
        amount: cardAmount,
        type: 'card',
    };
    const selectedCardName = _.split(selectCardDetails, ' ');
    if (isEnglishCard !== -1) {
        cardData.displayName = _.replace(selectedCardName[0], '\'s', '');
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

const getDonationMatchedData = (donationMatchId, donationAmount, donationMatchData) => {
    const donationMatchedData = _.find(
        donationMatchData, (item) => item.attributes.employeeRoleId == donationMatchId,
    );
    if (!_.isEmpty(donationMatchedData)) {
        const {
            attributes: {
                companyName,
                policyMax,
                policyPercentage,
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
            accountId: id,
            amount: donationMatchedAmount,
            displayName: companyName,
            type: 'donationMatch',
        };
        return matchedData;
    }
    return null;
}

const populateDonationReviewPage = (giveData, data, currency, formatMessage, language) => {
    const {
        creditCard,
        donationAmount,
        donationMatch,
        giftType,
        giveTo,
    } = giveData;
    const {
        companiesAccountsData,
        donationMatchData,
        fund,
    } = data;

    const state = {
    };

    const paymentMap = {
        companies: 'companyPaymentInstrumentsData',
        user: 'paymentInstrumentsData',
    };

    const sources = [];
    const recipients = [];
    let giveToData = {};
    if (!_.isEmpty(giveTo)) {
        if (giveTo.type === 'user') {
            giveToData = {
                accountId: giveTo.id,
                avatar: giveTo.avatar,
                displayName: fund.attributes.name,
                type: giveTo.type,
            };
        } else {
            const selectedData = _.find(companiesAccountsData, { id: giveTo.id });
            if (!_.isEmpty(selectedData)) {
                giveToData = {
                    accountId: selectedData.id,
                    displayName: selectedData.attributes.name,
                    type: 'company',
                };
            }
        }
        recipients.push(giveToData);
        if (creditCard.value > 0) {
            const creditCardData = _.find(data[paymentMap[giveTo.type]],
                { id: creditCard.id });
            if (!_.isEmpty(creditCardData)) {
                const cardData = populateCardData(creditCardData.attributes.description,
                    (donationAmount) ? Number(donationAmount) : null);
                cardData.accountId = creditCard.id;
                sources.push(cardData);
            }
        }
        if (donationMatch.value > 0) {
            const matchedData =  getDonationMatchedData(donationMatch.id, donationAmount, donationMatchData);
            if (!_.isEmpty(matchedData)) {
                sources.push(matchedData);
            }
        }
        if (giftType.value === 1 || giftType.value === 15) {
            state.startsOn = setDateForRecurring(giftType.value, formatMessage, language);
        }

        state.totalAmount = formatCurrency(
            _.sumBy(sources, (item) => Number(item.amount)),
            language,
            currency,
        );

        const buildAccounts = (item) => {
            const val = item.amount;
            if (val > 0) {
                return {
                    ...item,
                    amount: formatCurrency(
                        val,
                        language,
                        currency,
                    ),
                };
            }
            return item;
        };
        state.sources = _.map(sources, buildAccounts);
        state.recipients = _.map(recipients, buildAccounts);
        console.log(state);
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
        fund,
        activeGroupMatch,
    } = data;
    const {
        coverFeesAmount,
        coverFees,
        creditCard,
        donationAmount,
        donationMatch,
        giftType,
        giveAmount,
        giveFrom,
        giveTo,
        privacyShareAddress,
        privacyShareAmount,
        privacyShareEmail,
        privacyShareName,
        newCreditCardId,
        totalP2pGiveAmount,
    } = giveData;

    // Create this constant to not conflict with recipient constant.
    const emails = giveData.recipients;
    const state = {
        fromList: [],
        givingGroupMessage: '',
        givingOrganizerMessage: '',
        toList: [],
    };
    const sources = [];
    const recipients = [];
    let amountToGiveFrom = 0;
    let amountFromGroupMatch = 0;
    let fromData = {};
    let privacyShareNameMessage = '';
    let privacyShareEmailMessage = '';
    const dataMap = {
        campaigns: 'userCampaigns',
        companies: 'companiesAccountsData',
        donationMatches: 'donationMatchData',
        groups: 'userGroups',
    };
    const paymentMap = {
        companies: 'companiesPaymentInstrumentsList',
        user: 'paymentInstrumentsData',
    };

    const typeMap = {
        beneficiaries: 'beneficiary',
        campaigns: 'group',
        companies: 'company',
        donationMatches: 'donationMatch',
        groups: 'group',
    };

    if (!_.isEmpty(giveFrom)) {
        if (giveFrom.type === 'user') {
            fromData = {
                accountId: giveFrom.id,
                displayName: fund.attributes.name,
                type: giveFrom.type,
            };
        } else {
            const selectedData = _.find(data[dataMap[giveFrom.type]], { id: giveFrom.id });
            if (!_.isEmpty(selectedData)) {
                fromData = {
                    accountId: selectedData.id,
                    displayName: selectedData.attributes.name,
                    type: typeMap[giveFrom.type],
                };
            }
        }

        const amountToGive = totalP2pGiveAmount ? Number(totalP2pGiveAmount) : Number(giveAmount);
        const amountFromDonation = (donationAmount) ? Number(donationAmount) : 0;
        const coverFeesAmt = (coverFeesAmount) ? Number(coverFeesAmount) : 0;
        amountToGiveFrom = (amountFromDonation >= (amountToGive + coverFeesAmt)) ?
            (amountFromDonation - (amountToGive + coverFeesAmt)) : 0;

        if (!_.isEmpty(fromData) &&
            (amountToGiveFrom === 0 && (amountFromDonation !== (amountToGive + coverFeesAmt)))) {
            const {
                value,
            } = giftType;
            let amt = (amountToGive - amountFromDonation) + coverFeesAmt;
            amt = (value === 0 || value === null) ? amt : null;
            fromData.amount = amt;
            sources.push(fromData);
            const displayAmount = (amt) ? ` (${formatCurrency(amt, language, currency)})` : ``;
            state.fromList.push(
                `${fromData.displayName}${displayAmount}`,
            );
        }
        if (creditCard.value > 0) {
            const creditCardData = _.find(data[paymentMap[giveFrom.type]],
                { id: creditCard.id });
            if (!_.isEmpty(creditCardData)) {
                const cardData = populateCardData(creditCardData.attributes.description,
                    (donationAmount) ? Number(donationAmount) : null);
                cardData.accountId = creditCard.id;
                sources.push(cardData);
                const displayAmount = (cardData.amount) ? ` (${formatCurrency(cardData.amount, language, currency)})` : ``;
                state.fromList.push(
                    `${formatMessage('giveAccounts_withoutAmountCard', {
                        displayName: cardData.displayName,
                        processor: _.capitalize(cardData.processor),
                        truncatedPaymentId: cardData.truncatedPaymentId,
                    })}${displayAmount}`,
                );
            }
        }
        if (donationMatch.value > 0) {
            const matchedData =  getDonationMatchedData(donationMatch.id, donationAmount, donationMatchData);
            if (!_.isEmpty(matchedData)) {
                sources.push(matchedData);
                const displayAmount = (giftType.value === 0 || giftType.value === null) ?
                    ` (${formatCurrency(matchedData.amount, language, currency)})` : ``;
                state.matchList = `${matchedData.displayName}${displayAmount}`;
            }
        }
        if (!_.isEmpty(activeGroupMatch)) {
            const {
                company,
                companyId,
                maxMatchAmount,
                balance,
            } = activeGroupMatch;
            const maxMatchedAmount = (Number(maxMatchAmount) <= Number(balance)) ?
                Number(maxMatchAmount) : Number(balance);
            const activeMatchedAmount = (Number(giveAmount) > maxMatchedAmount) ?
                maxMatchedAmount : Number(giveAmount);

            const groupMatchedData = {
                accountId: companyId,
                amount: activeMatchedAmount,
                displayName: company,
                type: 'company',
            };
            amountFromGroupMatch = Number(groupMatchedData.amount);
            sources.push(groupMatchedData);
            state.groupMatchedBy = `${groupMatchedData.displayName} (${formatCurrency(groupMatchedData.amount, language, currency)})`;
        }
        const buildAccounts = (item) => {
            const val = item.amount;
            if (val > 0) {
                return {
                    ...item,
                    amount: formatCurrency(
                        val,
                        language,
                        currency,
                    ),
                };
            }
            return item;
        };
        state.totalAmount = (giftType.value === 0 || giftType.value === null) ?
            formatCurrency(_.sumBy(sources, (item) => {
                return Number(item.amount);
            }), language, currency) : formatCurrency((Number(giveAmount) + coverFeesAmt),
                language, currency);
        state.sources = _.map(sources, buildAccounts);

        if (coverFees) {
            const amount = formatCurrency(coverFeesAmt, language, currency);
            state.coverFessText = (giftType.value === 0 || giftType.value === null) ?
                formatMessage('givingAllocationSingleCoverFeesText',
                    {
                        amount,
                    }) : formatMessage(givingAllocationRecurringingCoverFeesText,
                    {
                        amount,
                    });
        }

        if (giveTo) {
            const {
                value,
            } = giftType;

            if (emails) {
                // build recipients images
                _.each(emails, (email) => {
                    const recipientData = {
                        displayName: email,
                        type: 'email',
                    };
                    recipients.push(recipientData);

                    const displayAmount = (recipientData.amount) ? ` (${formatCurrency(recipientData.amount, language, currency)})` : ``;
                    state.toList.push(
                        `${recipientData.displayName}${displayAmount}`,
                    );
                });
            } else {
                const recipientData = {
                    accountId: giveTo.id,
                    amount: (value === 0 || value === null) ?
                        (Number(giveAmount) + Number(amountFromGroupMatch)) : null,
                    displayName: giveTo.name,
                    type: typeMap[giveTo.type],
                };
                recipients.push(recipientData);

                const displayAmount = (recipientData.amount) ? ` (${formatCurrency(recipientData.amount, language, currency)})` : ``;
                state.toList.push(
                    `${recipientData.displayName}${displayAmount}`,
                );
            }
            if ((value === 0) &&
                (amountToGiveFrom > 0)
                && !_.isEmpty(fromData)) {
                fromData.amount = amountToGiveFrom;
                recipients.push(fromData);
                state.toList.push(
                    `${fromData.displayName} (${formatCurrency(fromData.amount, language, currency)})`,
                );
            }
        }
        if (giftType.value === 1 || giftType.value === 15) {
            state.startsOn = setDateForRecurring(giftType.value, formatMessage, language);
        }
        state.showTaxOnRecurring = false;
        if (newCreditCardId) {
            state.showTaxOnRecurring = (
                (newCreditCardId === creditCard.value) &&
                (giftType.value !== 0 || giftType.value !== null)
            );
        }

        if (privacyShareAmount && privacyShareName) {
            privacyShareNameMessage = formatMessage('givingGroups.privacyShareGiftAndName');
        } else if (!privacyShareAmount && privacyShareName) {
            privacyShareNameMessage = formatMessage('givingGroups.privacyShareNameHideGift');
        } else if (privacyShareAmount && !privacyShareName) {
            privacyShareNameMessage = formatMessage('givingGroups.privacyShareGiftHideName');
        } else {
            privacyShareNameMessage = formatMessage('givingGroups.privacyHideGiftAndName');
        }
        state.givingGroupMessage = privacyShareNameMessage;

        if (privacyShareEmail && privacyShareAddress) {
            privacyShareEmailMessage = formatMessage('givingGroups.privacyShareEmailAndPostal');
        } else if (!privacyShareEmail && privacyShareAddress) {
            privacyShareEmailMessage = formatMessage('givingGroups.privacySharePostal');
        } else if (privacyShareEmail && !privacyShareAddress) {
            privacyShareEmailMessage = formatMessage('givingGroups.privacyShareEmail');
        } else {
            privacyShareEmailMessage = formatMessage('givingGroups.privacyHideEmailAndPostal');
        }
        state.givingOrganizerMessage = privacyShareEmailMessage;

        state.recipients = _.map(recipients, buildAccounts);
        console.log(state);
        return state;
    }
>>>>>>> integration/giving_flows
};

export {
    percentage,
    fullMonthNames,
    validateTaxReceiptProfileForm,
    callApiAndGetData,
    onWhatDayList,
    isValidGiftAmount,
    getDropDownOptionFromApiData,
    populateAccountOptions,
    populateDonationMatch,
    populateGiveToGroupsofUser,
    populatePaymentInstrument,
    populateGiftType,
    populateInfoToShare,
    formatAmount,
    getDefaultCreditCard,
    getNextAllocationMonth,
    setDateForRecurring,
    validateDonationForm,
    resetDataForGiveAmountChange,
    resetDataForAccountChange,
    resetDataForGiftTypeChange,
    setDonationAmount,
    validateGiveForm,
    populateDonationReviewPage,
    populateGiveReviewPage
};
