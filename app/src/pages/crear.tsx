/* eslint-disable @typescript-eslint/quotes */
import {
  Button,
  Container,
  Input,
  InputWrapper,
  Switch,
  Textarea,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";

import { DatePicker, TimeInput } from "@mantine/dates";
import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
// import { useDebouncedValue } from "@mantine/hooks";
import { useRouter } from "next/router";
import { FileCheck } from "tabler-icons-react";
import ImageDropzone from "../components/ImageDropzone";
// import { Container } from "tabler-icons-react";
import Layout from "../components/Layout/Layout";
import Protected from "../components/Protected";

import { useFirestore } from "../hooks/useFirestore";

// type Props = {};

const CrearPost = () => {
  // Event state
  const [event, setEvent] = useState(false);
  //image state
  const [image, setImage] = useState<File | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { createPost } = useFirestore();

  const router = useRouter();

  const form = useForm({
    initialValues: {
      title: "",
      message: "",
      date: "",
      time: "",
      image: "",
      isEvent: false,
      anonimo: false,
    },
    // validate: {
    //   title: {
    //     minLength: 3,
    //     maxLength: 50,
    //   },
    //   message: {
    //     minLength: 3,
    //     maxLength: 200,
    //   },
    //   date: {},
    //   time: {},
    //   image: {},
    // },
  });

  // form.setFieldValue("image", image);
  useEffect(() => {
    imageUrl && form.setFieldValue("image", imageUrl);
  }, [imageUrl]);

  // form.setFieldValue("message", debouncedMessage);

  const submitPost = (postValues: any) => {
    showNotification({
      id: "created-post",
      disallowClose: true,
      autoClose: 4000,
      title: "Post creado",
      message: "La publicación fue creada exitosamente",
      color: "orange",
      className: "my-notification-class",
      icon: <FileCheck />,
    });
    createPost(postValues);
    router.push("/");
  };

  return (
    <Layout>
      <Protected.Route>
        <Container className="h-full">
          <form
            onSubmit={form.onSubmit((values) => submitPost(values))}
            className="flex flex-col justify-between h-full"
          >
            <div>
              <ImageDropzone
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                image={image}
                setImage={setImage}
              />
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
                {...form.getInputProps("title")}
              />
              <Textarea
                placeholder="Mensaje"
                variant="unstyled"
                radius="xl"
                size="md"
                minRows={5}
                required
                autosize
                // value={messageValue}
                {...form.getInputProps("message")}
              />
              <Switch
                label="Post Anónimo"
                color="orange"
                {...form.getInputProps("anonimo")}
              />
              <Switch
                mt="sm"
                label="Evento"
                color="orange"
                checked={event}
                onChange={(e) => {
                  setEvent(e.currentTarget.checked);
                  form.setFieldValue("isEvent", e.currentTarget.checked);
                }}
                // {...form.getInputProps("isEvent", { type: "checkbox" })}
              />
              {event && (
                <>
                  {/* <InputWrapper required={event} label="Día De Reunion">
                    <Input
                      type="datetime-local"
                      required={event}
                      placeholder="Escojer Dia De Reunion"
                      name="date"
                      id="time"
                    />
                  </InputWrapper> */}
                  <DatePicker
                    transition="pop-bottom-left"
                    placeholder="Escojer Dia De Reunion"
                    label="Día De Reunion"
                    required={event}
                    locale="es"
                    {...form.getInputProps("date")}
                  />
                  {/* <TimeInput
                    defaultValue={new Date()}
                    label="Hora"
                    // error="No permitimos viajes en el tiempo, la hora tiene que ser en el futuro"
                    format="12"
                    required={event}
                    clearable
                    onChange={(e) =>
                      form.setFieldValue(
                        "time",
                        `${e.getHours()}:${e.getMinutes()}`
                      )
                    }
                  /> */}
                  <InputWrapper required={event} label="Hora">
                    <Input type="time" name="time" id="time-is-value" />
                  </InputWrapper>
                </>
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
      </Protected.Route>
    </Layout>
  );
};

export default CrearPost;
