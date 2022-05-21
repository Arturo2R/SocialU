import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
} from "@firebase/firestore";
import { Image, Paper, Stack, Text, Title } from "@mantine/core";
import { orderBy } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AuthorInfo } from "../../../components/AuthorInfo";
import CommentWall from "../../../components/Comment/CommentWall";
import Layout from "../../../components/Layout/Layout";
import SeeUser from "../../../components/Post/SeeUser";
import { db } from "../../../firebase";
// import { useFirestore } from "../../../hooks/useFirestore";

import { CommentProps } from "../../../components/Comment/Comment";

type Props = {};

const PostPage = (props: Props) => {
  const router = useRouter();
  const { postId, authorName } = router.query;
  const id: string = typeof postId === "string" ? postId : "nada-que-ver";
  const [content, setContent] = useState<anything | undefined>();
  //loading state
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<CommentProps[] | undefined>();
  // console.log(postId);

  // const { fetchPost, loading, error } = useFirestore();
  const nestComments = (commentList: CommentProps[]) => {
    let commentMap: anything = {};
    console.log("0", commentList, commentMap);

    // move all the comments into a map of id => comment
    commentList.forEach(
      (comment: anything) => (commentMap[comment.id] = comment)
    );

    console.log("1", commentMap);

    // iterate over the comments again and correctly nest the children
    commentList.forEach((comment) => {
      if (comment.parentId !== null) {
        const parent = commentMap[comment.parentId];
        (parent.subComments = parent.subComments || []).push(comment);
      }
    });

    console.log("2", commentMap, commentList);

    // filter the list to return a list of correctly nested comments
    // commentMap = {};
    return commentList.filter((comment: anything) => {
      return comment.parentId === null;
    });
  };

  const fetchContent = async () => {
    try {
      const postRef = doc(db, "posts", id);

      const postSnap: anything = await getDoc(postRef);
      // console.log(postSnap.data());
      const data = postSnap.data();
      setContent(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // const myNestComments = (commentList: CommentProps[]) => {
  //   commentList.reduce((prev, curr) => {
  //     if (curr.parentId === null) {
  //       commentList[prev.index].push(curr);
  //     }
  //   });
  // };

  const fetchComments = async () => {
    try {
      setLoading(true);
      let q = query(
        collection(db, "posts", id, "comments")
        // orderBy("postedAt", "desc"),
        // limit(20)
      );

      const querySnapshot = await getDocs(q);

      const commentsDB = querySnapshot.docs.map((doc: anything) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("raw data", commentsDB);

      // console.log("nested data", nestComments(commentsDB));

      setComments(commentsDB);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
    fetchComments();
    return () => {
      setComments(undefined);
    };
  }, []);

  // if (loading) {
  //   return (
  //     <Center className="my-auto h-full">
  //       <Loader color="orange" size="lg" variant="bars" />
  //     </Center>
  //   );
  // }
  // if (error) return <Text>{error}</Text>;

  return (
    <Layout>
      <Paper p="md" shadow="sm" radius="md">
        {content?.image && <Image radius="lg" src={content.image} />}

        <Title className="mt-4 mb-2 text-3xl">{content?.title}</Title>
        {/* <Text className="mb-2 cursive">{content?.createdAt}</Text> */}
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
          {console.log("consoleado", comments)}
          {comments !== undefined && <CommentWall comments={comments} />}
        </div>
      </Paper>
    </Layout>
  );
};

export default PostPage;
