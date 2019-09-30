import { Firebase } from "./init";
import { firebaseMessageFetchCompleteAction } from "../actions/firebase";
import _ from 'lodash';
import applozicApi from '../services/applozicApi';
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

class ChatHelper {
    static instance = null;
    messaging = null;
    userInfo = null;
    constructor(userInfo) {
        let fbHelper = this;
        fbHelper.messaging = Firebase.messaging();
        fbHelper.userInfo = userInfo;
        // if (!ChatHelper.messageConfigDone) {
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
                            await ChatHelper.getMessages({ test: true }, dispatch);
                        });

                        console.log("Registration successful, scope is:", registration.scope);
                        ChatHelper.messageConfigDone = true;
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
        if (ChatHelper.instance == null || ChatHelper.instance.messaging == null) {
            ChatHelper.instance = new ChatHelper(userInfo);
        }
        return ChatHelper.instance;
    }
    getOrRegisterUser(userInfo) {
        applozicApi.post("https://apps.applozic.com/rest/ws/register/client", { data: { userId: userInfo.id, applicationId: "3c89339c82e4b307fb591f5b5c6e381f7" } });
    }
    getMessageHeads() { }
    getUserMessages() { }
    getGroupMessages() { }
    sendMessage() { }
    createGroup() { }
}

export { ChatHelper };