import {
  Button,
  Container,
  Input,
  Switch,
  Textarea,
  TextInput,
} from "@mantine/core";
import Image from "next/image";
import React from "react";
import ImageDropzone from "../components/ImageDropzone";
// import { Container } from "tabler-icons-react";

import Layout from "../components/Layout/Layout";
import { useStore } from "../store";

type Props = {};

const subscribe = useStore.subscribe(console.log);

const CrearPost = (props: Props) => {
  const image = useStore((state) => state.image);
  return (
    <Layout>
      <Container className="h-full">
        {console.log(image)}
        {image ? (
          <Image src={`/${image}`} width={300} height={200} />
        ) : (
          <ImageDropzone />
        )}

        <form action="">
          <Textarea
            // icon={<At />}
            variant="unstyled"
            placeholder="Titulo"
            size="xl"
            required
            minRows={1}
            autosize
            classNames={{ input: "!text-3xl !font-bold text-gray-800 " }}
          />
          <Textarea
            placeholder="Mensaje"
            variant="unstyled"
            radius="xl"
            size="md"
            minRows={5}
            required
            autosize
          />
          <Switch
            label="Post Anónimo"
            color="orange"
            // onLabel="Si"
            // offLabel="No"
          />
          <Button
            type="submit"
            variant="filled"
            color="orange"
            size="md"
            className="mt-4 w-full"
          >
            Enviar Post
          </Button>
        </form>
      </Container>
    </Layout>
  );
};

export default CrearPost;
