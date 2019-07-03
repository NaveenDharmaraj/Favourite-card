import _ from 'lodash';
import _concat from 'lodash/concat';
import _isEmpty from 'lodash/isEmpty';
import {
    hasMinTwoChars,
    hasMinFiveChars,
    isEmailListContainsSenderEmail,
    isLessThanNChars,
    isInputLengthLessThanOneThousand,
    isValidPositiveNumber,
    isAmountCoverGive,
    isAmountMoreOrEqualToOneDollor,
    isAmountMoreThanOneDollor,
    isAmountLessThanOneBillion,
    isInputBlank,
    isNumberOfEmailsLessThanMax,
    isValidDecimalAmount,
    isValidEmailList,
    isValidNoteData,
    isUniqueArray,
    parseEmails,
} from '../../components/helpers/giving-form-validation';
//import Money from 'client/giving/common/helpers/money';

// #region Private Helpers
/**
 * Checks if giveData contains any credit card information
 * @param {*} giveData state object for give page
 * @return {boolean} true if no credit card data is present, false otherwise.
 */
const isCreditCardBlank = (giveData) => {
    return (_isEmpty(giveData.creditCard) || giveData.creditCard.value === null);
};


// #endregion

/**
 * full Month Names for donation match policies.
 * @param {*} intl react-intl object
 * @return {Array} fullMonthNames
 */
const fullMonthNames = () => {
    //const { formatMessage } = intl;
    const fullMonths = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
    ];
    return fullMonths;
};

/**
 * short Month Names for recuuring dates for donation.
 * @param {*} intl react-intl object
 * @return {Array} shortMonthNames
 */
const shortMonthNames = (intl) => {
    const { formatMessage } = intl;
    const shortMonths = [
        formatMessage({ id: 'giving.shortMonthName.janLabel' }),
        formatMessage({ id: 'giving.shortMonthName.febLabel' }),
        formatMessage({ id: 'giving.shortMonthName.marLabel' }),
        formatMessage({ id: 'giving.shortMonthName.aprLabel' }),
        formatMessage({ id: 'giving.shortMonthName.mayLabel' }),
        formatMessage({ id: 'giving.shortMonthName.junLabel' }),
        formatMessage({ id: 'giving.shortMonthName.julLabel' }),
        formatMessage({ id: 'giving.shortMonthName.augLabel' }),
        formatMessage({ id: 'giving.shortMonthName.sepLabel' }),
        formatMessage({ id: 'giving.shortMonthName.octLabel' }),
        formatMessage({ id: 'giving.shortMonthName.novLabel' }),
        formatMessage({ id: 'giving.shortMonthName.decLabel' }),
    ];
    return shortMonths;
};

