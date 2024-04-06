import {
  Container
} from "@mantine/core";
import Masonry from 'react-masonry-css';
import { PostCard } from "../Post/Post";
import SEO from "../SEO";
import mansory from "./Feed.module.css";
import { useData } from "../../context/DataStateContext";
import PostCardLoading from "../Post/PostCardLoading";
import { useAuth } from "../../context/AuthContext";
import FilterByTags from "../FilterByTags";
import { useState } from "react";

// import InfiniteScroll from 'react-infinite-scroller';

interface FeedProps {
  data: Post[],
  user?: UserState,
}

export function Feed({ data, user }: FeedProps) {
  // const { classes } = useStyles();

  // error state
  // const [error, setError] = useState<Error | null>(null);
  // const [isLoading, setIsLoading] = useState<"loading" | "loaded">("loading");
  const { data: liveData } = useData()
  const { suscribetoPost } = useAuth();

  const [category, setCategory] = useState<CategoryState | null>(null)




  // if (postsLoading === "loading") {
  //   return (
  //     <Center className="h-full my-auto">
  //       <Loader color={DEFAULT_COLOR} size="lg" variant="bars" />
  //     </Center>
  //   );
  // }

  // if (error) return <Text>{error}</Text>;
  // console.log(postsLoading);
  const breakpointColumnsObj = {
    1920: 6,
    1600: 3,
    1024: 3,
    900: 2,
    500: 1,
    default: 1,
  };
  return (
    <>

      <SEO canonical="/" title="Feed" description="Mira las ultimas noticias de tus compañeros universitarios" />
      <Container className="p-0 mb-10 md:mb-0">

        {/* <Stack spacing="lg" className="max-w-sm mx-auto">  */}
        {/* ts-ignore */}

        <FilterByTags category={category} categorySetter={setCategory} />


        <Masonry
          breakpointCols={breakpointColumnsObj}
          className={mansory.grid}
          columnClassName={mansory.column}>

          {(liveData ?? data).filter((post) => category?.value ? post.tags?.includes(category?.value) : true).map((post: Post, index: number) => (
            <PostCard
              imageData={post?.imageData}
              userUID={user?.uid}
              description={post.message}
              priority={index < 4}
              renderMethod={post.renderMethod || "none"}
              commentsQuantity={post?.commentsQuantity}
              author={(() => {
                if (post.anonimo) {
                  if (post.asBussiness && post.bussiness) {
                    return {
                      name: post.bussiness.bussinessName,
                      id: post.bussiness.bussinessName,
                      image: post.bussiness.bussinessLogo,
                      color: post.bussiness.bussinessColor
                    }
                  } else {
                    return "anonimo"
                  }
                } else {
                  return {
                    name: post.useUserName ? post.userName : post.authorName,
                    id: post.userName || post.authorName,
                    ...(post.authorImage && { image: post.authorImage }),
                  }
                }
              })()}
              title={post.title}
              tags={post.tags}
              image={post.image}
              // asistants={post.asistants} // Añadir asistentes
              postId={post.id}
              event={post.isEvent}
              // createdAt={post.createdAt}
              key={index}
              asistants={post?.suscriptions}
              subscribeToPost={suscribetoPost}
            />
          ))}
          {!liveData && <PostCardLoading />}
        </Masonry>

        {/* </Stack> */}
      </Container>

    </>
  );
}
