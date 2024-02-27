import React, { Dispatch, SetStateAction } from "react";
import { Comment, CommentProps } from "./Comment";
import CommentForm from "./CommentForm";
import { auth } from "../../firebase";
import { Paper, Text } from "@mantine/core";
import Link from "next/link";
// import { Transition } from "@mantine/core";

type CommentWallProps = {
  comments?: CommentProps[];
  postId: string;
  setRespondTo?: Dispatch<SetStateAction<string>>;
};



const CommentWall = ({ comments, postId, setRespondTo }: CommentWallProps) => {
  // if (comments.map) {
  return (
    <>
      {auth.currentUser ? <CommentForm postId={postId} /> : (
        <Paper component={Link} href="/bienvenido" p="lg" bg="#e2e8f0" variant="😀" radius="md">
          <Text ta="center">
            Para comentar debes iniciar sesión con tu cuenta universitaria
          </Text>
        </Paper>
      )}
      {comments &&
        comments?.map((co, index) => (
          <Comment
            key={index}
            postedAt={co.postedAt}
            subComments={co.subComments}
            content={co.content}
            author={co.author}
            id={co.id}
            // setRespondTo={setRespondTo}
            parentId={co.parentId}
          />
        ))}
    </>
  );
  // } else {
  // return <></>;
};
// };

export default CommentWall;
