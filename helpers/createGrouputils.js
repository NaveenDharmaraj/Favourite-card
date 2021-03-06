import { Breadcrumb } from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';

import { validateGivingGoal } from './users/utils';
const CreateGivingGroupBasic = dynamic(() => import('../components/CreateGivingGroup/CreateGivingGroupBasic'));
const CreateGivingGroupAbout = dynamic(() => import('../components/CreateGivingGroup/CreateGivingGroupAbout'));
const CreateGivingGroupPicsVideo = dynamic(() => import('../components/CreateGivingGroup/CreateGivingGroupPicsVideo'));
const CreateGivingGroupGivingGoal = dynamic(() => import('../components/CreateGivingGroup/CreateGivingGroupGivingGoal'));
const Manage = dynamic(() => import('../components/ManageGivingGroup/Manage'));
const Invite = dynamic(() => import('../components/ManageGivingGroup/Invite'));
const EmailGroupMembers = dynamic(() => import('../components/ManageGivingGroup/EmailGroupMembers'));
const DownloadTransaction = dynamic(() => import('../components/ManageGivingGroup/DownloadTransaction'));
const AddDonationWidget = dynamic(() => import('../components/ManageGivingGroup/AddDonationWidget'));

// intializing breadCrum
export const createGivingGroupBreadCrum = (formatMessage) => {
    return [
        `${formatMessage('createGivingGroupBreadCrum.basicSettings')}`,
        `${formatMessage('createGivingGroupBreadCrum.aboutTheGroup')}`,
        `${formatMessage('createGivingGroupBreadCrum.picsVideos')}`,
        `${formatMessage('createGivingGroupBreadCrum.charitiesGoals')}`
    ]
}
// initialzing constant value for limits for the words
export const aboutDescriptionLimit = 300;
export const addModalDescriptionLimit = "10000";
//intializing the validation object
export const intializeValidity = {
    doesNameExist: true,
    doesDescriptionNotExist: true,
    isNotEmpty: true,
    hasAlphabet: true,
    hasValidLength: true,
    isSectionNotEmpty: true,
    isValidText: true,
};

// initialinzing the flow steps for create giving group
export const createGivingGroupFlowSteps = {
    stepOne: '/groups/step/one',
    stepTwo: '/groups/step/two',
    stepThree: '/groups/step/three',
    stepFour: '/groups/step/four',
};

// initialinzing the Add section modal object for create giving group
export const initializeAddSectionModalObject = {
    description: '',
    id: '',
    purpose: '',
}
// initialinzing the flow Object for create giving group
export const intializeCreateGivingGroup = {
    type: "groups",
    attributes: {
        name: "",
        prefersInviteOnly: "0",
        prefersRecurringEnabled: "1",
        city: "",
        province: "",
        short: "",
        fundraisingGoal: "",
        fundraisingDate: null,
        fundraisingCreated: null,
        logo: "",
        videoUrl: ""
    },
    groupPurposeDescriptions: [],
    beneficiaryItems: [],
    galleryImages: []
};
/**
 * generate breadcrums
 * @param {array} breakCrumArray List of items to be displayed in the breadcrums.
 * @param {array} currentActiveStepArray List of items covered in the breadcrums.
 * @returns {HTMLElement} returns the html elements of all the breadcrums.
 */
export const generateBreadCrum = (breakCrumArray = [], currentActiveStepArray = []) => {
    return (
        <div className="flowBreadcrumb">
            <Breadcrumb size="mini">
                {
                    breakCrumArray.map((item, i) => {
                        return (
                            <>
                                <Breadcrumb.Section
                                    className={currentActiveStepArray.includes(i + 1) && 'completed_step'}
                                    active={currentActiveStepArray.length === i + 1}
                                >
                                    {item}
                                </Breadcrumb.Section>
                                {(breakCrumArray.length - 1 !== i)
                                && (
                                    <Breadcrumb.Divider icon='right chevron' />
                                )}
                            </>
                        )
                    })
                }
            </Breadcrumb>
        </div>
    )
};

/**
 * validate the fields in create giving group
 * @param {object} validity validity object from component.
 * @param {string} name name of field to be validated.
 * @param {string} value value from the field to be validated.
 * @returns {object} returns the validation object after validating.
 */
