import { Title } from "@mantine/core";
import Layout from "../components/Layout/Layout";

type Props = {};

const _offline = (props: Props) => {
  return <Layout>
    <Title order={1}>No Se Pudo conectar al servidor</Title>
  </Layout>;
};

export default _offline;
