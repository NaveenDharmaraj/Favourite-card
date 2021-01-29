/* eslint-disable max-len */
import _ from 'lodash';
import ReactHtmlParser from 'react-html-parser';

import {
    isValidPositiveNumber,
    isAmountLessThanOneBillionDollars,
    isAmountMoreOrEqualToOneDollor,
    isInputBlank,
} from '../give/giving-form-validation';
import { isFalsy } from '../utils';
import { addToDataLayer } from './googleTagManager';

const hasLowerCase = (str) => {
    return (/[a-z]/.test(str));
};

const hasUpperCase = (str) => {
    return (/[A-Z]/.test(str));
};

const hasSpecialChar = (str) => {
    return (/[!@#$%^*&]/.test(str));
};

const hasLengthLessthan30 = (str) => {
    return (str && str.length <= 30);
};

const hasLengthLessthan100 = (str) => {
    return (str && str.length <= 100);
};

const hasTwoChar = (value) => {
    return (value && value.length >= 2);
};

const validateUserRegistrationForm = (field, untrimmedValue, validity) => {
    const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i);
    let value;
    if (untrimmedValue) {
        value = untrimmedValue.trim();
    }

    switch (field) {
        case 'firstName':
            validity.isFirstNameNotNull = !(!value || value.length === 0);
            validity.doesFirstNameHave2 = hasTwoChar(value);
            validity.isFirstnameLengthInLimit = hasLengthLessthan30(value);
            validity.isFirstNameValid = _.every(
                _.pick(validity, [
                    'isFirstNameNotNull',
                    'isFirstnameLengthInLimit',
                    'doesFirstNameHave2',
                ]),
            );
            break;
        case 'lastName':
            validity.isLastNameNotNull = !(!value || value.length === 0);
            validity.isLastnameLengthInLimit = hasLengthLessthan30(value);
            validity.isLastNameValid = _.every(
                _.pick(validity, [
                    'isLastNameNotNull',
                    'isLastnameLengthInLimit',
                ]),
            );
            break;
        case 'emailId':
            const emailValue = value;
            validity.isEmailIdNotNull = !(!value || value.length === 0);
            validity.isEmailLengthInLimit = hasLengthLessthan100(value);
            validity.isEmailValidFormat = !_.isEmpty(emailValue) ? (emailRegex).test(emailValue) : true;
            validity.isEmailIdValid = _.every(
                _.pick(validity, [
                    'isEmailIdNotNull',
                    'isEmailValidFormat',
                    'isEmailLengthInLimit',
                ]),
            );
            break;
        case 'password':
            // validity.isPasswordNotNull = !(!value || value.length === 0);
            validity.doesPwdHaveCount = !_.isEmpty(value) ? (value.length >= 8) : false;
            validity.isPasswordNull = !_.isEmpty(value);
            validity.doesPwdhaveLowerCase = !_.isEmpty(value) ? hasLowerCase(value) : false;
            validity.doesPwdhaveUpperCase = !_.isEmpty(value) ? hasUpperCase(value) : false;
            validity.doesPwdhaveSpecialChars = !_.isEmpty(value) ? hasSpecialChar(value) : false;
            validity.isPasswordLengthInLimit = hasLengthLessthan30(value);
            validity.isPasswordValid = _.every(
                _.pick(validity, [
                    // 'isPasswordNotNull',
                    'doesPwdHaveCount',
                    'doesPwdhaveLowerCase',
                    'doesPwdhaveUpperCase',
                    'doesPwdhaveSpecialChars',
                    'isPasswordLengthInLimit',
                ]),
            );
            break;
        default:
            break;
    }
    return validity;
};
const validateGivingGoal = (givingGoal, validity) => {
    //validity.doesAmountExist = !isInputBlank(givingGoal);
    validity.isAmountLessThanOneBillion = (givingGoal > 0)
        ? isAmountLessThanOneBillionDollars(givingGoal) : true;
    //validity.isAmountMoreThanOneDollor = isAmountMoreOrEqualToOneDollor(givingGoal);
    validity.isValidPositiveNumber = isValidPositiveNumber(givingGoal);

    validity.isValidGiveAmount = _.every(
        _.pick(validity, [
            //'doesAmountExist',
            'isAmountLessThanOneBillion',
            //'isAmountMoreThanOneDollor',
            'isValidPositiveNumber',
        ]),
    );
    return validity;
};
const populateDropdownInfoToShare = (infoShareOptions = [], preferences = {}, name = '') => {
    const infoToShare = {
        defaultValue: 'anonymous',
        infoToShareList: [],
    };
    infoShareOptions.map((info) => {
        switch (info.privacySetting) {
            case 'anonymous':
                infoToShare.infoToShareList.push({
                    key: `${info.privacySetting}`,
                    privacyData: null,
                    privacySetting: `${info.privacySetting}`,
                    text: ReactHtmlParser(`<div class="attributes">Give anonymously</div>`),
                    value: `${info.privacySetting}`,
                });
                if (preferences[name] === info.privacySetting) {
                    infoToShare.defaultValue = info.privacySetting;
                }
                break;
            case 'name':
                infoToShare.infoToShareList.push({
                    key: `${info.privacySetting}`,
                    privacyData: null,
                    privacySetting: `${info.privacySetting}`,
                    text: ReactHtmlParser(`<div class="attributes">${info.name}</div>`),
                    value: `${info.privacySetting}`,
                });
                if (preferences[name] === info.privacySetting) {
                    infoToShare.defaultValue = `${info.privacySetting}`;
                }
                break;
            case 'name_email':
                infoToShare.infoToShareList.push({
                    key: `${info.privacySetting}`,
                    privacyData: null,
                    privacySetting: `${info.privacySetting}`,
                    text: ReactHtmlParser(`<div class="attributes">${info.name}</div>
                    <div class="attributes">${info.email}</div>`),
                    value: `${info.privacySetting}`,
                });
                if (preferences[name] === info.privacySetting) {
                    infoToShare.defaultValue = `${info.privacySetting}`;
                }
                break;
            case 'name_address_email':
                infoToShare.infoToShareList.push({
                    key: `${info.privacySetting}-${info.privacyData}`,
                    privacyData: `${info.privacyData}`,
                    privacySetting: `${info.privacySetting}`,
                    text: ReactHtmlParser(`<div class="attributes">${info.name}</div>
                    <div class="attributes">${info.email}</div>
                    <div class="attributes"> ${info.address_one} ${!isFalsy(info.address_two) ? info.address_two : ''} </div>
                    <div class="attributes">${info.city}, ${info.province} ${info.country} ${info.postal_code}</div>`),
                    value: `${info.privacySetting}-${info.privacyData}`,
                });
                if (preferences[`${name}_address`] === info.privacyData) {
                    infoToShare.defaultValue = `${info.privacySetting}-${info.privacyData}`;
                }
                break;
            default:
                break;
        }
    });
    // if the condition is getting satisfied removing the anonymous from list and adding at the last
    if (name === 'giving_group_admins_info_to_share' && preferences.giving_group_members_info_to_share === 'name' && infoToShare.infoToShareList.length > 1) {
        infoToShare.infoToShareList.splice(0, 1);
        infoToShare.infoToShareList.push({
            disabled: true,
            text: ReactHtmlParser(`<div class="attributes">Give anonymously (group members can see your name, so admins can too)</div>`),
        });
    }

    return infoToShare;
};

/**
   * create a gtm events based on step index
   * Step index 0  firstname and last name
   * Step index 1 email paswword
   * Step index 2 causes selection
   * Step index 3 create impact account
   * @param {number} stepIndex tells the step on each continue click in sign up page.
   * @param {string} buttonClicked tells which button clicked continue or back.
   * @param {string[]} userCauses causes selected by user
   * @return {void} create a gtm events based on step index.
   */
const addGtmEventsSignUp = (stepIndex, buttonClicked, userCauses = []) => {
    const tagManagerArgs = {
        dataLayer: {},
        dataLayerName: 'dataLayer',
    };
    const parentRoute = '/users/new';
    const parentEvent = 'ci_users_new';
    if (buttonClicked === 'Continue') {
        if (stepIndex === 0) {
            tagManagerArgs.dataLayer.page = `${parentRoute}/email`;
            tagManagerArgs.dataLayer.web_event = `ci_first_last_name_added`;
        } else if (stepIndex === 1) {
            tagManagerArgs.dataLayer.page = `${parentRoute}/cause`;
            tagManagerArgs.dataLayer.web_event = `ci_email_password_verified`;
        } else if (stepIndex === 2) {
            tagManagerArgs.dataLayer.page = `${parentRoute}/confirm`;
            tagManagerArgs.dataLayer.web_event = `ci_signup_causes`;
            tagManagerArgs.dataLayer.causes = [
                ...userCauses,
            ];
        }
    } else if (buttonClicked === 'Back') {
        if (stepIndex === 1) {
            tagManagerArgs.dataLayer.page = `${parentRoute}`;
            tagManagerArgs.dataLayer.web_event = `${parentEvent}`;
        } else if (stepIndex === 2) {
            tagManagerArgs.dataLayer.page = `${parentRoute}/email`;
            tagManagerArgs.dataLayer.web_event = `ci_first_last_name_added`;
        }
    }
    tagManagerArgs.dataLayer.event = 'pageview';
    addToDataLayer(tagManagerArgs);
};


export {
    addGtmEventsSignUp,
    populateDropdownInfoToShare,
    validateGivingGoal,
    validateUserRegistrationForm,
};
