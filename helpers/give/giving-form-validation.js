// Helper functions for giving flow form validations

import _ from 'lodash';

// Regural expression to verify a valid email address
const emailRgx = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


export const parseEmails = (emails) => {
    const result = _.replace(emails, /\s/g, '');

    return result.length > 0
        ? _.filter(
            _.split(
                result,
                ',',
            ),
            (email) => (
                email.length > 0
            ),
        )
        : [];
};

// Check if a single email address is valid
export const isValidEmail = (email) => {
    return emailRgx.test(String(email).trim());
};

// Check if the input is a list of valid email adress separated by comma
export const isValidEmailList = (input) => {
    const emails = parseEmails(input);
    if (emails.length === 0) {
        return false;
    }

    return _.every(parseEmails(input), isValidEmail);
};

/**
 * Determine if array contains duplicates
 * @param {array} input an array of values
 * @return {boolean} true if array contains not duplicates, false, otherwise
 */
export const isUniqueArray = (input) => {
    const arr = parseEmails(input);
    return _.uniq(arr).length === arr.length;
};

export const isNumberOfEmailsLessThanMax = (input, max) => {
    const emails = parseEmails(input);
    return (emails.length <= max);
};

/**
 * Determine if array contains duplicates
 * @param {array} input an array of values
 * @param {string} senderEmail an array of values
 * @return {boolean} true if array contains duplicates, false, otherwise
 */
export const isEmailListContainsSenderEmail = (input, senderEmail) => {
    return _.isEmpty(_.intersection(input, senderEmail));
};

// Check if the input length is less than 1000
export const isInputLengthLessThanOneThousand = (input) => {
    return input.length <= 1000;
};

// Check if input is a valid positive number
export const isValidPositiveNumber = (number) => {
    return number > 0 && !isNaN(number);
};

// Check if input is at least 5 dollar.
// Ignore the error if it is not a valid positive number
export const isAmountMoreThanOneDollor = (number) => {
    return isValidPositiveNumber(number) ? number >= 5 : true;
};

// Check if input is at least 1 dollar.
// Ignore the error if it is not a valid positive number
export const isAmountMoreOrEqualToOneDollor = (number) => {
    return isValidPositiveNumber(number) ? number >= 1 : true;
};

// Check if input is less than 1000000
// Ignore the error if it is not a valid positive number
export const isAmountLessThanOneBillion = (number) => {
    return isValidPositiveNumber(number) ? number <= 9999 : true;
};
// Check if input is less than 10000000
// Ignore the error if it is not a valid positive number
export const isAmountLessThanOneBillionDollars = (number) => {
    return isValidPositiveNumber(number) ? number <= 10000000 : true;
};
// Check if input is blank
export const isInputBlank = (input) => {
    return (input === '' || input === null);
};

// Check if input has at least two chars
export const hasMinTwoChars = (input) => {
    return input.length >= 2;
};

// Check if input has at least five chars
export const hasMinFiveChars = (input) => {
    return input.length >= 5;
};

// Check if input has at n digits, n as no of digits
export const hasNDigits = (input, n) => {
    return input.length === n;
};

// Check if the input is less than n characters, n as no of chars
export const isLessThanNChars = (input, n) => {
    return input.length <= n;
};

export const isAmountCoverGive = (amount, coverFees, coverFeesAmount, giveAmount, balance) => {
    const totalAmount = (coverFees)
        ? (Number(giveAmount) + Number(coverFeesAmount)) : Number(giveAmount);
    return (Number(amount) + Number(balance)) >= Number(totalAmount);
};

// Check if the amount is valid
export const isValidDecimalAmount = (amount) => {
    const amountRegex = /^\d+(\.\d{1,2})?$/;
    return amountRegex.test(_.replace(amount, /\s/g, ''));
};

export const isValidNoteData = (input) => {
    const textTegex = /^[^\\<>]*$/;
    return textTegex.test(input);
};
