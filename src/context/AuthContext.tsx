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
} from "firebase/auth";
import { auth } from "../firebase";

import { Cross1Icon } from "@modulz/radix-icons";
import jwt_decode from "jwt-decode";
import { showNotification } from "@mantine/notifications";

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
  email: string;
}

interface AuthContextInterface {
  signup(email: string, password: string): Promise<void>;
  login(email: string, password: string): Promise<void>;
  user: User;
  logout(): void;
  loading: boolean;
  loginWithGoogle(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  loginWithGoogleOneTap(): Promise<void>;
}

export const authContext = createContext<AuthContextInterface | undefined>(
  undefined
);

const emailDomainRegex = /([a-z]*)@([a-z]*.[a-z]*.[a-z]*)/gm;

const allowedUniversities = [
  { name: "Universidad Del Norte", domain: "uninorte.edu.co" },
];

const StudentValidation = (email: string): boolean => {
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
  const [user, setUser] = useState<User>({ email: "" });
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState<boolean | "unset">("unset");

  // const router = useRouter();

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

  const loginWithGoogleOneTap = (response: googleResponse) => {
    console.log("google one tap");
    const data: googleDecodedResponse = jwt_decode(response.credential);
    console.log(data);
    const cred = GoogleAuthProvider.credential(response.credential);
    // Sign in with credential from the Google user.
    // console.log(user)
    return signInWithCredential(auth, cred);
  };

  const logout = () => signOut(auth);

  const resetPassword = async (email: string) =>
    sendPasswordResetEmail(auth, email);

  useEffect(() => {
    console.log("unsubuscribe effect");
    const unsubuscribe = onAuthStateChanged(auth, (currentUser: any) => {
      console.log({ currentUser });
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubuscribe();
  }, []);

  useEffect(() => {
    if (user?.email) {
      setValid(StudentValidation(user.email));
    }
  }, [user]);

  useEffect(() => {
    if (valid === true) {
      console.log("is valid");
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
      // deleteUser(thisUser)
      //   .then(() => {
      //     console.log("Deleted el caremonda");
      //   })
      //   .catch((error) => {
      //     // An error ocurred
      //     // ...
      //   });
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