/**
* addOrUpdate of credit card and company donation match details
* @param  {Array}  array Source of credit card and company donation match details
* @param  {object}  item selected item of credit card or donation match details
* @return {Number} donation match amount
*/
const addOrUpdate = (array, item) => {
    if (!_.isEmpty(item)) {
        const i = array.findIndex((_item) => _item.type === item.type);
        if (i > -1) {
            array[i] = item;
        } else {
            array.push(item);
        }
    }
    return array;
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

/**
* set date for recurring danations
* @param  {Date}  date recurringDonation date
* @param {object} intl react-intl
* @return {string} recurring full date format
*/
const setDateForRecurring = (date) => {
    const currentDate = new Date();
    const monthNames = fullMonthNames();
    let month = currentDate.getDate() < date ?
        monthNames[currentDate.getMonth()] : monthNames[currentDate.getMonth() + 1];
    let year = currentDate.getFullYear();
    if (!month) {
        month = monthNames[0];
        year = currentDate.getFullYear() + 1;
    }
    return (`${month} ${date}, ${year}`);
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
* Set donation match policies for selected donation match
* @param  {Array}  donationMatchOptionList donation match list
* @param  {String}  selectedDonationMatch selected donation match value for i18n
* @param  {String} donationAmount for donation amount
* @param  {object} intl react-intl
* @return {Object} PersonalAccountDataList
*/
const setDonationMatchPolicies = (
    donationMatchOptionList,
    selectedDonationMatch,
    donationAmount,
    intl,
) => {
    if (selectedDonationMatch <= 0) {
        return {};
    }
    const {
        data: {
            companyName,
            policyMax,
            policyPercentage,
            policyPeriod,
            totalMatched,
            totalRequested,
        },
    } = _.find(donationMatchOptionList, { value: selectedDonationMatch });
    const months = fullMonthNames(intl);
    const currentDate = new Date();
    const donationMatchedAmount = percentage({
        donationAmount,
        policyMax,
        policyPercentage,
        totalMatched,
    });
    const donationMatchPolicy = {
        companyName,
        donationMatchedAmount,
        donationMonth: (policyPeriod === 'month') ? months[currentDate.getMonth()] : currentDate.getFullYear(),
        donationPolicyMax: `$${policyMax}`,
        policyPercentage,
        policyPeriod,
        totalDonationMatched: `$${totalMatched}`,
        totalDonationRequested: `$${totalRequested}`,
    };
    return donationMatchPolicy;
};
/**
* transform personal fund account for personal account
* @param  {Array}  fund formatMessage for i18n
* @param  {object}  intl formatMessage for i18n
* @return {Array} PersonalAccountDataList
*/
const transformPersonalAccountOptions = (fund, intl) => {
    const { formatMessage } = intl;
    let PersonalAccountDataList = [];
    if (!_.isEmpty(fund)) {
        PersonalAccountDataList = [
            {
                className: 'ddlGroup',
                disabled: true,
                text: formatMessage({ id: 'giving.personalAccountLabel' }),
                value: 1,
            },
            {
                data: {
                    fundName: fund.attributes.name,
                    fundType: 'user',
                },
                disabled: false,
                text: `${fund.attributes.name} ($${fund.attributes.balance})`,
                value: fund.id,
            },
        ];
    }
    return PersonalAccountDataList;
};
/**
* transform companies accounts list for companies Accounts
* @param  {Array}  companiesAccountsData formatMessage for i18n
* @param  {object}  intl formatMessage for i18n
* @return {Array} companiesAccountDataOptions
*/
const transformCompaniesAccountsOptions = (companiesAccountsData, intl) => {
    const { formatMessage } = intl;
    let companiesAccountDataOptions = [];
    if (companiesAccountsData.length > 0) {
        companiesAccountDataOptions = [
            {
                className: 'ddlGroup',
                disabled: true,
                text: formatMessage({ id: 'giving.companiesAccountLabel' }),
                value: 2,
            },
        ];
        companiesAccountsData.map((item) => {
            const { attributes } = item;
            return companiesAccountDataOptions.push({
                data: {
                    companyId: item.id,
                    fundName: attributes.companyFundName,
                    fundType: item.type,
                },
                text: `${attributes.companyFundName} ($${attributes.balance})`,
                value: attributes.companyFundId,
            });
        });
    }
    return companiesAccountDataOptions;
};

/**
* transform paymentInstrumentsDataList for paymentInstrumentsData
* @param  {Array}  paymentInstrumentsDataList paymentInstrumentsData
* @param  {object}  intl formatMessage for i18n
* @return {Array} PaymentInstrumentOptions
*/
const transformPaymentInstrumentOptions = (paymentInstrumentsDataList, intl) => {
    const { formatMessage } = intl;
    const options = [];
    if (!_.isEmpty(paymentInstrumentsDataList)) {
        paymentInstrumentsDataList.map((item) => {
            const { attributes } = item;
            return options.push({
                key: item.id,
                text: `${attributes.description}`,
                value: item.id,
            });
        });
        options.push({
            text: formatMessage({ id: 'giving.useNewCreditCardLable' }),
            value: 'new',
        });
    }
    return options;
};

const transformDonationMatchOptions = (donationMatchData, intl) => {
    const { formatMessage } = intl;
    let donationMatchOptions = [];
    if (!_.isEmpty(donationMatchData)) {
        donationMatchData.map((item) => {
            const { attributes } = item;
            let matchPolicy = '';
            if (attributes.policyPercentage === null || attributes.policyMax === 0) {
                matchPolicy = `${attributes.displayName} (no matching policy)`;
            } else {
                matchPolicy = `${attributes.displayName} ($${attributes.policyMax} per ${attributes.policyPeriod})`;
            }
            return donationMatchOptions.push({
                data: attributes,
                disabled: !!(attributes.policyPercentage === null || attributes.policyMax === 0),
                text: matchPolicy,
                value: item.id,
            });
        });
        donationMatchOptions.push({
            disabled: false,
            text: formatMessage({ id: 'giving.doNotMatchLabel' }),
            value: 0,
        });
        donationMatchOptions = _.sortBy(donationMatchOptions, 'disabled');
    }
    return donationMatchOptions;
};
/**
 *  set Source colletions of card details and donaton match details for donation review view
 *  @param {object} allocation for getting fundaccount and fundAccountType
 *  @param {object} currentUser for getting current user data
 *@return {Array} sources
    */
const setSourceList = (allocation, currentUser) => {
    let {
        sources,
    } = allocation;
    const {
        accountsDataOptions,
        addingTo,
        donationData,
        donationMatchPolicy,
        paymentInstrumentsOptions,
        selectedCreditCard,
        selectedDonationMatch,
    } = allocation;
    const {
        fund,
    } = currentUser;

    if (!_.isEmpty(selectedCreditCard) && selectedCreditCard !== 'new') {
        const selectedIndex = paymentInstrumentsOptions.findIndex(
            (_item) => _item.value === selectedCreditCard,
        );
        const selectedCardName = _.split(paymentInstrumentsOptions[selectedIndex].text, ' ');
        sources = addOrUpdate(sources, {
            amount: donationData.attributes.amount,
            displayName: _.replace(selectedCardName[0], '\'s', ''),
            processor: selectedCardName[selectedCardName.indexOf('ending') - 1].toLowerCase().trim(),
            truncatedPaymentId: selectedCardName[selectedCardName.length - 1],
            type: 'card',
        });
    } else {
        sources = addOrUpdate(sources, {
            // @todo GIVEB-1416 warning that the prop displayName is required but does not exist
            amount: donationData.attributes.amount,
            type: 'card',
        });
    }
    if ((!_.isEmpty(selectedDonationMatch) && addingTo === fund.id) || (
        !_.isEmpty(selectedDonationMatch) && accountsDataOptions.length === 0)) {
        sources = addOrUpdate(sources, {
            amount: donationMatchPolicy.donationMatchedAmount,
            displayName: donationMatchPolicy.companyName,
            type: 'company',
        });
    } else {
        sources = _.reject(sources, { type: 'company' });
    }
    return sources;
};
/**
*  set Donors Account for donation review view
* @param {string} fundAccountType fundAccountType
* @param {string} fundAccountName fundAccountName
* @return {Array} donorsAccount
*/
const setDonorsAccount = (fundAccountType, fundAccountName) => {
    const donorsAccount = [];
    donorsAccount.push({
        accountId: '',
        displayName: fundAccountName,
        type: fundAccountType === 'companies' ? 'company' : fundAccountType,
    });
    return donorsAccount;
};


/**
* onWhatDayList array list
* @param  {object}  intl formatMessage for i18n
* @return {Array} recurringDayList
*/
const onWhatDayList = (intl) => {
    const { formatMessage } = intl;
    const recurringDayList = [
        {
            key: '1',
            text: formatMessage({ id: 'giving.recurringMonthlyFirstLabel' }),
            value: '1',
        },
        {
            key: '15',
            text: formatMessage({ id: 'giving.recurringMonthlyFifteenLabel' }),
            value: '15',
        },
    ];
    return recurringDayList;
};
/**
*  Valid Gift Amount
* @param {object} validity validation methods for amount field
* @return {void}
*/
const isValidGiftAmount = (validity) => {
    const giftAmountValidity = _.pick(validity, [
        'doesAmountExist',
        'isAmountLessThanOneBillion',
        'isAmountMoreThanOneDollor',
        'isValidPositiveNumber',
    ]);

    return _.every(giftAmountValidity);
};

/**
 * Determine whether the supplied field is valid.
 * @param  {String} field The add money form field name
 * @param  {any} value    The field's value
 * @param  {object} validity  The validaty object contains properties of addMoney form validations
 * @return {object}  validity Return the validity object.
 */
const validateAddMoneyForm = (field, value, validity) => {
    switch (field) {
        case 'amount':
            validity.doesAmountExist = !isInputBlank(value);
            validity.isAmountLessThanOneBillion = isAmountLessThanOneBillion(value);
            validity.isAmountMoreThanOneDollor = isAmountMoreThanOneDollor(value);
            validity.isValidPositiveNumber = isValidPositiveNumber(value);
            break;
        case 'reason':
            validity.isNoteToSelfInLimit = isInputLengthLessThanOneThousand(value);
            validity.isValidNoteSelfText = isValidNoteData(value);
            validity.isNoteToSelfValid = _.every(
                _.pick(validity, [
                    'isNoteToSelfInLimit',
                    'isValidNoteSelfText',
                ]),
            );
            break;
        case 'addingTo':
            validity.isValidAddingToSource = !isInputBlank(value);
            break;
        default: break;
    }
    return validity;
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
* Prepare dropdown options list from API dat
* @param  {object} data API data
* @param getValue function to call for getting the value
* @param textFormat function to call for getting the text
* @param isDisabled function to call for getting disabled flag
* @param {object[]} field list to be added to the option
* @return {object[]} drop down options array
*/

const getDropDownOptionFromApiData =
    (data, getValue, textFormat, isDisabled, extraField) => {
        const options = [];
        data.map((item) => {
            const { attributes } = item;
            const eachOption = {
                disabled: isDisabled(attributes),
                id: item.id,
                text: textFormat(attributes),
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
* @param {function} formatMessage  for getting intl text
* @param {string} giveToId giveTo Id
* @param {string} allocationType Type of allocation
* @return {object[]} drop down options array
*/
const populateAccountOptions = (data, formatMessage, giveToId = null, allocationType = null, isGiveFromGroupUrl = false) => {
    const {
        companiesAccountsData,
        firstName,
        fund,
        id,
        lastName,
        userCampaigns,
        userGroups,
    } = data;
    if ((!_isEmpty(companiesAccountsData)
    || !_isEmpty(userCampaigns)
    || !_isEmpty(userGroups))
    ) {
        const personalAccount = [
            {
                className: 'ddlGroup',
                disabled: true,
                text: formatMessage({ id: 'giving.personalAccountLabel' }),
                value: 'user',
            },
            {
                balance: fund.attributes.balance,
                data: {
                    fundName: fund.attributes.name,
                    fundType: 'user',
                },
                disabled: false,
                id,
                name: `${firstName} ${lastName}`,
                text: `${fund.attributes.name} ($${fund.attributes.balance})`,
                type: 'user',
                value: fund.id,
            },
        ];
        const companiesAccountLabel = [
            {
                className: 'ddlGroup',
                disabled: true,
                text: formatMessage({ id: 'giving.companiesAccountLabel' }),
                value: 'company',
            },
        ];
        const groupAccountLabel = [
            {
                className: 'ddlGroup',
                disabled: true,
                text: 'Group',
                value: 'group',
            },
        ];
        const campaignAccountLabel = [
            {
                className: 'ddlGroup',
                disabled: true,
                text: 'Campaign',
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
                    (item) => item.attributes.fundId,
                    (attributes) => `${attributes.fundName} ($${attributes.balance})`,
                    (attributes) => false,
                    [
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
                    (item) => item.attributes.fundId,
                    (attributes) => `${attributes.fundName} ($${attributes.balance})`,
                    (attributes) => false,
                    [
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
                    (item) => item.attributes.companyFundId,
                    (attributes) => `${attributes.companyFundName} ($${attributes.balance})`,
                    (attributes) => false,
                    [
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

/**
* Populate donation match drop down options
* @param  {object} donationMatchData API data
* @param {object} intl function for getting intl text
* @return {object[]} drop down options array
*/

const populateDonationMatch = (donationMatchData, intl) => {
    const { formatMessage } = intl;
    if (!_isEmpty(donationMatchData)) {
        const noDonationMatch = {
            disabled: false,
            text: formatMessage({ id: 'giving.doNotMatchLabel' }),
            type: '',
            value: 0,
        };
        return (
            _.sortBy(
                _concat(
                    getDropDownOptionFromApiData(
                        donationMatchData,
                        (item) => item.attributes.employeeRoleId,
                        (attributes) => {
                            if (attributes.policyPercentage === null
                                || attributes.policyMax === 0) {
                                return `${attributes.displayName} (no matching policy)`;
                            }
                            return `${attributes.displayName} ($${attributes.policyMax} per ${attributes.policyPeriod})`;
                        },
                        (attributes) =>
                            !!(attributes.policyPercentage === null || attributes.policyMax === 0),
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
* Populate payment instrument drop down options
* @param  {object} paymentInstrumentsData API data
* @param {object} intl for getting intl text
* @return {object[]} drop down options array
*/

const populatePaymentInstrument = (paymentInstrumentsData, intl) => {
    if (!_isEmpty(paymentInstrumentsData)) {
        const { formatMessage } = intl;
        const newCreditCard = [
            {
                disabled: false,
                text: formatMessage({ id: 'giving.useNewCreditCardLable' }),
                value: 0,
            },
        ];
        return _concat(
            getDropDownOptionFromApiData(
                paymentInstrumentsData,
                (item) => item.id,
                (attributes) => `${attributes.description}`,
                (attributes) => false,
            ),
            newCreditCard,
        );
    }
    return null;
};

const populateGiveToGroupsofUser = (giveToGroupsData) => {
    if (!_isEmpty(giveToGroupsData)) {
        return (
            getDropDownOptionFromApiData(
                giveToGroupsData.benificiaryDetails,
                (item) => item.attributes.fundId,
                (attributes) => `${attributes.name}`,
                (attributes) => false,
            )
        );
    }
    return null;
};

const populateGroupsOfUser = (giveToGroupsData) => {
    if (!_isEmpty(giveToGroupsData)) {
        return (
            getDropDownOptionFromApiData(
                giveToGroupsData.userGroups,
                (item) => item.attributes.fundId,
                (attributes) => `${attributes.name}`,
                (attributes) => false,
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

const populateGiftType = (intl) => {
    const { formatMessage } = intl;
    return [
        {
            disabled: false,
            text: formatMessage({ id: 'giving.giftTypeSingle' }),
            value: 0,
        },
        {
            disabled: false,
            text: formatMessage({ id: 'giving.giftTypeRecurring1' }),
            value: 1,
        },
        {
            disabled: false,
            text: formatMessage({ id: 'giving.giftTypeRecurring15' }),
            value: 15,
        },
    ];
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
    companyDetails, intl, giveFrom, userDetails) => {
    const { formatMessage } = intl;
    let infoToShareList = null;
    switch (giveFrom.type) {
        case 'user':
            const {
                displayName,
                email,
            } = userDetails;
            const userTaxProfileData = !_isEmpty(taxReceiptProfile) ?
                getDropDownOptionFromApiData(taxReceiptProfile, (item) => `name_address_email|${item.id}`,
                    (attributes) => `${attributes.fullName}, ${attributes.addressOne}, ${attributes.city}, ${attributes.province}, ${attributes.postalCode}`,
                    (attributes) => false) : null;
            infoToShareList = [
                {
                    disabled: false,
                    text: formatMessage({ id: 'giving.infoToShareAnonymous' }),
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
            const companyTaxProfileData = (!_isEmpty(companyDetails) &&
                !_isEmpty(companyDetails.taxReceiptProfileData)) ?
                getDropDownOptionFromApiData(
                    companyDetails.taxReceiptProfileData,
                    (item) => `name_address_email|${item.id}`,
                    (attributes) => `${attributes.fullName}, ${attributes.addressOne}, ${attributes.city}, ${attributes.province}, ${attributes.postalCode}`,
                    (attributes) => false,
                ) : null;
            infoToShareList = [
                {
                    disabled: false,
                    text: formatMessage({ id: 'giving.infoToShareAnonymous' }),
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
                    text: formatMessage({ id: 'giving.infoToShareAnonymous' }),
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
* Get default credit card
* @param {object[]} paymentInstrumentList payment instrument list
* @return {object} selected credit card option
*/

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
* Set donation amount
* @param {object} giveData state object for give page
* @return {object} selected credit card option
*/

const setDonationAmount = (giveData, coverFeesData) => {
    let donationAmount = '';
    const coverFeesGreaterThan0 = (!_isEmpty(coverFeesData) &&
        !_isEmpty(coverFeesData.coverFees) &&
        Number(coverFeesData.coverFees.giveAmountFees) > 0
    );
    const giveAmount = (giveData.coverFees && coverFeesGreaterThan0) ?
        (Number(giveData.giveAmount) + Number(coverFeesData.coverFees.giveAmountFees)) :
        Number(giveData.giveAmount);
    if (Number(giveAmount) > Number(giveData.giveFrom.balance) &&
        giveData.giftType.value === 0
    ) {
        donationAmount =
            (formatAmount(giveData.giveAmount) - formatAmount(giveData.giveFrom.balance));
        donationAmount = formatAmount(donationAmount);
        if (Number(donationAmount) < 5) {
            donationAmount = 5;
        }
    }
    return donationAmount;
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
            paymentInstrumentsData,
            taxReceiptProfile,
        },
        intl,
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
        if (!_isEmpty(companyDetails) &&
            companyDetails.companyId === Number(giveData.giveFrom.id)) {
            dropDownOptions.paymentInstrumentList = populatePaymentInstrument(
                (!_isEmpty(companyDetails) &&
                !_isEmpty(companyDetails.companyPaymentInstrumentsData)) ?
                    companyDetails.companyPaymentInstrumentsData : null,
                props.intl,
            );
            if ((giveData.giftType.value > 0 ||
                Number(giveData.giveAmount) > Number(giveData.giveFrom.balance))) {
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
        if (!_isEmpty(dropDownOptions.donationMatchList) &&
            (giveData.giftType.value > 0 ||
                Number(giveData.giveAmount) > Number(giveData.giveFrom.balance))
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
        if ((giveData.giftType.value > 0 ||
            Number(giveData.giveAmount) > Number(giveData.giveFrom.balance))) {
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
            intl,
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
};

/**
* Reset give page data for give amount change
* @param {object} giveData state object for give page
* @param {object} dropDownOptions full drop down options for give page
* @return {object} selected credit card option
*/

const resetDataForGiveAmountChange = (giveData, dropDownOptions, coverFeesData) => {
    giveData.coverFees = false;
    if ((giveData.giveFrom.type === 'user' || giveData.giveFrom.type === 'companies') &&
    giveData.giftType.value === 0) {
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
        if (giveData.giveFrom.type === 'user' &&
            !_isEmpty(dropDownOptions.donationMatchList) &&
            (_isEmpty(giveData.donationMatch) ||
                giveData.donationMatch.value === null) &&
                giveData.donationAmount > 0
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

// #region P2P Util Methods

/**
* Set donation amount we need to give in order to give the total P2P give amount.
* @param {object} giveData state object for give page
* @return {object} selected credit card option
*/
const setP2pDonationAmount = (giveData) => {
    let donationAmount = '';

    if (Number(giveData.totalP2pGiveAmount) > Number(giveData.giveFrom.balance)) {
        donationAmount = (formatAmount(giveData.totalP2pGiveAmount) -
            formatAmount(giveData.giveFrom.balance));

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
    giveData.totalP2pGiveAmount = Money.calculateP2pTotalGiveAmount(
        parseEmails(giveData.recipients).length,
        giveData.giveAmount,
    );

    if ((giveData.giveFrom.type !== 'user' && giveData.giveFrom.type !== 'companies')) {
        return giveData;
    }

    giveData.donationAmount = setP2pDonationAmount(giveData);

    if (Number(giveData.donationAmount) > 0 && isCreditCardBlank(giveData)) {
        giveData.creditCard = getDefaultCreditCard(
            dropDownOptions.paymentInstrumentList,
        );
    } else if (giveData.donationAmount === '') {
        giveData.creditCard = {
            value: null,
        };
    }

    if (giveData.giveFrom.type === 'user' &&
        !_isEmpty(dropDownOptions.donationMatchList) &&
        (_isEmpty(giveData.donationMatch) ||
            giveData.donationMatch.value === null) &&
            giveData.donationAmount > 0
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

// #endregion

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
const validateGiveForm =
    (field, value, validity, giveData, coverFeesAmount, senderEmail = null) => {
        const giveAmount = giveData.totalP2pGiveAmount ?
            giveData.totalP2pGiveAmount :
            giveData.giveAmount;

        switch (field) {
            case 'giveAmount':
                validity.doesAmountExist = !isInputBlank(value);
                validity.isAmountLessThanOneBillion = (giveData.giftType.value > 0) ?
                    isAmountLessThanOneBillion(value) : true;
                validity.isAmountMoreThanOneDollor = (giveData.giveTo.type === 'beneficiaries') ?
                    isAmountMoreThanOneDollor(value) : isAmountMoreOrEqualToOneDollor(value);
                validity.isValidPositiveNumber = isValidPositiveNumber(value);
                validity.isAmountCoverGive = (giveData.giveFrom.type === 'groups' ||
                    giveData.giveFrom.type === 'campaigns') ?
                    isAmountCoverGive(
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
                    Number(giveAmount) > Number(giveData.giveFrom.balance) ||
                    (giveData.coverFees &&
                        (Number(giveAmount) + Number(coverFeesAmount)) >
                        Number(giveData.giveFrom.balance))
                );
                const eligibleForTopup = ((giveData.giveFrom.type === 'user' || giveData.giveFrom.type === 'companies') &&
                    giveData.giftType.value === 0 && isDonationAmountApplicable
                );
                validity.isDonationAmountBlank = (eligibleForTopup) ? !isInputBlank(value) : true;
                validity.isDonationAmountLessThan1Billion = (eligibleForTopup) ?
                    isAmountLessThanOneBillion(value) : true;
                validity.isDonationAmountMoreThan1Dollor = (eligibleForTopup) ?
                    isAmountMoreThanOneDollor(value) : true;
                validity.isDonationAmountPositive = (eligibleForTopup) ?
                    isValidPositiveNumber(value) : true;
                validity.isDonationAmountCoverGive = (eligibleForTopup) ?
                    isAmountCoverGive(
                        value,
                        giveData.coverFees,
                        coverFeesAmount, giveAmount, giveData.giveFrom.balance,
                    ) : true;
                validity.isValidDecimalDonationAmount = (eligibleForTopup) ?
                    isValidDecimalAmount(value) : true;
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
* Setup the display parameters for review page
* @param {object} giveData state object for give page
* @param {object[]} data with all details like tax, payment,donationmatch etc
* @param {object} intl format message and format number
* @return {string} currency
*/

const populateReviewPage = (giveData, data, intl, currency) => {
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

    const {
        formatMessage,
        formatNumber,
    } = intl;
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
    const currencyFormatting = {
        currency,
        style: 'currency',
    };
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

            const displayAmount = (amt) ? ` (${formatNumber(amt, currencyFormatting)})` : ``;
            state.fromList.push(
                `${fromData.displayName}${displayAmount}`,
            );
        }
        if (creditCard.value > 0) {
            const creditCardData = _.find(data[paymentMap[giveFrom.type]],
                { id: creditCard.id });
            if (!_.isEmpty(creditCardData)) {
                const splitedCardName = _.split(creditCardData.attributes.description, ' ');
                const cardData = {
                    accountId: creditCard.id,
                    amount: (donationAmount) ? Number(donationAmount) : null,
                    displayName: _.replace(splitedCardName[0], '\'s', ''),
                    processor: _.capitalize(splitedCardName[splitedCardName.indexOf('ending') - 1].toLowerCase().trim()),
                    truncatedPaymentId: splitedCardName[splitedCardName.length - 1],
                    type: 'card',
                };
                sources.push(cardData);
                const displayAmount = (cardData.amount) ? ` (${formatNumber(cardData.amount, currencyFormatting)})` : ``;
                state.fromList.push(
                    `${cardData.displayName}'s ${cardData.processor} ending with ${cardData.truncatedPaymentId}${displayAmount}`,
                );
            }
        }
        if (donationMatch.value > 0) {
            const donationMatchedData = _.find(data.donationMatchData, (item) => {
                return item.attributes.employeeRoleId == donationMatch.id;
            });
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
                sources.push(matchedData);
                const displayAmount = (giftType.value === 0 || giftType.value === null) ?
                    ` (${formatNumber(matchedData.amount, currencyFormatting)})` : ``;
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
            state.groupMatchedBy = `${groupMatchedData.displayName} (${formatNumber(groupMatchedData.amount, currencyFormatting)})`;
        }
        const buildAccounts = (item) => {
            const val = item.amount;
            if (val > 0) {
                return {
                    ...item,
                    amount: formatNumber(
                        val,
                        currencyFormatting,
                    ),
                };
            }
            return item;
        };
        state.totalAmount = (giftType.value === 0 || giftType.value === null) ?
            formatNumber(_.sumBy(sources, (item) => {
                return Number(item.amount);
            }), currencyFormatting) : formatNumber((Number(giveAmount) + coverFeesAmt),
                currencyFormatting);
        state.sources = _.map(sources, buildAccounts);

        if (coverFees) {
            const amount = formatNumber(coverFeesAmt, currencyFormatting);
            state.coverFessText = (giftType.value === 0 || giftType.value === null) ?
                formatMessage({ id: 'giving.allocation.review.singleCoverFeesText' },
                    {
                        amount,
                    }) : formatMessage({ id: 'giving.allocation.review.recurringingCoverFeesText' },
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

                    const displayAmount = (recipientData.amount) ? ` (${formatNumber(recipientData.amount, currencyFormatting)})` : ``;
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

                const displayAmount = (recipientData.amount) ? ` (${formatNumber(recipientData.amount, currencyFormatting)})` : ``;
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
                    `${fromData.displayName} (${formatNumber(fromData.amount, currencyFormatting)})`,
                );
            }
        }
        if (giftType.value === 1 || giftType.value === 15) {
            state.startsOn = setDateForRecurring(giftType.value, intl);
        }
        state.showTaxOnRecurring = false;
        if (newCreditCardId) {
            state.showTaxOnRecurring = (
                (newCreditCardId === creditCard.value) &&
                (giftType.value !== 0 || giftType.value !== null)
            );
        }

        if (privacyShareAmount && privacyShareName) {
            privacyShareNameMessage = formatMessage({ id: 'giving.groups.privacyShareGeneralMessage' },
                {
                    privacyContent: 'gift amount and name',
                    shareHide: 'Share',
                });
        } else if (!privacyShareAmount && privacyShareName) {
            privacyShareNameMessage = formatMessage({ id: 'giving.groups.privacyShareGeneralMessage' },
                {
                    privacyContent: 'name but hide my gift amount',
                    shareHide: 'Share',
                });
        } else if (privacyShareAmount && !privacyShareName) {
            privacyShareNameMessage = formatMessage({ id: 'giving.groups.privacyShareGeneralMessage' },
                {
                    privacyContent: 'gift amount but hide my name',
                    shareHide: 'Share',
                });
        } else {
            privacyShareNameMessage = formatMessage({ id: 'giving.groups.privacyShareGeneralMessage' },
                {
                    privacyContent: 'name and gift amount',
                    shareHide: 'Hide',
                });
        }
        state.givingGroupMessage = privacyShareNameMessage;


        if (privacyShareEmail && privacyShareAddress) {
            privacyShareEmailMessage = formatMessage({ id: 'giving.groups.privacyShareGeneralMessage' },
                {
                    privacyContent: 'email and postal address',
                    shareHide: 'Share',
                });
        } else if (!privacyShareEmail && privacyShareAddress) {
            privacyShareEmailMessage = formatMessage({ id: 'giving.groups.privacyShareGeneralMessage' },
                {
                    privacyContent: 'postal address',
                    shareHide: 'Share',
                });
        } else if (privacyShareEmail && !privacyShareAddress) {
            privacyShareEmailMessage = formatMessage({ id: 'giving.groups.privacyShareGeneralMessage' },
                {
                    privacyContent: 'email',
                    shareHide: 'Share',
                });
        } else {
            privacyShareEmailMessage = formatMessage({ id: 'giving.groups.privacyShareGeneralMessage' },
                {
                    privacyContent: 'email and postal address',
                    shareHide: 'Hide',
                });
        }
        state.givingOrganizerMessage = privacyShareEmailMessage;

        state.recipients = _.map(recipients, buildAccounts);
        return state;
    }
};

export {
    fullMonthNames,
    shortMonthNames,
    addOrUpdate,
    percentage,
    setDateForRecurring,
    getFirstThirdTuesday,
    getNextAllocationMonth,
    setDonationMatchPolicies,
    transformPersonalAccountOptions,
    transformCompaniesAccountsOptions,
    transformPaymentInstrumentOptions,
    transformDonationMatchOptions,
    setSourceList,
    setDonorsAccount,
    onWhatDayList,
    isValidGiftAmount,
    validateAddMoneyForm,
    validateTaxReceiptProfileForm,
    getDropDownOptionFromApiData,
    populateAccountOptions,
    populateDonationMatch,
    populatePaymentInstrument,
    populateGiveToGroupsofUser,
    populateGroupsOfUser,
    populateGiftType,
    populateInfoToShare,
    getDefaultCreditCard,
    formatAmount,
    setDonationAmount,
    resetDataForAccountChange,
    resetDataForGiftTypeChange,
    resetDataForGiveAmountChange,
    resetP2pDataForOnInputChange,
    validateGiveForm,
    populateReviewPage,
};
