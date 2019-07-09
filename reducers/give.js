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
        case 'DONATIONS_ADDTO_DROPDOWN':
            const {
                donationAddToData,
            } = action.payload;
            newState = {
                ...state,
                donationAddToData: Object.assign([], state.donationAddToData, donationAddToData),
            };
            break;
        case 'GET_COMPANY_PAYMENT_AND_TAXRECEIPT':
            newState = {
                ...state,
                companyData: Object.assign({}, state.companyData, action.payload),
            };
            break;
        default:
            break;
    }
    return newState;
};

export default give;
