import React, { Dispatch, SetStateAction } from "react";
import { Comment, CommentProps } from "./Comment";
import CommentForm from "./CommentForm";
import { auth } from "../../firebase";
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
