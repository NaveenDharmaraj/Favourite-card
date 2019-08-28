const distanceOfTimeInWords = (from) => {
    const parsedFrom = new Date(from);
    const to = new Date();
    const distanceInSeconds = ((to - parsedFrom) / 1000);
    let distanceInMinutes = Math.floor(distanceInSeconds / 60);
    const tense = distanceInSeconds < 0 ? ' from now' : ' ago';
    distanceInMinutes = Math.abs(distanceInMinutes);
    if (distanceInMinutes === 0) { return `less than a minute${tense}`; }
    if (distanceInMinutes === 1) { return `a minute${tense}`; }
    if (distanceInMinutes < 45) { return `${distanceInMinutes} minutes${tense}`; }
    if (distanceInMinutes < 90) { return `about an hour${tense}`; }
    if (distanceInMinutes < 1440) { return `about ${Math.floor(distanceInMinutes / 60)} hours${tense}`; }
    if (distanceInMinutes < 2880) { return `a day${tense}`; }
    if (distanceInMinutes < 43200) { return `${Math.floor(distanceInMinutes / 1440)} days${tense}`; }
    if (distanceInMinutes < 86400) { return `about a month${tense}`; }
    if (distanceInMinutes < 525960) { return `${Math.floor(distanceInMinutes / 43200)} months${tense}`; }
    if (distanceInMinutes < 1051199) { return `about a year${tense}`; }
    return `over ${Math.floor(distanceInMinutes / 525960)} years`;
};

export {
    distanceOfTimeInWords,
};
