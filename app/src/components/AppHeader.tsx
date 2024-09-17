"use client"
import {
  Avatar,
  Burger,
  Button,
  Group,
  Text,
  Title,
  Image,
} from "@mantine/core";

import Link from "next/link";
import React from "react";
//   import { ColorSchemeToggle } from "../ColorSchemeToggle/ColorSchemeToggle";
import { DEFAULT_COLOR } from "@lib/constants";
import config from "@lib/config";
import { Authenticated, Unauthenticated } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { ColorSchemeToggle } from "./ColorSchemeToggle/ColorSchemeToggle";
import { useDisclosure } from "@mantine/hooks";

interface AppHeaderProps {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  // color: any;
  // user: User | null;
  // loginProvider?: () => Promise<UserCredential>;
}

export const AppHeader = ({
  opened,
  setOpened,
  // color,
  // user,
  // loginProvider
}: AppHeaderProps) => {


  function getRandomString(date: Date, stringList: string[]): string {
    const randomIndex = Math.floor(date.getDate() % stringList.length);
    return stringList[randomIndex];
  }
  const { user } = useUser();

  const stringList = config().appNames;
  // const randomString = process.env.VERCEL_ENV==="preview" ? "βeta" : getRandomString(new Date(), stringList);
  const randomString = "βeta";
  const officialAppName = config().siteName

  return (
    <Group px="md" h="100%" justify="space-between" >
      <Burger
        opened={opened}
        onClick={() => setOpened(!opened)}
        size="sm"
        color={DEFAULT_COLOR}
        hiddenFrom="sm"
        title="Hamburger"
      />

      <Link href="/">
        <Group>
          {/* <div className="flex space-x-2"> */}
          <Image src="/logologo.svg" w={40} h={40} alt="Social U Logo" />
          <Title order={3} className="w-auto" >{officialAppName}<div className="hidden sm:inline"> • {randomString}</div></Title>
        </Group>
      </Link>

      <Group>
        <Authenticated>
          <Text className="hidden md:block">{user?.fullName}</Text>
          <Avatar alt={`${user?.fullName} image`} radius="xl" placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAQAAACROWYpAAAAHklEQVR42mNk+M9ANmAc1TyqeVTzqOZRzaOah7NmAJ7UHgH+uhixAAAAAElFTkSuQmCC" src={user?.imageUrl} />
          <ColorSchemeToggle />
        </Authenticated>
        <Unauthenticated>
          <Button
            component={Link}
            href="/bienvenido"
            size="xs"
            color={DEFAULT_COLOR}
          >
            Iniciar Sesión
          </Button>
        </Unauthenticated>
      </Group>
    </Group>
  );
};
