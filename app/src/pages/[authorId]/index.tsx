import React, { useEffect, useState } from 'react';
import { Avatar, Text, Button, Paper } from '@mantine/core';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout/Layout';
import { useFirestore } from '../../hooks/useFirestore';
import { LetterV } from 'tabler-icons-react';

// interface UserInfoActionProps {
//   avatar: string;
//   name: string;
//   email: string;
//   job: string;
// }

// export const getStaticProps = () => { 
//   return {}
// }

// export async function getStaticPaths () { 
  
// }

export default function UserInfoAction() {
  const router = useRouter();
  const { authorId } = router.query;
  const [user, setUser] = useState<any| undefined>()
  const {fetchUser} = useFirestore()

  
  useEffect(() => {
    typeof authorId === 'string' && setUser(fetchUser(authorId))
  }, [])
  
  user

  const avatar: string = '/perfil.jpg';
  const email: string = `${authorId}@uninorte.edu.co`;
  const job: string = 'Economía';

  return (
    <Layout>
      <Paper
        radius="md"
        withBorder
        p="lg"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        })}
      >
        <Avatar src={avatar} size={120} radius={120} mx="auto" />
        <Text align="center" size="lg" weight={500} mt="md">
          {user.userName}
        </Text>
        <Text align="center" color="dimmed" size="sm">
          {user.email} • {user.career}
        </Text>
        <Text align="center" className="mx-auto my-2 max-w-sm italic">
          {user.description}
        </Text>
        {/* <Button variant="outline" className="mx-auto" color="orange" mt="md">
          Send message
        </Button> */}
      </Paper>
    </Layout>
  );
}
