 import _forEach from 'lodash/forEach';
import { loadConversationMessages } from '../../actions/chat';
 
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


const groupMessagesByDate = (msgs, msgsByDate={}) => {
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

const debounceFunction = ({dispatch, searchValue}, delay) => {
    if(chatTimeout){
        clearTimeout(chatTimeout);
    }
    chatTimeout = setTimeout(function(){
        dispatch(loadConversationMessages(searchValue));
    },delay);
}
export {
    getDateString,
    getBase64,
    timeString,
    groupMessagesByDate,
    debounceFunction,
};
