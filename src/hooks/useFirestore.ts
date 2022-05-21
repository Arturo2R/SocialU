import { connectStorageEmulator } from "@firebase/storage";
import {
  addDoc,
  doc,
  setDoc,
  collection,
  getDocs,
  // QuerySnapshot,
  query,
  orderBy,
  limit,
  getDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";

export const useFirestore = () => {
  const [data, setData] = useState<Post[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    console.log("useFirestore to getData");
    fetchData();
  }, []);

  return { data, error, loading, createPost, fetchPost };
};
