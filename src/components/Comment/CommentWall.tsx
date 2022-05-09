import React from "react";
import { Comment, CommentProps } from "./Comment";

type CommentWallProps = {
  comments: CommentProps[];
};

const CommentWall = (props: CommentWallProps) => (
  <>
    {props.comments.map((co, index) => (
      <Comment
        key={index}
        postedAt={co.postedAt}
        subComments={co.subComments}
        body={co.body}
        author={co.author}
      />
    ))}
  </>
);

export default CommentWall;
