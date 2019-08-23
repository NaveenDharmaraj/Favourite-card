const group = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'GET_GROUP_DETAILS_FROM_SLUG':
            newState = {
                ...state,
                groupDetails: Object.assign({}, state.groupDetails, action.payload.groupDetails),
            };
            break;
        case 'GET_GROUP_MEMBERS_DETAILS':
            if (state.groupMembersDetails && state.groupMembersDetails.data) {
                newState = {
                    ...state,
                    groupMembersDetails: {
                        ...state.groupMembersDetails,
                        data: state.groupMembersDetails.data.concat(action.payload.groupMembersDetails.data),
                        nextLink: action.payload.groupMembersDetails.nextLink,
                    },
                };
            } else {
                newState = {
                    ...state,
                    groupMembersDetails: Object.assign({}, state.groupMembersDetails, action.payload.groupMembersDetails),
                };
            }
            break;
        case 'GET_GROUP_ADMIN_DETAILS':
            if (state.groupAdminsDetails && state.groupAdminsDetails.data) {
                newState = {
                    ...state,
                    groupAdminsDetails: {
                        ...state.groupAdminsDetails,
                        data: state.groupAdminsDetails.data.concat(action.payload.groupAdminsDetails.data),
                        nextLink: action.payload.groupAdminsDetails.nextLink,
                    },
                };
            } else {
                newState = {
                    ...state,
                    groupAdminsDetails: Object.assign({}, state.groupAdminsDetails, action.payload.groupAdminsDetails),
                };
            }
            break;
        case 'GET_GROUP_BENEFICIARIES':
            if (state.groupBeneficiaries && state.groupBeneficiaries.data) {
                newState = {
                    ...state,
                    groupBeneficiaries: {
                        ...state.groupBeneficiaries,
                        data: state.groupBeneficiaries.data.concat(action.payload.groupBeneficiaries.data),
                        nextLink: action.payload.groupBeneficiaries.nextLink,
                    },
                };
            } else {
                newState = {
                    ...state,
                    groupBeneficiaries: Object.assign([], state.groupBeneficiaries, action.payload.groupBeneficiaries),
                };
            }
            break;
        case 'GET_GROUP_TRANSACTION_DETAILS':
            newState = {
                ...state,
                groupTransactions: Object.assign({}, state.groupTransactions, action.payload.groupTransactions),
            };
            break;
        default:
            break;
    }
    return newState;
};

export default group;
