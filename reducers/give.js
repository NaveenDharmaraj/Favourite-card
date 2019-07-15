const give = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'SAVE_FLOW_OBJECT':
            newState = {
                ...state,
                flowObject: {
                    ...state.flowObject,
                    ...action.payload,
                },
            };
            break;
        case 'COVER_FEES':
            const {
                coverFees,
            } = action.payload;
            newState = {
                ...state,
                coverFeesData: Object.assign([], state.coverFees, coverFees),
            };
            break;
        case 'DONATIONS_ADDTO_DROPDOWN':
            const {
                donationAddToData,
            } = action.payload;
            newState = {
                ...state,
                donationAddToData: Object.assign([], state.donationAddToData, donationAddToData),
            };
            break;
        case 'ALLOCATIONS_GIVE_FROM_DROPDOWN':
            const {
                allocationGiveFromData,
            } = action.payload;
            newState = {
                ...state,
                allocationGiveFromData: Object.assign([], state.allocationGiveFromData, allocationGiveFromData),
            };
            break;
        case 'GET_COMPANY_PAYMENT_AND_TAXRECEIPT':
            newState = {
                ...state,
                companyData: Object.assign({}, state.companyData, action.payload),
            };
            break;
        case 'GET_BENIFICIARY_FOR_GROUP':
            newState = {
                ...state,
                benificiaryForGroupDetails: Object.assign({}, state.benificiaryForGroupDetails, action.payload),
            };
            break;
        case 'GET_BENEFICIARY_FROM_SLUG':
            newState = {
                ...state,
                charityDetails: Object.assign({}, state.charityDetails, action.payload),
            };
            break;
        default:
            break;
    }
    return newState;
};

export default give;
