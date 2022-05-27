import {
  Container,
  Space,
  Stack,
  Loader,
  Text,
  Title,
  Center,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { Suspense } from "react";
import { Post } from "../Post/Post";
import useStyles from "./Feed.styles";

export function Feed() {
  const { classes } = useStyles();

  // error state
  const [error, setError] = useState<Error | null>(null);

  const { data, error: dataError, loading, fetchData } = useFirestore();
  // console.log(data);
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Center className="my-auto h-full">
        <Loader color="orange" size="lg" variant="bars" />
      </Center>
    );
  }

  // if (error) return <Text>{error}</Text>;

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
        <Stack spacing="lg" className="mx-auto max-w-sm">
          {data &&
            data.map((post, index) => (
              <Post
                description={post.message}
                author={
                  post.anonimo
                    ? "anonimo"
                    : {
                        name: post.authorName,
                        id: post.userName ? post.userName : post.id,
                        ...(post.authorImage && { image: post.authorImage }),
                      }
                }
                title={post.title}
                image={post.image}
                // asistants={post.asistants} // Añadir asistentes
                postId={post.id}
                event={post.isEvent}
                key={index}
                asistants={post?.suscriptions}
              />
            ))}
        </Stack>
      </Container>
    </>
  );
}
