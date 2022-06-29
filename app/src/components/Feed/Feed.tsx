import {
  Container,
  Space,
  Stack
} from "@mantine/core";
import { useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { Post } from "../Post/Post";
// import InfiniteScroll from 'react-infinite-scroller';

export function Feed({ data, user }: anything) {
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
  //     <Center className="my-auto h-full">
  //       <Loader color="orange" size="lg" variant="bars" />
  //     </Center>
  //   );
  // }

  // if (error) return <Text>{error}</Text>;
  // console.log(postsLoading);
  return (
    <>
      {/* {isLoading === "loading" && (
        <Center className="my-auto h-full">
          <Loader color="orange" size="lg" variant="bars" />
        </Center>
      )} */}
      {/* {isLoading === "loaded" && ( */}
      <Container className="p-0 lg:px-12">
        <Space h="md" />
        <Stack spacing="lg" className="mx-auto max-w-sm">
          {(liveData ?? data).map((post: any, index: number) => (
            <Post
              userUID={user?.uid}
              description={post.message}
              author={
                post.anonimo
                  ? "anonimo"
                  : {
                      name: post.userName,
                      id: post.userName ? post.userName : post.id,
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
        </Stack>
      </Container>
      {/* )} */}
    </>
  );
}
