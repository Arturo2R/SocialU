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
  Spoiler,
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
  author: { image?: string; name: string; id: string } | "anonimo";
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
    <article className="mx-auto max-w-sm">
      <Link
        href={`/${author !== "anonimo" ? author.name : "anonimo"}/${postId}`}
      >
        <Card withBorder p="xs" radius="md">
          {image && (
            <Card.Section>
              <Image src={image} alt={title} height={160} />
            </Card.Section>
          )}
          {/* <Badge>{category}</Badge> */}
          <Text className="mt-2 text-xl font-bold">{title}</Text>

          {author !== "anonimo" ? (
            <Group mt="md">
              <Avatar size="md" src={author?.image} radius="xl" />
              <Anchor component={Link} href={`/${author.id}`}>
                {author?.name}
              </Anchor>
            </Group>
          ) : (
            <Text color="orange">Anónimo</Text>
          )}

          <Spoiler
            onClick={(e) => e.stopPropagation()}
            maxHeight={110}
            showLabel="Ver Más"
            hideLabel="Menos"
          >
            <Text>{description}</Text>
          </Spoiler>

          {event && (
            <>
              <Group grow my="sm">
                <Button
                  className="text-sm sm:text-base"
                  size="lg"
                  onClick={(e: { stopPropagation: () => void }) => {
                    e.stopPropagation();
                    setExpanded(!expanded);
                  }}
                  variant="light"
                  color="orange"
                  disabled={aja()}
                  compact
                  // rightIcon={<ChevronsRight />}
                >
                  {asistants?.length} Asistentes
                </Button>
                <Button
                  compact
                  className="text-sm sm:text-base"
                  size="lg"
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
                <Stack spacing="xs">
                  {/* <Spoiler
                    maxHeight={180}
                    showLabel="Ver Más"
                    hideLabel="Menos"
                  > */}
                  {asistants?.map((i, index) => (
                    <SeeUser
                      key={index}
                      id={i.id}
                      name={i.name}
                      image={i.avatar}
                    />
                  ))}
                  {/* </Spoiler> */}
                </Stack>
              </Collapse>
            </>
          )}
        </Card>
      </Link>
    </article>
  );
};
