const firebase = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'FIREBASE_MESSAGE_FETCH_COMPLETE': {
            // console.log("FIREBASE_MESSAGE_FETCH_COMPLETE");
            // console.error(action.payload.messages);
            let newMsgs = action.payload.messages || [];
            let oldMsgs = state.messages || [];
            let uniqueArray = oldMsgs.concat(newMsgs);
            uniqueArray = uniqueArray.filter((obj, pos, arr) => {
                return arr.map(mapObj => mapObj["_key"]).indexOf(obj["_key"]) === pos;
            });

            uniqueArray.sort(function (a, b) {
                return a.createdTs > b.createdTs ? -1 : 1;
            });
            newState = {
                ...state,
                messages: uniqueArray,
                lastSyncTime: action.payload.lastSyncTime,
                page: action.payload.page
            };
        }
            break;
        default:
            // console.log(action.type);
            // console.log(action.payload);
            break;
    }
    return newState;
};

export default firebase;