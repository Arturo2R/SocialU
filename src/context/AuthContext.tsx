import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  deleteUser,
  signInWithCredential,
  UserCredential,
} from "firebase/auth";
import { auth } from "../firebase";

import { Cross1Icon } from "@modulz/radix-icons";
import jwt_decode from "jwt-decode";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";

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

interface User {
  email?: string;
  uid?: string;
  displayName?: string;
  photoURL?: string;
  username?: string;
  phoneNumber?: number;
  description?: string;
}

interface AuthContextInterface {
  signup(email: string, password: string): Promise<UserCredential>;
  login(email: string, password: string): Promise<UserCredential>;
  user: User | null;
  logout(): void;
  loading: boolean;
  loginWithGoogle(): Promise<UserCredential>;
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

const emailDomainRegex = /([a-z]*)@([a-z]*.[a-z]*.[a-z]*)/gm;

const allowedUniversities: University[] = [
  { name: "Universidad Del Norte", domain: "uninorte.edu.co" },
];

export const StudentValidation = (email: string): boolean => {
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

  console.log(email);

  validated = allowedUniversities.some((item) => {
    return item.domain === hostDomain;
  });

  console.log("funcion student validation escupe ", validated);
  return validated;
};

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("There is no Auth provider");
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState<boolean | "unset">("unset");
  // state for superUser
  const [superUser, setSuperUser] = useState<superUser | undefined>(undefined);

  const router = useRouter();

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    console.log("google provider");
    const googleProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleProvider);
  };

  const loginWithGoogleOneTap = (
    response: googleResponse
  ): Promise<UserCredential> => {
    console.log("google one tap");
    const data: googleDecodedResponse = jwt_decode(response.credential);
    console.log(data);
    const cred = GoogleAuthProvider.credential(response.credential);
    // Sign in with credential from the Google user.
    // console.log(user)
    return signInWithCredential(auth, cred);
  };

  // globalThis.window.loginWithGoogleOneTap = (
  //   response: googleResponse
  // ): Promise<UserCredential> => {
  //   console.log("google one tap");
  //   const data: googleDecodedResponse = jwt_decode(response.credential);
  //   console.log(data);
  //   const cred = GoogleAuthProvider.credential(response.credential);
  //   // Sign in with credential from the Google user.
  //   // console.log(user)
  //   return signInWithCredential(auth, cred);
  // };

  const logout = () => {
    setValid("unset");
    signOut(auth);
    showNotification({
      id: "log-out",
      disallowClose: true,
      autoClose: 5000,
      title: "Has cerrado Sesión",
      color: "red",
      message: "Hasta pronto",
      icon: <Cross1Icon />,
    });
  };

  const resetPassword = async (email: string): Promise<void> =>
    sendPasswordResetEmail(auth, email);

  useEffect(() => {
    console.log("unsubuscribe effect", valid);
    const unsubuscribe = onAuthStateChanged(auth, (currentUser: any) => {
      console.log({ currentUser });
      setUser(currentUser);
      setLoading(false);
    });
    console.log(superUser);
    return () => unsubuscribe();
  }, []);

  useEffect(() => {
    console.log("antes de validar el correo ", user?.email, " es", valid);
    if (user?.email) {
      const quees = StudentValidation(user.email);
      console.log("la validacion es", quees);
      setValid(quees);
    }
    console.log("despues de validar el correo ", user?.email, " es", valid);
  }, [user]);

  useEffect(() => {
    console.log("valid cambió a ", valid);
    if (valid === true) {
      console.log("is valid");
      router.push("/");
      // setSuperUser({
      //   //ts-ignore
      //   email: user.email,
      //   uid: user.uid,
      //   displayName: user.displayName,
      //   photoURL: user.photoURL,
      //   // username: user.username,
      //   phoneNumber: user.phoneNumber || undefined,
      //   university: {
      //     name: "Universidad Del Norte",
      //     domain: "uninorte.edu.co",
      //   },
      //   // description: currentUser.description,
      // });
      console.log(superUser);
      showNotification({
        id: "welcome",
        disallowClose: true,
        autoClose: 5000,
        title: "Bienvenido",
        message: "Bienvenido a la aplicación",
        color: "orange",
        className: "my-notification-class",
      });
    }
    if (valid === false) {
      logout();
      showNotification({
        id: "get-out",
        disallowClose: true,
        autoClose: 5000,
        title: "No Estas Permitido",
        message:
          "No estas usando un correo universtario de una de nuestras universidades permitidas",
        color: "red",
        icon: <Cross1Icon />,
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
        logout,
        loading,
        loginWithGoogle,
        resetPassword,
        loginWithGoogleOneTap,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
