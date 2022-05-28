// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, indexedDBLocalPersistence, browserLocalPersistence, setPersistence, signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyAmlz9P2IVzUnlLMKZt12yhGlOzvOGFHTY",
  authDomain: "socialu-c62e6.firebaseapp.com",
  projectId: "socialu-c62e6",
  storageBucket: "socialu-c62e6.appspot.com",
  messagingSenderId: "931771205523",
  appId: "1:931771205523:web:7adf6fc79f62422fbbca66",
  measurementId: "G-7NBJYR8P0Y"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig)

const db = getFirestore(app);

// let analytics = getAnalytics(app)

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app)//.setPersistence(browserLocalPersistence)
auth.languageCode = 'es';

const letSignOut = () => signOut(auth).catch((error) => sendError(error));

enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
    }
  });



const storage = getStorage(app, "gs://socialu-c62e6.appspot.com");
const storageRef = ref(storage);
// Create a child reference
const profilesImages = ref(storage, 'profiles');
const postsBanners = ref(storage, 'postsBanners');


// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
export { auth, app, db, letSignOut, storage, storageRef, profilesImages, postsBanners };
