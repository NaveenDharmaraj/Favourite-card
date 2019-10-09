import _findIndex from 'lodash/findIndex';
import _isEmpty from 'lodash/isEmpty';
import _remove from 'lodash/remove';
import _cloneDeep from 'lodash/cloneDeep';
import _uniqBy from 'lodash/uniqBy';

const firebase = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case 'FIREBASE_INITIAL_LOAD':
            const newMsgs = action.payload.firebaseMessages || [];
            const oldMsgs = state.messages || [];
            const uniqueArray = _uniqBy(oldMsgs.concat(newMsgs), '_key');
            newState = {
                ...state,
                initialLoadCompleted: true,
                lastSyncTime: action.payload.lastSyncTime,
                messages: uniqueArray,
                page: action.payload.page,
            };
            break;
        case 'ADD_NEW_FIREBASE_MESSAGE':
            const newMessage = action.payload.addedMessage;
            const oldMessages = _cloneDeep(state.messages) || [];
            let notificationAddedUpdate = action.payload.notificationUpdate;
            oldMessages.unshift(newMessage);
            const addedMesages = oldMessages.filter((msg) => {
                if (msg) {
                    return msg;
                }
            });
            const addedMesagesArray = _uniqBy(addedMesages, '_key');
            addedMesagesArray.sort((a, b) => {
                return a.createdTs > b.createdTs ? -1 : 1;
            });
            if (state.initialLoadCompleted) {
                notificationAddedUpdate = false;
            }
            newState = {
                ...state,
                initialLoadCompleted: false,
                lastSyncTime: action.payload.lastSyncTime,
                messages: addedMesagesArray,
                notificationUpdate: notificationAddedUpdate,
            };
            break;
        case 'UPDATE_FIREBASE_MESSAGE':
            const updatenewMessage = action.payload.addedMessage;
            const updateoldMessages = _cloneDeep(state.messages) || [];
            const index = updateoldMessages.find((msg) => {
                if (!_isEmpty(msg)) {
                    return msg._key === updatenewMessage._key;
                }
            });
            if (index !== -1) {
                updateoldMessages.splice(index, 1, updatenewMessage);
            }
            newState = {
                ...state,
                lastSyncTime: action.payload.lastSyncTime,
                messages: updateoldMessages,
                notificationUpdate: action.payload.notificationUpdate,
            };
            break;
        case 'REMOVE_FIREBASE_MESSAGE':
            const { deletedMessage } = action.payload;
            const deleteOldMessages = _cloneDeep(state.messages) || [];
            let indexDelete;
            deleteOldMessages.find((msg, i) => {
                if (!_isEmpty(deletedMessage) && !_isEmpty(msg) && action.payload.deletedMessage._key === msg._key) {
                    indexDelete = i;
                    deleteOldMessages.splice(indexDelete, 1);
                }
            });
            newState = {
                ...state,
                lastSyncTime: action.payload.lastSyncTime,
                messages: deleteOldMessages,
                notificationUpdate: action.payload.notificationUpdate,
            };
            break;
        case 'FIREBASE_NOTIFICATION_COUNT':
            newState = {
                ...state,
                notificationUpdate: action.payload.notificationUpdate,
            };
            break;
        case 'FIREBASE_LAST_SYNC_TIME':
            newState = {
                ...state,
                lastSyncTime: action.payload.lastSyncTime,
            };
            break;
        default:
            break;
    }
    return newState;
};

export default firebase;
