// import * as firebase from "firebase/app";
import Firebase from "firebase";
import firebaseConfig from "./config";

try { Firebase.getInstance() } catch (err) {
    try {
        Firebase.initializeApp(firebaseConfig);
    } catch (e) {
        console.log(e);
    }
}

export { Firebase };