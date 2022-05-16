import {
  Center,
  Image,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AuthorInfo } from "../../../components/AuthorInfo";
import CommentWall from "../../../components/Comment/CommentWall";
import Layout from "../../../components/Layout/Layout";
import SeeUser from "../../../components/Post/SeeUser";
import { useFirestore } from "../../../hooks/useFirestore";

type Props = {};

const PostPage = (props: Props) => {
  const router = useRouter();
  const { postId, authorName } = router.query;
  const [content, setContent] = useState<anything | undefined>();

  console.log(postId);

  const { fetchPost, loading, error } = useFirestore();

  useEffect(() => {
    if (typeof postId === "string") setContent(fetchPost(postId));
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
    <Layout>
      <Paper p="md" shadow="sm" radius="md">
        {content?.image && <Image radius="lg" src={content.image} />}

        <Title className="mt-4 mb-2 text-3xl">{content?.title}</Title>
        <Text className="mb-2 cursive">{content?.createdAt}</Text>
        {content?.message && (
          <Text className="max-w-lg text-md">{content.message}</Text>
        )}
        {content?.anonimo ? (
          <Text color="orange" size="lg">
            Anonimo
          </Text>
        ) : (
          <AuthorInfo
            name={content?.authorName}
            email={`${authorName}@uninorte.edu.co`}
            image="/perfil.jpg"
            icon
          />
        )}
        <div className="my-4">
          <Title className="mb-2 text-xl">Asistentes</Title>
          <Stack>
            <SeeUser id="slkds" name="Juan" key="2" />
          </Stack>
        </div>
        <div className="my-2">
          <Title className="mb-2 text-xl">Comentarios</Title>
          <CommentWall
            // postId={postId}
            comments={[
              {
                author: "anonimo",
                body: "Hola Que Hace",
                postedAt: "Hace 10 Min",
              },
            ]}
          />
        </div>
      </Paper>
    </Layout>
  );
};

export default PostPage;
