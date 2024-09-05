"use client"
// import {
//     collection,
//     doc,
//     getDoc, onSnapshot, orderBy, query
//   } from "@firebase/firestore";
import {
Group,
Image,
Paper,
// Stack,
Text,
Title,
TypographyStylesProvider,
} from "@mantine/core";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import NextImage from "next/image";
// import { AuthorInfo } from "@components/AuthorInfo";
// import { CommentProps } from "@components/Comment/Comment";
// import CommentWall from "@components/Comment/CommentWall";
// import Layout from "@components/Layout/Layout";
// import SeeUser from "@components/Post/SeeUser";
// import SEO from "@components/SEO";
// import { db } from "../../../firebase";
import { DEFAULT_COLOR, PATH } from "@lib/constants";
import styles from "./PostPage.module.css"
import BackButton from "@components/BackButton";
import { Tag } from "@components/Post/Tag";
// import posthog from "posthog-js";
// import Head from "next/head";
import config from "@lib/config";
// import type { InferGetStaticPropsType, GetStaticProps, Metadata } from 'next'
import { fetchQuery } from "convex/nextjs";
import { api } from "@backend/api";
// import { useMutation, useQuery } from "convex/react";
import { AuthorInfo } from "@components/AuthorInfo";
import CommentWall from "@components/Comment/CommentWall";
import { useEffect } from "react";
import { useAddView } from "./OneView";
import LoadingPost from "./loading";
import { useQuery } from "convex-helpers/react/cache/hooks";
// import { ViewPost } from "@components/TextEditor";
import dynamic from "next/dynamic";

// import "@blocknote/mantine/style.css";

// const { domain } = config()


dayjs.extend(relativeTime);
dayjs.locale(es);


// export const generateStaticParams = async () => {
//     const slugs = await fetchQuery(api.post.slugs)

//     return slugs.map(slug=>{slug})
// }
interface ViewPostProps {
    content: any[]
}

const ViewPost: React.ComponentType<ViewPostProps> = dynamic(() => import('@components/TextEditor').then(mod => mod.ViewPost), { ssr: false });


const PostPage = ({ params }: { params: { postSlug: string } } ) => {
    useAddView(params.postSlug)
    const content =  useQuery(api.post.get, {slug: params.postSlug})
    

    if (content === undefined) {
        return <LoadingPost />
    }

    return (
        <Paper classNames={{ root: styles.postPage }}>
            {content?.image ? (
            <>
                <BackButton id={content.slug} />
                <Image priority component={NextImage} alt="Nose" width={content?.imageData?.width || 800} height={content?.imageData?.height || 400} className="mb-4" radius="lg" sizes="(max-width: 768px) 100vw, 60vw" src={content.image} />
                {content.title && (
                <Title order={2} className="min-w-0 mb-2 text-3xl break-words hyphens-auto text-pretty" lang="es">{content?.title}</Title>
                )}
            </>
            ) : (
            <div className="flex space-x-4">
                <BackButton id={content?.slug} />
                <Title order={1} mb="sm" className="min-w-0 break-words whitespace-pre-wrap hyphens-auto text-pretty" lang="es">
                {content?.title || "     "}
                </Title>
            </div>
            )}

            <Group mb="xs">
            {content?.categoryValue && (
                <Tag label={content?.categoryValue} />
            )}
            {(content?.viewsCounter) && (
                <Text className="italic text-stone-400">
                {dayjs(content?._creationTime).fromNow()}  •  {content.viewsCounter && `${content.viewsCounter} Vista${content.viewsCounter > 1 ? 's' : ''}`}
                </Text>
            )}
            </Group>

            {(content?.content && (content?.renderMethod === "DangerouslySetInnerHtml")) && (
                <TypographyStylesProvider>
                    <div className="max-w-xl min-w-0 break-words whitespace-pre-line text-md bn-container" lang="es" dangerouslySetInnerHTML={{ __html: content.content.replace('<audio', '<audio controls').replace('<video', '<video controls') }}></div>
                </TypographyStylesProvider>
            )}
            {(content?.content && content?.renderMethod === "NonEditableTiptap") && (
                <ViewPost content={content.content as any[]} />
            )}
            {(content?.content && (content.renderMethod === "none" || !content?.renderMethod)) && (
            <Text className="max-w-xl min-w-0 break-words whitespace-pre-line text-md " lang="es">{content.content}</Text>
            )}


            {(content.anonimo === false && content.author) && (
                <AuthorInfo
                    isBussiness={false}
                    link={content.author.userName}
                    name={content.author.displayName}
                    email={`${content.author.userName}@uninorte.edu.co`}
                    image={content.author.image || "/profile.jpg"}
                    icon
                />
            )}
          
            {(content.asBussiness === true && content.organization ) && (
                <AuthorInfo
                    isBussiness={true}
                    link={content.organization.link}
                    name={content.organization.displayName}
                    email={content.organization.link || `${content?.organization.userName}@uninorte.edu.co`}
                    image={content.organization.image || "/profile.jpg"}
                    icon
                />
            )} 
            {(content?.anonimo && content.asBussiness === false) && (
            <Text color={DEFAULT_COLOR} size="lg">
                Anonimo
            </Text>
            )}
{/* 
            {content?.isEvent && (
            <div className="my-4">
                <Title order={3}>Fecha</Title>
                <Text mb="sm">{dayjs(eventDate.seconds * 1000).format('D [de] MMMM [de] YYYY, [a las] h:mm a')}</Text>
                <Title order={3} mb="xs">Asistentes</Title>
                <Stack>
                {(!content.suscriptions || content.suscriptions?.length == 0) && (
                    <Text>    Por ahora no Hay Nadie</Text>
                )}
                {content?.suscriptions?.map((s, index) => (
                    <SeeUser
                    id={s.user.userName || s.user.ref}
                    image={s.user.image}
                    name={s.user.name}
                    key={index}
                    />
                ))}
                </Stack>
            </div>
            )}

            {content?.date && (
            <Text className="mb-2 italic text-stone-400">Fecha:  {dayjs(content?.date?.getSeconds()).format("MMM D, YYYY")}</Text>
        )} */}

            <div className="z-10 my-2">

            <Title order={3} mb="sm" >Comentarios  • {content.commentsCounter || "0"}</Title>
            <CommentWall postId={content._id} oldComments={[]}  />
            </div>

        </Paper>

    );
};

export default PostPage;
