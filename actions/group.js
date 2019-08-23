import _ from 'lodash';

import coreApi from '../services/coreApi';

export const actionTypes = {
    GET_GROUP_ADMIN_DETAILS: 'GET_GROUP_ADMIN_DETAILS',
    GET_GROUP_BENEFICIARIES: 'GET_GROUP_BENEFICIARIES',
    GET_GROUP_DETAILS_FROM_SLUG: 'GET_GROUP_DETAILS_FROM_SLUG',
    GET_GROUP_MEMBERS_DETAILS: 'GET_GROUP_MEMBERS_DETAILS',
    GET_GROUP_TRANSACTION_DETAILS: 'GET_GROUP_TRANSACTION_DETAILS',
};

export const getGroupFromSlug = async (dispatch, slug) => {
    if (slug !== ':slug') {
        const fsa = {
            payload: {
                groupDetails: {},
            },
            type: actionTypes.GET_GROUP_DETAILS_FROM_SLUG,
        };
        await coreApi.get(`/groups/find_by_slug?load_full_profile=true`, {
            params: {
                dispatch,
                slug: [
                    slug,
                ],
                uxCritical: true,
            },
        }).then(
            (result) => {
                if (result && !_.isEmpty(result.data)) {
                    fsa.payload.groupDetails = result.data;
                }
            },
        ).catch(() => {
            // redirect('/give/error');
        }).finally(() => {
            dispatch(fsa);
        });
    } else {
        // redirect('/dashboard');
    }
};

// export const getGroupMembersAndAdmin = async (dispatch, id) => {
//     const fsa = {
//         payload: {
//             groupAdminsDetails: [],
//             groupMembersDetails: [],
//         },
//         type: actionTypes.GET_GROUP_MEMBERS_AND_ADMINS_DETAILS,
//     };

//     const membersData = await coreApi.get(`/groups/${id}/groupMembers?page[size]=3`);
//     const adminsData = await coreApi.get(`/groups/${id}/groupAdmins?page[size]=3`);

//     Promise.all([
//         membersData,
//         adminsData,
//     ])
//         .then(
//             (result) => {
//                 if (!_.isEmpty(result)) {
//                     fsa.payload.groupMembersDetails = result[0];
//                     fsa.payload.groupAdminsDetails = result[1];
//                 }
//             },
//         ).catch(() => {

//         }).finally(() => {
//             dispatch(fsa);
//         });
// };

export const getGroupMemberDetails = async (dispatch, id, url) => {
    const fsa = {
        payload: {
            groupMembersDetails: {},
        },
        type: actionTypes.GET_GROUP_MEMBERS_DETAILS,
    };
    let newUrl = null;
    if (url) {
        newUrl = url;
    } else {
        newUrl = `/groups/${id}/groupMembers?page[size]=3`;
    }
    coreApi.get(newUrl)
        .then((result) => {
            if (result && !_.isEmpty(result.data)) {
                const memberDetails = {
                    data: result.data,
                    nextLink: (result.links.next) ? result.links.next : null,
                };
                fsa.payload.groupMembersDetails = memberDetails;
            }
        }).catch().finally(() => {
            dispatch(fsa);
        });
};

export const getGroupAdminDetails = async (dispatch, id, url) => {
    const fsa = {
        payload: {
            groupAdminsDetails: {},
        },
        type: actionTypes.GET_GROUP_ADMIN_DETAILS,
    };
    let newUrl = null;
    if (url) {
        newUrl = url;
    } else {
        newUrl = `/groups/${id}/groupAdmins?page[size]=1`;
    }
    coreApi.get(newUrl)
        .then((result) => {
            if (result && !_.isEmpty(result.data)) {
                const adminDetails = {
                    data: result.data,
                    nextLink: (result.links.next) ? result.links.next : null,
                };
                fsa.payload.groupAdminsDetails = adminDetails;
            }
        }).catch().finally(() => {
            dispatch(fsa);
        });
};

export const getGroupBeneficiaries = async (dispatch, id, url) => {
    const fsa = {
        payload: {
            groupBeneficiaries: {},
        },
        type: actionTypes.GET_GROUP_BENEFICIARIES,
    };
    let newUrl = null;
    if (url) {
        newUrl = url;
    } else {
        newUrl = `groups/${id}/groupBeneficiaries?page[size]=1`;
    }
    coreApi.get(newUrl)
        .then((result) => {
            if (result && !_.isEmpty(result.data)) {
                const beneficiariesDetails = {
                    data: result.data,
                    nextLink: (result.links.next) ? result.links.next : null,
                };
                fsa.payload.groupBeneficiaries = beneficiariesDetails;
            }
        }).catch().finally(() => {
            dispatch(fsa);
        });
};

export const getTransactionDetails = async (dispatch, id, url) => {
    const fsa = {
        payload: {
            groupTransactions: {},
        },
        type: actionTypes.GET_GROUP_TRANSACTION_DETAILS,
    };
    let newUrl = null;
    if (url) {
        newUrl = url;
    } else {
        newUrl = `groups/${id}/activities?filter[moneyItems]=all&page[size]=2`;
    }
    await coreApi.get(newUrl)
        .then((result) => {
            if (result && !_.isEmpty(result.data)) {
                fsa.payload.groupTransactions = result;
            }
        }).catch().finally(() => {
            dispatch(fsa);
        });
};
