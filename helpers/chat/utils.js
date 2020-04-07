import getConfig from 'next/config';

import _forEach from 'lodash/forEach';
import _isEmpty from 'lodash/isEmpty';
import { loadConversationMessages } from '../../actions/chat';
import { placeholderGroup } from '../../static/images/no-data-avatar-group-chat-profile.png';
import { placeholderUser } from '../../static/images/no-data-avatar-user-profile.png';
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
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result);
    };
    reader.onerror = function (error) {
        // console.log('Error: ', error);
    };
}


const groupMessagesByDate = (msgs, msgsByDate = {}) => {
    msgs = msgs.sort((a, b) => (a.createdAtTime - b.createdAtTime));

    _forEach(msgs, function (msg) {
        let dateStr = getDateString(msg.createdAtTime);

        if (!msgsByDate[dateStr]) {
            msgsByDate[dateStr] = [];
        }
        msgsByDate[dateStr].push(msg);
    });
    return msgsByDate;
}

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
            imagePresent: (info.imageUrl && info.imageUrl !== '' && info.imageUrl != null && info.imageUrl !== CHAT_GROUP_DEFAULT_AVATAR ? true : false),
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
            imagePresent: (info.imageLink && info.imageLink !== '' && info.imageLink != null ? true : false),
            info,
            isMuted: (muteInfo && muteInfo.notificationAfterTime && muteInfo.notificationAfterTime > new Date().getTime()),
            title: info.displayName,
            type: 'user',

        } : {};
        return convHead;
    }
    return {};
};

export {
    conversationHead,
    debounceFunction,
    getBase64,
    getDateString,
    groupMessagesByDate,
    timeString,
};
