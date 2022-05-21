import React from "react";
import { Comment, CommentProps } from "./Comment";

type CommentWallProps = {
  comments: CommentProps[];
};

const CommentWall = ({ comments }: CommentWallProps) => {
  if (comments.map) {
    return (
      <>
        {comments.map((co, index) => (
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
  } else {
    return <></>;
  }
};

export default CommentWall;
