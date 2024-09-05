import {
  collection,
  doc,
  getDoc, onSnapshot, orderBy, query
} from "@firebase/firestore";
import {
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import NextImage from "next/image";
import React, { useEffect, useState } from "react";
import { AuthorInfo } from "@components/AuthorInfo";
import { CommentProps } from "@components/Comment/Comment";
import CommentWall from "@components/Comment/CommentWall";
import Layout from "@components/Layout/Layout";
import SeeUser from "@components/Post/SeeUser";
import SEO from "@components/SEO";
import { db } from "../../../firebase";
import { DEFAULT_COLOR, PATH } from "../../../constants";
import styles from "./PostPage.module.css"
import BackButton from "@components/BackButton";
import { Tag } from "@components/Post/Tag";
import posthog from "posthog-js";
import Head from "next/head";
import config from "../../../config";
import type { InferGetStaticPropsType, GetStaticProps } from 'next'

// import "@blocknote/mantine/style.css";

const { domain } = config()

export interface PostPageProps { data: Post, postId: string; authorId: string };
dayjs.extend(relativeTime);
dayjs.locale(es);
// const PATH = process.env.NEXT_PUBLIC_DB_COLLECTION_PATH || "developmentPosts"

export const getStaticProps = (async (context) => {
  const { postId, authorId } = context.params
  console.log("postID: ", postId, "authorId: ", authorId)
  console.log("el path:", PATH)
  try {
    const postRef = doc(db, PATH, postId);
    // TODO: Arreglar Urgente aqui, un problema que cuando se crea un nuevo post, no puedo acceser a es, puede que sea por el ISR
    const postSnap: anything = await getDoc(postRef);
    console.log("ladata: ", postSnap)
    const data: Post = postSnap.data()
    if (!data) {
      return {
        notFound: true,
      }

    }

    // console.log(data.computedDate?.toJSON())
    const Payload = {
      ...data,
      createdAt: data?.createdAt?.toMillis(),
      ...(data?.date && { date: data.date.toJSON() }),
      ...(data?.time && { time: JSON.stringify(data.time) }),
      ...(data?.computedDate && { computedDate: data.computedDate.toJSON() }),
      ...(data?.comentarios && { comentarios: JSON.stringify(data.comentarios) }),
    }
    return {
      revalidate: 200,
      props: { data: Payload, postId, authorId: JSON.stringify(authorId) }, // will be passed to the page component as props
    }
  } catch (error: any) {
    console.error("Error en en ISR del post ", error.message)
    posthog.capture('$exception', {
      message: error.message,
      error: "Error en ISR del post",
      function: "Server getStaticProps Post page"
    });
    return { notFound: true }
  }
}) satisfies GetStaticProps<{ data: Post, postId: string, authorId: string, }>

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking", // false or "blocking"
  }
}



