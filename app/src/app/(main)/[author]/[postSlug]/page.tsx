"use client"

import { api } from "@backend/api";
import { AuthorInfo } from "@components/AuthorInfo";
import BackButton from "@components/BackButton";
import CommentWall from "@components/Comment/CommentWall";
import { LikesWall } from "@components/Like";
import { Tag } from "@components/Post/Tag";
import { VideoPlayer } from "@components/VideoPlayer";
import { usefeed } from "@context/FeedContext";
import { DEFAULT_COLOR } from "@lib/constants";
import { Group, Image, Paper, Text, Title, TypographyStylesProvider, } from "@mantine/core";
import { useQuery } from "convex-helpers/react/cache/hooks";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import NextImage from "next/image";
import { useAddView } from "./OneView";
import styles from "./PostPage.module.css";
import LoadingPost from "./loading";
import Head from "next/head";

dayjs.extend(relativeTime);
dayjs.locale(es);


// export const generateStaticParams = async () => {
//     const slugs = await fetchQuery(api.post.slugs)

//     return slugs.map(slug=>{slug})
// }
interface ViewPostProps {
    content: any[]
}

// const ViewPost: React.ComponentType<ViewPostProps> = dynamic(() => import('@components/TextEditor').then(mod => mod.ViewPost), { ssr: false });


const PostPage = ({ params }: { params: { postSlug: string } }) => {
    useAddView(params.postSlug)
    const { posts, isLoading } = usefeed()
    let feedpost = posts.find(p => p.slug === params.postSlug)

    const querypost = useQuery(api.post.get, !feedpost || isLoading ? { slug: params.postSlug } : "skip")
    const content = !feedpost || isLoading ? querypost : feedpost
    // const content = useQuery(api.post.get, { slug: params.postSlug })

    if (content === undefined) {
        return <LoadingPost />
    }

    return (
        <>

            <Head>
                <title>{content.title}</title>
                <meta name="description" content={content.contentInMarkdown} />
                <meta property="og:title" content={content.title} />
                <meta property="og:description" content={content.contentInMarkdown} />
                <meta property="og:image" content={content.image} />
                <meta property="og:type" content="article" />
                <meta property="og:site_name" content="Redsocialu" />
                <meta property="og:url" content={`https://redsocialu.com/anonimo/${content.slug}`} />
                <meta property="og:locale" content="es_ES" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@redsocialu" />
                <meta name="twitter:creator" content="@redsocialu" />
                <meta name="twitter:title" content={content.title} />
                <meta name="twitter:description" content={content.contentInMarkdown} />
                <meta name="twitter:image" content={content.image} />
                <meta name="twitter:image:alt" content={content.title} />
                <meta name="twitter:label1" content="Tiempo de lectura" />
                <meta name="twitter:data1" content="2 minutos" />
                <meta name="twitter:label2" content="Fecha de publicación" />
                <meta name="twitter:data2" content={dayjs(content._creationTime).format("MMMM D, YYYY")} />
            </Head>
            <Paper classNames={{ root: styles.postPage }}>
                {content.video && (
                    <>
                        <VideoPlayer playbackId={content.video} title={content.title} />

                    </>
                )}
                {content?.image ? (
                    <>
                        <BackButton />
                        <Image priority component={NextImage} alt="Nose" width={content?.imageData?.width || 800} height={content?.imageData?.height || 400} className="mb-4" radius="lg" sizes="(max-width: 768px) 100vw, 60vw" src={content.image} />
                        {content.title && (
                            <Title order={2} className="min-w-0 mb-2 text-3xl break-words hyphens-auto text-pretty" lang="es">{content?.title}</Title>
                        )}
                    </>
                ) : (
                    <div className="flex space-x-4">
                        <BackButton />
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

                {(content?.contentInHtml && (content?.renderMethod === "DangerouslySetInnerHtml")) && (
                    <TypographyStylesProvider>
                        <div className="max-w-xl min-w-0 break-words whitespace-pre-line text-md bn-container" lang="es" dangerouslySetInnerHTML={{ __html: content.contentInHtml.replace('<audio', '<audio controls').replace('<video', '<video controls') }}></div>
                    </TypographyStylesProvider>
                )}
                {/* {(content?.content && content?.renderMethod === "NonEditableTiptap") && (
                <ViewPost content={content.content as any[]} />
            )} */}
                {/* {(content?.content && content.renderMethod === "CustomEditorJSParser") && (
                <TypographyStylesProvider className="max-w-xl min-w-0 break-words whitespace-pre-line text-md">
                    <Blocks data={JSON.parse(String(content.content))} />
                </TypographyStylesProvider>
            )} */}
                {/* {(content?.content && content.renderMethod === "CustomEditorJSParser") && (
                <ContentViewReact content={String(content.content)} />
            )} */}
                {(content?.content && (content.renderMethod === "none" || !content?.renderMethod)) && (
                    <Text className="max-w-xl min-w-0 break-words whitespace-pre-line text-md " lang="es">{content.content}</Text>
                )}


                {(content.anonimo === false && content.author) && (
                    <AuthorInfo
                        isBussiness={false}
                        link={content.author.userName}
                        name={content.author.displayName}
                        email={`${content.author.userName || 'elman'}@uninorte.edu.co`}
                        image={content.author.image || "/profile.jpg"}
                        icon
                    />
                )}

                {(content.asBussiness === true && content.organization) && (
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
                        {`Anónimo ${content.authorAnonimousId}` || "Anonimo"}
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
                <div className="my-4">
                    <LikesWall likeText={content.likeText} postId={content._id} serverLiked={content.likedByTheUser} likes={content.likes || 0} dislikes={content.dislikes || 0} />
                </div>

                <div className="z-10 my-2">

                    <Title order={3} mb="sm" >Comentarios  • {content.commentsCounter || "0"}</Title>
                    <CommentWall postId={content._id} oldComments={[]} />
                </div>

            </Paper>
        </>
    );
};

export default PostPage;
