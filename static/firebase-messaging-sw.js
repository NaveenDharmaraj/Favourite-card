// console.log(self);
// console.log("Adding Event Listener");
self.addEventListener('notificationclick', function (event) {
  console.log('notification open');
  console.log(event);
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.currentTarget.origin + "/notifications/all")
  );
});


importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyCVmEnXltzSaZb38zzjSsAu7_T8LG5jxho",
  authDomain: "chimp-fbmobile-dev.firebaseapp.com",
  databaseURL: "https://chimp-fbmobile-dev.firebaseio.com",
  projectId: "chimp-fbmobile-dev",
  storageBucket: "chimp-fbmobile-dev.appspot.com",
  messagingSenderId: "745841700240",
  appId: "1:745841700240:web:7f010837ea13d384"
});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
  const promiseChain = clients.matchAll({
    type: "window",
    includeUncontrolled: true
  }).then(windowClients => {
    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      console.log(windowClient);
      windowClient.postMessage(payload);
    }
  }).then(() => {
    return registration.showNotification("Chimp Notification");
  });
  return promiseChain;
});

