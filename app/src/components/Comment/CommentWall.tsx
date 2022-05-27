import React from "react";
import { Comment, CommentProps } from "./Comment";
import CommentForm from "./CommentForm";
import { auth } from "../../firebase";
import { Transition } from "@mantine/core";

type CommentWallProps = {
  comments?: CommentProps[];
  postId: string;
};

const CommentWall = ({ comments, postId }: CommentWallProps) => {
  // if (comments.map) {
  return (
    <>
      {auth.currentUser && <CommentForm postId={postId} />}
      {comments &&
        comments?.map((co, index) => (
          <Comment
            key={index}
            postedAt={co.postedAt}
            subComments={co.subComments}
            content={co.content}
            author={co.author}
            id={co.id}
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
