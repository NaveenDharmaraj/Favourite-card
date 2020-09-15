const firebaseConfig = {
    get firebaseConfigGetSet() {
        return this.firebaseEnvs;
    },
    set firebaseConfigGetSet(FIREBASE_PARAMS = {}) {
        this.firebaseEnvs = {
            apiKey: FIREBASE_PARAMS[`${this.firebaseEnvKeys.FIREBASE_API_KEY}`], // "AIzaSyCVmEnXltzSaZb38zzjSsAu7_T8LG5jxho",
            authDomain: FIREBASE_PARAMS[`${this.firebaseEnvKeys.FIREBASE_AUTH_DOMAIN}`], // "chimp-fbmobile-dev.firebaseapp.com",
            databaseURL: FIREBASE_PARAMS[`${this.firebaseEnvKeys.FIREBASE_DATABASE_URL}`], // "https://chimp-fbmobile-dev.firebaseio.com",
            projectId: FIREBASE_PARAMS[`${this.firebaseEnvKeys.FIREBASE_PROJECT_ID}`], // "chimp-fbmobile-dev",
            storageBucket: FIREBASE_PARAMS[`${this.firebaseEnvKeys.FIREBASE_STORAGE_BUCKET}`], // "chimp-fbmobile-dev.appspot.com",
            messagingSenderId: FIREBASE_PARAMS[`${this.firebaseEnvKeys.FIREBASE_MSG_SENDER_ID}`] || "745841700240",
            appId: FIREBASE_PARAMS[`${this.firebaseEnvKeys.FIREBASE_APP_ID}`], // "1:745841700240:web:7f010837ea13d384"
        };
    },
    firebaseEnvKeys: {
        FIREBASE_API_KEY: 'FIREBASE_API_KEY',
        FIREBASE_APP_ID: 'FIREBASE_APP_ID',
        FIREBASE_AUTH_DOMAIN: 'FIREBASE_AUTH_DOMAIN',
        FIREBASE_DATABASE_URL: 'FIREBASE_DATABASE_URL',
        FIREBASE_MSG_SENDER_ID: 'FIREBASE_MSG_SENDER_ID',
        FIREBASE_PROJECT_ID: 'FIREBASE_PROJECT_ID',
        FIREBASE_STORAGE_BUCKET: 'FIREBASE_STORAGE_BUCKET',
    },
    firebaseEnvs: {},
};
export default firebaseConfig;
