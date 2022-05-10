import {
  Container,
  Space,
  Stack,
  Loader,
  Text,
  Title,
  Center,
} from "@mantine/core";
import { useState } from "react";
import { useFirestore } from "../../hooks/useFirestore";

import { Post } from "../Post/Post";
import useStyles from "./Feed.styles";

export function Feed() {
  const { classes } = useStyles();

  // error state
  const [error, setError] = useState<Error | null>(null);

  const { data, error: dataError, loading } = useFirestore();
  console.log(data);
  if (loading) {
    return (
      <Center className="h-full my-auto">
        <Loader color="orange" size="lg" variant="bars" />
      </Center>
    );
  }
  if (error) return <Text>{error}</Text>;

  return (
    <>
      <Container className="p-0 lg:px-12">
        {/* <Title className={classes.title} align="center">
          Bienvenido A
          <Text
            inherit
            className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600"
            component="span"
          >
            SocialU
          </Text>
        </Title> */}

        {/* // !TODO: Use React Suspense */}

        <Space h="md" />
        <Stack spacing="lg" className="max-w-sm mx-auto">
          {data &&
            data.map((post, index) => (
              <Post
                description={post.message}
                author={
                  post.anonimo
                    ? "anonimo"
                    : { name: post.authorName, id: post.userUID, image: "fsl" }
                }
                title={post.title}
                image={post.image}
                // asistants={post.asistants} // Añadir asistentes
                postId={post.id}
                event={post.isEvent}
                key={index}
              />
            ))}

          <Post
            description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque laudantium officia, ipsum enim tempore molestias architecto itaque? Vel aut nam at voluptatem, sunt, quo laudantium similique dolore, asperiores laborum nostrum."
            author={{
              image:
                "https://cr00.epimg.net/radio/imagenes/2021/01/02/tendencias/1609606240_435257_1609606414_noticia_normal.jpg",
              name: "María Juana",
              id: "kjsdflk",
            }}
            title="Hola Que Hace"
            // image="https://source.unsplash.com/random/180x90"
            postId="kljdfslkf"
            event
            asistants={[
              {
                id: "jlfksd",
                name: "El Kangas",
                avatar: "/perfil.jpg",
              },
              {
                id: "jlfksd",
                name: "El Carecu",
                avatar: "/perfil.jpg",
              },
              {
                id: "jlfksd",
                name: "El Brayan",
                avatar: "/perfil.jpg",
              },
              {
                id: "jlfksd",
                name: "El Manotas",
                avatar: "/perfil.jpg",
              },
              {
                id: "jlfksd",
                name: "El Gato Volador",
                avatar: "/perfil.jpg",
              },
              {
                id: "jlfksd",
                name: "El Kangas",
                avatar: "/perfil.jpg",
              },
              {
                id: "jlfksd",
                name: "El Carecu",
                avatar: "/perfil.jpg",
              },
              {
                id: "jlfksd",
                name: "El Brayan",
                avatar: "/perfil.jpg",
              },
              {
                id: "jlfksd",
                name: "El Manotas",
                avatar: "/girl.jpg",
              },
              {
                id: "jlfksd",
                name: "El Gato Volador",
                avatar: "/perfil.jpg",
              },
            ]}
          />
        </Stack>
      </Container>
    </>
  );
}
