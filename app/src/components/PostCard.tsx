import * as React from 'react';

import Image from "next/image";
import Link from "next/link";

import {
  Avatar,
  Card,
  Group,
  Spoiler,
  Text,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";

import { DEFAULT_COLOR } from "@lib/constants";
import { Tag } from "./Post/Tag";
import convertAllAToSpan from '@lib/converToNonA';
// import ContentView, { ContentViewReact } from './ContentView';
// import Blocks from 'editorjs-blocks-react-renderer';

// import dayjs from "dayjs";
// import es from "dayjs/locale/es";
// import relativeTime from "dayjs/plugin/relativeTime";

// dayjs.extend(relativeTime);
// dayjs.locale(es);

interface PostCardProps {
  viewsNumber: number;
  tags?: string[];
  priority: boolean;
  postId: string;
  description: string;
  renderMethod: string;
  commentsQuantity: number;
  image?: string;
  slug: string;
  title?: string;
  imageData?: { width: number; height: number };
  author: {
    id: string;
    name: string;
    color?: string;
    image: string;
  } | "anonimo";

}


export const PostCard = ({
  author,
  title,
  image,
  commentsQuantity,
  renderMethod,
  description,
  slug,
  imageData,
  priority,
  tags,
  viewsNumber,
}: PostCardProps) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <article className="max-w-sm" id={slug}>
      <Card
        href={{
          pathname: `/${author !== "anonimo" ? author.id : "anonimo"}/${slug}`,
        }}
        component={Link}
        className="X"
        radius="md"
        withBorder
        p="xs"
      >
        {image && (
          <Card.Section style={{ display: "block", margin: "-10px -10px 10px -10px" }}>
            <Image
              sizes="(max-width: 500px) 100vw, (max-width: 768px) 50vw, (max-width: 900px) 40vw, 35vw"
              loading={priority ? "eager" : "lazy"}
              height={imageData?.height || 240}
              width={imageData?.width || 380}
              alt={title || "No hay titulo"}
              color={DEFAULT_COLOR}
              priority={priority}
              className="w-full"
              quality={70}
              src={image}
            // style="margin: -10px -10px 10px -10px; display:block"
            // style={{ margin: "-10px -10px 10px -10px", display: "block"}}
            // priority={key === 1||2||3||4 ? true:false }
            // width={380}
            // withPlaceholder
            // placeholder={<Text align="center">This image contained the meaning of life</Text>}
            // layout="fill"
            // style={{
            //   width: "100%",
            //   height: "auto"
            // }} 
            />
          </Card.Section>
        )}
        {/* <Badge>{category}</Badge> */}
        {title && (
          <Title
            className="text-xl font-bold break-words text-pretty hyphens-auto"
            lineClamp={2}
            lang="es"
            order={3}
          >
            {title}
          </Title>
        )}
        <Spoiler
          maxHeight={110}
          showLabel="Ver Más"
          hideLabel="Menos"
          transitionDuration={120}
          expanded={expanded}
          onExpandedChange={setExpanded}
        >
          {(renderMethod === "DangerouslySetInnerHtml") && (
            <TypographyStylesProvider>
              <div className="bn-container" dangerouslySetInnerHTML={{ __html: description.includes('<a') ? convertAllAToSpan(description.replace('<audio', '<audio controls')) : description.replace('<audio', '<audio controls') }}></div>
            </TypographyStylesProvider>
          )}
          {/* {renderMethod === "CustomEditorJSParser" && (
            <ContentViewReact content={description} />
          )} */}
        </Spoiler>
        {author !== "anonimo" && (
          <Group gap="xs">
            {author?.image && (
              <Avatar
                src={author?.image}
                radius="xl"
                // w={25}
                size="sm"
              />
            )}
            <Text c={author?.color || DEFAULT_COLOR} fw={author.color ? 700 : 400}>{author?.name}</Text>
          </Group>
        )}

        <Group mt="xs" justify="space-between">
          <Group>
            {tags?.map((tag, index) => (
              <Tag key={index} label={tag} />
            ))}
          </Group>
          <Text size="xs" c="dimmed">{commentsQuantity} Comentario{commentsQuantity > 1 ? "s" : ""}</Text>
          <Text size="xs" c="dimmed">{viewsNumber} Vista{viewsNumber > 1 ? "s" : ""}</Text>
        </Group>
      </Card>
    </article>
  );
};