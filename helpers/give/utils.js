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
    
} from '../give/giving-form-validation';
import coreApi from '../../services/coreApi';


/**
 * Checks if giveData contains any credit card information
 * @param {*} giveData state object for give page
 * @return {boolean} true if no credit card data is present, false otherwise.
 */
const isCreditCardBlank = (giveData) => {
    return (_isEmpty(giveData.creditCard) || giveData.creditCard.value === null);
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

const getAllPaginationData = async (url, params = null) => {
    // Right now taking the only relative url from the absolute url.
    const replacedUrl = _split(url, '/api/v2').pop();
    const result = await coreApi.get(replacedUrl, params);
    const dataArray = result.data;
    if (result.links.next) {
        return dataArray.concat(await getAllPaginationData(result.links.next, params));
    }
    return dataArray;
};


const callApiAndGetData = (url, params) => getAllPaginationData(url, params).then(
    (result) => {
        const allData = [];
        if (result && !_isEmpty(result)) {
            result.map((item) => {
                const {
                    attributes,
                    id,
                    type,
                } = item;
                allData.push({
                    attributes,
                    id,
                    type,
                });
            });
        }
        return allData;
    },
);

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
};

export {
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
    validateDonationForm,
    resetDataForGiveAmountChange,
    resetDataForAccountChange,
    resetDataForGiftTypeChange,
    setDonationAmount,
    validateGiveForm,
};
