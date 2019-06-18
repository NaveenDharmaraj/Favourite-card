const user = (state = {}, action) => {
    console.log(action.type);
    switch (action.type) {
        case "USER_AUTH" :
            state = {
                ...state,
                auth: action.payload,
            }
            break;
    }
    return state;
}

export default user;
