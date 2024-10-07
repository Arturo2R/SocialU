
import { Avatar, Text, Paper } from '@mantine/core';

import { api } from '@backend/api';
import { fetchQuery } from 'convex/nextjs';

export const generateStaticParams = async () => {
    const slugs = await fetchQuery(api.user.slugs)
    
    if (!slugs || slugs.length === 0) {
        return []
    }

    return slugs.map((slug) => ({
        slug
    }))
}
export default async function UserInfoAction({ params }: { params: { author: string } }) {
    const author = await fetchQuery(api.user.getUserByUserName, {slug: params.author})

  const avatar: string = author?.photoURL ||'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAK0lEQVR42u3NMQEAAAQAMBrq30EGYnBsBZZT0XEgxWKxWCwWi8VisVj8N158HkMnz28EVQAAAABJRU5ErkJggg==';
  const email: string = author?.email || `${params.author}@uninorte.edu.co`;
  const job: string = author?.career || 'Economía';

  return (
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
        <Text ta="center" c="dimmed" size="sm">
          {email} • {job}
        </Text>
        <Text ta="center" className="max-w-sm mx-auto my-2 italic">
          {author?.description}
        </Text>
        {/* <Button variant="outline" className="mx-auto" color={DEFAULT_COLOR} mt="md">
          Send message
        </Button> */}
      </Paper>
  );
}
