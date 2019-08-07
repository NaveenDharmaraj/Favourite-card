import socialApi from '../services/socialApi';

export const actionTypes = {
    GET_BENEFICIARY_DONEE_LIST: 'GET_BENEFICIARY_DONEE_LIST',
    SAVE_DEEP_LINK: 'SAVE_DEEP_LINK',
    SAVE_FOLLOW_STATUS: 'SAVE_FOLLOW_STATUS',
};

export const getBeneficiaryDoneeList = (dispatch, charityId) => {
    const fsa = {
        payload: {
            donationDetails: {},
        },
        type: actionTypes.GET_BENEFICIARY_DONEE_LIST,
    };
    socialApi.get(`/beneficiaryDoneeList/${charityId}?locale=en_ca&tenant_name=chimp&page=1&size=10`).then(
        (result) => {
            if (result) {
                fsa.payload.donationDetails = result;
            }
            return dispatch(fsa);
        },
    ).catch((error) => {
        console.log(error);
    }).finally(() => {
        return dispatch(fsa);
    });
};

export const saveFollowStatus = (dispatch, userId, charityId) => {
    const fsa = {
        payload: {
            followStatus: false,
        },
        type: actionTypes.SAVE_FOLLOW_STATUS,
    };
    socialApi.post(`/graph/create/relationship`,
        {
            relationship: 'FOLLOWS',
            source: {
                entity: 'user',
                filters: {
                    user_id: Number(userId),
                },
            },
            target: {
                entity: 'charity',
                filters: {
                    charity_id: Number(charityId),
                },
            },
        }).then(
        (result) => {
            fsa.payload.followStatus = true;
        },
    ).catch((error) => {
        console.log(error);
    }).finally(() => dispatch(fsa));
};

export const deleteFollowStatus = (dispatch, userId, charityId) => {
    const fsa = {
        payload: {
            followStatus: true,
        },
        type: actionTypes.SAVE_FOLLOW_STATUS,
    };
    socialApi.post(`/users/deleterelationship`, {
        relationship: 'FOLLOWS',
        source: {
            entity: 'user',
            filters: {
                user_id: Number(userId),
            },
        },
        target: {
            entity: 'charity',
            filters: {
                charity_id: Number(charityId),
            },
        },
    }).then(
        (result) => {
            fsa.payload.followStatus = false;
        },
    ).catch((error) => {
        console.log(error);
    }).finally(() => dispatch(fsa));
};

export const copyDeepLink = (url, dispatch) => {
    const fsa = {
        payload: {
            deepLink: {},
        },
        type: actionTypes.SAVE_DEEP_LINK,
    };
    socialApi.get(url).then(
        (result) => {
            fsa.payload.deepLink = result.data;
        },
    ).catch((error) => {
        console.log(error);
    }).finally(() => dispatch(fsa));
};
