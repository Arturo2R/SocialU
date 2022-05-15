import {
  addDoc,
  collection,
  getDocs,
  // QuerySnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";

interface FormPost {
  title: string;
  message: string; // !TODO: Change property name to content
  image?: string;
  isEvent?: boolean;
  date: string;
  anonimo: boolean;
  // author: string | "anonimo"; // !TODO: Change to { image?: string; name: string; id: string } | "anonimo"
  // comments: string[]; ////Comments are not implemented yet
  // suscribed: string[];
}
interface Post extends FormPost {
  id?: string;
  createdAt: any; // !TODO: Change string to Date type
  userUID?: string;
  authorRef?: string;
  authorName?: string | null;
}

interface anything {
  [field: string]: any;
}

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

      const q = query(collection(db, "posts"), orderBy("createdAt"), limit(30));
      const querySnapshot = await getDocs(q);

      const dataDB = querySnapshot.docs.map((doc: anything) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(dataDB);
      console.log(dataDB);
    } catch (thiserror: any) {
      console.log(thiserror);

      //ts-ignore
      setError(thiserror.message);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (formData: FormPost) => {
    if (auth.currentUser) {
      try {
        setLoading(true);

        const postsRef = collection(db, "posts");

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

        await addDoc(postsRef, newPost);
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

  return { data, error, loading, createPost };
};
