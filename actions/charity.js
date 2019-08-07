import socialApi from '../services/socialApi';

export const actionTypes = {
    GET_BENEFICIARY_DONEE_LIST: 'GET_BENEFICIARY_DONEE_LIST',
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
            followStatus: {},
        },
        type: actionTypes.SAVE_FOLLOW_STATUS,
    };
    socialApi.post(`/graph/create/relationship`,
        {
            'source': {
                'entity': "user",
                'filters': {
                    'user_id': Number(userId)
                }
            },
            'target': {
                'entity': "charity",
                'filters': {
                    'charity_id': Number(charityId)
                }
            },
            "relationship": "FOLLOWS"
        },
    ).then(
        (result) => {
            if (result) {
                fsa.payload.followStatus = result;
            }
            return dispatch(fsa);
        },
    ).catch((error) => {
        console.log(error);
    }).finally(() => {
        return dispatch(fsa);
    });
};

export const deleteFollowStatus = (dispatch, userId, charityId) => {
    const fsa = {
        payload: {
            followStatus: {},
        },
        type: actionTypes.SAVE_FOLLOW_STATUS,
    };
    // const followData = {
    //     source: {
    //         entity: 'user',
    //         filters: {
    //             user_id: Number(userId),
    //         },
    //     },
    //     target: {
    //         entity: 'charity',
    //         filters: {
    //             charity_id: Number(charityId),
    //         },
    //     },
    //     relationship: 'FOLLOWS',
    // };
    socialApi.post(`/users/deleterelationship`, {
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
        relationship: 'FOLLOWS',
    }).then(
        (result) => {
            if (result) {
                fsa.payload.followStatus = result;
            }
            return dispatch(fsa);
        },
    ).catch((error) => {
        console.log(error);
    }).finally(() => {
        return dispatch(fsa);
    });
};
