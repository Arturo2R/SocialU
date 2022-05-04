// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore'
import { getAuth, signOut, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from "firebase/auth";

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

const db = getFirestore(app);

const provider = new GoogleAuthProvider();

const letSignOut = signOut(auth);

// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
export { auth, app, db, provider, letSignOut }


// provider.setCustomParameters({
//   'login_hint': 'user@example.com'
// });

// onAuthStateChanged(auth, user => console.log(`Hi ${user}`))

// signInWithPopup(auth, provider)
//   .then((result) => {
//     // This gives you a Google Access Token. You can use it to access the Google API.
//     const credential = GoogleAuthProvider.credentialFromResult(result);
//     const token = credential.accessToken;
//     // The signed-in user info.
//     const user = result.user;
//     // ...
//   }).catch((error) => {
//     // Handle Errors here.
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // The email of the user's account used.
//     const email = error.email;
//     // The AuthCredential type that was used.
//     const credential = GoogleAuthProvider.credentialFromError(error);
//     // ...
//   });

// createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ..
//   });


// export const uiConfig = {
//   // Popup signin flow rather than redirect flow.
//   signInFlow: 'popup',
//   // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
//   signInSuccessUrl: '/',
//   // We will display Google and Facebook as auth providers.
//   signInOptions: [
//     GoogleAuthProvider.,
//     firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//   ],
// };