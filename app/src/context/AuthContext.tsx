import {
  // createUserWithEmailAndPassword,
  // GoogleAuthProvider, 
  // sendPasswordResetEmail,
  // signInWithCredential,
  // signInWithEmailAndPassword,
  // UserCredential
  onAuthStateChanged,
  OAuthProvider,
  signInWithPopup,
  signOut,
  signInWithRedirect,
} from "firebase/auth";
import { notifications } from '@mantine/notifications'
// import jwt_decode from "jwt-decode";
import { X } from "tabler-icons-react";
// import { useStore } from "../store";
import { auth } from "../firebase";
import { createContext, useContext, useEffect, useState } from "react";
import { useFirestore } from "../hooks/useFirestore";
import posthog from "posthog-js";
import { useRouter } from "next/router";


export const authContext = createContext<AuthContextInterface | undefined>(
  undefined
);


export const StudentValidation = (email: string): boolean => {
  const allowedUniversities: University[] = [
    { name: "Universidad Del Norte", domain: "uninorte.edu.co" },
  ];
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
  const [user, setUser] = useState<UserState | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  // const [valid, setValid] = useState<boolean | "unset">("unset");
  // state for superUser
  // const [superUser, setSuperUser] = useState<superUser | undefined>(undefined);

  const { createOrFetchUser, suscribe } = useFirestore();

  // ! Dont delete this, it will be used later
  // const signup = (email: string, password: string) => {
  //   return createUserWithEmailAndPassword(auth, email, password);
  // };

  // ! Dont delete this, it will be used later
  // const login = (email: string, password: string) => {
  //   return signInWithEmailAndPassword(auth, email, password);
  // };
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
    if (navigator.userAgent.includes("Instagram")) {
      return signInWithRedirect(auth, microsoftProvider);
    } else {
      return signInWithPopup(auth, microsoftProvider);
    }

  };

  // ! Dont delete this, it will be used later
  //   const loginWithGoogle = () => {
  //  // console.log("google provider");
  //     const googleProvider = new GoogleAuthProvider();
  //     googleProvider.setCustomParameters({
  //       login_hint: "usuario@uninorte.edu.co",
  //       login_type: "popup",
  //       prompt: "select_account",
  //       select_account: "true",
  //       use_account: "true",
  //       hd: "uninorte.edu.co",
  //     });
  //     return signInWithPopup(auth, googleProvider);
  //   };
  const suscribetoPost = async (postId: string, remove: boolean,) => {
    if (user) await suscribe(postId, remove, user);
  }


  // ! Dont delete this, it will be used later
  //   const loginWithGoogleOneTap = (
  //     response: googleResponse
  //   ): Promise<UserCredential> => {
  //  // console.log("google one tap");
  //     const data: googleDecodedResponse = jwt_decode(response.credential);
  //  // console.log(data);
  //     const cred = GoogleAuthProvider.credential(response.credential);
  //     // Sign in with credential from the Google user.
  //     // console.log(user)
  //     return signInWithCredential(auth, cred);
  //   };

  const logout = () => {
    // console.log("Se fue");
    setUser(null);
    // setValid("unset");
    signOut(auth);
    posthog.reset();
    notifications.show({
      id: "log-out",
      autoClose: 5000,
      title: "Has cerrado Sesión",
      color: "red",
      message: "Hasta pronto",
      icon: <X />,
    });
  };

  // ! Dont delete this, it will be used later
  // const resetPassword = async (email: string): Promise<void> =>
  //   sendPasswordResetEmail(auth, email);

  // const updateUser =(configurationData:any)=>{
  //   auth?.currentUser && updateProfile(auth.currentUser, configurationData).then(() => {
  //   auth?.currentUser?.uid && updateFirestoreProfile(auth.currentUser.uid, configurationData)
  // }).catch((error) => {
  //// console.log(error)
  // });
  // }



  useEffect(() => {
    // console.log("unsubuscribe effect", valid);
    const unsubuscribe = onAuthStateChanged(auth, (currentUser: any) => {
      if (currentUser) {
        setUser(currentUser);
        // console.log({ currentUser });
        const fectchUser = async () => {
          const newUser = await createOrFetchUser(currentUser, setUser);
          setLoading(false);
          // console.log("elusuario", user);
          const valid = StudentValidation(currentUser.email);
          console.log("la validacion es ", valid);
          // setValid(quees);
          if (valid === true) {
            if (newUser) {
              notifications.show({
                id: "welcome",
                autoClose: 5000,
                title: "Bienvenido a SocialU!",
                message: "Estas usando un correo universitario permitido",
                color: "green",
              });
            }
            router.push("/")
          }
          if (valid === false) {
            logout();
            notifications.show({
              id: "get-out",
              autoClose: false,
              title: "No Estas Permitido",
              message:
                "No estas usando un correo universtario de una de nuestras universidades permitidas",
              color: "red",
              icon: <X />,
            });
          }
        }
        fectchUser()
        router.push("/")
      } else {
        console.log("No hay usuario");
      }
    });


    return () => unsubuscribe();
  }, [auth]);





  return (
    <authContext.Provider
      value={{
        // signup,
        // login,
        user,
        setUser,
        suscribetoPost,
        logout,
        // valid,
        loading,
        // loginWithGoogle,
        loginWithMicrosoft,
        // resetPassword,
        // loginWithGoogleOneTap,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
