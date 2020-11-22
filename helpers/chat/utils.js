import getConfig from 'next/config';
import _forEach from 'lodash/forEach';
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';

import { loadConversationMessages } from '../../actions/chat';
import { placeholderGroup } from '../../static/images/no-data-avatar-group-chat-profile.png';
import { placeholderUser } from '../../static/images/no-data-avatar-user-profile.png';
import { isFalsy } from '../utils';

const { publicRuntimeConfig } = getConfig();
const {
    CHAT_GROUP_DEFAULT_AVATAR,
} = publicRuntimeConfig;
const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];
let chatTimeout = '';
/**
 * Returns dateStr.
 *
 * @param {number} timeInMs timestamp of the message created.
 * @return {string} dateStr Contains either formatted date or for current day it returns today.
 */
const getDateString = (timeInMs) => {
    const today = new Date();
    const todayStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
    const date = new Date(timeInMs);
    let dateStr = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    if (dateStr === todayStr) {
        dateStr = 'Today';
    }
    return dateStr;
};

/**
 * Returns timeStr or dateStr based on date.
 *
 * @param {number} timestamp timestamp of the message created.
 * @param {boolean} isForLeftConvList .
 * @return {string} timeStr or dateStr it returns either dateStr with formatted date or timeStr  for current day.
 */
const timeString = (timestamp, isForLeftConvList) => {
    const d = new Date(timestamp);
    const dateStr = getDateString(timestamp);
    const timeStr = (`${(d.getHours() < 10 ? '0' : '') + d.getHours()}:${d.getMinutes() < 10 ? '0' : ''}${d.getMinutes()}`);
    if (!isForLeftConvList || dateStr === 'Today') {
        return timeStr;
    }
    return dateStr;
};

/**
 * Returns callback.
 *
 * @param {string} file details about the file.
 * @return {string} return a string which contain binary data of image with base 64 encoding.
 */
const getBase64 = (file, cb) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result);
    };
    reader.onerror = function (error) {
        // console.log('Error: ', error);
    };
};


const groupMessagesByDate = (msgs, msgsByDate = {}) => {
    msgs = msgs.sort((a, b) => (a.createdAtTime - b.createdAtTime));

    _forEach(msgs, (msg) => {
        const dateStr = getDateString(msg.createdAtTime);

        if (!msgsByDate[dateStr]) {
            msgsByDate[dateStr] = [];
        }
        msgsByDate[dateStr].push(msg);
    });
    return msgsByDate;
};

const debounceFunction = ({
    dispatch,
    selecetedConversation,
}, delay) => {
    if (chatTimeout) {
        clearTimeout(chatTimeout);
    }
    chatTimeout = setTimeout(() => {
        dispatch(loadConversationMessages(selecetedConversation));
    }, delay);
};

/**
 * Returns info object.
 *
 * @param {object} msg details about the file.
 * @param {object} groupFeeds details about the groupFeeds list.
 * @param {object} muteUserList details about the muteUserList.
 * @param {object} userDetails details about the userDetails list.
 * @param {object} userInfo details about the current userInfo.
 * @return {object} returns convHead | groupHead an object contains info about the selected users.
 */
const conversationHead = (msg, groupFeeds, muteUserList, userDetails, userInfo) => {
    const currentUserId = !_isEmpty(userInfo) ? userInfo.id : null;
    if (msg && msg.groupId) {
        const info = !_isEmpty(groupFeeds) ? groupFeeds[msg.groupId] : {};
        const groupHead = {
            image: (info.imageUrl ? info.imageUrl : placeholderGroup),
            imagePresent: (!!(info.imageUrl && info.imageUrl !== '' && info.imageUrl != null && info.imageUrl !== CHAT_GROUP_DEFAULT_AVATAR)),
            info,
            isMuted: (info.notificationAfterTime && info.notificationAfterTime > new Date().getTime()),
            title: info.name,
            type: 'group',
        };
        groupHead.disabled = (info.removedMembersId && info.removedMembersId.indexOf(currentUserId) >= 0);
        return groupHead;
    } if (msg && msg.contactIds) {
        const info = !_isEmpty(userDetails) ? userDetails[msg.contactIds] : {};
        const muteInfo = !_isEmpty(muteUserList) ? muteUserList[msg.contactIds] : {};
        const convHead = info ? {
            image: (info.imageLink ? info.imageLink : placeholderUser),
            imagePresent: (!!(info.imageLink && info.imageLink !== '' && info.imageLink != null)),
            info,
            isMuted: (muteInfo && muteInfo.notificationAfterTime && muteInfo.notificationAfterTime > new Date().getTime()),
            title: info.displayName,
            type: 'user',

        } : {};
        return convHead;
    }
    return {};
};

const getCurrentUserRoleInGroup = (groupFeed, userId) => {
    const { groupUsers } = groupFeed;
    let userInfo = {};
    _find(groupUsers, (user) => {
        if (user.userId == userId) {
            // console.log(user);
            userInfo = user;
        }
    });
    return userInfo;
};

/**
 * sort the userDetails alphabetically.
 * @param {object[]} userDetails the list of userDetail.
 * @return {object[]} sorted userDetails alphabetically.
 */
const sortUserDetails = (userDetails) => {
    if (Object.values(userDetails).length > 0) {
        // sort by name
        const sortedUserDetails = Object.values(userDetails).sort((a, b) => {
            const displayNameA = a.displayName ? a.displayName.toUpperCase() : ''; // ignore upper and lowercase
            const displayNameB = b.displayName ? b.displayName.toUpperCase() : ''; // ignore upper and lowercase
            if (displayNameA < displayNameB) {
                return -1;
            }
            if (displayNameA > displayNameB) {
                return 1;
            }

            // names must be equal
            return 0;
        });
        return sortedUserDetails;
    }
    return userDetails;
};

const defaultSelectedConversation = (msgId, newMessgaeArr, selectedConversation, userDetails, groupFeeds) => {
    let compose = false;
    // select the conversation based in groupid or contact id
    if (Number(msgId) && newMessgaeArr && newMessgaeArr.length > 0) {
        newMessgaeArr.find((msg) => {
            if (msg.groupId == msgId) {
                selectedConversation = msg;
                return true;
            } if (isFalsy(msg.groupId) && msg.contactIds == msgId) {
                selectedConversation = msg;
                return true;
            }
        });
    }
    // userdetails is thr group details is thr but no message then select the msgId from url and the compose as true.
    if (_isEmpty(selectedConversation) && Number(msgId)) {
        if (userDetails[msgId]) {
            userDetails[msgId].contactIds = msgId;
            selectedConversation = userDetails[msgId];
        } else if (groupFeeds[msgId]) {
            groupFeeds[msgId].contactIds = msgId;
            selectedConversation = groupFeeds[msgId];
        }
    }
    // if there is no match in userDetails and groupfeeds select the defualt first message
    if (_isEmpty(selectedConversation) && newMessgaeArr && newMessgaeArr.length > 0 && msgId != 'new') {
        newMessgaeArr[0].conversationInfo.info.unreadCount = 0;
        selectedConversation = newMessgaeArr[0];
    }
    if ((newMessgaeArr && newMessgaeArr.length <= 0 && _isEmpty(userDetails[msgId])) || msgId == 'new') {
        compose = true;
        selectedConversation = {};
    }
    return {
        compose,
        selectedConversation,
    };
};

export {
    conversationHead,
    debounceFunction,
    defaultSelectedConversation,
    getBase64,
    getCurrentUserRoleInGroup,
    getDateString,
    groupMessagesByDate,
    sortUserDetails,
    timeString,
};
