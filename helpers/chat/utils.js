
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

export {
    getDateString,
    timeString,
};
