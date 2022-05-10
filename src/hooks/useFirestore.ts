import { addDoc, collection, getDocs } from "firebase/firestore/lite";
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
  createdAt: number | string; // !TODO: Change string to Date type
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

  useEffect(() => {
    console.log("useFirestore to getData");
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // querysnapshot function to get docs from firestore
      const querySnapshot = await getDocs(collection(db, "posts"));

      const dataDB = querySnapshot.docs.map((doc: anything) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(dataDB);
    } catch (error: any) {
      console.log(error);

      //ts-ignore
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (formData: FormPost) => {
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
        createdAt: Date.now(),
        userUID: auth?.currentUser?.uid,
        authorRef: `user/${auth?.currentUser?.uid}`,
        authorName: auth?.currentUser?.displayName,
      };
      setData([...data, newPost]);

      console.log(data);

      await addDoc(postsRef, newPost);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return { data, error, loading, createPost };
};
