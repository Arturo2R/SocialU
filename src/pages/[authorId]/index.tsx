import React from "react";
import { Avatar, Text, Button, Paper } from "@mantine/core";
import Layout from "../../components/Layout/Layout";
import { useRouter } from "next/router";

// interface UserInfoActionProps {
//   avatar: string;
//   name: string;
//   email: string;
//   job: string;
// }

export default function UserInfoAction() {
  const router = useRouter();
  const { authorId } = router.query;

  const avatar: string = "/perfil.jpg";
  const email: string = `${authorId}@uninorte.edu.co`;
  const job: string = "Economía";
  return (
    <Layout>
      <Paper
        radius="md"
        withBorder
        p="lg"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
        })}
      >
        <Avatar src={avatar} size={120} radius={120} mx="auto" />
        <Text align="center" size="lg" weight={500} mt="md">
          {authorId}
        </Text>
        <Text align="center" color="dimmed" size="sm">
          {email} • {job}
        </Text>
        <Text align="center" className="mx-auto my-2 max-w-sm italic">
          Economista apasionada por entender el comportamiento de las personas
        </Text>
        {/* <Button variant="outline" className="mx-auto" color="orange" mt="md">
          Send message
        </Button> */}
      </Paper>
    </Layout>
  );
}
