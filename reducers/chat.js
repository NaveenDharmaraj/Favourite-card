import { actionTypes } from '../actions/chat';

const chat = (state = {}, action) => {
    let newState = {
        ...state,
    };
    switch (action.type) {
        case actionTypes.LOAD_MUTE_USER_LIST:
            newState = {
                ...state,
                muteUserList: action.payload.muteUserList,
            };
            break;
        default:
            // console.log(action.type);
            // console.log(action.payload);
            break;
    }
    return newState;
};

export default chat;