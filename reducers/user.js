const user = (state = {}, action) => {
    console.log(action.type);
    switch (action.type) {
        case "USER_AUTH" :
            state = {
                ...state,
                auth: action.payload,
            }
            break;
        case "TAX_RECEIPT_PROFILES" :
            state = {
                ...state,
                taxReceiptProfiles: action.payload.taxReceiptProfiles,
            }
    }
    return state;
}

export default user;
