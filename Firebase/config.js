import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_DATABASE_URL, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MSG_SENDER_ID, FIREBASE_APP_ID } = publicRuntimeConfig;
const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,//"AIzaSyCVmEnXltzSaZb38zzjSsAu7_T8LG5jxho",
    authDomain: FIREBASE_AUTH_DOMAIN,//"chimp-fbmobile-dev.firebaseapp.com",
    databaseURL: FIREBASE_DATABASE_URL,//"https://chimp-fbmobile-dev.firebaseio.com",
    projectId: FIREBASE_PROJECT_ID,//"chimp-fbmobile-dev",
    storageBucket: FIREBASE_STORAGE_BUCKET,// "chimp-fbmobile-dev.appspot.com",
    messagingSenderId: FIREBASE_MSG_SENDER_ID,// "745841700240",
    appId: FIREBASE_APP_ID//"1:745841700240:web:7f010837ea13d384"
};
export default firebaseConfig;