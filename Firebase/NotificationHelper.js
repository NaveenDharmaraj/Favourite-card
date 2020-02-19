// import { Firebase } from "./init";
import * as Firebase from "firebase/app";
import 'firebase/database';
import firebaseConfig from "./config";
import getConfig from 'next/config';
import { firebaseMessageFetchCompleteAction } from "../actions/firebase";
import _ from 'lodash';
import eventApi from '../services/eventApi';
const ACCEPT_FREIND_PAYLOAD = {
    "attributes": {
        "source": "web",
        "acceptor_email_id": "",
        "acceptor_user_id": 0,
        "acceptor_avatar_link": "",
        "acceptor_first_name": "",
        "requester_user_id": 0,
        "requester_email_id": "",
        "friend_request_event_id": "",
    }
};
const { publicRuntimeConfig } = getConfig();
const {
    FIREBASE_PUBLIC_API_KEY
} = publicRuntimeConfig;

class NotificationHelper {
    static instance = null;
    static currentPage = null;
    messaging = null;
    userInfo = null;
    constructor(userInfo) {
        let fbHelper = this;
        try { Firebase.getInstance() } catch (err) {
            try {
                if (!Firebase.apps.length) {
                    Firebase.initializeApp(firebaseConfig);
                } else {
                    Firebase.app();
                }
            } catch (e) {
                console.error(e);
            }
        }
        // fbHelper.messaging = Firebase.messaging();
        // fbHelper.userInfo = userInfo;
    }
    static get(userInfo) {
        if (NotificationHelper.instance == null || NotificationHelper.instance.messaging == null) {
            NotificationHelper.instance = new NotificationHelper(userInfo);
        }
        return NotificationHelper.instance;
    }

    static async acceptFriendRequest(userInfo, dispatch, msgData) {
        const {
            cta: {
                accept: {
                    user_id,
                    user_email_id,
                },
            },
        } = msgData;
        let requestData = ACCEPT_FREIND_PAYLOAD;
        requestData.attributes.acceptor_email_id = userInfo.attributes.email,
        requestData.attributes.acceptor_user_id = Number(userInfo.id);
        requestData.attributes.acceptor_avatar_link = userInfo.attributes.avatar,
        requestData.attributes.acceptor_first_name = userInfo.attributes.firstName;
        requestData.attributes.acceptor_display_name = userInfo.attributes.displayName;

        requestData.attributes.requester_user_id = user_id;
        requestData.attributes.requester_email_id = user_email_id;
        requestData.attributes.friend_request_event_id = msgData.id;
        eventApi.post("/friend/accept", { data: requestData }).then(function(resp){
        });
    }

    static firebaseInitialLoad = async(userInfo, dispatch )=> {
            const limit = 10;
            NotificationHelper.get(userInfo);
            let userRef = Firebase.database().ref("/organisation/chimp/users/" + userInfo.id);
            let lastSyncTime = null;
            userRef.on("value", snapshot => {
                let temp = snapshot;
                lastSyncTime = temp.child("last_sync_time").val();
                dispatch({
                    type: 'FIREBASE_LAST_SYNC_TIME',
                    payload: {
                        lastSyncTime,
                    }
                  });
            });
    
            const messageRef = userRef.child("/messages");
            const showMessages = messageRef.orderByChild("createdTs").limitToLast(limit);
            await showMessages.once("value", snapshot => {
                let firebaseMessages = [];
                let temp = snapshot.val();
                if (!temp) {
                    firebaseMessages = [];
                } else {
                    firebaseMessages = [];
                    Object.keys(temp).forEach(function (key) {
                        let t = temp[key];
                        if (t.sourceUserId != userInfo.id || true) {
                            t["_key"] = key;
                            if(!_.isEmpty(t)){
                                firebaseMessages.push(t);
                            }
                        }
                    });
                    firebaseMessages.sort(function (a, b) {
                        return a.createdTs > b.createdTs ? -1 : 1;
                    });
                }
              dispatch({
                type: 'FIREBASE_INITIAL_LOAD',
                payload: {
                    firebaseMessages,
                    lastSyncTime,
                    loaded: false,
                    page: 1,
                }
              });
            });

            messageRef.limitToLast(1).on('child_added', function(snapshot) {
                const temp = snapshot.val();
                temp._key = snapshot.key;
                dispatch({
                    type: 'ADD_NEW_FIREBASE_MESSAGE',
                    payload: {
                        addedMessage: temp,
                        lastSyncTime,
                        notificationUpdate: true,
                    }
                });
            });

            messageRef.on('child_changed', function(snapshot) {
                const temp = snapshot.val();
                temp._key = snapshot.key;
                dispatch({
                    type: 'UPDATE_FIREBASE_MESSAGE',
                    payload: {
                        addedMessage: temp,
                        lastSyncTime,
                        notificationUpdate: true,
                    }
                });
            });
            messageRef.on('child_removed', function(snapshot) {
                const temp = snapshot.val();
                temp._key = snapshot.key;
                dispatch({
                    type: 'REMOVE_FIREBASE_MESSAGE',
                    payload: {
                        deletedMessage: temp,
                        lastSyncTime,
                        notificationUpdate: false,
                    }
                });
            });

    };


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
                            firebaseMessages.push(t);
                        }
                    });
                }
                firebaseMessages.sort(function (a, b) {
                    return a.createdTs > b.createdTs ? -1 : 1;
                });
            });
            firebaseMessageFetchCompleteAction(dispatch, firebaseMessages, lastSyncTime, page);

        } catch (e) {
            // console.log(e);
        }
    };

    static async updateLastSyncTime(userInfo, dispatch, lastSyncTime) {
        let userRef = Firebase.database().ref("/organisation/chimp/users/" + userInfo.id);
        userRef.child("last_sync_time").set(lastSyncTime).then(async function () {
        }).catch(function (e) {
            // console.log(e);
        });
    }

    static getMessagePart(msg, userInfo, localeCode) {
        let msgText = msg["msg"][localeCode];
        if (msg.highlighted && msg.highlighted.length > 0) {
            msg.highlighted.forEach(function (w) {
                // let regEx = new RegExp("{{ " + w + " }}", "g");
                msgText = msgText.replace(/{{/g, "<b>");
                msgText = msgText.replace(/}}/g, "</b>");
            });
        }        
        let d = {
            "sourceDisplayName": msg.sourceDisplayName,
            "message": msgText,
            read: msg.read,
            sourceImageLink: msg.avatar_link
        };
        if (msg.sourceUserId == userInfo.id) {
            d.sourceDisplayName = "You";
        }
        return d;
    }

}

export { NotificationHelper };
