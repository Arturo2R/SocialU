import {
    collection, getDocs,
    limit,
    orderBy,
    query
} from "@firebase/firestore";
import Feed from "../components/Feed";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

export const getServerSideProps = async () => {
  const q = query(
    collection(db, process.env.NEXT_PUBLIC_DB_COLLECTION_PATH||"developmentPosts"),
    orderBy("createdAt", "desc"),
    limit(7)
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
  data: Post[];
}

export default function HomePage({ data }: HomeProps) {
  const { user } = useAuth()

  

  return (
    <Layout>
      <Feed data={data} user={user||undefined} />
    </Layout>
  );
}
