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
} from '../give/giving-form-validation';

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
    console.log(validity);
    return validity;
};

export {
    onWhatDayList,
    isValidGiftAmount,
    getDropDownOptionFromApiData,
    populateAccountOptions,
    populateDonationMatch,
    populatePaymentInstrument,
    formatAmount,
    getDefaultCreditCard,
    validateDonationForm,
};
