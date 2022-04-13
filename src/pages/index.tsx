import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import NavBar from '../components/NavBar';
import Layout from '../components/Layout/Layout';

export default function HomePage() {
  return (
    <>
      {/* <NavBar /> */}
      <Layout
        navLinks={[
          {
            link: '/crear',
            label: 'Crear Posts',
          },
          {
            link: '/proximos',
            label: 'Proximos Posts',
          },
        ]}
      >
        <Welcome />
        <h3 className="text-3xl text-orange-600">Hola</h3>
        <ColorSchemeToggle />
      </Layout>
    </>
  );
}
