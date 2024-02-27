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
} from "@mantine/core";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import NextImage from "next/image";
import React, { useEffect, useState } from "react";
import { AuthorInfo } from "../../../components/AuthorInfo";
import { CommentProps } from "../../../components/Comment/Comment";
import CommentWall from "../../../components/Comment/CommentWall";
import Layout from "../../../components/Layout/Layout";
import SeeUser from "../../../components/Post/SeeUser";
import SEO from "../../../components/SEO";
import { db } from "../../../firebase";
import { DEFAULT_COLOR, PATH } from "../../../constants";
import { Timestamp } from "@firebase/firestore";
import styles from "./PostPage.module.css"
import BackButton from "../../../components/BackButton";
import { Tag } from "../../../components/Post/Tag";


export interface PostPageProps { data: Post, postId: string; authorId: string };
dayjs.extend(relativeTime);
dayjs.locale(es);
// const PATH = process.env.NEXT_PUBLIC_DB_COLLECTION_PATH || "developmentPosts"

export async function getStaticProps(context: any) {
  const { postId, authorId } = context.params
  console.log("postID: ", postId, "authorId: ", authorId)
  console.log("el path:", PATH)
  try {
    const postRef = doc(db, PATH, postId);
    // TODO: Arreglar Urgente aqui, un problema que cuando se crea un nuevo post, no puedo acceser a es, puede que sea por el ISR
    const postSnap: anything = await getDoc(postRef);
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
    }
    return {
      revalidate: 20,
      props: { data: Payload, postId, authorId: JSON.stringify(authorId) }, // will be passed to the page component as props
    }
  } catch (error: any) {
    console.error("Error en en ISR del post ", error.message)
  }
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking", // false or "blocking"
  }
}



const PostPage = ({ data: content, postId: id, authorId }: PostPageProps) => {
  // const { postId, authorId } = router.query;
  // const id: string = typeof] postId === "string" ? postId : "nada-que-ver";
  // const [content, setContent] = useState<Post | undefined>();
  //loading state
  // const [respondTo, setRespondTo] = useState("")
  console.log(id)
  const [comments, setComments] = useState<CommentProps[] | undefined>();
  const [numberOfComments, setNumberOfComments] = useState(content.commentsQuantity || 0)

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
          author: comment.anonimo === true ? "anonimo" : comment.author,
        }));
      // console.log("raw", commentsDB);
      setComments(commentsDB);
      setNumberOfComments(commentsDB.length)
    });
    return () => {
      unsuscribe()
    };
  }, []);


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
  const eventDate: Timestamp = content.isEvent ? content.computedDate || content.date : undefined

  return (

    <Layout>

      <SEO canonical={`${authorId}/${id}`} description={content.message} twitterCreator="Social\U" mainImage={content.image} title={content.title || `Post ${id}`} />
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
            <Title order={2} mb="sm" className="min-w-0 break-words whitespace-pre-wrap hyphens-auto text-pretty" lang="es">
              {content?.title || "     "}
            </Title>
          </div>
        )}

        <Group mb="xs">
          {content?.tags && content.tags.map((tag, index) => (
            <Tag key={index} label={tag} />
          ))
          }
        {fecha && (
          <Text className="italic text-stone-400">
            {dayjs(fecha).fromNow()}
          </Text>
        )}
        </Group>

        {content?.message && (
          <Text className="max-w-xl min-w-0 break-words whitespace-pre-line text-md hyphens-auto " lang="es">{content.message}</Text>
          //  <TypographyStylesProvider>
          //     <div className="max-w-lg text-md" dangerouslySetInnerHTML={{ __html: content.message}}></div>
          // </TypographyStylesProvider>

        )}
        {content?.anonimo === false && content.authorName ? (
          <AuthorInfo
            link={content?.userName}
            name={content?.authorName}
            email={content?.authorEmail || `${content?.userName}@uninorte.edu.co`}
            image={content.authorImage ? content.authorImage : "/profile.jpg"}
            icon
          />
        ) : (
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

          <Title order={3} mb="sm" >Comentarios  • {numberOfComments}</Title>
          <CommentWall postId={id} comments={comments} />
        </div>

      </Paper>
    </Layout>
  );
};

export default PostPage;
