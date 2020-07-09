// window.hasFocus = true;
// // too make it complete, also add onblur to document.
// // For browsers using tabs (like firefox)
// document.onblur = window.onblur;
// document.focus = window.focus;

var events = {
    'onConnectFailed': function (resp) {
        // console.log(resp);
        window.Applozic.ALSocket.reconnect();
    },
    'onConnect': function (resp) {
        // console.log("Applozic Web Socket Connection Established!");
    },
    'onMessageDelivered': function (resp) {
        // console.log(resp);
    },
    'onMessageRead': function (resp) {
        //called when a message is read by the receiver
        // console.log(resp);
    },
    'onMessageDeleted': function (resp) { },
    'onConversationDeleted': function (resp) { },
    'onUserConnect': function (resp) {
        // console.log(resp);
    },
    'onUserDisconnect': function (resp) { },
    'onConversationReadFromOtherSource': function (resp) {
        // console.log(resp);
    },
    'onConversationRead': function (resp) {
        //called when the conversation thread is read by the receiver
        // console.log(resp);
    },
    'onMessageReceived': function (resp) {
        // type: 5 - Sent Message, 4 - Received Message
        //contentType: 0 - Standard Chat Message
        //contentType = 10 is for action haapend in groups likee adding meembers
        //called when a new message is received
        if (resp.message.contentType !== 102) {
            window.totalUnreadCount++;

            // Incrementing unread count expect for group action
            resp.message.contentType !== 10 ? window.dispatchEvent(new CustomEvent("onUnreadMessageCountUpdate", { detail: { count: window.totalUnreadCount } }))
                : null;
            // document.title = window.totalUnreadCount + " Unread Msgs";
            /*if (!window.hasFocus) {
                Notification.requestPermission(function (permission) {
                    // If the user accepts, let's create a notification
                    if (permission === "granted") {
                        var notification = new Notification("New Message Received.");
                        notification.onclick = function (e) { console.log(e); window.focus(); };
                    }
                });
            } else {

            }*/
            var onMessageReceived = new CustomEvent("onMessageReceived", { detail: {resp, received: 'received'} });
            window.dispatchEvent(onMessageReceived);
        }
    },
    'onMessageSentUpdate': function (resp) {
        // console.log(resp);
    },
    'onMessageSent': function (resp) {
        //called when the message is sent
        let onMessageSent = new CustomEvent("onMessageSent", { detail: {resp, sent : 'sent'} });
        window.dispatchEvent(onMessageSent);
    },
    'onUserBlocked': function (resp) { },
    'onUserUnblocked': function (resp) { },
    'onUserActivated': function (resp) { },
    'onUserDeactivated': function (resp) { },
    'connectToSocket': function (resp) {
        // console.log(resp);
    },
    'onMessage': function (resp) {
        //called when the websocket receive the data
        var onMessageEvent = new CustomEvent("onMessageEvent", { detail: resp });
        window.dispatchEvent(onMessageEvent);
    },
    'onTypingStatus': function (resp) {
        // console.log(resp);
    }
};

// window.onblur = function () {
//     window.hasFocus = false;
// }
// window.onfocus = function () {
//     window.hasFocus = true;
// }
// window.onload = function () {
const registerAppLozic = (id) => {
    if (undefined != window.Applozic) {
        Applozic.ALApiService.login(
            {
                data: {
                    baseUrl: window.APPLOZIC_BASE_URL,//'https://apps.applozic.com'
                    alUser:
                    {
                        userId: id,
                        // password: '',//Enter password here for the userId passed above, read this if you want to add additional security by verifying password from your server https://www.applozic.com/docs/configuration.html#access-token-url
                        imageLink: window.userAvatar, //User's profile picture url
                        email: window.userEmail, //optional
                        displayName: window.userFirstName + " " + window.userLastName,
                        // contactNumber: '', //optional, pass with internationl code eg: +13109097458
                        appVersionCode: 108,
                        applicationId: window.APPLOZIC_APP_KEY, //Get your App ID from [Applozic Dashboard](https://console.applozic.com/settings/install)
                    }
                },
                success: function (response) {
                    var data = {};
                    data.token = response.token;
                    data.deviceKey = response.deviceKey;
                    data.websocketUrl = response.websocketUrl;
                    window.totalUnreadCount = response.totalUnreadCount;

                    //is this code requiredd????????
                    document.cookie = "_deviceKey=" + data.deviceKey + ";";
                    document.cookie = "_applozicToken=" + data.token + ";";
                    document.cookie = "_applozicWebsocketUrl=" + data.websocketUrl + ";";
                    //Get your App ID from [Applozic Dashboard](https://console.applozic.com/settings/install)
                    window.Applozic.ALSocket.init(window.APPLOZIC_APP_KEY, data, events);
                    // Notification.requestPermission();
                    window.dispatchEvent(new CustomEvent("applozicAppInitialized", { detail: { data: response, count: window.totalUnreadCount } }));
                    window.dispatchEvent(new CustomEvent("onUnreadMessageCountUpdate", { detail: { count: window.totalUnreadCount } }));
                    /*Applozic.ALApiService.getMessages({
                        data:
                        {
                            startIndex: 0,
                            mainPageSize: 5
                        },
                        success: function (response) {
                            response.totalUnreadCount = window.totalUnreadCount;
                            var onMessagesListLoad = new CustomEvent("onMessagesListLoad", { detail: response });
                            window.dispatchEvent(onMessagesListLoad);
                        },
                        error: function () { }
                    });*/
                    // This method initializes socket connection
                },
                error: function (error) {
                    console.log(error)
                }
            }
        );
    } else {
        setTimeout(() => {
            registerAppLozic();
        }, 2000);
    }
}
// (function () { registerAppLozic() })();
// window.onload = function () {
//     registerAppLozic();
// };
// };
/*
(function (d, m) {
    var s, h;
    s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = "https://apps.applozic.com/sidebox.app";
    h = document.getElementsByTagName('head')[0];
    h.appendChild(s);
    window.Applozic = m;
    m.init = function (t) { m._globals = t; }
})(document, window.Applozic || {});*/

export {
    registerAppLozic as default,
};
