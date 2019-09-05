import React from 'react';
import { connect } from 'react-redux';
import { Firebase } from "./init";
import { firebaseMessageFetchCompleteAction } from "../actions/firebase";
import _ from 'lodash';

class FirebaseHelper {
    static instance = null;
    messaging = null;
    constructor(...args) {
        let fbHelper = this;
        fbHelper.messaging = Firebase.messaging();
        // if (!FirebaseHelper.messageConfigDone) {
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
                            await FirebaseHelper.getMessages({ test: true }, dispatch);
                        });

                        console.log("Registration successful, scope is:", registration.scope);
                        FirebaseHelper.messageConfigDone = true;
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
    static get() {
        if (FirebaseHelper.instance == null || FirebaseHelper.instance.messaging == null) {
            FirebaseHelper.instance = new FirebaseHelper();
        }
        return FirebaseHelper.instance;
    }

    static async getMessages(params, dispatch) {
        try {
            FirebaseHelper.get();
            //999988
            let ref = Firebase.database().ref("/organisation/chimp/users/888000/messages");
            let firebaseMessages = [];
            await ref.once('value').then(function (snapshot) {
                let temp = snapshot.val();
                if (!temp) {
                    firebaseMessages = [];
                } else {
                    Object.keys(temp).forEach(function (key) {
                        let t = temp[key];
                        t["_key"] = key;
                        firebaseMessages.push(t);
                        // // firebaseMessages.push(t);
                        // // firebaseMessages.push(t);
                        // // firebaseMessages.push(t);
                        // // firebaseMessages.push(t);
                        // // firebaseMessages.push(t);
                        // if (params.test) {
                        //     // firebaseMessages.push(t);
                        //     // firebaseMessages.push(t);
                        //     // firebaseMessages.push(t);
                        //     // firebaseMessages.push(t);
                        //     // firebaseMessages.push(t);
                        //     // firebaseMessages.push(t);
                        // }
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


    static async markAsRead(msgId, msgData, dispatch) {
        msgData["read"] = !msgData["read"];//false;
        let userRef = Firebase.database().ref("/organisation/chimp/users/888000/messages");
        userRef.child(msgId).set(msgData).then(function () {
            console.log("Marked Msg " + msgId + " REad" + msgData["read"]);
        }).catch(function (e) {
            console.log(e);
        });
    }
}

export default FirebaseHelper;