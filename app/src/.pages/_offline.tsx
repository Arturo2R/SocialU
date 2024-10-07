import { Title } from "@mantine/core";
import Layout from "@components/Layout/Layout";


const _offline = () => {
  return <Layout>
    <Title order={1}>No Se Pudo conectar al servidor</Title>
  </Layout>;
};

export default _offline;
