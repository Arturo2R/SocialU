import React, { useState } from "react";
import {
  createStyles,
  Text,
  Avatar,
  Group,
  Anchor,
  Stack,
  Textarea,
  Button,
  ActionIcon,
  Collapse,
} from "@mantine/core";
import { useToggle } from "@mantine/hooks";
import { Send } from "tabler-icons-react";

export interface CommentProps {
  postedAt: string;
  body: string;
  author:
    | {
        name: string;
        image: string;
      }
    | "anonimo";
  subComments?: CommentProps[];
}

export function Comment({ postedAt, body, author, subComments }: CommentProps) {
  const [reply, toggle] = useToggle("closed", ["closed", "open"]);
  const [opened, setOpen] = useState(false);
  return (
    <div>
      <Group>
        <Avatar size="sm" src={author.image} alt={author.name} radius="xl" />
        <div>
          <Text size="sm">{author.name ? author.name : "Anónimo"}</Text>
          <Text size="xs" color="dimmed">
            {postedAt}
          </Text>
        </div>
      </Group>
      <div className="">
        <Text size="sm">{body}</Text>
        <Anchor onClick={() => setOpen((o) => !o)} color="orange">
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
        </Collapse>
      </div>

      {subComments && (
        <Stack className="pl-4 border-l-2">
          {subComments?.map((subco, index) => (
            <Comment
              key={index}
              postedAt={subco.postedAt}
              author={subco.author}
              body={subco.body}
              subComments={subco.subComments}
            />
          ))}
        </Stack>
      )}
    </div>
  );
}
