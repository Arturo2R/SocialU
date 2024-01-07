import Link from 'next/link';
import { UnstyledButton, Group, Avatar, Text, rem } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import classes from './UserButton.module.css';

interface AuthorInfoProps {
  image: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
  link?:string,
}

export function AuthorInfo({
  image,
  name,
  email,
  icon,
  link,
}: AuthorInfoProps) {
  return (
    <UnstyledButton className={classes.user}>
      <Link href={`/${link||name}`}>
      <Group>
        <Avatar
          src={image}
          radius="xl"
        />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {name}
          </Text>

          <Text c="dimmed" size="xs">
            {email}
          </Text>
        </div>

        {icon || <IconChevronRight style={{ width: rem(14), height: rem(14) }} stroke={1.5} />}
      </Group>
      </Link>
    </UnstyledButton>
  );
}

