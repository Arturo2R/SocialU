import Feed from "../components/Feed";
import Layout from "../components/Layout/Layout";
import { PATH, MAX_SERVER_SIDE_RESULTS } from "../constants";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
// import { db } from "../firebase";


interface HomeProps {
  data: Post[];
}

export const getServerSideProps = async (context:{query:{nrf:boolean}}) => {
  // nrf: not refetch, for not refetching the data, because it's already fetched in the client side
  const { nrf } = context.query;
  console.log("nrf:    ",nrf)
  if (nrf) {
    return {
      props: {
        data: [],
      },
    };
  }
  const { collection, getDocs, limit, orderBy, query:fsquery } = await import("@firebase/firestore");

  const q = fsquery(
    collection(db, PATH),
    orderBy("createdAt", "desc"),
    limit(MAX_SERVER_SIDE_RESULTS)
  );

  const querySnapshot = await getDocs(q);

  const data = querySnapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc?.data()?.createdAt?.toJSON(),
    ...(doc.data().date && { date: doc?.data()?.date?.toJSON() }),
    ...(doc.data().time && {
      time: JSON.stringify(doc?.data()?.time),
    }),
    ...(doc.data().computedDate && {
      computedDate: doc?.data()?.computedDate?.toJSON(),
    }),
  }));

  console.log("Server side on /")

  return {
    props: {
      data,
    },
  };
};


export default function HomePage({data}: HomeProps) {
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
