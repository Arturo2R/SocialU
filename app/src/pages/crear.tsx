import {
  Button,
  Center,
  Container,
  Input,
  Modal,
  MultiSelect,
  Textarea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm as hform } from "react-hook-form";
import { FileCheck } from "tabler-icons-react";
import DatePick from "../components/Comment/DatePick";
import Switc from "../components/Comment/Switc";
import ImageDropzone from "../components/ImageDropzone";
import Layout from "../components/Layout/Layout";
import Protected from "../components/Protected";
import { useAuth } from "../context/AuthContext";
import { useFirestore } from "../hooks/useFirestore";
import { DEFAULT_COLOR, MAXIMUM_MESSAGE_LENGTH, MAXIMUM_TITLE_LENGTH, MINIMUM_MESSAGE_LENGTH, MINIMUM_TITLE_LENGTH } from "../constants";
// import { DatePicker, DatePickerInput } from "@mantine/dates";
import { DatePicker } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import posthog from "posthog-js";
import config from "../config";
import { useWatch } from 'react-hook-form';
import {TextEditor} from "../components/TextEditor";
import '@mantine/dates/styles.css';

const conf = config()

// type Props = {};
interface FormInputs {
  TextField: string
  MyCheckbox: boolean
}

export const checkImage = async (url: string, cacheImage?: boolean): Promise<boolean> => {
  let data = {
    "DataRepresentation": "URL",
    "Value": url
  };
  let isPorn: boolean = false
  try {
    let response = await fetch(process.env.NEXT_PUBLIC_AZURE_NAP_URL + `/contentmoderator/moderate/v1.0/ProcessImage/Evaluate${cacheImage ? "?CacheImage=true" : ""}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_AZURE_NAP_KEY || "",
      },
      body: JSON.stringify(data)
    });

    let result = await response.json();
    isPorn = result.IsImageAdultClassified
  } catch (error) {
    console.error("Un error mirando la imagen", error)
  }
  return isPorn
}

const CrearPost = () => {
  const { user, bussinessAccount, hasBussinessAccount } = useAuth()
  const { register, setValue, handleSubmit, watch, control, formState: { errors }, getValues } = hform({
    defaultValues: {
      title: "",
      message: "",
      isEvent: false,
      time: "", //
      date: null,
      image: "",
      tags: [],
      anonimo: user?.anonimoDefault || false,
      asBussiness: false,
    }
  });

  const asBussiness = useWatch({
    control,
    name: 'asBussiness',
    defaultValue: false, // provide a default value if necessary
  });



  // Event state
  const [opened, setOpened] = useState(false) // #MOdal
  //image state
  const [image, setImage] = useState<File | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { createPost, creatingPost } = useFirestore();

  const [imageData, setImageData] = useState<{ width: number, height: number } | null>(null);

  const [editor, setEditor] = useState()

  const matches = useMediaQuery('(max-width: 768px)', true, {
    getInitialValueInEffect: false,
  });


  // const [value, setValue] = useState<Date | null>(null);

  const router = useRouter();



  const [imageChecking, setImageChecking] = useState<null | "loading" | "loaded">(null)
  useEffect(() => {
    if (imageUrl) {
      checkImage(imageUrl)
        .then(porn => {
          if (porn) {
            posthog.capture("obscene_image", {
              email: user?.email,
              image_url: imageUrl,
            })
            setOpened(true);
            setImage(null);
            setImageUrl(null)
          } else {
            setValue("image", imageUrl)
          }
        }
        )
    }
    setImageChecking("loaded")
  }, [imageUrl]);

  useEffect(() => {
    setValue("anonimo", asBussiness)
  }, [asBussiness, setValue])



  const submitPost: SubmitHandler<FormPost> = postValues => {
    if (user) {
      let payload: ComputedPost = {...postValues, renderMethod: "DangerouslySetInnerHtml", messageFormat: "html"}
      if (postValues.image && imageData) {
        payload = { ...payload, imageData: imageData }
      }
      if (postValues.date && postValues.time) {
        console.log("date: ", postValues.date, "time: ", postValues.time)
        payload = { ...payload, computedDate: new Date(postValues.date.toISOString().split('T')[0] + "T" + postValues.time + ":00") }
      }
      if (hasBussinessAccount && bussinessAccount) {
        payload = {
          ...payload,
          bussiness: {
            bussinessColor: bussinessAccount.color,
            bussinessLogo: bussinessAccount.logo,
            bussinessName: bussinessAccount.name,
            bussinessUrl: bussinessAccount.url,
            bussinessDescription: bussinessAccount.description,
          }
        }
      }
      console.log("sip", payload)
      createPost(payload, user);
      router.push({ pathname: "/", query: { nrf: true } }, { pathname: "/", }, { shallow: true, scroll: true });
      notifications.show({
        id: "created-post",
        autoClose: 3000,
        title: "Post creado",
        message: "Se Publicó 😀",
        color: DEFAULT_COLOR,
        className: "my-notification-class",
        icon: <FileCheck />,
      });
    } else {
      throw new Error("No hay usuario");
    }
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
        <Container p={0} className="h-full">
          <form
            onSubmit={handleSubmit(submitPost)}
            className="flex flex-col justify-between h-full"
          >
            <div>
              <ImageDropzone
                setImageLoading={setImageChecking}
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                image={image}
                setImage={setImage}
                setImageData={setImageData}
              />
              <Textarea  // Titulo
                variant="unstyled"
                placeholder="Titulo"
                error={errors.title?.message}
                size="xl"
                minRows={1}
                autosize
                classNames={{
                  input: "!text-3xl !font-bold dark:text-white-200 ",
                }}
                {...register("title", {
                  minLength: { value: MINIMUM_TITLE_LENGTH, message: `No menos de ${MINIMUM_TITLE_LENGTH} caracteres` },
                  maxLength: { value: MAXIMUM_TITLE_LENGTH, message: `No más de ${MAXIMUM_TITLE_LENGTH} caracteres` }
                })}
              />

              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    maxValues={2} // maximo de etiquetas TODO: tranfeer to constants file
                    onChange={field.onChange}
                    value={field.value}
                    // label="Etiquetas"
                    variant="unstyled"
                    placeholder="Categorias"
                    data={conf.categories.map(c => { return { label: c.name, value: c.value } })}
                    clearable
                    hidePickedOptions
                  />
                )}
              />
              <TextEditor control={control} name="message" required editor={editor} setEditor={setEditor} />
              {/*<Textarea
                placeholder="Mensaje"
                variant="unstyled"
                error={errors.message?.message}
                size="md"
                maxLength={2000}
                minRows={5}
                autosize
                {...register("message", {
                  required: "La descripcion es necesaria",
                  minLength: { value: MINIMUM_MESSAGE_LENGTH, message: `No menos de ${MINIMUM_MESSAGE_LENGTH} caracteres` },
                  maxLength: { value: MAXIMUM_MESSAGE_LENGTH, message: `No más de ${MAXIMUM_MESSAGE_LENGTH} caracteres` }
                })}
              /> */}

              {/* <TypographyStylesProvider pl="0">
                <Editor />
              </TypographyStylesProvider>  */}

              {(hasBussinessAccount && bussinessAccount) && (
                <Switc
                  label={`Publicar como ${bussinessAccount.name}`}
                  color={bussinessAccount.color}
                  control={control}
                  def={false}
                  name="asBussiness"
                  size="md"
                />
              )}

              <Switc
                label="Anonimo"
                control={control}
                def={user?.anonimoDefault || false}
                name="anonimo"
              />

              <Switc
                label="Reunion / Solicitar Ayuda"
                control={control}
                name="isEvent"
              />

              {watch("isEvent") && (
                <>
                  {matches ? (
                    <Controller
                      name="date"
                      control={control}
                      rules={{ required: "La fecha es necesaria", }}
                      render={({ field }) => (
                        <Input.Wrapper required={watch("isEvent")} label="Fecha" error={errors.date?.message}>
                          <Center>
                            <DatePicker
                              mx="auto"
                              // required={true}
                              // control={control}
                              size="md"
                              onChange={field.onChange}
                              value={field.value}
                            // label="Día De Reunion"
                            // {...register("date",{ required: true })} 
                            />
                          </Center>
                        </Input.Wrapper>

                      )}
                    />
                  ) : (
                    <DatePick
                      required={true}
                      control={control}
                      label="Día De Reunion"
                      {...register("date")}
                    />
                  )}


                  <Input.Wrapper required={watch("isEvent")} label="Hora" error={errors.time?.message}>
                    <Input type="time" id="time-is-value"
                      {...register("time", { required: "La hora es necesaria" })}
                    />
                  </Input.Wrapper>
                </>
              )}

            </div>

            <Button
              loading={creatingPost == "loading" || imageChecking == "loading"}
              type="submit"
              variant="filled"
              fullWidth
              color={DEFAULT_COLOR}
              size="md"
              className="self-end w-full mt-4"
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
