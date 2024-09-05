// import { Send } from "tabler-icons-react";
import { Timestamp } from "@firebase/firestore";
import {
  Anchor,
  // ActionIcon,
  // Anchor,
  Avatar,
  Collapse,
  // Collapse,
  Group, Stack, Text
} from "@mantine/core";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
// import { useToggle } from "@mantine/hooks";
import { useState } from "react";
import { DEFAULT_COLOR } from "@lib/constants";
import CommentForm from "./CommentForm";
import {  Id } from "@backend/dataModel";
import { PostComment } from "../../../index";
import { UserObject } from "@context/UserStateContext";
import Protected from "@components/Protected";
import Link from "next/link";
import { useRouter } from "next/navigation";

// import { propsToAttributes } from "@blocknote/core";
export interface CommentProps {
  id: Id<"comment">;
  parentId?: Id<"comment">;
  postId: Id<"post">;
  postedAt: number; // Number of date
  content: string;
  author: { name: string; image: string, color?:string, } | "anonimo";
  subComments?: PostComment[];
  old?: boolean;
  anonimoDefault?: boolean;
  level?: number;
  user?: UserObject;
  isAuthenticated?: boolean;
  //setRespondTo?: Dispatch<SetStateAction<string>>;
}

export function Comment({
  postedAt,
  content,
  author,
  old,
  postId,
  subComments,
  anonimoDefault,
  id,
  level = 1,
  user,
  isAuthenticated
 // setRespondTo
}: CommentProps) {
  // const [reply, toggle] = useToggle("closed", ["closed", "open"]);
  const [opened, setOpen] = useState(false);
  const [subCommentsOpened, setSubCommentsOpened] = useState(true);
  const router = useRouter();
  dayjs.extend(relativeTime);
  dayjs.locale(es);
  //handleRespondTo = () =>{ if (author?.name) setRespondTo(author?.name && author?.name)}
  
  return (
    <div  className="ps-4 mt-2 border-l-[2px] pb-0 max-w-2xl border-l-gray-400/40" >
      <Stack gap={7} onClick={()=>{
      setSubCommentsOpened((o) => !o)
    }
    } >
        <Text size="md" className="break-words whitespace-normal">{content}</Text>  
        <Group justify="flex-start" gap="xs" onClick={
            (e) => {
              e.stopPropagation();
            }
        }>
          {author !== "anonimo" ? (
            <Avatar size={22} src={author.image} alt={author.name} radius="xl" />
            ) : (
            <Avatar size="xs" alt="Anónimo" radius="xl" />
          )}
          
            <Text size="sm" color="dimmed">
              {author !== "anonimo" ?  author.name : "Anónimo"}
            </Text>
            •
            {postedAt && (
              <Text size="sm" color="dimmed">
               {dayjs(postedAt).fromNow()}
              </Text>
            )}

            <Anchor onClick={() => {console.log(isAuthenticated);isAuthenticated ? setOpen((o) => !o) : router.push("/bienvenido")}} c={DEFAULT_COLOR} >
            Responder
            </Anchor>

        </Group>
        {user && (
          <Collapse in={opened} onClick={
            (e) => {
              e.stopPropagation();
            }
          }>
          <CommentForm user={user} postId={postId}  respondto={id}  closeCollapse={setOpen} />
        </Collapse>  
        )}
      </Stack>

     <div className="ml-11">
        {/* <Anchor onClick={() => setOpen((o) => !o)} color={DEFAULT_COLOR}>
          Responder
        </Anchor>
    {/* 
        <MiniCommentForm opened={opened} postId={id} userNameToResponder={author === "anonimo" ? "Anónimo" : author.name} />
    */}  
    </div> 
      
       {subComments && (
        <Collapse in={subCommentsOpened} onClick={
          (e) => {
            e.stopPropagation();
          }
      }>
          <Stack>
            { Object.values(subComments)
              .sort((comment1, comment2)=>  new Date(comment2.postedAt).getTime() - new Date(comment1.postedAt).getTime())
              .map((subco, index) => (
              <Comment
                postId={postId}
                level={level+1}
                id={subco._id}
                parentId={subco.parentId}
                key={index}
                postedAt={subco._creationTime}
                anonimoDefault={anonimoDefault}
                author={subco.author}
                content={subco.content}
                subComments={subco.subcomments}
                user={user}
                isAuthenticated={isAuthenticated}
                />
            ))}
          </Stack>
        </Collapse>
      )} 
    </div>
  );
}
