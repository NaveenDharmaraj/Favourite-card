import { Firebase } from "./init";
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

class NotificationHelper {
    static instance = null;
    messaging = null;
    userInfo = null;
    constructor(userInfo) {
        let fbHelper = this;
        fbHelper.messaging = Firebase.messaging();
        fbHelper.userInfo = userInfo;
        // if (!NotificationHelper.messageConfigDone) {
        try {
            console.log(fbHelper.messaging.publicVapidKeyToUse);
            //usePublicVapidKey function should be called only once.
            fbHelper.messaging.usePublicVapidKey(
                // Project Settings => Cloud Messaging => Web Push certificates
                "BBtmpfGlMgEid3h1Fdi0Euv5bQYEzQR4QDzDKI7bTbujc-EfLXWv_q8dJDIxqxfoo812Qx1ahR1pvUlEMHoViLg"
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
                            console.log(payload);
                            await NotificationHelper.getMessages({ test: true }, dispatch);
                        });

                        console.log("Registration successful, scope is:", registration.scope);
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
        await NotificationHelper.getMessages(userInfo, dispatch);
    }

    static async getMessages(userInfo, dispatch) {
        try {
            NotificationHelper.get(userInfo);
            //999988
            let ref = Firebase.database().ref("/organisation/chimp/users/" + userInfo.id + "/messages");
            let firebaseMessages = [];
            await ref.once('value').then(function (snapshot) {
                let temp = snapshot.val();
                if (!temp) {
                    firebaseMessages = [];
                } else {
                    Object.keys(temp).forEach(function (key) {
                        let t = temp[key];
                        if (t.sourceUserId != userInfo.id || true) {
                            t["_key"] = key;
                            firebaseMessages.push(t);
                        }
                    });
                }
                firebaseMessages.sort(function (a, b) {
                    return a.createdTs > b.createdTs ? -1 : 1;
                });
                console.log(Object.keys(firebaseMessages).length + " Messages Received.");
                console.info(firebaseMessages);
            });
            await firebaseMessageFetchCompleteAction(dispatch, firebaseMessages);
        } catch (e) {
            console.log(e);
        }
    };


    static async markAsRead(userInfo, dispatch, msgId, msgData) {
        msgData["read"] = !msgData["read"];//false;
        let userRef = Firebase.database().ref("/organisation/chimp/users/" + userInfo.id + "/messages");
        userRef.child(msgId).set(msgData).then(async function () {
            console.log("Marked Msg " + msgId + " REad" + msgData["read"]);
            await NotificationHelper.getMessages(userInfo, dispatch);
        }).catch(function (e) {
            console.log(e);
        });
    }


}

export { NotificationHelper };