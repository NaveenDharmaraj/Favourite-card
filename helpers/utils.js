import _isEmpty from 'lodash/isEmpty';
import Bowser from 'bowser';

const isFalsy = (val) => {
    const falsyArray = [
        undefined,
        null,
        NaN,
        0,
        '',
        false,
    ];
    return falsyArray.includes(val);
};
const distanceOfTimeInWords = (from) => {
    const parsedFrom = new Date(from);
    const to = new Date();
    const distanceInSeconds = ((to - parsedFrom) / 1000);
    let distanceInMinutes = Math.floor(distanceInSeconds / 60);
    const tense = distanceInSeconds < 0 ? ' from now' : ' ago';
    distanceInMinutes = Math.abs(distanceInMinutes);
    if (distanceInMinutes === 0) { return `Less than a minute${tense}`; }
    if (distanceInMinutes === 1) { return `A minute${tense}`; }
    if (distanceInMinutes < 45) { return `${distanceInMinutes} minutes${tense}`; }
    if (distanceInMinutes < 90) { return `About an hour${tense}`; }
    if (distanceInMinutes < 1440) { return `About ${Math.floor(distanceInMinutes / 60)} hours${tense}`; }
    if (distanceInMinutes < 2880) { return `A day${tense}`; }
    if (distanceInMinutes < 43200) { return `${Math.floor(distanceInMinutes / 1440)} days${tense}`; }
    if (distanceInMinutes < 86400) { return `About a month${tense}`; }
    if (distanceInMinutes < 525960) { return `${Math.floor(distanceInMinutes / 43200)} months${tense}`; }
    if (distanceInMinutes < 1051199) { return `About a year${tense}`; }
    return `Over ${Math.floor(distanceInMinutes / 525960)} years`;
};

/**
   * Return a String getting trimmed based on Count
   *
   * @param {string} wordGroup String for getting trimmed.
   * @param {number} wordCount Count.
   * @return {string} String after getting trimmed.
   */
const renderText = (wordGroup, wordCount = 20) => {
    let str;
    if (!_isEmpty(wordGroup)) {
        str = wordGroup.split(' ');
        if (!_isEmpty(str) && str.length > 0) {
            if (str.length > wordCount) {
                return `${str.slice(0, wordCount).join(' ')}...`;
            }
            return wordGroup;
        }
    }
    return null;
};

const renderTextByCharacter = (string, charCount = 100) => {
    let str;
    if (!_isEmpty(string)) {
        str = string.split('');
        if (!_isEmpty(str) && str.length > 0) {
            if (str.length > charCount) {
                return `${str.slice(0, charCount).join('')}...`;
            }
            return string;
        }
    }
    return null;
};
const redirectIfNotUSer = (currentAccount, railAppOrgin) => {
    if (!_isEmpty(currentAccount) && currentAccount.accountType !== 'personal' && typeof window !== 'undefined') {
        const typeMap = {
            charity: `admin/beneficiaries/${currentAccount.slug}`,
            company: `companies/${currentAccount.slug}`,
        };
        window.location.href = `${railAppOrgin}/${typeMap[currentAccount.accountType]}`;
    }
};

const getMainNavItems = (accountType, slug) => {
    const menuLinks = [];
    if (accountType === 'company') {
        menuLinks.push({
            location: `/companies/${slug}/match-requests/new`,
            name: 'Match Requests',
            isExternal: true,
        });
        menuLinks.push({
            location: `/companies/${slug}/employees`,
            name: 'Manage Employees',
            isExternal: true,
        });
    } else if (accountType === 'charity') {
        menuLinks.push({
            location: `/admin/beneficiaries/${slug}/eft`,
            name: 'Direct Deposit',
            isExternal: true,
        });
        menuLinks.push({
            location: `/admin/beneficiaries/${slug}/tool`,
            name: 'Take Donations Online',
            isExternal: true,
        });
        menuLinks.push({
            location: `/admin/beneficiaries/${slug}/members`,
            name: 'Manage Admins',
            isExternal: true,
        });
    } else {
        menuLinks.push({
            location: '/user/groups',
            name: 'Giving Groups & Campaigns',
            isExternal: false,
        });
        menuLinks.push({
            location: '/user/favourites',
            name: 'Favourites',
            isExternal: false,
        });
        menuLinks.push({
            location: '/user/recurring-donations',
            name: 'Tools',
            isExternal: false,
        });
        menuLinks.push({
            location: '/user/tax-receipts',
            name: 'Tax receipts',
            isExternal: false,
        });
    }
    return menuLinks;
}

const isValidBrowser = (userAgent) => {
    const browser = Bowser.getParser(userAgent);
    const isvalid = browser.satisfies({
        Linux: {
            Chrome: '>67',
            Chromium: '>67',
            Firefox: '>58',
            'Microsoft Edge': '>17',
            safari: '>11',
        },
        macos: {
            Chrome: '>67',
            Chromium: '>67',
            Firefox: '>58',
            'Microsoft Edge': '>17',
            safari: '>11',
        },
        mobile: {
            android: {
                Chrome: '>67',
                Chromium: '>67',
                Firefox: '>58',
                'Microsoft Edge': '>17',
            },
            iOS: {
                Chrome: '>67',
                Chromium: '>67',
                Firefox: '>58',
                'Microsoft Edge': '>17',
                safari: '>10',
            },
        },
        tablet: {
            android: {
                Chrome: '>67',
                Chromium: '>67',
                Firefox: '>58',
                'Microsoft Edge': '>17',
            },
            iOS: {
                Chrome: '>67',
                Chromium: '>67',
                Firefox: '>58',
                'Microsoft Edge': '>17',
                safari: '>10',
            },
        },
        Windows: {
            Chrome: '>67',
            Chromium: '>67',
            Firefox: '>58',
            'Microsoft Edge': '>17',
        },
    });
    return !isvalid;
};

export {
    getMainNavItems,
    isFalsy,
    distanceOfTimeInWords,
    renderText,
    renderTextByCharacter,
    redirectIfNotUSer,
    isValidBrowser,
};
