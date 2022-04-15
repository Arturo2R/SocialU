import { Container, Input, Textarea, TextInput } from "@mantine/core";
import React from "react";
// import { Container } from "tabler-icons-react";

import Layout from "../components/Layout/Layout";

type Props = {};

const CrearPost = (props: Props) => {
  return (
    <Layout>
      <Container className="h-full">
        <form action="">
          <Textarea
            // icon={<At />}
            variant="unstyled"
            placeholder="Titulo"
            size="xl"
            required
            minRows={1}
            classNames={{ input: "!text-3xl !font-bold text-blue-500" }}
          />
          <Textarea
            placeholder="Descripción"
            variant="unstyled"
            radius="xl"
            size="md"
            required
            autosize
          />
        </form>
      </Container>
    </Layout>
  );
};

export default CrearPost;
