/* eslint-disable @typescript-eslint/quotes */
import { Timestamp } from "@firebase/firestore";
import {
  Anchor,
  Avatar,
  Button,
  Card,
  Collapse,
  Group,
  // Image,
  Spoiler,
  Stack,
  Text,
} from "@mantine/core";
import { CheckCircledIcon } from "@modulz/radix-icons";
import Link from "next/link";
import Image from "next/image";
import React, { useState, FC, useEffect } from "react";
import { Plus } from "tabler-icons-react";
import { useAuth } from "../../context/AuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import SeeUser from "./SeeUser";
// import BiggerPicture from "bigger-picture";
// type author =
//   | {
//       image: string;
//       name: string;
//       id?: string;
//       // ref?: `user/${string}`;
//     }
//   | "anonimo";

export interface PostProps {
  author:
  | { image?: string | null; name: string; id: string }
  | "anonimo";
  image?: string;
  description: string;
  title: string;
  event?: boolean;
  postId?: string;
  // relevantCommentary?: Object;
  asistants?: {
    user: {
      image: string;
      name: string;
      ref: `user/${string}`;
    };
    suscribedAt?: Timestamp;
  }[];
  key: number;
}

export const Post: FC<PostProps> = ({
  author,
  title,
  image,
  description,
  postId,
  asistants,
  event,
  key,
}) => {
  const [expanded, setExpanded] = useState(false);
  const { user } = useAuth()




  // useEffect(() => {
  const sera = (): boolean => {
    let isSuscribed: boolean
    if (event && asistants) {
      isSuscribed = asistants.some((item) => {
        // console.log(item.user.ref, `user/${user?.uid}`)
        return item.user.ref == `user/${user?.uid}`
      })
    } else { isSuscribed = false }
    return isSuscribed
  }

  const [suscribed, setSuscribed] = useState<boolean>(false);

  useEffect(() => {
    setSuscribed(sera())
  }, [asistants])
  

  const aja = () => {
    if (asistants === undefined || asistants.length === 0) {
      return true;
    }
    return false;
  };

  const { suscribe } = useFirestore();
  return (
    <article className="">
      <Link
        href={`/${author !== "anonimo" ? author.name : "anonimo"}/${postId}`}
      // as="a"
      >
        <Card withBorder p="xs" radius="md">
          {image && (
            <Card.Section className="mb-2 image">
              <Image
                // quality={50}
                src={image}
                alt={title}
                width={380}
                height={240}
                color="orange"
                loading="lazy"
                layout="responsive"
                sizes="50vw"
                quality={70}
                // priority={key === 1||2||3||4 ? true:false }
                // width={380}
                // withPlaceholder
                // placeholder={<Text align="center">This image contained the meaning of life</Text>}
                className="w-full"
              // layout="fill"
              />
            </Card.Section>
          )}
          {/* <Badge>{category}</Badge> */}
          <Text className="text-xl font-bold">{title}</Text>
          {author !== "anonimo" ? (
            <Link href={`/${author.id}`} >
              <a >
                <Group className="mt-1" spacing="xs">
                  <Avatar size="sm" src={author?.image} radius="xl" />
                  <p className="hover:decoration-orange-600 hover:decoration-dotted hover:decoration-2">{author?.name}</p>
                </Group>
              </a>
            </Link>
          ) : (
            <Text color="orange">Anónimo</Text>
          )}
          <Spoiler
            className="mt-1"
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
                    setSuscribed(!suscribed);
                    typeof postId === "string" && suscribe(postId, suscribed);
                  }}
                  color="orange"
                  rightIcon={suscribed ? <CheckCircledIcon /> : <Plus />}
                >
                  {suscribed ? "Asistiré" : "Unirme"}
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
                      id={i.user.ref || i.user.name}
                      name={i.user.name}
                      image={i.user.image}
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
