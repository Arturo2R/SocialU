// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore/lite'
import { ref, getStorage } from 'firebase/storage'
import { getAuth, signOut, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";

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

// const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
auth.languageCode = 'es';
// make the auth state persitence local
setPersistence(auth, browserLocalPersistence)
const letSignOut = signOut(auth);



const db = getFirestore(app);


const storage = getStorage(app, "gs://socialu-c62e6.appspot.com");
const storageRef = ref(storage);
// Create a child reference
const profilesImages = ref(storage, 'profiles');
const postsBanners = ref(storage, 'postsBanners');


// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
export { auth, app, db, letSignOut, storage, storageRef, profilesImages, postsBanners };
