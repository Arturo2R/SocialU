import { Container, Image, Stack, Title, Text, Paper } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";
import { AuthorInfo } from "../../../components/AuthorInfo";
import CommentWall from "../../../components/Comment/CommentWall";
import Layout from "../../../components/Layout/Layout";
import SeeUser from "../../../components/Post/SeeUser";

type Props = {};

const PostPage = (props: Props) => {
  const router = useRouter();
  const { postId, authorName } = router.query;

  return (
    <Layout>
      <Paper p="md" shadow="sm" radius="md">
        <Image
          radius="lg"
          src="https://images.unsplash.com/photo-1647891941746-fe1d53ddc7a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxzZWFyY2h8MXx8bGlmZXN0eWxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
        />
        <Title className="mt-4 mb-2 text-3xl">Hola Que Hace Mundo</Title>
        <Text className="mb-2 cursive">21 de Julio del 2022</Text>
        <Text className="max-w-lg text-md">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo
          molestiae itaque illo neque. Unde, fuga sequi voluptas earum
          temporibus libero! Eum quae natus mollitia nihil. Ipsa, rem culpa!
          Soluta, labore. Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Fugiat, cum dolore similique animi consectetur exercitationem
          dolorum reiciendis illo aperiam impedit accusantium delectus
          provident, nostrum illum aliquam ullam sunt nobis obcaecati.
          Blanditiis eius ea quas dolores minus. Hic possimus quae quaerat
          corporis! Deleniti odit, nesciunt repudiandae qui delectus quibusdam!
          Harum perferendis magni voluptates eum earum porro delectus quos
          voluptatem assumenda est.
        </Text>
        <AuthorInfo
          name="juana María"
          email={`${authorName}@uninorte.edu.co`}
          image="/perfil.jpg"
          icon
        />
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
          ></CommentWall>
        </div>
      </Paper>
    </Layout>
  );
};

export default PostPage;
