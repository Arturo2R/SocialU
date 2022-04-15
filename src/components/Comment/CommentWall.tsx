import React from "react";
import { CommentProps, Comment } from "./Comment";

type CommentWallProps = {
  comments: CommentProps[];
};

const CommentWall = (props: CommentWallProps) => {
  return (
    <>
      {props.comments.map((co) => (
        <Comment
          postedAt={co.postedAt}
          subComments={co.subComments}
          body={co.body}
          author={co.author}
        />
      ))}
    </>
  );
};

export default CommentWall;
