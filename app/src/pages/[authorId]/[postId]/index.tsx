import {
  collection,
  doc,
  getDoc, onSnapshot, orderBy, query
} from "@firebase/firestore";
import {
  Image,
  Paper,
  Stack,
  Text,
  Title,
  ActionIcon,
} from "@mantine/core";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import NextImage from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ChevronLeft } from "tabler-icons-react";
import { AuthorInfo } from "../../../components/AuthorInfo";
// import { useFirestore } from "../../../hooks/useFirestore";
import { CommentProps } from "../../../components/Comment/Comment";
import CommentWall from "../../../components/Comment/CommentWall";
import Layout from "../../../components/Layout/Layout";
import SeeUser from "../../../components/Post/SeeUser";
import SEO from "../../../components/SEO";
import { db } from "../../../firebase";
import { useMediaQuery } from "@mantine/hooks";
// import "bigger-picture";

// import "https://cdn.jsdelivr.net/npm/bigger-picture@1.0.4/dist/bigger-picture.umd.min.js";


export interface PostPageProps { data: Post, postId: string; authorId: string };
dayjs.extend(relativeTime);
dayjs.locale(es);
const path = process.env.NEXT_PUBLIC_DB_COLLECTION_PATH || "developmentPosts"

export async function getServerSideProps(context: any) {
  const { postId, authorId } = context.params

  const postRef = doc(db, path, postId);

  const postSnap: anything = await getDoc(postRef);
  // console.log(postSnap.data());
  const data = postSnap.data()
  
  // if (!data) {
    
  //   return {
  //     notFound: true,
  //   }
  // }

  const Payload = {
    ...data,
    createdAt: data?.createdAt?.toMillis(),
    ...(data.date !== "" && { date: data.date?.toJSON() }),
    ...(typeof data.time !== "string" && { time: data.time?.toJSON() }),
  }
  return {
    props: { data: Payload, postId, authorId: JSON.stringify(authorId) }, // will be passed to the page component as props
  }
}

// export async function getStaticPaths(){
//   const q = query(collection(db, path), limit(100))

//   const posts = await getDocs(q)
//   posts.metadata.
//   const ids = posts.docs.map((obj) => obj.id);
// }

const PageWrapper = ({ children }: any) => {
  const matches = useMediaQuery('(min-width: 780px)', true, {
    getInitialValueInEffect: false,
  });

  if (matches) {
    return <Paper p="md" shadow="sm" radius="md" >{children}</Paper>
  } else {
    return <>{ children }</>
  }
  
  
}

const PostPage = ({ data: content, postId: id, authorId }: PostPageProps) => {
  // const { postId, authorId } = router.query;
  // const id: string = typeof] postId === "string" ? postId : "nada-que-ver";
  // const [content, setContent] = useState<Post | undefined>();
  //loading state
  // const [respondTo, setRespondTo] = useState("")
  console.log(content)
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<CommentProps[] | undefined>();

  const path = process.env.NEXT_PUBLIC_DB_COLLECTION_PATH || "developmentPosts"


  const fetchComments = async () => {
    try {
      setLoading(true);
      let q = query(
        collection(db, path, id, "comments"),
        orderBy("postedAt", "desc")
        // limit(20)
      );

      onSnapshot(q, (querySnapshot: any) => {
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
      });

      // const querySnapshot = await getDocs(q);

      // console.log("nested data", nestComments(commentsDB));
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchContent();
    fetchComments();
    // return () => {
    //   setComments(undefined);
    // };
  }, []);
  
  
  // if (loading) {
  //   return (
  //     <Layout>
  //       <Center className="h-full my-auto">
  //         <Loader color="orange" size="lg" variant="bars" />
  //       </Center>
  //     </Layout>
  //   );
  // }
  // if (error) return <Text>{error}</Text>;
  const fecha: Date = content.createdAt

  return (

    <Layout>

      <SEO canonical={`${authorId}/${id}`} description={content.message} twitterCreator="Social\U" mainImage={content.image} title={content.title} />
      <span className="hidden bg-dark/50 dark:bg-white/50"></span>
      
      <PageWrapper >

        {content?.image ? (
          <>
            <ActionIcon variant="light" component={Link} classNames={{ root: "!flex justify-items-center" }} href={`/`} scroll={false} color="rgba(255, 255, 255, 1)" className="z-10" display="flow" mb="-44px" ml="10px" size="lg" radius="xl" >
              <ChevronLeft />
            </ActionIcon>
            <Image component={NextImage} alt="Nose" width={content?.imageData?.width || 800} height={content?.imageData?.height || 400} className="mb-4" radius="lg" src={content.image} />
            <Title order={2} className="mb-2 text-3xl">{content?.title}</Title>
          </>
        ) : (<div className="flex space-x-4">
          <Link href="/" >
            <ActionIcon variant="light" component={Link} classNames={{ root: "!flex justify-items-center" }} href={`/`} scroll={false} color="rgba(255, 255, 255, 1)" className="z-10" display="flow" mb="-44px" ml="10px" size="lg" radius="xl" >
              <ChevronLeft />
            </ActionIcon>
          </Link>
          <Title order={2} mb="sm">{content?.title}</Title>
        </div>)}


        {fecha && (
          <Text className="mb-2 italic text-stone-400">
            {dayjs(fecha).fromNow()}
          </Text>
        )}
        {content?.message && (
          <Text className="max-w-lg text-md">{content.message}</Text>
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
          <Text color="orange" size="lg">
            Anonimo
          </Text>
        )}
        <div className="my-4">
          {content?.isEvent && (
            <>
              <Title order={3} mb="sm">Asistentes</Title>
              <Stack>
                {(!content.suscriptions || content.suscriptions?.length == 0) && (
                  <Text>    Por ahora no Hay Nadie</Text>
                )}
                {content?.suscriptions?.map((s, index) => (
                  <SeeUser
                    id={s.user.ref}
                    image={s.user.image}
                    name={s.user.name}
                    key={index}
                  />
                ))}
              </Stack>
            </>
          )}
        </div>

        {/* {content?.date && (
        <Text className="mb-2 italic text-stone-400">Fecha:  {dayjs(content?.date?.getSeconds()).format("MMM D, YYYY")}</Text>
      )} */}

        <div className="z-10 my-2">
          <Title order={3} mb="sm" >Comentarios</Title>
          {console.log("consoleado", comments)}

          <CommentWall postId={id} comments={comments}
          //setRespondTo={setRespondTo} 
          />
        </div>

      </PageWrapper>
    </Layout>
  );
};

export default PostPage;
