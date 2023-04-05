import {
  Button,
  Container,
  Input,
  InputWrapper,
  Modal,
  Textarea
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
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
import { useFirestore} from "../hooks/useFirestore";



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
      anonimo: user?.configuration?.anonimoDefault || false,
    }
  });
  
  // console.log(user?.configuration?.anonimoDefault)
  // Event state
  const [opened, setOpened] = useState(false) // #MOdal
  //image state
  const [image, setImage] = useState<File | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { createPost } = useFirestore();

  

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
                size="xl"
                required
                minRows={1}
                autosize
                classNames={{
                  input: "!text-3xl !font-bold dark:text-white-200 ",
                }}
                {...register("title")}
              />
              <Textarea
                placeholder="Mensaje"
                variant="unstyled"
                radius="xl"
                size="md"
                minRows={5}
                required
                autosize
                {...register("message")}
                
              />
              
                  <Switc
                   label="Anonimo"
                   control={control}
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
                        name="date"
                        control={control}
                        label="Día De Reunion"
                      />
                  
                  
                  <InputWrapper required={true} label="Hora">
                    <Input type="time" id="time-is-value"
                    {...register("time")}
                      />
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
