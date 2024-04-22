import React, { Dispatch, SetStateAction } from "react";
import { Comment, CommentProps } from "./Comment";
import CommentForm from "./CommentForm";
import { auth } from "../../firebase";
import { Paper, Text } from "@mantine/core";
import Link from "next/link";
// import { Transition } from "@mantine/core";

type CommentWallProps = {
  comments?: Post["comentarios"];
  postId: string;
  setRespondTo?: Dispatch<SetStateAction<string>>;
  oldComments: CommentProps[];
};



const CommentWall = ({ comments, postId, setRespondTo, oldComments }: CommentWallProps) => {
  return (
    <>
     <CommentForm postId={postId}/>
      {comments &&
        Object.values(comments)
        .sort((comment1, comment2)=>  new Date(comment2.postedAt).getTime() - new Date(comment1.postedAt).getTime())
        .map((co, index) => (
          <Comment
            key={index}
            postedAt={co.postedAt}
            subComments={co.subComments}
            content={co.content}
            author={co.author}
            commentRoute={co.id}
            id={co.id}
            postId={postId}
            // setRespondTo={setRespondTo}
            parentId={co.postId}
          />
        ))}
        {oldComments &&
        oldComments?.map((co, index) => (
          <Comment
            old={true}
            key={index}
            postedAt={co.postedAt}
            subComments={co.subComments}
            content={co.content}
            author={co.author}
            commentRoute={co.id}
            id={co.id}
            postId={co.postId}
            // setRespondTo={setRespondTo}
            parentId={co.postId}
          />
        ))}
    </>
  );
  // } else {
  // return <></>;
};
// };

export default CommentWall;
