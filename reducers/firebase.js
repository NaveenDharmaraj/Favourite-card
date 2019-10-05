import _findIndex from 'lodash/findIndex';
import _remove from 'lodash/remove';

const firebase = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'FIREBASE_MESSAGE_FETCH_COMPLETE':
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
            break;
        case 'FETCH_TODOS':
            newState = {
                ...state,
                messages: action.payload.firebaseMessages,
                lastSyncTime: action.payload.lastSyncTime,
                page: action.payload.page,
            };
            break;
        case 'ADD_NEW_FIREBASE_MESSAGE':
            const newMessage = action.payload.addedMessage;
            const oldMessages = state.messages || [];
            oldMessages.unshift(newMessage);
            newState = {
                ...state,
                messages: oldMessages,
                lastSyncTime: action.payload.lastSyncTime,
            };
            break;
            case 'UPDATE_FIREBASE_MESSAGE':
            const updatenewMessage = action.payload.addedMessage;
            const updateoldMessages = Object.assign([], state.messages) || [];
            const index = _findIndex(updateoldMessages, (msg) => msg._key === updatenewMessage._key);
            if(index !== -1) {
                updateoldMessages.splice(index, 1, updatenewMessage);
            }
            newState = {
                ...state,
                messages: updateoldMessages,
                lastSyncTime: action.payload.lastSyncTime,
            };
            break;
            case 'REMOVE_FIREBASE_MESSAGE':
                const deletedMessage = action.payload.deletedMessage;
                let deleteOldMessages = Object.assign([], state.messages) || [];
                _remove(deleteOldMessages, (msg) => msg._key === deletedMessage._key);
                newState = {
                    ...state,
                    messages: deleteOldMessages,
                    lastSyncTime: action.payload.lastSyncTime,
                };
                break;
        default:
            break;
    }
    return newState;
};

export default firebase;