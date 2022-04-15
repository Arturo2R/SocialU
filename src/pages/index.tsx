import { ColorSchemeToggle } from "../components/ColorSchemeToggle/ColorSchemeToggle";
import Feed from "../components/Feed";
import Layout from "../components/Layout/Layout";

export default function HomePage() {
  return (
    <>
      {/* <NavBar /> */}
      <Layout
      // navLinks={[
      //   {
      //     link: "/crear",
      //     label: "Crear Posts",
      //   },
      //   {
      //     link: "/proximos",
      //     label: "Proximos Posts",
      //   },
      // ]}
      >
        <Feed />
        <ColorSchemeToggle />
      </Layout>
    </>
  );
}
