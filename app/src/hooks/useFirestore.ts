import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc, getDocs, increment, limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc, updateDoc, where
} from "firebase/firestore";
import { nanoid } from "../utils";
import { useState } from "react";
import { auth, db } from "../firebase";
import { PATH } from "../constants"
import posthog from "posthog-js";



interface configurationForm extends User, AppConfiguration { }

export const useFirestore = () => {
  const [data, setData] = useState<Post[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState();
  const [postsLoading, setPostsLoading] = useState<
    "loading" | "loaded" | "error"
  >("loading");
  const [creating, setCreating] = useState<boolean>(false);


  // const fetchMore = async () => { 
  //   try {
  //     const q = query(
  //       collection(db, PATH),
  //       orderBy("createdAt", "desc"),
  //       limit(20),
  //       startAfter(lastVisible)
  //     );

  //     const querySnapshot = await getDocs(q);
  //     setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1])
  //     setData([...data, querySnapshot.docs])
  //     console.log(data)


  //   } catch (error) {

  //   }



  // }


  const fetchData = async () => {
    setPostsLoading("loading");
    try {

      const q = query(
        collection(db, PATH),
        orderBy("createdAt", "desc"),
        limit(100)
      );
      // const querySnapshot = await getDocs(q);

      onSnapshot(q, (querySnapshot: any) => {
        const dataDB = querySnapshot.docs.map((doc: anything) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // console.log(dataDB);
        setData(dataDB);
      });
    } catch (thiserror: any) {
      console.log(thiserror);
      setPostsLoading("error");

      //ts-ignore
      setError(thiserror.message);
    } finally {
      setPostsLoading("loaded");
    }
  };

  const fetchPost = async (id: string): Promise<Post> => {
    let postSnap: any;
    try {
      setLoading(true);
      const postRef = doc(db, PATH, id);
      postSnap = await getDoc(postRef);
      // console.log(postSnap);
    } catch (error: any) {
      console.error(error);
      posthog?.capture('$exception', {
        message: error.message,
        error: "Error buscando el post",
        function: "fetchPost",
      })
    } finally {
      setLoading(false);
    }
    return postSnap;
  };

  const [creatingPost, setCreatingPost] = useState<"loading" | "loaded" | "error" | false>(false)
  const createPost = async (formData: ComputedPost, user: UserState) => {
    if (auth.currentUser && auth.currentUser.email) {
      try {
        setCreatingPost("loading");

        const generatedPostId = await nanoid(7);
        console.log(PATH)
        const allPostsRef = doc(db, "posts", generatedPostId);
        const onlyPublicPostsRef = doc(db, PATH, generatedPostId);
        // const formatted = await markdownToHtml(formData.message)
        // console.log(formatted)
        let newPost: Post = {
          // id: formData.id,
          // title: formData.title,
          // image: formData.image,
          // isEvent: formData.isEvent,
          // date: formData.date,
          // anonimo: formData.anonimo,
          // tags: formData.tags,
          ...formData,
          message: formData.message,
          // ...(user.photoURL ? {
          authorImage: user?.photoURL || "",
          // } : {authorImage : "st",}),
          useUserName: user?.useUserName || false,
          userName: user?.userName,
          authorEmail: user?.email || auth.currentUser.email,
          createdAt: serverTimestamp(),
          userUID: auth.currentUser.uid,
          authorRef: `user/${auth?.currentUser?.uid}`,
          authorName: auth.currentUser.displayName,
        };



        if (formData.anonimo) {
          await Promise.all([
            setDoc(onlyPublicPostsRef, { ...formData, createdAt: serverTimestamp(), }),
            setDoc(allPostsRef, newPost),
            posthog.capture('post_created', {
              postId: generatedPostId,
              anonimo: true,
              event: formData.isEvent ? true : false,
              image: formData.image ? true : false,
            })
          ]).then(() =>
            fetch(`/api/revalidate?secret=calandriel&id=${generatedPostId}&author=anonimo`)
          )
        } else {
          await Promise.all([
            setDoc(onlyPublicPostsRef, newPost),
            setDoc(allPostsRef, newPost),
            posthog.capture('post_created', {
              postId: generatedPostId,
              anonimo: false,
              event: formData.isEvent ? true : false,
              image: formData.image ? true : false,
            })
          ]).then(() =>
            fetch(`/api/revalidate?secret=calandriel&id=${generatedPostId}&author=${newPost.userName}`)
          )
        }
        setCreatingPost("loaded")

      } catch (thiserror: any) {
        setCreatingPost("error")
        console.error("Error creando la Publicación:", thiserror.message);
        posthog?.capture('$exception', {
          message: thiserror.message,
          error: "Error creando el post",
          function: "suscribe",
        })
      } finally {
        setCreatingPost("loaded")
      }
    } else {
      // console.log("Inautorizado");
    }
  };

  interface letSuscribe extends suscription {
    // suscribedAt: Timestamp | any;
    postId: string;
  }

  const suscribe = async (postId: string, remove: boolean, user: UserState) => {
    if (user?.displayName) {
      try {
        // console.log("Tirado", auth.currentUser.displayName);
        const postRef = doc(db, PATH, postId);
        const Payload: letSuscribe = {
          postId,
          // suscribedAt: serverTimestamp(),
          user: {
            name: user?.displayName,
            image:
              user?.photoURL ||
              "https://source.unsplash.com/random/30x45",
            ref: `user/${user?.uid}`,
            userName: user.userName || "",
          },
        };


        if (remove === false) {
          await updateDoc(postRef, {
            suscriptions: arrayUnion(Payload),
          });
        } else {
          await updateDoc(postRef, {
            suscriptions: arrayRemove(Payload),
          });
        }
      } catch (error: any) {
        console.error("errorsaso", error);
        posthog?.capture('$exception', {
          message: error.message,
          error: "Error suscribiendose",
          function: "suscribe",
        })
      } finally {
      }
    } else {
      // console.log("Nada Papi");
    }
  };

 





  const createComment = async (data: CommentFormProps, currentUser: UserState, hasBussinessAccount: boolean,  bussinessAccount?: bussiness, route?: string, ) => {
    if (
      currentUser?.displayName &&
      currentUser.uid
    ) {
      try {
        setCreating(true);
        const commentRef = doc(db, "posts", data.postId);
        const onlyPublicPostsRef = doc(db, PATH, data.postId);

        const commentId = nanoid();
        const newId = route ? route+commentId : commentId;


        const Payload: createCommentProps = {
          id: commentId,
          content: data.content,
          anonimo: data.anonimo,
          author: {
            image: currentUser?.photoURL || "",
            name:  currentUser?.useUserName ? currentUser?.userName : currentUser?.displayName ,
            ref: `user/${currentUser.uid}`,
            userName: currentUser.userName || "",
          },
          postedAt: new Date().toJSON(),
          parentId: "",
          asBussiness: data.asBussiness,
          postId: data.postId,
          timeFormat: "JSONDate"
        };

        const author = (() => {
          if (data.anonimo) {
            if (data.asBussiness) {
              return {
                image: bussinessAccount?.logo,
                name: bussinessAccount?.name,
                ref: `user/${currentUser.uid}`,
                userName: bussinessAccount?.name,
              }
            } else {
              return "anonimo"
            }
          } else {
            return {
              image: currentUser?.photoURL || "",
              name: currentUser?.useUserName ? currentUser?.userName : currentUser?.displayName,
              ref: `user/${currentUser.uid}`,
              userName: currentUser.userName || "",
            }
          }
        })()

        

        console.log("commentRoute: ", route)
        console.log(newId)

        console.log({
          [`subComments.${newId}`]: {
            ...Payload,
            author: author,
          }
        })

        if (data.anonimo) {
          // Si el comentarrio es anonimo
          await Promise.all([

            // Crea el comentario en la ruta de pública
            updateDoc(onlyPublicPostsRef, {
              [`comentarios.${ newId}`]: {
                ...Payload,
                
                author: author,
              }
            }), // Esto es lo que tengo que cambiar

            // Crea el comentario en la ruta de backup "posts"
            updateDoc(commentRef, {
              [`comentarios.${ newId}`]: {
                ...Payload,
                author: author,
              }}),
            // Incrementa el número de comentarios
            updateDoc(doc(db, PATH, data.postId as string), {
              commentsQuantity: increment(1)
            }),
            posthog.capture('comment_created', {
              postId: data.postId,
              firebaseuid: currentUser.uid,
              anonimo: true,
            })
          ]);
        } else {
          await Promise.all([
            // Crea el comentario en la ruta de pública
            updateDoc(onlyPublicPostsRef, {
              [`comentarios.${ newId}`]: {
                ...Payload,
                author: author,
              }}),
            // Crea el comentario en la ruta de backup "posts"
            updateDoc(commentRef, {
              [`comentarios.${ newId}`]: {
                ...Payload,
                author: author,
              }}),
            // Incrementa el número de comentarios
            updateDoc(doc(db, PATH, data.postId as string), {
              commentsQuantity: increment(1)
            }),
            posthog.capture('comment_created', {
              postId: data.postId,
              anonimo: false,
            })
          ]);
        }
      } catch (error: any) {
        console.error("Error creando el comentario :", error);
        posthog?.capture('$exception', {
          message: error.message,
          error: "Error creando el comentario",
          function: "createComment",
        })
      } finally {
        setCreating(false);
      }
    }
  };

  interface userSchema {
    career?: string;
    semester?: number;
    description?: string;
    displayName: string;
    email: string;
    photoURL?: string;
    uid: string;
    phoneNumber?: number;
    university?: {
      domain: "uninorte.edu.co";
      name: "Universidad Del Norte";
    };
    userName?: string;
    anonimoDefault?: boolean,

  }


  const createUser = async (user: any, setter: Function) => {
    if (user?.displayName && user?.uid && user?.email) {
      try {
        console.log("Creando Un Nuevo Usuario");
        setCreating(true);

        const emailDomainRegex = /([a-z]*)@([a-z]*.[a-z]*.[a-z]*)/gm;
        const [email, userName, hostDomain] = emailDomainRegex.exec(
          user.email
        ) || ["lalama.com", "lalalama.com", "lalama.com"];

        const Payload: UserState = {
          displayName: user.displayName,
          uid: user.uid,
          email,
          userName,
          useUserName: true,
          anonimoDefault: false,
          ...(user.phoneNumber && { phoneNumber: user.phoneNumber }),
          ...(user.photoURL && { photoURL: user.photoURL }),
        };
        setter(Payload);
        await setDoc(userRef, Payload)
      } catch (error: any) {
        console.log(error);
        posthog?.capture('$exception', {
          message: error.message,
          error: "Error creando el usuario",
          function: "createOrFetchUser",
        })
      } finally {
        setCreating(false);
        posthog.identify(user.uid, {
          university: "Universidad Del Norte",
          created: user.metadata.creationTime,
          email: user.email,
          last_login: user.metadata.lastSignInTime,
        })

  }
    }}
  const fetchUserData = async (user: any, setter: Function) => {
    const userRef = doc(db, "user", user.uid);
    let docExists: boolean;
    let userSnap;
    let userProfile;
    try {
      userSnap = await getDoc(userRef);
      docExists = userSnap.exists();
  
      if (docExists) {
        userProfile = userSnap.data();
        setter(userProfile);
        posthog.identify(user.uid, {
          email: user.email,
          firebase_id: user.uid,
          last_login: user.metadata.lastSignInTime,
        },)
      }
    } catch (error) {
      console.error(error.message);
      posthog?.capture('$exception', {
        message: error.message,
        error: "Error buscando el usuario",
        function: "fetchUserData",
      })
    }
  }

  const createOrFetchUser = async (user: any, setter: Function): Promise<boolean> => {
    // const {state} = useStore();
    console.log("Buscando al Usuario", user.email)

    // const { currentUser: user } = authData;
    const userRef = doc(db, "user", user.uid);
    let docExists: boolean;
    let userSnap;
    let userProfile;


    // Esto mira si el usuario existe, si es asi lo trae y si no existe crea uno nuevo
    try {
      userSnap = await getDoc(userRef);
      docExists = userSnap.exists();
      if (docExists) {
        userProfile = userSnap.data();
        setter(userProfile);

        posthog.identify(user.uid, {
          email: user.email,
          firebase_id: user.uid,
          last_login: user.metadata.lastSignInTime,
        },)
      } else {

        if (user?.displayName && user?.uid && user?.email) {
          try {
            console.log("Creando Un Nuevo Usuario");
            setCreating(true);

            const emailDomainRegex = /([a-z]*)@([a-z]*.[a-z]*.[a-z]*)/gm;
            const [email, userName, hostDomain] = emailDomainRegex.exec(
              user.email
            ) || ["lalama.com", "lalalama.com", "lalama.com"];

            const Payload: UserState = {
              displayName: user.displayName,
              uid: user.uid,
              email,
              userName,
              useUserName: true,
              anonimoDefault: false,
              ...(user.phoneNumber && { phoneNumber: user.phoneNumber }),
              ...(user.photoURL && { photoURL: user.photoURL }),
            };
            setter(Payload);
            await setDoc(userRef, Payload)
          } catch (error: any) {
            console.log(error);
            posthog?.capture('$exception', {
              message: error.message,
              error: "Error creando el usuario",
              function: "createOrFetchUser",
            })
          } finally {
            setCreating(false);
            posthog.identify(user.uid, {
              university: "Universidad Del Norte",
              created: user.metadata.creationTime,
              email: user.email,
              last_login: user.metadata.lastSignInTime,
            })
            return true
            // console.log(useStore.getState().user);
          }
        }
      }
    } catch (error: any) {
      console.error(error.message);
      posthog?.capture('$exception', {
        message: error.message,
        error: "Error buscando el usuario",
        function: "createOrFetchUser",
      })
    }
    return false
  };

  interface userConfiguration extends userSchema {
    anonimoDefault: boolean,
  }

  

  const [updatingProfile, setUpdatingProfile] = useState<"loading" | "loaded" | "error" | false>(false)
  //? Función Provisional, pasar a una función en un contexto propio
  const updateProfile = async (id: string, Payload: configurationForm, user: User, setter: Function) => {
    try {
      setUpdatingProfile("loading")
      const userRef = doc(db, "user", id);

      const data = {
        ...user,
        ...Payload,
      }
      console.log("data la data despues de update profile", data);

      // ...(Payload. && { photoURL: Payload.photoURL }),
      // ...(Payload.photoURL && { photoURL: Payload.photoURL }),


      // console.log(data)

      setter((user: any) => ({
        ...user,
        ...data
      }))

      await Promise.all([
        updateDoc(userRef, data),
        posthog.capture('profile_updated', {
          anonimoDefault: Payload.anonimoDefault,
          useUserName: Payload.useUserName,
        })
      ])
    } catch (error: any) {
      console.error(error)
      setUpdatingProfile("error")
      posthog.capture('$exception', {
        message: error.message,
        error: "Error actualizando el perfil",
        function: "updateProfile",
      })
    } finally {
      setUpdatingProfile("loaded")
    }
  }

  const UserPaths = async () => {
    try {
      const q = query(collection(db, "user"))
      const ids = await getDocs(q)
      return q
    } catch (error: any) {
      console.error(error)
      posthog?.capture('$exception', {
        message: error.message,
        error: "Error buscando el usuario",
        function: "UserPaths",
      })
    }
  }


  const [authorProfile, serAuthorProfile] = useState<any>()
  const fetchUser = async (userName: string) => {
    try {
      const userRef = query(collection(db, 'user'), where("userName", "==", userName), limit(1))
      const user = await getDocs(userRef)
      const data = user.docs[0].data()
      serAuthorProfile(data)
    } catch (error: any) {
      console.error(error)
      posthog?.capture('$exception', {
        message: error.message,
        error: "Error buscando el usuario",
        function: "fetchUser",
      })
      return undefined
    }
  }




  // useEffect(() => {
  //// console.log("useFirestore to getData");
  //   fetchData();
  // }, []);

  return {
    data,
    error,
    loading,
    creating,
    postsLoading,
    authorProfile,
    fetchUser,
    fetchUserData,
    createUser,
    updateProfile,
    updatingProfile,
    fetchData,
    creatingPost,
    createPost,
    createOrFetchUser,
    fetchPost,
    createComment,
    suscribe,
  };

};
