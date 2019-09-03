const firebase = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'CHAT_MESSAGE_LIST_LOAD':
            console.log("CHAT_MESSAGE_LIST_LOAD");
            console.error(action.payload.messages);
            newState = {
                ...state,
                messages: action.payload.messages,
            };
            break;
        default:
            console.log(action.type);
            console.log(action.payload);
            break;
    }
    return newState;
};

export default firebase;