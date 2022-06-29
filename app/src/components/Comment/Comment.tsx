import {
  // ActionIcon,
  // Anchor,
  Avatar,
  // Collapse,
  Group,
  Stack,
  Text,
  // Textarea,
} from "@mantine/core";
// import { useToggle } from "@mantine/hooks";
import { useState } from "react";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
// import { Send } from "tabler-icons-react";
import { Timestamp } from "@firebase/firestore";

export interface CommentProps {
  id: string;
  parentId: string | null;
  postedAt: Timestamp;
  content: string;
  author: { name: string; image: string } | "anonimo";
  subComments?: CommentProps[];
}

export function Comment({
  postedAt,
  content,
  author,
  subComments,
  id,
}: CommentProps) {
  // const [reply, toggle] = useToggle("closed", ["closed", "open"]);
  const [opened, setOpen] = useState(false);
  dayjs.extend(relativeTime);
  dayjs.locale(es);

  return (
    <div className="mt-5">
      <Group>
        {author === "anonimo" ? (
          <Avatar size="sm" alt="Anónimo" radius="xl" />
        ) : (
          <Avatar size="sm" src={author.image} alt={author.name} radius="xl" />
        )}
        
        <div>
          <Text size="sm">
            {author === "anonimo" ? "Anónimo" : author.name}
          </Text>
          {postedAt && postedAt.toDate() && (
            <Text size="xs" color="dimmed">
              {dayjs(postedAt?.toDate()).fromNow()}
            </Text>
          )}
        </div>
      </Group>

      <div className="ml-11">
        <Text size="sm">{content}</Text>
        {/* <Anchor onClick={() => setOpen((o) => !o)} color="orange">
          Responder
        </Anchor>

        <Collapse in={opened}>
          <form action="">
            <Textarea />
            <ActionIcon
              type="submit"
              component="button"
              color="orange"
              radius="xl"
            >
              <Send />
            </ActionIcon>
          </form>
        </Collapse> */}
      </div>

      {subComments && (
        <Stack className="pl-4 border-l-2">
          {subComments?.map((subco, index) => (
            <Comment
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
      )}
    </div>
  );
}
