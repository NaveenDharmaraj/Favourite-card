const firebaseConfig = {
    get firebaseConfigGetSet() {
        return this.firebaseEnvs;
    },
    set firebaseConfigGetSet(FIREBASE_PARAMS = {}) {
        this.firebaseEnvs = {
            apiKey: FIREBASE_PARAMS[`${this.firebaseEnvKeys.FIREBASE_API_KEY}`],
            authDomain: FIREBASE_PARAMS[`${this.firebaseEnvKeys.FIREBASE_AUTH_DOMAIN}`],
            databaseURL: FIREBASE_PARAMS[`${this.firebaseEnvKeys.FIREBASE_DATABASE_URL}`],
            projectId: FIREBASE_PARAMS[`${this.firebaseEnvKeys.FIREBASE_PROJECT_ID}`],
            storageBucket: FIREBASE_PARAMS[`${this.firebaseEnvKeys.FIREBASE_STORAGE_BUCKET}`],
            messagingSenderId: FIREBASE_PARAMS[`${this.firebaseEnvKeys.FIREBASE_MSG_SENDER_ID}`] || '745841700240',
            appId: FIREBASE_PARAMS[`${this.firebaseEnvKeys.FIREBASE_APP_ID}`],
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
