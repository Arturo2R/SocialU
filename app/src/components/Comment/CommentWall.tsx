import React, { Dispatch, SetStateAction } from "react";
import { Comment, CommentProps } from "./Comment";
import CommentForm from "./CommentForm";
import { auth } from "@lib/firebase";
import { Paper, Text } from "@mantine/core";
import Link from "next/link";
import { Doc, Id } from "@backend/dataModel";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "@backend/api";
import { useUser } from "@context/UserStateContext";
// import { Transition } from "@mantine/core";

type CommentWallProps = {
  comments?: Post["comentarios"];
  postId: Id<"post">;
  setRespondTo?: Dispatch<SetStateAction<string>>;
  oldComments: CommentProps[];
};



const CommentWall = ({ postId, setRespondTo, oldComments }: CommentWallProps) => {
  const comments = useQuery(api.comment.getCommentsForPost, { postId });
  const { user, isAuthenticated } = useUser()
  console.log(user?.isMember)
  return (
    <>
      <Authenticated>
        <CommentForm postId={postId} user={user} />
      </Authenticated>
      <Unauthenticated>
        <Paper component={Link} href="/bienvenido" p="lg" bg="#e2e8f0" variant="😀" radius="md" shadow="md">
          <Text ta="center">
            Para comentar debes iniciar sesión con tu cuenta universitaria
          </Text>
        </Paper>
      </Unauthenticated>
      {comments &&
        Object.values(comments)
          .map((co, index) => (
            <Comment
              key={index}
              anonimoDefault={user?.settings?.anonimoDefault}
              postedAt={co._creationTime}
              // subComments={co.subComments}
              content={co.content}
              author={co.author}
              commentRoute={co._id}
              id={co._id}
              postId={postId}
              user={user}
              // setRespondTo={setRespondTo}
              parentId={co.postId}
              subComments={co.subcomments}
              isAuthenticated={isAuthenticated}
            />
          ))}

    </>
  );
  // } else {
  // return <></>;
};
// };

export default CommentWall;
