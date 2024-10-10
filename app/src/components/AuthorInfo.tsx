import Link from 'next/link';
import { UnstyledButton, Group, Avatar, Text, rem } from '@mantine/core';
import { ChevronRight } from 'tabler-icons-react';
import classes from './UserButton.module.css';

interface AuthorInfoProps {
  image?: string;
  name: string;
  email: string;
  icon?: React.ReactNode;
  link?: string,
  isBussiness?: boolean,
}

export function AuthorInfo({
  image,
  name,
  email,
  icon,
  link,
  isBussiness
}: AuthorInfoProps) {
  return (
    <UnstyledButton className={classes.user}>
      {isBussiness ? (
        <a href={link}>
          <Group>
            <Avatar src={image} radius="xl" />

            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                {name}
              </Text>

              <Text c="dimmed" size="xs">
                {email}
              </Text>
            </div>

            {icon || <ChevronRight style={{ width: rem(14), height: rem(14) }} stroke="1.5" />}
          </Group>
        </a>
      ) : (
        <Link href={`/${link || name}`}>
          <Group>
            <Avatar src={image} radius="xl" />

            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                {name}
              </Text>

              <Text c="dimmed" size="xs">
                {email}
              </Text>
            </div>

            {icon || <ChevronRight style={{ width: rem(14), height: rem(14) }} stroke="1.5" />}
          </Group>
        </Link>
      )}
    </UnstyledButton>
  );
}

