window.hasFocus = true;
// too make it complete, also add onblur to document.
// For browsers using tabs (like firefox)
document.onblur = window.onblur;
document.focus = window.focus;

var events = {
    'onConnectFailed': function (resp) {
        // console.log(resp);
        window.Applozic.ALSocket.reconnect();
    },
    'onConnect': function (resp) {
        console.log("Applozic Web Socket Connection Established!");
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
        //called when a new message is received
        if (resp.message.contentType !== 10 && resp.message.contentType !== 102) {
            window.totalUnreadCount++;
            window.dispatchEvent(new CustomEvent("onUnreadMessageCountUpdate", { detail: { count: window.totalUnreadCount } }));
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
            var onMessageReceived = new CustomEvent("onMessageReceived", { detail: resp });
            window.dispatchEvent(onMessageReceived);
        }
    },
    'onMessageSentUpdate': function (resp) {
        // console.log(resp);
    },
    'onMessageSent': function (resp) {
        //called when the message is sent
        var onMessageSent = new CustomEvent("onMessageSent", { detail: resp });
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
function getCookie(name) {
    var nameEQ = name + "=";
    //alert(document.cookie);
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) != -1) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
window.onblur = function () {
    window.hasFocus = false;
}
window.onfocus = function () {
    window.hasFocus = true;
}
// window.onload = function () {
function registerAppLozic() {
    Applozic.ALApiService.login(
        {
            data: {
                baseUrl: 'https://apps.applozic.com',
                alUser:
                {
                    // userId: localStorage.getItem("userId"), //Logged in user's id, a unique identifier for user
                    userId: getCookie("chimpUserId"),
                    // password: '',//Enter password here for the userId passed above, read this if you want to add additional security by verifying password from your server https://www.applozic.com/docs/configuration.html#access-token-url
                    imageLink: window.userAvatar, //User's profile picture url
                    email: window.userEmail, //optional
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
                //document.title = window.totalUnreadCount + " Unread Msgs";
                // localStorage.setItem("_deviceKey", data.deviceKey);
                // localStorage.setItem("_applozicToken", data.token);
                // localStorage.setItem("_applozicWebsocketUrl", data.websocketUrl);
                document.cookie = "_deviceKey=" + data.deviceKey + ";";
                document.cookie = "_applozicToken=" + data.token + ";";
                document.cookie = "_applozicWebsocketUrl=" + data.websocketUrl + ";";
                //Get your App ID from [Applozic Dashboard](https://console.applozic.com/settings/install)
                window.Applozic.ALSocket.init(window.APPLOZIC_APP_KEY, data, events);
                Notification.requestPermission();
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
            error: function () {

            }
        }
    );
}
(function () { registerAppLozic() })();
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
