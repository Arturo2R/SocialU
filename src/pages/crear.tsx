import {
  Button,
  Container,
  Input,
  Switch,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import Image from "next/image";
import React, { useState } from "react";
import ImageDropzone from "../components/ImageDropzone";
// import { Container } from "tabler-icons-react";

import Layout from "../components/Layout/Layout";
import { useStore } from "../store";

type Props = {};

const subscribe = useStore.subscribe(console.log);

const CrearPost = (props: Props) => {
  const [event, setEvent] = useState(false);
  const image = useStore((state) => state.image);
  return (
    <Layout>
      <Container className="h-full">
        <form className="flex flex-col justify-between h-full" action="">
          <div>
            {image ? (
              <Image src={`/${image}`} width={300} height={200} />
            ) : (
              <ImageDropzone />
            )}

            <Textarea
              // icon={<At />}
              variant="unstyled"
              placeholder="Titulo"
              size="xl"
              required
              minRows={1}
              autosize
              classNames={{
                input: "!text-3xl !font-bold dark:text-white-200 ",
              }}
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
            <Switch
              mt="sm"
              label="Evento"
              color="orange"
              checked={event}
              onChange={(event) => setEvent(event.currentTarget.checked)}
              // onLabel="Si"
              // offLabel="No"
            />
            {event && (
              <DatePicker
                transition="pop-bottom-left"
                placeholder="Escojer Dia De Reunion"
                label="Día De Reunion"
                required={event}
                locale="es"
              />
            )}
          </div>
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
