import { showNotification } from "@mantine/notifications";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider, OAuthProvider, onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut, UserCredential
} from "firebase/auth";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { X } from "tabler-icons-react";
// import { useStore } from "../store";
import { auth } from "../firebase";
import { useFirestore } from "../hooks/useFirestore";

interface googleResponse {
  credential: string;
  clientId: string;
  select_by: string;
}

interface googleDecodedResponse {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  sub: string;
  given_name: string;
  family_name: string;
  locale: string;
}

interface Login {
  email: string;
  password: string;
}

// interface User {
//   email?: string;
//   uid?: string;
//   displayName?: string;
//   photoURL?: string;
//   username?: string;
//   phoneNumber?: number;
//   description?: string;
// }

interface AuthContextInterface {
  signup(email: string, password: string): Promise<UserCredential>;
  login(email: string, password: string): Promise<UserCredential>;
  user: UserState | null;
  setUser: Function
  logout(): void;
  valid: boolean|string;
  loading: boolean;
  loginWithGoogle(): Promise<UserCredential>;
  loginWithMicrosoft(): Promise<UserCredential>;
  resetPassword(email: string): Promise<void>;
  loginWithGoogleOneTap(response: googleResponse): Promise<UserCredential>;
}
interface University {
  name: string;
  domain: string;
}
interface superUser {
  email: string;
  uid: string;
  displayName?: string;
  photoURL?: string;
  username?: string;
  phoneNumber?: number;
  university: University;
  description?: string;
  carrer?: string;
}

export const authContext = createContext<AuthContextInterface | undefined>(
  undefined
);

const allowedUniversities: University[] = [
  { name: "Universidad Del Norte", domain: "uninorte.edu.co" },
];

export const StudentValidation = (email: string): boolean => {
  const emailDomainRegex = /([a-z]*)@([a-z]*.[a-z]*.[a-z]*)/gm;
  let validated: boolean = false;
  let hostDomain = email;

  if (email.includes("@")) {
    const emailDomain: string[] = emailDomainRegex.exec(email) || [
      "lalama.com",
      "lalalama.com",
      "lalama.com",
    ];
    hostDomain = emailDomain[2];
  }

  // console.log(email);

  validated = allowedUniversities.some((item) => {
    return item.domain === hostDomain;
  });

  // console.log("funcion student validation escupe ", validated);
  return validated;
};

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("There is no Auth provider");
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,  setUser] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState<boolean | "unset">("unset");
  // state for superUser
  // const [superUser, setSuperUser] = useState<superUser | undefined>(undefined);

  const { createOrFetchUser, updateProfile:updateFirestoreProfile } = useFirestore();

  const router = useRouter();

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const loginWithMicrosoft = () => { 
    const microsoftProvider = new OAuthProvider('microsoft.com');
    microsoftProvider.setCustomParameters({
      // Force re-consent.
      prompt: 'select_account',

      // Target specific email with login hint.
      login_hint: "usuario@uninorte.edu.co",
      login_type: "popup",
     // select_account: "true",
     // use_account: "true",
     domain_hint: "uninorte.edu.co",
    // redirect_uri: "https://socialu-c62e6.firebaseapp.com/__/auth/handler",
    });
    return signInWithPopup(auth, microsoftProvider);
  };

  const loginWithGoogle = () => {
 // console.log("google provider");
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      login_hint: "usuario@uninorte.edu.co",
      login_type: "popup",
      prompt: "select_account",
      select_account: "true",
      use_account: "true",
      hd: "uninorte.edu.co",
    });
    return signInWithPopup(auth, googleProvider);
  };

  const loginWithGoogleOneTap = (
    response: googleResponse
  ): Promise<UserCredential> => {
 // console.log("google one tap");
    const data: googleDecodedResponse = jwt_decode(response.credential);
 // console.log(data);
    const cred = GoogleAuthProvider.credential(response.credential);
    // Sign in with credential from the Google user.
    // console.log(user)
    return signInWithCredential(auth, cred);
  };

  const logout = () => {
 // console.log("Se fue");
    setUser(null);
    setValid("unset");
    signOut(auth);
    showNotification({
      id: "log-out",
      
      autoClose: 5000,
      title: "Has cerrado Sesión",
      color: "red",
      message: "Hasta pronto",
      icon: <X />,
    });
  };

  const resetPassword = async (email: string): Promise<void> =>
    sendPasswordResetEmail(auth, email);

    // const updateUser =(configurationData:any)=>{
    //   auth?.currentUser && updateProfile(auth.currentUser, configurationData).then(() => {
    //   auth?.currentUser?.uid && updateFirestoreProfile(auth.currentUser.uid, configurationData)
    // }).catch((error) => {
    //// console.log(error)
    // });
    // }

const updateInfo = 

  useEffect(() => {
 // console.log("unsubuscribe effect", valid);
    const unsubuscribe = onAuthStateChanged(auth, (currentUser: any) => {
      if (currentUser) {
        setUser(currentUser);
        // console.log({ currentUser });
        createOrFetchUser(currentUser, setUser);
        setLoading(false);
     // console.log("elusuario", user);
      } else {
     // console.log("No hay usuario");
      }
    });
    return () => unsubuscribe();
  }, [auth]);

  useEffect(() => {
 // console.log("antes de validar el correo ", user?.email, " es", valid);
    if (user?.email) {
      const quees = StudentValidation(user.email);
   // console.log("la validacion es", quees);
      setValid(quees);
    }
 // console.log("despues de validar el correo ", user?.email, " es", valid);
  }, [user]);

  
useEffect(() => {
    if (valid === false) {
      logout();
      showNotification({
        id: "get-out",
        
        autoClose: 5000,
        title: "No Estas Permitido",
        message:
          "No estas usando un correo universtario de una de nuestras universidades permitidas",
        color: "red",
        icon: <X/>,
        // className: "my-notification-class",
      });
    }
  }, [valid]);

  return (
    <authContext.Provider
      value={{
        signup,
        login,
        user,
        setUser,
        logout,
        valid,
        loading,
        loginWithGoogle,
        loginWithMicrosoft,
        resetPassword,
        loginWithGoogleOneTap,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
