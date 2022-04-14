import {
  Card,
  Group,
  Avatar,
  ActionIcon,
  Text,
  Image,
  Button,
  Anchor,
  Collapse,
  Stack,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import Link from "next/link";
// import Image from "next/image";
// import { title } from 'process'
import React, { useState } from "react";
import { ChevronsRight, Plus } from "tabler-icons-react";
import SeeUser from "./SeeUser";
// import { theme } from 'twin.macro'

interface PostProps {
  author: { avatar?: string; name: string; id: string } | "anonimo";
  image?: string;
  description: string;
  title: string;
  event?: boolean;
  postId: string;
  // relevantCommentary?: Object;
  asistants?: { id: string; name: string; avatar: string }[];
}

export const Post = ({
  author,
  title,
  image,
  description,
  postId,
  asistants,
  event,
}: PostProps) => {
  const [expanded, setExpanded] = useState(false);

  const aja = () => {
    if (asistants === undefined || asistants.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <article>
      <Anchor
        component={Link}
        href={`/${author !== "anonimo" ? author.id : "anonimo"}/${postId}`}
      >
        <div className="w-full">
          <Card withBorder p="lg" radius="md">
            {image && (
              <Card.Section>
                <Image src={image} alt={title} height={160} />
              </Card.Section>
            )}
            {/* <Badge>{category}</Badge> */}
            <Text className="mt-2 text-xl font-bold">{title}</Text>

            {author !== "anonimo" ? (
              <Group mt="md">
                <Avatar size="sm" src={author?.avatar} radius="xl" />
                <Anchor component={Link} href={`/${author.id}`}>
                  {author?.name}
                </Anchor>
              </Group>
            ) : (
              <Text color="orange">Anónimo</Text>
            )}

            <Text className="mt-2">{description}</Text>

            {event && (
              <>
                <Group grow mt="sm">
                  <Button
                    onClick={(e: { stopPropagation: () => void }) => {
                      e.stopPropagation();
                      setExpanded(!expanded);
                    }}
                    variant="light"
                    color="orange"
                    disabled={aja()}
                    rightIcon={<ChevronsRight />}
                  >
                    Ver Asistentes
                  </Button>
                  <Button
                    onClick={(e: { stopPropagation: () => void }) => {
                      e.stopPropagation();
                    }}
                    color="orange"
                    rightIcon={<Plus />}
                  >
                    Unirme
                  </Button>
                </Group>

                <Collapse in={expanded}>
                  <Stack mt="sm" spacing="xs">
                    {asistants?.map((i) => (
                      <SeeUser id={i.id} name={i.name} image={i.avatar} />
                    ))}
                  </Stack>
                </Collapse>
              </>
            )}
          </Card>
        </div>
      </Anchor>
    </article>
  );
};
