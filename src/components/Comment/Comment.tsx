import {
  ActionIcon,
  Anchor,
  Avatar,
  Collapse,
  Group,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import React, { useState } from "react";
import { Send } from "tabler-icons-react";

export interface CommentProps {
  id: string;
  parentId: string | null;
  postedAt: Date | string;
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
  const [reply, toggle] = useToggle("closed", ["closed", "open"]);
  const [opened, setOpen] = useState(false);
  return (
    <div>
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
          {/* <Text size="xs" color="dimmed">
            {postedAt}
          </Text> */}
        </div>
      </Group>
      <div className="">
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
