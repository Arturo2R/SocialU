/* eslint-disable @typescript-eslint/quotes */
import {
  Anchor,
  Avatar,
  Button,
  Card,
  Collapse,
  Group,
  Image,
  Spoiler,
  Stack,
  Text,
} from "@mantine/core";
import Link from "next/link";
// import Image from "next/image";
import React, { useState } from "react";
import { Plus } from "tabler-icons-react";
import SeeUser from "./SeeUser";

export interface PostProps {
  author:
    | { image?: string | null; name?: string | null; id?: string | null }
    | "anonimo";
  image?: string;
  description: string;
  title: string;
  event?: boolean;
  postId?: string;
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
    }
    return false;
  };

  return (
    <article className="">
      <Link
        href={`/${author !== "anonimo" ? author.name : "anonimo"}/${postId}`}
        // as="a"
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
