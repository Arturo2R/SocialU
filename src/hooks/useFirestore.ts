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
import { auth, db } from "../firebase";

export const useFirestore = () => {
  const [data, setData] = useState<Post[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // creating state
  const [creating, setCreating] = useState<boolean>(false);

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
    }
    return postSnap;
  };

  const createPost = async (formData: FormPost) => {
    if (auth.currentUser) {
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
    if (auth.currentUser?.displayName && auth.currentUser.uid) {
      try {
        setCreating(true);

        const commentRef = collection(db, "posts", data.postId, "comments");
        const Payload: createCommentProps = {
          content: data.content,
          anonimo: data.anonimo,
          author: {
            image: "https://source.unsplash.com/random/30x45",
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

  useEffect(() => {
    console.log("useFirestore to getData");
    fetchData();
  }, []);

  return {
    data,
    error,
    loading,
    creating,
    createPost,
    fetchPost,
    createComment,
    suscribe,
  };
};
