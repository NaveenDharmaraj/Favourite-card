import _keyBy from 'lodash/keyBy';
import _forEach from 'lodash/forEach';

import graphApi from '../services/graphApi';
import applozicApi from '../services/applozicApi';

const actionTypes = _keyBy([
    'CHAT_MESSAGE_LIST_LOAD',
    'LOAD_MUTE_USER_LIST',
]);
const chatMessageFetchCompleteAction = (dispatch, messages) => {
    return dispatch({
        type: actionTypes.CHAT_MESSAGE_LIST_LOAD,
        payload: {
            messages
        },
    });
};

const loadFriendsList = (userInfo) => (dispatch) => {
    // const pageSize = 999;
    // const pageNumber = 1;
    // const email = userInfo.attributes.email;
    // graphApi.get(`/user/myfriends`, {
    //     params: {
    //         'page[number]': pageNumber,
    //         'page[size]': pageSize,
    //         status: 'accepted',
    //         userid: email,
    //     },
    // });
};

const loadMuteUserList = () => (dispatch) => {
    const muteUserList = {};
    applozicApi.get('/user/chat/mute/list', {}).then((response) => {
        _forEach(response, (muteUser) => {
            muteUserList[muteUser.userId] = muteUser;
        });
        dispatch({
            payload: {
                muteUserList,
            },
            type: actionTypes.LOAD_MUTE_USER_LIST,
        });
    });
};

export {
    actionTypes,
    loadMuteUserList,
    loadFriendsList,
};
