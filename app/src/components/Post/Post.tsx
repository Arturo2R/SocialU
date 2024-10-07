/* eslint-disable @typescript-eslint/quotes */
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Check, Plus } from "tabler-icons-react";
import styles from "./Post.module.css";
import SeeUser from "./SeeUser";

import {
  Avatar,
  Button,
  Card,
  Collapse,
  Image as M_Img,
  Group,
  Spoiler,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";

import { DEFAULT_COLOR, DEFAULT_GRADIENT } from "@lib/constants";
import { Tag } from "./Tag";
import ContentView from "@components/ContentView";

// import dayjs from "dayjs";
// import es from "dayjs/locale/es";
// import relativeTime from "dayjs/plugin/relativeTime";

// dayjs.extend(relativeTime);
// dayjs.locale(es);


export const PostCard: FC<PostCardProps> = ({
  author,
  title,
  image,
  commentsQuantity,
  renderMethod,
  description,
  postId,
  asistants,
  event,
  userUID,
  imageData,
  priority,
  tags,
  viewsNumber,
  // createdAt,
  subscribeToPost,
}) => {
  const [expanded, setExpanded] = useState(false);

  const suscribeUserIfNotSuscribed = (): boolean => {
    let isSuscribed: boolean
    if (event && asistants && userUID) {
      isSuscribed = asistants.some((item) => {
        return item.user.ref == `user/${userUID}`
      })
    } else { isSuscribed = false }
    return isSuscribed
  }

  const [suscribed, setSuscribed] = useState<boolean>(false);

  useEffect(() => {
    setSuscribed(suscribeUserIfNotSuscribed())
  }, [asistants])


  const show0IfThereisNoSuscribers = () => {
    if (asistants === undefined || asistants.length == 0) {
      return true;
    }
    return false;
  };


  return (
    <article className="max-w-lg" id={postId}>
      <Card component={Link}
        href={`/${author !== "anonimo" ? author.id : "anonimo"}/${postId}`}
        className="X"
        withBorder p="xs" radius="md">

        {image && (
          <Card.Section className={styles.mainImage}>
            <Image
              src={image}
              alt={title || "No hay titulo"}
              width={imageData?.width || 380}
              height={imageData?.height || 240}
              color={DEFAULT_COLOR}
              loading={priority ? "eager" : "lazy"}
              quality={70}
              priority={priority}
              // style="margin: -10px -10px 10px -10px; display:block"
              // style={{ margin: "-10px -10px 10px -10px", display: "block"}}
              // priority={key === 1||2||3||4 ? true:false }
              // width={380}
              // withPlaceholder
              // placeholder={<Text align="center">This image contained the meaning of life</Text>}
              // layout="fill"
              className="w-full"
              sizes="(max-width: 500px) 100vw, (max-width: 768px) 50vw, (max-width: 900px) 40vw, 35vw"
            // style={{
            //   width: "100%",
            //   height: "auto"
            // }} 
            />
          </Card.Section>
        )}
        {/* <Badge>{category}</Badge> */}
        {title && (
          <Title lineClamp={2} order={3} className="text-xl font-bold break-words text-pretty hyphens-auto" lang="es">{title}</Title>
        )}


        {author !== "anonimo" && (
          <Link href={`/${author.id}`} >
            <Group gap="xs">

              {author?.image && (
                <Avatar
                  src={author?.image}
                  mt={1}
                  // w={25}
                  size="sm"
                  radius="xl"
                />
              )}

              <Text c={author?.color || DEFAULT_COLOR} fw={author.color ? 700 : 400}>{author?.name}</Text>
            </Group>
          </Link>
        )}



        <Spoiler
          className=""
          onClick={(e) => {
            if (description.length > 200) {
              e.preventDefault(); e.stopPropagation()
            }
          }}
          maxHeight={110}
          showLabel="Ver Más"
          hideLabel="Menos"
          transitionDuration={120}
        >
          {renderMethod === "DangerouslySetInnerHtml" && (
            <TypographyStylesProvider>
              <div className="bn-container" dangerouslySetInnerHTML={{ __html: description }}></div>
            </TypographyStylesProvider>
          )}
          {renderMethod === "CustomEditorJSParser" && (
            <ContentView content={String(description)} />
          )}
        </Spoiler>
        {event && (
          <>
            <Group grow mt="sm" onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}>
              <Button
                className="text-sm sm:text-base"
                size="compact-lg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  setExpanded(!expanded);
                }}
                variant="light"
                gradient={DEFAULT_GRADIENT}
                disabled={show0IfThereisNoSuscribers()}
              // rightIcon={<ChevronsRight />}
              >
                {asistants?.length} Asistentes
              </Button>
              <Button
                variant="gradient"
                gradient={DEFAULT_GRADIENT}
                className="text-sm sm:text-base"
                size="compact-lg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  setSuscribed(!suscribed);
                  typeof postId === "string" && subscribeToPost(postId, suscribed);
                }}
                rightSection={suscribed ? <Check /> : <Plus />}
              >
                {suscribed ? "Asistiré" : "Unirme"}
              </Button>
            </Group>
            <Collapse in={expanded}>
              <Stack gap="xs" mt="xs">
                {/* <Spoiler
                      maxHeight={180}
                      showLabel="Ver Más"
                      hideLabel="Menos"
                    > */}
                {asistants?.map((i, index) => (
                  <SeeUser
                    key={index}
                    id={i.user.userName || i.user.ref}
                    name={i.user.name}
                    image={i.user.image}
                  />
                ))}
                {/* </Spoiler> */}
              </Stack>
            </Collapse>
          </>
        )}
        <Group mt="xs" justify="space-between">
          <Group>
            {tags?.map((tag, index) => (
              <Tag key={index} label={tag} />
            ))}
          </Group>
          {/* <Group className="justify-self-end" justify="end"> */}
          {commentsQuantity && (
            <Text size="xs" c="dimmed"  >{commentsQuantity} Comentario{commentsQuantity > 1 ? "s" : ""}</Text>
          )}
          {viewsNumber && (
            <Text size="xs" c="dimmed"  >{viewsNumber} Vista{viewsNumber > 1 ? "s" : ""}</Text>
          )}


          {/* {createdAt && (
              <Text size="xs" c="dimmed"  >• {dayjs(createdAt).fromNow()}</Text>
            )} */}
        </Group>
        {/* </Group> */}
      </Card>
    </article>
  );
};


