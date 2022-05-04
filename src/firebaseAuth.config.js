import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, provider } from './firebase'; // update path to your firestore config

export const googleHandler = async () => {
  provider.setCustomParameters({ prompt: 'select_account' });
  return signInWithPopup(auth, provider)
  // .then((result) => {
  //   // This gives you a Google Access Token. You can use it to access the Google API.
  //   const credential = GoogleAuthProvider.credentialFromResult(result);
  //   const token = credential.accessToken;
  //   // The signed-in user info.
  //   const user = result.user;
  //   // redux action? --> dispatch({ type: SET_USER, user });
  //   console.log(user, token)
  // })
  // .catch((error) => {
  //   // Handle Errors here.
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  //   // The email of the user's account used.
  //   const email = error.email;
  //   // The AuthCredential type that was used.
  //   const credential = GoogleAuthProvider.credentialFromError(error);
  //   // 
  // });
};


export const useSignOut = () => {
  signOut(auth)
    .then(() => {
      console.log('logged out');
      // navigate('/welcome');
    })
    .catch((error) => {
      console.log(error);
    });
}
