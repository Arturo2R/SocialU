import {
  Button,
  Container,
  Input,
  InputWrapper,
  Modal,
  Switch,
  Textarea,
  Tooltip
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
// import { useDebouncedValue } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FileCheck, InfoCircle } from "tabler-icons-react";
import ImageDropzone from "../components/ImageDropzone";
// import { Container } from "tabler-icons-react";
import Layout from "../components/Layout/Layout";
import Protected from "../components/Protected";
import { useAuth } from "../context/AuthContext";
import { useFirestore } from "../hooks/useFirestore";



// type Props = {};

const CrearPost = () => {
  const {user} = useAuth()
  // console.log(user?.configuration?.anonimoDefault)
  // Event state
  const [opened, setOpened] = useState(false)
  const [event, setEvent] = useState(false);
  const [anonimo, setAnonimo] = useState<boolean>(user?.configuration?.anonimoDefault || false)
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
      anonimo: user?.configuration?.anonimoDefault,
    },
    validate: {
      title: (value) => (value.length < 7 ? 'El Titulo debe tener almenos 7 letras' : null),
      message: (value) => (value.length < 23 ? 'El Mensaje debe tener almenos 23 letras' : null),
    },
  });

  const checkImage = async (url:string): Promise<boolean> => {
    let data = {
      "DataRepresentation":"URL",
      "Value": url
    };
    let isPorn : boolean = false
    try {
      let response = await fetch('https://nap.cognitiveservices.azure.com/contentmoderator/moderate/v1.0/ProcessImage/Evaluate?', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': 'a4b85165c2584472a9f2b5dd6101525f',
        },
        body: JSON.stringify(data)
      });
  
      let result = await response.json();
      // console.log(result)
      isPorn = result.IsImageAdultClassified
    } catch (error) {
      // console.log("Un error mirando la imagen", error)
    }
    return isPorn
  }

  // form.setFieldValue("image", image);
  useEffect(() => {
    if(imageUrl){
      checkImage(imageUrl).then(porn =>{ if(porn){setOpened(true); setImage(null); setImageUrl(null)}else{form.setFieldValue("image", imageUrl)}})
    }
  }, [imageUrl]);

  // form.setFieldValue("message", debouncedMessage);

  const submitPost = (postValues: any) => {
    showNotification({
      id: "created-post",
      disallowClose: true,
      autoClose: 3000,
      title: "Post creado",
      message: "Se Publicó 😀",
      color: "orange",
      className: "my-notification-class",
      icon: <FileCheck />,
    });
    if(user){
      createPost(postValues, user);
    } else {
      throw new Error("No hay usuario");
    }
    router.push("/");
  };

  return (
    <Layout>
      <Protected.Route>
        <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        withCloseButton={false}
        title="Que Pensabas!"
      >
       <h1 className="text-2xl">No Puedes Subir Porno En Esta <b className="text-orange-600">Red Social</b></h1>
      </Modal>
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
                checked={anonimo}
                onChange={(e) => {
                  setAnonimo(e.currentTarget.checked);
                  form.setFieldValue("anonimo", e.currentTarget.checked);
                }}
              />
              <Switch
                mt="sm"
                mb="md"
                label="Reunion / Solicitar Ayuda"
                color="orange"
                checked={event}
                onChange={(e:any) => {
                  setEvent(e.currentTarget.checked);
                  form.setFieldValue("isEvent", e.currentTarget.checked);
                }}
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
