import { useEffect } from 'react';
import { Avatar, Text, Paper } from '@mantine/core';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout/Layout';
import { useFirestore } from '../../hooks/useFirestore';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { GetStaticPaths } from 'next';
import { db } from '../../firebase';

// interface UserInfoActionProps {
//   avatar: string;
//   name: string;
//   email: string;
//   job: string;
// }

export const getStaticProps = async (ctx:any) => {
  const { authorId } = ctx.params;
  
  if (typeof authorId === 'string') {
    try {
      const userRef = query(collection(db, 'user'), where("userName", "==", authorId), limit(1))
      const user = await getDocs(userRef)
      
      const data = user.docs[0].data()
      
      return {
        revalidate: 2000,
        props:{author: data, authorId}
      }
    } catch (error) {
      return {
        notFound: true,
      }
    }
  } else {
    return {
      notFound: true,
    }
  }
}

export const getStaticPaths = (async () => {
  return {
    paths: [
      {
        params: {
          authorId: 'arosenstielhl',
        },
      }, // See the "paths" section below
    ],
    fallback: "blocking", // false or "blocking"
  }
}) satisfies GetStaticPaths

export default function UserInfoAction({author, authorId}) {
  // console.log(authorId);
  // const [author, setAuthor] = useState<any| undefined>()
  
  
  useEffect(() => {
    // console.log(author)
  }, [])

  // useEffect(() => {

  //   setAuthor(authorProfile)
  // }, authorProfile)

  // console.log(author)
  const avatar: string = author?.photoURL ||'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAK0lEQVR42u3NMQEAAAQAMBrq30EGYnBsBZZT0XEgxWKxWCwWi8VisVj8N158HkMnz28EVQAAAABJRU5ErkJggg==';
  const email: string = author?.email || `${authorId}@uninorte.edu.co`;
  const job: string = author?.career || 'Economía';

  return (
    <Layout>
      <Paper
        radius="md"
        withBorder
        p="lg"
        bg="var(--mantine-color-body)"
      >
        <Avatar src={avatar} size={120} radius={120} mx="auto" />
        <Text ta="center" size="lg" mx="auto" mt="md">
          {author?.displayName}
        </Text>
        <Text ta="center" color="dimmed" size="sm">
          {email} • {job}
        </Text>
        <Text ta="center" className="max-w-sm mx-auto my-2 italic">
          {author?.description}
        </Text>
        {/* <Button variant="outline" className="mx-auto" color={DEFAULT_COLOR} mt="md">
          Send message
        </Button> */}
      </Paper>
    </Layout>
  );
}