export const validateCreateGivingGroup = (validity, name, value) => {
    let modofiedValue = '';
    if (value) {
        modofiedValue =  value.trim();
    }
    switch (name) {
        case 'name':
            validity.doesNameExist = !_isEmpty(value) ? true : false;
            validity.isNotEmpty = !(!modofiedValue || modofiedValue.length === 0);
            validity.hasAlphabet = hasAlphabet(modofiedValue);
            validity.hasValidLength = (value.length <= 150);
            validity.isValidText = isValidText(modofiedValue);
            break;
        case 'purpose':
            validity.doesNameExist = !_isEmpty(value) ? true : false;
            validity.hasValidLength = (value.length <= 300);
            validity.isNotEmpty = !(!modofiedValue || modofiedValue.length === 0);
            validity.isValidText = isValidText(modofiedValue);
            break;
        case 'description':
            validity.doesDescriptionNotExist = !_isEmpty(value) ? true : false;
            validity.isSectionNotEmpty = !(!modofiedValue || modofiedValue.length === 0);
            validity.isValidText = isValidText(modofiedValue);
            break;
        case 'givingGoal':
            validity = validateGivingGoal(value, validity);
            break;
        default:
            break;
    };
    return {
        ...validity,
    }
};

export const getStore = (reduxStore, reducerName = '') => reduxStore.getState() && reduxStore.getState()[reducerName];

export const youTubeVimeoValidator = (url) => /^(http(s)?:\/\/)?((w){3}.)?(player\.vimeo\.com|vimeo\.com|youtu\.be|www\.youtube\.com)?\/.+/.test(url);
/**
 * convert a data to a string based on a seprator
 * @param {date} date date that need to be formatted
 * @param {string} typeOfSeprator type of seprator .
 * @returns {string} date after appending seperators
 */
export const hasAlphabet = (str) => {
    const stringRegex = /[A-Za-z]/;
    const res = stringRegex.test(str);
    return res;
}
export const dateFormatConverter = (date, typeOfSeprator = '/') => (
    date ? `${date.getFullYear()}${typeOfSeprator}${date.getMonth() + 1}${typeOfSeprator}${date.getDate()}` : null
);
export const manageGivingGroupAccordianMenuOptions = {
    basic: {
        key: 'basic',
        route: 'basic',
        text: 'Basic Settings',
        value: 0,
        component: <CreateGivingGroupBasic
            showBasic={true}
            showButton={true}
            showMonthly={false}
        />
    },
    about: {
        key: 'about',
        route: 'about',
        text: 'About the group',
        value: 1,
        component: <CreateGivingGroupAbout />
    },
    picsvideos: {
        key: 'picsvideos',
        route: 'picsvideos',
        text: 'Photos and video',
        value: 2,
        component: <CreateGivingGroupPicsVideo />
    },
    givinggoals: {
        key: 'givinggoals',
        route: 'givinggoals',
        text: 'Giving goal',
        value: 3,
        component: <CreateGivingGroupGivingGoal showCharity={false} showGivingGoal={true} />
    },
    monthlygifts: {
        key: 'monthlygifts',
        route: 'monthlygifts',
        text: 'Monthly gifts',
        value: 4,
        component: <CreateGivingGroupBasic
            showBasic={false}
            showButton={false}
            showMonthly={true}
        />
    },
    charitysupport: {
        key: 'charitysupport',
        route: 'charitysupport',
        text: 'Charities to support',
        value: 5,
        component: <CreateGivingGroupGivingGoal showCharity={true} showGivingGoal={false} />
    },
};
export const manageGivingGroupAccordianOptions = {
    edit: {
        key: 'edit',
        route: 'edit',
        text: 'Edit group',
        value: 0,
        component: <CreateGivingGroupBasic
            showBasic={true}
            showButton={true}
            showMonthly={false}
        />
    },
    members: {
        key: 'members',
        route: 'members',
        text: 'Members',
        value: 1,
        componentValue: 7,
        component: <Manage />
    },
    manage: {
        key: 'manage',
        route: 'manage',
        text: 'Manage',
        value: 2,
        component: <Manage />
    },
    invites: {
        key: 'invites',
        route: 'invites',
        text: 'Invite',
        value: 3,
        component: <Invite />
    },
    ['email_members']: {
        key: 'email_members',
        route: 'email_members',
        text: 'Email members',
        value: 4,
        component: <EmailGroupMembers />
    },
    downloaddonation: {
        key: 'downloaddonation',
        route: 'downloaddonation',
        text: 'Download transaction data',
        value: 5,
        component: <DownloadTransaction />
    },
    widget: {
        key: 'widget',
        route: 'widget',
        text: 'Add donation button',
        value: 6,
        component: <AddDonationWidget />
    },
};

export const isValidText = (str) => {
    const stringRegex = /^[ A-Za-z0-9-_()@"'.,+=$]*$/;
    const res = stringRegex.test(str);
    return res;
}

export const parseVimeoUrl = (url) => {
    const vimeoRegex = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    const parsedUrl = url.match(vimeoRegex);
    return "https://player.vimeo.com/video/" + parsedUrl[1];
}