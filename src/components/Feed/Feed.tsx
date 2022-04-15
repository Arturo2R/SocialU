import { Container, Space, Stack, Text, Title } from "@mantine/core";

import { Post } from "../Post/Post";
import useStyles from "./Feed.styles";

export function Feed() {
  const { classes } = useStyles();

  return (
    <>
      <Container className="p-0">
        <Title className={classes.title} align="center">
          Bienvenido A
          <Text
            inherit
            className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600"
            component="span"
          >
            SocialU
          </Text>
        </Title>

        <Space h="md" />
        <Stack spacing="lg">
          <Post
            description="Pues ocurrio una vaina muy jodida por alla en el culo de la mula un par de arrechos hijueputas estaban cagando encima de un ..."
            author="anonimo"
            title="Hola Que Hace"
            // image="https://source.unsplash.com/random/180x90"
            postId="kljdfslkf"
            event
            asistants={[
              {
                id: "jlfksd",
                name: "El Kangas",
                avatar: "https://source.unsplash.random/30x30",
              },
              {
                id: "jlfksd",
                name: "El Carecu",
                avatar: "https://source.unsplash.random/30x30",
              },
              {
                id: "jlfksd",
                name: "El Brayan",
                avatar: "https://source.unsplash.random/30x30",
              },
              {
                id: "jlfksd",
                name: "El Manotas",
                avatar: "https://source.unsplash.random/30x30",
              },
              {
                id: "jlfksd",
                name: "El Gato Volador",
                avatar: "https://source.unsplash.random/30x30",
              },
              {
                id: "jlfksd",
                name: "El Kangas",
                avatar: "https://source.unsplash.random/30x30",
              },
              {
                id: "jlfksd",
                name: "El Carecu",
                avatar: "https://source.unsplash.random/30x30",
              },
              {
                id: "jlfksd",
                name: "El Brayan",
                avatar: "https://source.unsplash.random/30x30",
              },
              {
                id: "jlfksd",
                name: "El Manotas",
                avatar: "https://source.unsplash.random/30x30",
              },
              {
                id: "jlfksd",
                name: "El Gato Volador",
                avatar: "https://source.unsplash.random/30x30",
              },
            ]}
          />
          <Post
            description="Now that there is the Tec-9, a crappy spray gun from South Miami. This gun is advertised as the most popular gun in American crime. Do you believe that shit? It actually says that in the little book that comes with it: the most popular gun in American crime. Like they're actually proud of that shit. "
            author="anonimo"
            title="crappy spray gun from South Miami"
            image="https://source.unsplash.com/random/180x90"
            postId="fskdsl"
          />
          <Post
            description="The path of the righteous man is beset on all sides by the iniquities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of darkness, for he is truly his brother's keeper and the finder of lost children "
            author="anonimo"
            title="The path of the righteous man"
            image="https://source.unsplash.com/random/180x90"
            postId="fskdsl"
            event
          />
        </Stack>
      </Container>
    </>
  );
}
