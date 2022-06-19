import {
  collection,
  doc,
  getDoc, onSnapshot, orderBy, query
} from "@firebase/firestore";
import {
  Center,
  Image,
  Loader,
  Paper,
  Stack,
  Text,
  Title
} from "@mantine/core";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AuthorInfo } from "../../../components/AuthorInfo";
// import { useFirestore } from "../../../hooks/useFirestore";
import { CommentProps } from "../../../components/Comment/Comment";
import CommentWall from "../../../components/Comment/CommentWall";
import Layout from "../../../components/Layout/Layout";
import SeeUser from "../../../components/Post/SeeUser";
import { db } from "../../../firebase";

// import "bigger-picture";

// import "https://cdn.jsdelivr.net/npm/bigger-picture@1.0.4/dist/bigger-picture.umd.min.js";

type Props = {};
dayjs.extend(relativeTime);
dayjs.locale(es);

const PostPage = (props: Props) => {
  const router = useRouter();
  const { postId, authorName } = router.query;
  const id: string = typeof postId === "string" ? postId : "nada-que-ver";
  const [content, setContent] = useState<Post | undefined>();
  //loading state
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<CommentProps[] | undefined>();
  // console.log(postId);

  // const { fetchPost, loading, error } = useFirestore();
  const nestComments = (commentList: CommentProps[]) => {
    let commentMap: anything = {};
    console.log("0", commentList, commentMap);

    // move all the comments into a map of id => comment
    commentList.forEach(
      (comment: anything) => (commentMap[comment.id] = comment)
    );

    console.log("1", commentMap);

    // iterate over the comments again and correctly nest the children
    commentList.forEach((comment) => {
      if (comment.parentId !== null) {
        const parent = commentMap[comment.parentId];
        (parent.subComments = parent.subComments || []).push(comment);
      }
    });

    console.log("2", commentMap, commentList);

    // filter the list to return a list of correctly nested comments
    // commentMap = {};
    return commentList.filter((comment: anything) => {
      return comment.parentId === null;
    });
  };

  const fetchContent = async () => {
    try {
      const postRef = doc(db, "publicPosts", id);

      const postSnap: anything = await getDoc(postRef);
      // console.log(postSnap.data());
      const data = postSnap.data();
      setContent(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // const myNestComments = (commentList: CommentProps[]) => {
  //   commentList.reduce((prev, curr) => {
  //     if (curr.parentId === null) {
  //       commentList[prev.index].push(curr);
  //     }
  //   });
  // };

  const fetchComments = async () => {
    try {
      setLoading(true);
      let q = query(
        collection(db, "publicPosts", id, "comments"),
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
        console.log("raw", commentsDB);
        setComments(commentsDB);
      });

      // const querySnapshot = await getDocs(q);

      // console.log("nested data", nestComments(commentsDB));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
    fetchComments();
    // return () => {
    //   setComments(undefined);
    // };
  }, []);

  if (loading) {
    return (
      <Layout>
        <Center className="my-auto h-full">
          <Loader color="orange" size="lg" variant="bars" />
        </Center>
      </Layout>
    );
  }
  // if (error) return <Text>{error}</Text>;

  return (
    <Layout>
      <Paper p="md" shadow="sm" radius="md">
        {content?.image && (
          <Image className="mb-4" radius="lg" src={content.image} />
        )}

        <Title className="mb-2 text-3xl">{content?.title}</Title>
        {content?.createdAt?.toDate() && (
          <Text className="mb-2 italic text-stone-400">
            {dayjs(content?.createdAt?.toDate()).fromNow()}
          </Text>
        )}
        {content?.message && (
          <Text className="max-w-lg text-md">{content.message}</Text>
        )}
        {content?.anonimo === false && content.authorName ? (
          <AuthorInfo
            link={content?.userName}
            name={content?.authorName}
            email={content?.authorEmail ||`${content?.userName}@uninorte.edu.co`}
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
              <Title className="mb-2 text-xl">Asistentes</Title>
              <Stack>
                {content.suscriptions?.length === 0 && (
                  <Text>No Hay Nadie</Text>
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
        <div className="my-2">
          <Title className="mb-2 text-xl">Comentarios</Title>
          {console.log("consoleado", comments)}

          <CommentWall postId={id} comments={comments} />
        </div>
      </Paper>
    </Layout>
  );
};

export default PostPage;