const PostPage = ({ data, postId: id, authorId }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // const { postId, authorId } = router.query;
  // const id: string = typeof] postId === "string" ? postId : "nada-que-ver";
  // const [content, setContent] = useState<Post | undefined>();
  //loading state
  // const [respondTo, setRespondTo] = useState("")
  console.log(id)
  const [content, setContent] = useState(data)
  const [comments, setComments] = useState<CommentProps[] | undefined>();

  const [onlyOneView, setAlreadyViewed] = useState<Boolean>(false)





  useEffect(() => {
    const postRef = doc(db, PATH, id);

    // Create a snapshot listener
    const unsubscribe = onSnapshot(postRef, (postSnap) => {
      const data: Post = postSnap.data();
      const Payload = {
        ...data,
        createdAt: data?.createdAt?.toMillis(),
        ...(data?.date && { date: data.date.toJSON() }),
        ...(data?.time && { time: JSON.stringify(data.time) }),
        ...(data?.computedDate && { computedDate: data.computedDate.toJSON() }),
        ...(data?.comentarios && { comentarios: JSON.stringify(data.comentarios) }),
      }
      setContent(Payload)
    })


    return () => {
      unsubscribe()
    }
  }, [])


  useEffect(() => {

    let q = query(
      collection(db, PATH, id, "comments"),
      orderBy("postedAt", "desc")
      // limit(20)
    );
    const unsuscribe = onSnapshot(q, (querySnapshot: any) => {
      const commentsDB = querySnapshot.docs
        .map((doc: anything) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .map((comment: any) => ({
          ...comment,
        }));
      // console.log("raw", commentsDB);
      setComments(commentsDB);

    });



    return () => {
      unsuscribe()
    };
  }, []);

  const nada = "nada"

  useEffect(() => {
    if (onlyOneView === false) {
      fetch(`/api/views?password=eyquecomovalavaina&id=${id}&userId=${authorId || "asdfafs"}&feedView=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => {
          console.error(error);
          posthog.capture('$exception', {
            message: error.message,
            error: "Error publicando un view",
            function: "Client UseEffect Post page"
          });
        });
      setAlreadyViewed(true)
    }

    return () => {
      setAlreadyViewed(false)
    };
  }, [])

  const postAuthor = data.anonimo ? "Anonimo" : data.userName

  // const qaJSONLd = `{
  //   "@context": "https://schema.org",
  //   "@type": "QAPage",
  //   "mainEntity": {
  //     "@type": "Question",
  //     "name": "What is the capital of France?",
  //     "text": "I've heard that the capital of France is either Paris or London. Can anyone confirm this?",
  //     "answerCount": 1,
  //     "upvoteCount": 1,
  //     "dateCreated": "2022-01-01T00:00:00Z",
  //     "author": {
  //       "@type": "Person",
  //       "name": "User1"
  //     },
  //     "acceptedAnswer": {
  //       "@type": "Answer",
  //       "text": "{data.title}",
  //       "dateCreated": "{data.createdAt}",
  //       "upvoteCount": "{data.viewsCounter}",
  //       "url": "https://example.com/answer-url",
  //       "author": {
  //         "@type": "Person",
  //         "name": "${postAuthor}"
  //       }
  //     }
  //   }
  // }`

  const socialMediaPostJSONLd = `
  {
    "@context": "https://schema.org",
    "@type": "SocialMediaPosting",
    "sharedContent": {
      "@type": "WebPage",
      "url": "https:/${domain}/${postAuthor}/${id}",
      "headline": "${data.title || "Post"}",
      "datePublished": "${new Date(data.createdAt).toISOString()}",
      "author": {
        "@type": "Person",
        "name": "${postAuthor}"
      }
    }
  }
`;

  const blogPostJSONLd = `
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${data.title || "Post"}",
      "datePublished": ${new Date(data.createdAt).toISOString()}",,
      "author": {
        "@type": "Person",
        "name": ${postAuthor}
      }
    }
  `;


  // if (loading) {
  //   return (
  //     <Layout>
  //       <Center className="h-full my-auto">
  //         <Loader color={DEFAULT_COLOR} size="lg" variant="bars" />
  //       </Center>
  //     </Layout>
  //   );
  // }
  // if (error) return <Text>{error}</Text>;

  const fecha: Date = content.createdAt
  const eventDate = content?.computedDate || content?.date;

  return (

    <Layout>

      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: data.message.length > 150 ? blogPostJSONLd : socialMediaPostJSONLd }}
        />
      </Head>

      <SEO canonical={`${postAuthor}/${id}`} description={content.message} twitterCreator="Social\U" mainImage={content.image} title={content.title || `Post ${id}`} />
      <span className="hidden bg-dark/50 dark:bg-white/50"></span>

      <Paper classNames={{ root: styles.postPage }}>

        {content?.image ? (
          <>
            <BackButton id={id} />
            <Image priority component={NextImage} alt="Nose" width={content?.imageData?.width || 800} height={content?.imageData?.height || 400} className="mb-4" radius="lg" sizes="(max-width: 768px) 100vw, 60vw" src={content.image} />
            {content.title && (
              <Title order={2} className="min-w-0 mb-2 text-3xl break-words hyphens-auto text-pretty" lang="es">{content?.title}</Title>
            )}
          </>
        ) : (
          <div className="flex space-x-4">
            <BackButton id={id} />
            <Title order={1} mb="sm" className="min-w-0 break-words whitespace-pre-wrap hyphens-auto text-pretty" lang="es">
              {content?.title || "     "}
            </Title>
          </div>
        )}

        <Group mb="xs">
          {content?.tags && content.tags.map((tag, index) => (
            <Tag key={index} label={tag} />
          ))
          }
          {(fecha || content.viewsCounter) && (
            <Text className="italic text-stone-400">
              {dayjs(fecha).fromNow()}  •  {content.viewsCounter && `${content.viewsCounter} Vista${content.viewsCounter > 1 ? 's' : ''}`}
            </Text>
          )}
        </Group>

        {(content?.message && content?.renderMethod === "DangerouslySetInnerHtml") && (
          <TypographyStylesProvider>
            <div className="max-w-xl min-w-0 break-words whitespace-pre-line text-md bn-container" lang="es" dangerouslySetInnerHTML={{ __html: content.message }}></div>
          </TypographyStylesProvider>
        )}
        {(content?.message && (content.renderMethod === "none" || !content?.renderMethod)) && (
          <Text className="max-w-xl min-w-0 break-words whitespace-pre-line text-md " lang="es">{content.message}</Text>
        )}


        {(content?.anonimo === false && content.authorName) && (
          <AuthorInfo
            isBussiness={content.asBussiness}
            link={content?.userName}
            name={content?.authorName}
            email={content?.authorEmail || `${content?.userName}@uninorte.edu.co`}
            image={content.authorImage || "/profile.jpg"}
            icon
          />
        )}
        {console.log(content)}
        {(content?.anonimo && content?.asBussiness) && (
          <AuthorInfo
            isBussiness={content.asBussiness}
            link={content.bussiness?.bussinessUrl}
            name={content.bussiness?.bussinessName}
            email={content.bussiness?.bussinessUrl || `${content?.userName}@uninorte.edu.co`}
            image={content.bussiness?.bussinessLogo || "/profile.jpg"}
            icon
          />
        )}
        {(content?.anonimo && content.asBussiness === false) && (
          <Text color={DEFAULT_COLOR} size="lg">
            Anonimo
          </Text>
        )}

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

        {/* {content?.date && (
        <Text className="mb-2 italic text-stone-400">Fecha:  {dayjs(content?.date?.getSeconds()).format("MMM D, YYYY")}</Text>
      )} */}

        <div className="z-10 my-2">

          <Title order={3} mb="sm" >Comentarios  • {content.commentsQuantity}</Title>
          <CommentWall postId={id} oldComments={comments} comments={content.comentarios && JSON.parse(content.comentarios)} />
        </div>

      </Paper>
    </Layout>
  );
};

export default PostPage;
