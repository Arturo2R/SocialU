import { Image, Paper, Stack, Text, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import React from 'react';
import { AuthorInfo } from '../../../components/AuthorInfo';
import CommentWall from '../../../components/Comment/CommentWall';
import Layout from '../../../components/Layout/Layout';
import SeeUser from '../../../components/Post/SeeUser';

type Props = {};

const PostPage = (props: Props) => {
  const router = useRouter();
  const { postId, authorName } = router.query;

  return (
    <Layout>
      <Paper p="md" shadow="sm" radius="md">
        <Image radius="lg" src="/girl.jpg" />
        <Title className="mt-4 mb-2 text-3xl">Hola Que Hace Mundo</Title>
        <Text className="cursive mb-2">21 de Julio del 2022</Text>
        <Text className="text-md max-w-lg">
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
                author: 'anonimo',
                body: 'Hola Que Hace',
                postedAt: 'Hace 10 Min',
              },
            ]}
          />
        </div>
      </Paper>
    </Layout>
  );
};

export default PostPage;
