import Feed from "../components/Feed";
import Layout from "../components/Layout/Layout";
import { PATH } from "../constants";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";


export const getServerSideProps = async () => {
  const { collection, getDocs, limit, orderBy, query } = await import("@firebase/firestore");

  const q = query(
    collection(db, PATH),
    orderBy("createdAt", "desc"),
    limit(5)
  );

  const querySnapshot = await getDocs(q);

  const data = querySnapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc?.data()?.createdAt?.toJSON(),
    ...(doc.data().date && { date: doc?.data()?.date?.toJSON() }),
    ...(doc.data().time !== "" && {
      time: doc?.data()?.time?.toJSON(),
    }),
  }));

  return {
    props: {
      data,
    },
  };
};

interface HomeProps {
  data: Post[];
}

export default function HomePage({ data }: HomeProps) {
  const { user } = useAuth();

  let baseStyles = [
    "color: #FD7E14",
    "padding: 2px 4px",
    "font-size: 32px",
  ].join(";");

  console.log("%cJah Tu Crees Que Puedes Hackearme, ¡Que iluso!", baseStyles);

  return (
    <Layout>
      <Feed data={data} user={user || undefined} />
    </Layout>
  );
}
