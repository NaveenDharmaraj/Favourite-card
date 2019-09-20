import { Firebase } from "./init";
import getConfig from 'next/config';
import { firebaseMessageFetchCompleteAction } from "../actions/firebase";
import _ from 'lodash';
import eventApi from '../services/eventApi';
const ACCEPT_FREIND_PAYLOAD = {
    "type": "event",
    "attributes": {
        "source": "socialapi",
        "category": "social",
        "subCategory": "friend",
        "eventName": "friendAccept",
        "payload": {
            "sourceUserId": 0,
            "destinationEmailId": "",
            "message": "",
            "deepLink": "",
            "linkedEventId": ""
        }
    }
};
const { publicRuntimeConfig } = getConfig();
const {
    FIREBASE_PUBLIC_API_KEY
} = publicRuntimeConfig;
//"BBtmpfGlMgEid3h1Fdi0Euv5bQYEzQR4QDzDKI7bTbujc-EfLXWv_q8dJDIxqxfoo812Qx1ahR1pvUlEMHoViLg"
class NotificationHelper {
    static instance = null;
    static currentPage = null;
    messaging = null;
    userInfo = null;
    constructor(userInfo) {
        let fbHelper = this;
        fbHelper.messaging = Firebase.messaging();
        fbHelper.userInfo = userInfo;
        // if (!NotificationHelper.messageConfigDone) {
        try {
            // console.log(fbHelper.messaging.publicVapidKeyToUse);
            //usePublicVapidKey function should be called only once.
            fbHelper.messaging.usePublicVapidKey(
                // Project Settings => Cloud Messaging => Web Push certificates
                FIREBASE_PUBLIC_API_KEY
            );

            // Check for browser support of service worker
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker
                    .register("/static/firebase-messaging-sw.js")
                    .then(function (registration) {
                        fbHelper.messaging.useServiceWorker(registration);
                        fbHelper.messaging.requestPermission().then(function () {
                            let token = fbHelper.messaging.getToken();
                            console.log(token);
                            return token;
                        }).then(function (token) {
                            console.log(token);
                        }).catch(function (err) {
                            console.log('Permission denied', err);
                        });
                        fbHelper.messaging.onMessage(async function (payload) {
                            //console.log(payload);
                            await NotificationHelper.getMessages({ test: true }, dispatch, NotificationHelper.currentPage);
                        });

                        // console.log("Registration successful, scope is:", registration.scope);
                        NotificationHelper.messageConfigDone = true;
                    })
                    .catch(function (err) {
                        console.log("Service worker registration failed, error:", err);
                    });
            }
        } catch (err) {
            console.log(err);
        }
        // }
    }
    static get(userInfo) {
        if (NotificationHelper.instance == null || NotificationHelper.instance.messaging == null) {
            NotificationHelper.instance = new NotificationHelper(userInfo);
        }
        return NotificationHelper.instance;
    }

    static async acceptFriendRequest(userInfo, dispatch, msgData) {
        let requestData = ACCEPT_FREIND_PAYLOAD;
        requestData.attributes.payload.sourceUserId = userInfo.id;
        requestData.attributes.payload.destinationEmailId = msgData.sourceEmailId;
        requestData.attributes.payload.message = "Accepted.";
        requestData.attributes.payload.deepLink = msgData.link;
        requestData.attributes.payload.linkedEventId = msgData.eventId;
        await eventApi.post("/event", { data: requestData });
        await NotificationHelper.getMessages(userInfo, dispatch, NotificationHelper.currentPage);
    }

    static async getMessages(userInfo, dispatch, page, lastMsg, lastMsgKey) {
        try {
            // NotificationHelper.currentPage = page;
            let limit = 10;
            NotificationHelper.get(userInfo);
            let lastSyncTime = null;
            let userRef = Firebase.database().ref("/organisation/chimp/users/" + userInfo.id);
            userRef.once("value").then(function (snapshot) {
                let temp = snapshot;
                lastSyncTime = temp.child("last_sync_time").val();
            });
            let messageRef = null;

            if (lastMsgKey) {
                console.log(lastMsgKey);
                messageRef = userRef.child("/messages").orderByChild("createdTs").endAt(lastMsg.createdTs).limitToLast(limit);
            } else {
                messageRef = userRef.child("/messages").orderByChild("createdTs").limitToLast(limit);//.startAt((page - 1) * limit).limitToLast(limit);//.orderByChild("read").equalTo(true);I
            }
            let firebaseMessages = [];
            await messageRef.once('value').then(function (snapshot) {
                let temp = snapshot.val();
                if (!temp) {
                    firebaseMessages = [];
                } else {
                    Object.keys(temp).forEach(function (key) {
                        let t = temp[key];
                        if (t.sourceUserId != userInfo.id || true) {
                            t["_key"] = key;
                            // if (t.msg && t.msg[localeCode]) {
                            //     t.msg = t.msg[localeCode];
                            // }
                            /*if (t.messageActions && t.messageActions[localeCode]) {
                                t.messageActions = t.messageActions[localeCode];
                            }*/
                            // if (t.cta && t.cta[localeCode]) {
                            //     t.cta = t.callToActions[localeCode];
                            // }
                            firebaseMessages.push(t);
                        }
                    });
                }
                firebaseMessages.sort(function (a, b) {
                    return a.createdTs > b.createdTs ? -1 : 1;
                });
                console.info(firebaseMessages);
            });
            await firebaseMessageFetchCompleteAction(dispatch, firebaseMessages, lastSyncTime, page);

        } catch (e) {
            console.log(e);
        }
    };

    static async updateLastSyncTime(userInfo, dispatch, lastSyncTime) {
        let userRef = Firebase.database().ref("/organisation/chimp/users/" + userInfo.id);
        userRef.child("last_sync_time").set(lastSyncTime).then(async function () {
        }).catch(function (e) {
            console.log(e);
        });
    }

    static async updateReadFlag(userInfo, dispatch, msgId, msgData, readFlag) {
        msgData["read"] = readFlag;// !msgData["read"];//false;
        let userRef = Firebase.database().ref("/organisation/chimp/users/" + userInfo.id + "/messages");
        userRef.child(msgId).set(msgData).then(async function () {
            // console.log("Marked Msg " + msgId + " REad" + msgData["read"]);
            await NotificationHelper.getMessages(userInfo, dispatch, NotificationHelper.currentPage);
        }).catch(function (e) {
            console.log(e);
        });
    }

    static async updateDeleteFlag(userInfo, dispatch, msgId, msgData, deleted) {
        /*msgData["deleted"] = deleted;
        let userRef = Firebase.database().ref("/organisation/chimp/users/" + userInfo.id + "/messages");
        userRef.child(msgId).set(msgData).then(async function () {
            // console.log("Marked Msg " + msgId + " REad" + msgData["read"]);*/
        await NotificationHelper.getMessages(userInfo, dispatch, NotificationHelper.currentPage);
        setTimeout(function () {
            eventApi.post("/notification/delete", { "user_id": userInfo.id, "id": msgData.id }).then(async function (response) {
                await NotificationHelper.getMessages(userInfo, dispatch, NotificationHelper.currentPage);
            });
            /*userRef.child(msgId).once('value').then(function (snapshot) {
                let temp = snapshot.val();
                if (temp && typeof temp != "undefined" && temp.deleted) {
                    userRef.child(msgId).remove().then(async function () {
                        await NotificationHelper.getMessages(userInfo, dispatch, NotificationHelper.currentPage);
                    }).catch(function (e) {
                        console.error(e);
                    });
                }
            });*/
        }, 10000);
        /*}).catch(function (e) {
            console.log(e);
        });*/
    }

    static timeDifference(current, previous, t) {

        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed = current - previous;

        if (elapsed < msPerMinute) {
            return Math.round(elapsed / 1000) + ' ' + t("secondsAgo");
        } else if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + ' ' + t('minutesAgo');
        } else if (elapsed < msPerDay) {
            return Math.round(elapsed / msPerHour) + ' ' + t('hoursAgo');
        } else if (elapsed < msPerMonth) {
            return Math.round(elapsed / msPerDay) + ' ' + t('daysAgo');
        } else if (elapsed < msPerYear) {
            return Math.round(elapsed / msPerMonth) + ' ' + t('monthsAgo');
        } else {
            return Math.round(elapsed / msPerYear) + ' ' + t('yearsAgo');
        }
    }

    static getMessagePart(msg, userInfo, localeCode) {
        let msgText = msg["msg"][localeCode];
        // console.log(msg["msg"]);
        // console.log(localeCode + "||" + msgText);
        if (msg.highlighted && msg.highlighted.length > 0) {
            msg.highlighted.forEach(function (w) {
                let regEx = new RegExp("{{ " + w + " }}", "g");
                msgText = msgText.replace(regEx, "<b>" + w + "</b>");
            });
        }
        let d = { "sourceDisplayName": msg.sourceDisplayName, "message": msgText, read: msg.read };
        if (msg.sourceUserId == userInfo.id) {
            d.sourceDisplayName = "You";
        }
        return d;
    }

}

export { NotificationHelper };