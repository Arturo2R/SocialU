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
import businessAccounts from "../bussiness_accounts.json"

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
  const [bussinessAccount, setBussinessAccount] = useState<bussiness>()
  const [hasBussinessAccount, setHasBussinessAccount] = useState(false)
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState(router.pathname);
  const [loading, setLoading] = useState(true);
  // const [valid, setValid] = useState<boolean | "unset">("unset");
  // state for superUser
  // const [superUser, setSuperUser] = useState<superUser | undefined>(undefined);

  const { createOrFetchUser, suscribe, fetchUserData, createUser  } = useFirestore();

  // ! Dont delete this, it will be used later
  // const signup = (email: string, password: string) => {
  //   return createUserWithEmailAndPassword(auth, email, password);
  // };

  // ! Dont delete this, it will be used later
  // const login = (email: string, password: string) => {
  //   return signInWithEmailAndPassword(auth, email, password);
  // };
  const loginWithMicrosoft = () => {
    setLoading(true)
    const microsoftProvider = new OAuthProvider('microsoft.com');
    microsoftProvider.setCustomParameters({
      // Force re-consent.
      prompt: 'select_account',

      // Target specific email with login hint.
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




  const validation= (email:string, newUser:Boolean) =>{
    const valid = StudentValidation(email);
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

  const effection = async (redirect:Boolean = false): Promise<Function>=> {
    // console.log("unsubuscribe effect", valid);
    return onAuthStateChanged(auth, async (currentUser: any) => {
        if (currentUser) {
          setLoading(false)
          let newUser = createOrFetchUser(currentUser, setUser)
          validation(currentUser.email, newUser)

          // push to the latest route
          router.push("/")
          setLoading(false)
          // console.log(currentPath)
          // if (currentPath== "/bienvenido") {

        } else {
          console.log("No hay usuario");
          setLoading(false)
        }
      }
    );

  }



  // useEffect(() => {
  //   const unsubuscribe = effection(false)

  //   return () => {
  //     unsubuscribe()
  //   }
  // }, [auth]);

  // useEffect(() => {
  //   fetchUserData()
  // }, [user])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
      if (currentUser) {
        setUser(currentUser)
        fetchUserData(currentUser, setUser)
      } else {
        console.log("No hay usuario");
        setLoading(false)
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth])

  useEffect(() => {
    let foundBussiness
    if (user) {
      console.log("aja", user.email)
      foundBussiness = businessAccounts.bussiness.find(bussines =>
        bussines.members.some(member => member.email === user.email)
      )
    }
    if (!foundBussiness) {
      setHasBussinessAccount(false)
    } else {
      setHasBussinessAccount(true)
    }
    setBussinessAccount(foundBussiness);
  }, [user])

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      setCurrentPath(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);





  return (
    <authContext.Provider
      value={{
        // signup,
        // login,
        effection,
        user,
        setUser,
        suscribetoPost,
        logout,
        // valid,
        loading,
        bussinessAccount,
        hasBussinessAccount,
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
