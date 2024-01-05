/* eslint-disable @typescript-eslint/quotes */
import { Check, Plus } from "tabler-icons-react";
import Link from "next/link";
import Image from "next/image";
import { useState, FC, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import SeeUser from "./SeeUser";
import styles from "./Post.module.css"
// import markdownToHtml from "../../lib/mardown";

import {
  // Anchor,
  // Avatar,
  Card,
  Collapse,
  Group,
  // Image,
  Spoiler,
  Stack,
  Text,
  Title,
  Button,
} from "@mantine/core";
import { DEFAULT_COLOR, DEFAULT_GRADIENT } from "../../constants";
// import BiggerPicture from "bigger-picture";
// type author =
//   | {
//       image: string;
//       name: string;
//       id?: string;
//       // ref?: `user/${string}`;
//     }
//   | "anonimo";



export const PostCard: FC<PostCardProps> = ({
  author,
  title,
  image,
  description,
  postId,
  asistants,
  event,
  userUID,
  imageData
}) => {
  const [expanded, setExpanded] = useState(false);





  // useEffect(() => {
  const sera = (): boolean => {
    let isSuscribed: boolean
    if (event && asistants && userUID) {
      isSuscribed = asistants.some((item) => {
        // console.log(item.user.ref, `user/${user?.uid}`)
        return item.user.ref == `user/${userUID}`
      })
    } else { isSuscribed = false }
    return isSuscribed
  }

  const [suscribed, setSuscribed] = useState<boolean>(false);

  useEffect(() => {
    setSuscribed(sera())
  }, [asistants])


  const aja = () => {
    if (asistants === undefined || asistants.length == 0) {
      return true;
    }
    return false;
  };
  // const generateText = async (text: string) => {
  //   await markdownToHtml(text)
  // }

  const { suscribe } = useFirestore();
  return (
    <article className="px" id={postId}>
      <Card withBorder p="xs" radius="md">
        <Link
          href={`/${author !== "anonimo" ? author.id : "anonimo"}/${postId}`}
          className="X"
        >
          <>
            {image && (
              <Card.Section className={styles.mainImage}>
                <Image
                  src={image}
                  alt={title}
                  width={imageData?.width || 380}
                  height={imageData?.height || 240}
                  color={DEFAULT_COLOR}
                  loading="lazy"
                  quality={70}
                  // style="margin: -10px -10px 10px -10px; display:block"
                  // style={{ margin: "-10px -10px 10px -10px", display: "block"}}
                  // priority={key === 1||2||3||4 ? true:false }
                  // width={380}
                  // withPlaceholder
                  // placeholder={<Text align="center">This image contained the meaning of life</Text>}
                  // layout="fill"
                  className="w-full"
                  sizes="50vw"
                // style={{
                //   width: "100%",
                //   height: "auto"
                // }} 
                />
              </Card.Section>
            )}
            {/* <Badge>{category}</Badge> */}
            <Title lineClamp={2} order={3} className="text-xl font-bold">{title}</Title>
          </>
        </Link>
        {author !== "anonimo" ? (
          <Link href={`/${author.id}`} >
            <Group className="mt-1" gap="xs">
              {author?.image && <Image
                alt={`${author.name} avatar image`}
                width="30"
                height="30"
                quality={30}
                src={author?.image}
                className="rounded-full"
                style={{
                  maxWidth: "100%",
                  height: "auto"
                }} />}
              <p className="hover:decoration-orange-600 hover:decoration-dotted hover:decoration-2">{author?.name}</p>
            </Group>
          </Link>
        ) : (
          <Text color={DEFAULT_COLOR}>Anónimo</Text>
        )}
        <Spoiler
          className="mt-1"
          onClick={(e) => e.stopPropagation()}
          maxHeight={110}
          showLabel="Ver Más"
          hideLabel="Menos"
        >
          <Text>{description}</Text>
          {/* <TypographyStylesProvider>
          <div dangerouslySetInnerHTML={{ __html:  description}}></div>
          
          </TypographyStylesProvider> */}
        </Spoiler>
        {event && (
          <>
            <Group grow mt="sm" >
              <Button
                className="text-sm sm:text-base"
                size="compact-lg"
                onClick={(e: { stopPropagation: () => void }) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
                variant="light"
                gradient={DEFAULT_GRADIENT}
                disabled={aja()}
                // rightIcon={<ChevronsRight />}
              >
                {asistants?.length} Asistentes
              </Button>
              <Button
                variant="gradient"
                gradient={DEFAULT_GRADIENT}
                className="text-sm sm:text-base"
                size="compact-lg"
                onClick={(e: { stopPropagation: () => void }) => {
                  e.stopPropagation();
                  setSuscribed(!suscribed);
                  typeof postId === "string" && suscribe(postId, suscribed);
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

    </article>
  );
};
