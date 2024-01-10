import Feed from "../components/Feed";
import Layout from "../components/Layout/Layout";
// import { PATH } from "../constants";
import { useAuth } from "../context/AuthContext";
// import { db } from "../firebase";




interface HomeProps {
  data: Post[];
}

export default function HomePage() {
  const { user } = useAuth();

  let baseStyles = [
    "color: #FD7E14",
    "padding: 2px 4px",
    "font-size: 32px",
  ].join(";");

  console.log("%cJah Tu Crees Que Puedes Hackearme, ¡Que iluso!", baseStyles);

  return (
    <Layout>

      <Feed  user={user || undefined} />
    </Layout>
  );
}
