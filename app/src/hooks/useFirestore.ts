import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  // QuerySnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth, db } from "../firebase";

export const useFirestore = () => {
  const [data, setData] = useState<Post[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState(null);
  const [postsLoading, setPostsLoading] = useState<
    "loading" | "loaded" | "error"
  >();


  // creating state
  const [creating, setCreating] = useState<boolean>(false);
  // const {user} = useStore()

  const fetchData = async () => {
    setPostsLoading("loading");
    try {
      // querysnapshot function to get docs from firestore
      // const dataRef = collection(db, "posts");

      // const snapshot = await query(dataRef, {
      //   collection: "posts",
      //   orderBy: ["createdAt", "desc"],
      //   limit: 10,
      // });

      const q = query(
        collection(db, "publicPosts"),
        orderBy("createdAt", "desc"),
        limit(30)
      );
      // const querySnapshot = await getDocs(q);

      onSnapshot(q, (querySnapshot: any) => {
        const dataDB = querySnapshot.docs.map((doc: anything) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(dataDB);
        setData(dataDB);
        setPostsLoading("loaded");
      });
    } catch (thiserror: any) {
      console.log(thiserror);

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
      const postRef = doc(db, "publicPosts", id);
      postSnap = await getDoc(postRef);
      // console.log(postSnap);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    return postSnap;
  };

  const createPost = async (formData: FormPost, user:User) => {
    if (auth.currentUser && user?.photoURL && auth.currentUser.email) {
      try {
        setLoading(true);

        const generatedPostId = await nanoid(7);

        const postsRef = doc(db, "posts", generatedPostId);

        const newPost: Post = {
          // id: formData.id,
          // title: formData.title,
          // message: formData.message,
          // image: formData.image,
          // isEvent: formData.isEvent,
          // date: formData.date,
          // anonimo: formData.anonimo,
          ...formData,
          // ...(auth.currentUser.photoURL && {
          authorImage: user?.photoURL,
          // }),
          userName: user?.userName,
          authorEmail: user?.email || auth.currentUser.email,
          createdAt: serverTimestamp(),
          userUID: auth.currentUser.uid,
          authorRef: `user/${auth?.currentUser?.uid}`,
          authorName: auth.currentUser.displayName,
          
        };
        // setData([...data, newPost]);

        console.log(data);
        await setDoc(postsRef, newPost);
      } catch (thiserror: any) {
        console.log(thiserror.message);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Inautorizado");
    }
  };

  interface letSuscribe {
    // suscribedAt: Timestamp | any;
    postId: string;
    user: { name: string; image: string; ref: `user/${string}` };
  }

  const suscribe = async (postId: string, remove: boolean) => {
    if (auth.currentUser?.displayName) {
      try {
        setLoading(true);
        console.log("Tirado", auth.currentUser.displayName);
        const postRef = doc(db, "publicPosts", postId);
        const Payload: letSuscribe = {
          postId,
          // suscribedAt: serverTimestamp(),
          user: {
            name: auth.currentUser?.displayName,
            image:
              auth.currentUser?.photoURL ||
              "https://source.unsplash.com/random/30x45",
            ref: `user/${auth.currentUser?.uid}`,
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
      } catch (error) {
        console.log("errorsaso", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Nada Papi");
    }
  };

  interface CommentFormProps {
    content: string;
    postId: string;
    anonimo: boolean;
  }

  interface createCommentProps extends CommentFormProps {
    author: {
      image: string;
      name: string;
      ref: `user/${string}`;
      userName: string;
    };
    postedAt: any;
    parentId?: string | null;
  }

 

  const createComment = async (data: CommentFormProps, user:any) => {
    if (
     user?.displayName &&
     user.uid &&
     user.photoURL &&
     user.userName
    ) {
      try {
        setCreating(true);

        const commentRef = collection(db, "posts", data.postId, "comments");
        const Payload: createCommentProps = {
          content: data.content,
          anonimo: data.anonimo,
          author: {
            image: user.photoURL,
            name: user.displayName,
            ref: `user/${user.uid}`,
            userName: user.userName,
          },
          postedAt: serverTimestamp(),
          parentId: null,
          postId: data.postId,
        };

        await addDoc(commentRef, Payload);
      } catch (error) {
        console.log(error);
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

  const createOrFetchUser = async (user: any, setter: Function) => {
    // const {state} = useStore();

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
      } else {
        if (user?.displayName && user?.uid && user?.email) {
          try {
            console.log("Creando Un Nuevo Usuario");
            setCreating(true);

            const emailDomainRegex = /([a-z]*)@([a-z]*.[a-z]*.[a-z]*)/gm;
            const [email, userName, hostDomain] = emailDomainRegex.exec(
              user.email
            ) || ["lalama.com", "lalalama.com", "lalama.com"];

            const Payload: userSchema = {
              displayName: user.displayName,
              uid: user.uid,
              email,
              userName,
              anonimoDefault: false,
              ...(user.phoneNumber && { phoneNumber: user.phoneNumber }),
              ...(user.photoURL && { photoURL: user.photoURL }),
            };
            setter(Payload);
            await setDoc(userRef, Payload);
          } catch (error) {
            console.log(error);
          } finally {
            setCreating(false);
            // console.log(useStore.getState().user);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  interface userConfiguration extends userSchema {
    anonimoDefault: boolean,
  }
  
  const [updatingProfile, setUpdatingProfile] = useState<"loading"| "loaded"| "error"| false>(false)
  //? Función Provisional, pasar a una función en un contexto propio
  const updateProfile = async (id:string, Payload:userSchema, user: User, setter: Function) => {
    try {
      setUpdatingProfile("loading")
      const userRef = doc(db, "user", id);

      const data = {
      ...(Payload.anonimoDefault  && { anonimoDefault: Payload.anonimoDefault }),
              ...(Payload.career && { career: Payload.career }),
              ...(Payload.semester && { semester: Payload.semester }),
              ...(Payload.photoURL && { photoURL: Payload.photoURL }),
              ...(Payload.phoneNumber && { phoneNumber: Payload.phoneNumber }),
              ...(Payload.userName && { userName: Payload.userName }),
              ...(Payload.description && { description: Payload.description }),
              // ...(Payload. && { photoURL: Payload.photoURL }),
              // ...(Payload.photoURL && { photoURL: Payload.photoURL }),
            }

      console.log(data)
      
      setter((user:any) => ({
      ...user,
      ...data
    }))

      await updateDoc(userRef, data)
      
    } catch (error) {
      console.log(error)
      setUpdatingProfile("error")
    } finally {
      setUpdatingProfile("loaded")
    } 
  }

  const UserPaths = async () => { 
      try {
        const q = query(collection(db, "user"))
        const ids = await getDocs(q)
        return q
      } catch (error) {
        console.error(error)
      }
  }


  const [authorProfile, serAuthorProfile] = useState<any>()
  const fetchUser = async (userName:string)=> {
    try {
        const userRef = query(collection(db, 'user'), where("userName", "==", userName), limit(1))
        const user = await getDocs(userRef)
        const data = user.docs[0].data()
        serAuthorProfile(data)
      } catch (error) {
        console.error(error)
        return undefined
      }
  }


  

  // useEffect(() => {
  //   console.log("useFirestore to getData");
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
    updateProfile,
    updatingProfile,
    fetchData,
    createPost,
    createOrFetchUser,
    fetchPost,
    createComment,
    suscribe,
  };
};
