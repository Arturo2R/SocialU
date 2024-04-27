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
import { DEFAULT_COLOR } from "../../constants";
import MiniCommentForm from "./MiniCommentForm";
import CommentForm from "./CommentForm";

export interface CommentProps {
  id: string;
  parentId?: string;
  postId: string;
  postedAt: Date;
  content: string;
  author: { name: string; image: string, color?:string, } | "anonimo";
  subComments?: subComments;
  commentRoute: string;
  old?: boolean;
  level?: number;
  //setRespondTo?: Dispatch<SetStateAction<string>>;
}

export function Comment({
  postedAt,
  content,
  author,
  old,
  postId,
  parentId,
  subComments,
  id,
  commentRoute,
  level = 1,
 // setRespondTo
}: CommentProps) {
  // const [reply, toggle] = useToggle("closed", ["closed", "open"]);
  const [opened, setOpen] = useState(false);
  const [subCommentsOpened, setSubCommentsOpened] = useState(true);
  dayjs.extend(relativeTime);
  dayjs.locale(es);
  //handleRespondTo = () =>{ if (author?.name) setRespondTo(author?.name && author?.name)}
  
  return (
    <div  className="p-4 mt-2 border-l-[2px] pb-0 max-w-2xl border-l-gray-400/40" >
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
               {dayjs(old?postedAt?.toDate():postedAt).fromNow()}
              </Text>
            )}
        {!old && (
          <Anchor onClick={() => setOpen((o) => !o)} color={DEFAULT_COLOR} >
          Responder
        </Anchor>
        )}
        </Group>
        <Collapse in={opened} onClick={
            (e) => {
              e.stopPropagation();
            }
        }>
          <CommentForm postId={postId} commentId={id} respondto={commentRoute+".subComments."} closeCollapse={setOpen} />
        </Collapse>  
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
          <Stack >
            { Object.values(subComments)
              .sort((comment1, comment2)=>  new Date(comment2.postedAt).getTime() - new Date(comment1.postedAt).getTime())
              .map((subco, index) => (
              <Comment
                postId={postId}
                level={level+1}
                commentRoute={commentRoute+".subComments."+subco.id}
                id={subco.id}
                parentId={subco.parentId}
                key={index}
                postedAt={subco.postedAt}
                author={subco.author}
                content={subco.content}
                subComments={subco.subComments}
                />
            ))}
          </Stack>
        </Collapse>
      )} 
    </div>
  );
}
