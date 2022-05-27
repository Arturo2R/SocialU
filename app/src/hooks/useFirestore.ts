import {
  addDoc,
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
  updateDoc,
  arrayRemove,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { Id } from "tabler-icons-react";
import { auth, db } from "../firebase";
import { useStore } from "../store";

export const useFirestore = () => {
  const [data, setData] = useState<Post[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // creating state
  const [creating, setCreating] = useState<boolean>(false);
  // const {user} = useStore()

  const fetchData = async () => {
    try {
      setLoading(true);
      // querysnapshot function to get docs from firestore
      // const dataRef = collection(db, "posts");

      // const snapshot = await query(dataRef, {
      //   collection: "posts",
      //   orderBy: ["createdAt", "desc"],
      //   limit: 10,
      // });

      const q = query(
        collection(db, "posts"),
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
      });
    } catch (thiserror: any) {
      console.log(thiserror);

      //ts-ignore
      setError(thiserror.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPost = async (id: string): Promise<Post> => {
    let postSnap: any;
    try {
      setLoading(true);
      const postRef = doc(db, "posts", id);
      postSnap = await getDoc(postRef);
      // console.log(postSnap);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    return postSnap;
  };

  const createPost = async (formData: FormPost) => {
    if (auth.currentUser && auth.currentUser.photoURL) {
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
          authorImage: auth.currentUser.photoURL,
          // }),

          createdAt: serverTimestamp(),
          userUID: auth.currentUser.uid,
          authorRef: `user/${auth?.currentUser?.uid}`,
          authorName: auth.currentUser.displayName,
        };
        setData([...data, newPost]);

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
        const postRef = doc(db, "posts", postId);
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
    };
    postedAt: any;
    parentId?: string | null;
  }

  const createComment = async (data: CommentFormProps) => {
    if (
      auth.currentUser?.displayName &&
      auth.currentUser.uid &&
      auth.currentUser.photoURL
    ) {
      try {
        setCreating(true);

        const commentRef = collection(db, "posts", data.postId, "comments");
        const Payload: createCommentProps = {
          content: data.content,
          anonimo: data.anonimo,
          author: {
            image: auth.currentUser.photoURL,
            name: auth.currentUser.displayName,
            ref: `user/${auth.currentUser.uid}`,
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
    photoUrl?: string;
    uid: string;
    number?: number;
    university?: {
      domain: "uninorte.edu.co";
      name: "Universidad Del Norte";
    };
    userName?: string;
  }

  const createOrFetchUser = async (user: any) => {
    // const {state} = useStore();

    // const { currentUser: user } = authData;
    const userRef = doc(db, "user", user.uid);
    let docExists: boolean;
    let userSnap;
    let userProfile;

    try {
      userSnap = await getDoc(userRef);
      docExists = userSnap.exists();
      if (docExists) {
        userProfile = userSnap.data();
        useStore.setState({ user: userProfile });
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
              ...(user.phoneNumber && { number: user.phoneNumber }),
              ...(user.photoURL && { photoUrl: user.photoURL }),
            };
            useStore.setState({ user: Payload });
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

  // useEffect(() => {
  //   console.log("useFirestore to getData");
  //   fetchData();
  // }, []);

  return {
    data,
    error,
    loading,
    creating,
    fetchData,
    createPost,
    createOrFetchUser,
    fetchPost,
    createComment,
    suscribe,
  };
};
