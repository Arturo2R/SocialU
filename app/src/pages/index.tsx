import {
  collection,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "@firebase/firestore";
import { useMemo } from "react";
import Feed from "../components/Feed";
import Layout from "../components/Layout/Layout";
import { db } from "../firebase";

export const getServerSideProps = async () => {
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    limit(30)
  );

  const querySnapshot = await getDocs(q);

  const data = querySnapshot.docs.map((doc: anything) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc?.data()?.createdAt?.toJSON(),
    ...(doc.data().date !== "" && { date: doc?.data()?.date?.toJSON() }),
    ...(typeof doc.data().time !== "string" && {
      time: doc?.data()?.time?.toJSON(),
    }),
    // time: doc?.data()?.time?.toJSON(),
    // date: doc.title,
  }));

  console.log(data);

  return {
    props: {
      data,
    }, // will be passed to the page component as props
  };
};

interface HomeProps {
  data: Object[];
}

export default function HomePage({ data }: HomeProps) {
  console.log(data);
  return (
    <Layout>
      <Feed data={data} />
    </Layout>
  );
}
