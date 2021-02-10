import { Breadcrumb } from 'semantic-ui-react';
import _isEmpty from 'lodash/isEmpty';
import { validateGivingGoal } from './users/utils';

// initialzing constant value for limits for the words
export const aboutDescriptionLimit = 300;
export const addModalDescriptionLimit = 10000;
//intializing the validation object
export const intializeValidity = {
    doesNameExist: true,
    doesDescriptionNotExist: true,
};

// initialinzing the flow steps for create giving group
export const CreateGivingGroupFlowSteps = {
    stepOne: '/groups/step/one',
    stepTwo: '/groups/step/two',
    stepThree: '/groups/step/three',
    stepFour: '/groups/step/four',
};

// initialinzing the Add section modal object for create giving group
export const initializeAddSectionModalObject = {
    description: '',
    id: '',
    name: '',
}
// initialinzing the flow Object for create giving group
export const intializeCreateGivingGroup = {
    type: "groups",
    attributes: {
        name: "",
        prefersInviteOnly: "0",
        prefersRecurringEnabled: "0",
        city: "",
        province: "",
        short: "",
        fundraisingGoal: "",
        fundraisingDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        fundraisingCreated: new Date(),
        logo: "",
        videoUrl: ""
    },
    groupDescriptions: [],
    beneficiaryIds: [],
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
                                <Breadcrumb.Divider icon='right chevron' />
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
export const ValidateCreateGivingGroup = (validity, name, value) => {
    switch (name) {
        case 'name':
            validity.doesNameExist = !_isEmpty(value) ? true : false
            break
        case 'description':
            validity.doesDescriptionNotExist = !_isEmpty(value) ? true : false
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

export const getBase64 = (file, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
        // console.log('Error: ', error);
    };
};

export const youTubeVimeoValidator = (url) => /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/.test(url);

/**
 * convert a data to a string based on a seprator
 * @param {date} date date that need to be formatted
 * @param {string} typeOfSeprator type of seprator .
 * @returns {string} date after appending seperators
 */
export const dateFormatConverter = (date, typeOfSeprator = '/') => (
    `${date.getFullYear()}${typeOfSeprator}${date.getMonth() + 1}${typeOfSeprator}${date.getDate()}`
);