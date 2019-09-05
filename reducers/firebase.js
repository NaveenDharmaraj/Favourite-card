const firebase = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'FIREBASE_MESSAGE_FETCH_COMPLETE':
            console.log("FIREBASE_MESSAGE_FETCH_COMPLETE");
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