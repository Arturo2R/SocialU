import {
  Button,
  Container,
  Input,
  Modal,
  Textarea,
  TypographyStylesProvider
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm as hform } from "react-hook-form";
import { FileCheck } from "tabler-icons-react";
import DatePick from "../components/Comment/DatePick";
import Switc from "../components/Comment/Switc";
import ImageDropzone from "../components/ImageDropzone";
import Layout from "../components/Layout/Layout";
import Protected from "../components/Protected";
import { useAuth } from "../context/AuthContext";
import { useFirestore } from "../hooks/useFirestore";
// import { useEditor } from "@tiptap/react";
// import Placeholder from '@tiptap/extension-placeholder'
import {Editor} from "novel"

// import dynamic from 'next/dynamic';
// const Editor = dynamic(() => import('novel').then((module) => module.Editor));



// type Props = {};
interface FormInputs {
  TextField: string
  MyCheckbox: boolean
}


const CrearPost = () => {
  const {user} = useAuth()
  const { register,setValue, handleSubmit, watch, control, formState: { errors } } =  hform({
    defaultValues: {
      title: "",
      message: "",
      isEvent: false,
      time: "", //
      date: "",
      image: "",
      anonimo: user?.anonimoDefault || false,
    }
  });
  console.log(errors);
  
  console.log(user?.anonimoDefault)
  // Event state
  const [opened, setOpened] = useState(false) // #MOdal
  //image state
  const [image, setImage] = useState<File | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { createPost, creatingPost } = useFirestore();
  

  const router = useRouter();
  

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
      console.log(result)
      isPorn = result.IsImageAdultClassified
    } catch (error) {
      console.error("Un error mirando la imagen", error)
    }
    return isPorn
  }

  useEffect(() => {
    if(imageUrl){
      checkImage(imageUrl)
        .then(porn =>{ 
          if(porn){
            setOpened(true); 
            setImage(null); 
            setImageUrl(null)
          }else{
            setValue("image", imageUrl)
          }
        }
        )
    }
  }, [imageUrl]);


  const submitPost:SubmitHandler<FormPost> = postValues => {
    if(user){
      console.log("sip", postValues)
      createPost(postValues, user);
    } else {
      throw new Error("No hay usuario");
    }
    notifications.show({
      id: "created-post",
      
      autoClose: 3000,
      title: "Post creado",
      message: "Se Publicó 😀",
      color: "orange",
      className: "my-notification-class",
      icon: <FileCheck />,
    });
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
            onSubmit={handleSubmit(submitPost)}
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
                variant="unstyled"
                placeholder="Titulo"
                error={errors.title?.message}
                size="xl"
                required
                minRows={1}
                autosize
                classNames={{
                  input: "!text-3xl !font-bold dark:text-white-200 ",
                }}
                {...register("title",{ 
                  required: "El titulo es necesario", 
                  minLength: { value:5, message: "No menos de 5 caracteres" },
                  maxLength: { value:80, message: "No más de 80 caracteres" } 
                })}
              />
              <div className="hidden !p-0"></div>
              <Textarea
                placeholder="Mensaje"
                variant="unstyled"
                error={errors.message?.message}
                size="md"
                maxLength={1000}
                minRows={5}
                required
                autosize
                {...register("message",{
                  required: "La descripcion es necesaria",
                  minLength: { value:20, message: "No menos de 20 caracteres" }, 
                  maxLength: { value:1000, message: "No más de 1000 caracteres" } })}
              />
                <TypographyStylesProvider pl="0">
                <Editor 
                  storageKey="socialu-editor-contente"
                  className=" relative min-h-[200px] w-full " 
                  // extensions={
                  //     [
                  //       Placeholder.configure({
                  //         placeholder: "Hombre que bueno, Pressiona el '*' for commands, or '++' for AI autocomplete...",
                  //         includeChildren: true,
                  //       })
                  //   ]
                  // }
                  editorProps={{
                    attributes:{
                      class:"prose-md  focus:novel-outline-none novel-max-w-full"
                    }
                  }}
                  onDebouncedUpdate={(value) =>setValue("message", value?.getHTML() || "s")}
                />
              </TypographyStylesProvider> 
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
                  <DatePick
                    required={true}
                    control={control}
                    label="Día De Reunion"
                    {...register("date",{ required: true })}
                  />
              
                  
                  <Input.Wrapper required={true} label="Hora">
                    <Input type="time" id="time-is-value"
                    {...register("time",{ required: true })}
                      />
                  </Input.Wrapper>
                </>
              )}

            </div>

            <Button
              loading={creatingPost == "loading"}
              type="submit"
              variant="filled"
              color="orange"
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
