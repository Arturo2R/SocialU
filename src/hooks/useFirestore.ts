import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore/lite";
import { db } from "../firebase";
import Error from "next/error";
// import { f } from "firebase/firestore/lite";

interface DocPost {
  id: any;
  title: string;
  message: string; // !TODO: Change property name to content
  createdAt: string; // !TODO: Change to Date
  author: string | "anonimo"; // !TODO: Change to { image?: string; name: string; id: string } | "anonimo"
  image?: string;
  // comments: string[]; ////Comments are not implemented yet
  isEvent?: boolean;
  userUID: string;
  authorName: string;
  data: () => Object;
}

interface Post extends DocPost {
  id: string;
}

interface anything {
  [field: string]: any;
}

export const useFirestore = () => {
  const [data, setData] = useState<Post[] | null>([]);
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

  return { data, error, loading };
};
