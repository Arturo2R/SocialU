import {
  Container
} from "@mantine/core";
import { useEffect } from "react";
import Masonry from 'react-masonry-css';
import { useFirestore } from "../../hooks/useFirestore";
import { Post } from "../Post/Post";
import SEO from "../SEO";
import mansory from "./Feed.module.css";

// import InfiniteScroll from 'react-infinite-scroller';

interface FeedProps { 
  data: Post[],
  user?: UserState,
}

export function Feed({ data, user }:FeedProps) {
  // const { classes } = useStyles();

  // error state
  // const [error, setError] = useState<Error | null>(null);
  // const [isLoading, setIsLoading] = useState<"loading" | "loaded">("loading");
  const {
    data: liveData,
    // error: dataError,
    // postsLoading,
    fetchData,
  } = useFirestore();
  // console.log(data);
  useEffect(() => {
    // setIsLoading("loading");
    fetchData()//.then(() => setIsLoading("loaded"));
    // return () => {
    // };
  }, []);

  // if (postsLoading === "loading") {
  //   return (
  //     <Center className="h-full my-auto">
  //       <Loader color="orange" size="lg" variant="bars" />
  //     </Center>
  //   );
  // }

  // if (error) return <Text>{error}</Text>;
  // console.log(postsLoading);
  const breakpointColumnsObj = {
    1920:6,
    1600: 3,
    1024: 3,
    900: 2,
    500: 1,
    default: 1,
  };
  return (
    <>

      <SEO canonical="/" title="Feed" description="Mira las ultimas noticias de tus compañeros universitarios" />
      <Container className="p-0">

        {/* <Stack spacing="lg" className="max-w-sm mx-auto">  */}
        {/* ts-ignore */}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className={mansory.grid}          
          columnClassName={mansory.column}>
      
          {(liveData ?? data).map((post: any, index: number) => (
            <Post
              imageData={post?.imageData }
              userUID={user?.uid}
              description={post.message}
              author={
                post.anonimo
                  ? "anonimo"
                  : {
                      name: post.useUserName ? post.userName : post.authorName ,
                      id: post.userName||post.authorName,
                      ...(post.authorImage && { image: post.authorImage }),
                    }
              }
              title={post.title}
              image={post.image}
              // asistants={post.asistants} // Añadir asistentes
              postId={post.id}
              event={post.isEvent}
              key={index}
              asistants={post?.suscriptions}
            />
          ))}
          
        </Masonry>
        {/* </Stack> */}
      </Container>
      
    </>
  );
}
