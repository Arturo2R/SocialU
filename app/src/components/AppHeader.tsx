"use client"
import {
  Avatar,
  Burger,
  Button,
  Group,
  Text,
  Title,
  Image,
  ActionIcon,
  Container,
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
import { Search } from "./Search";
import { Search as SearchIcon } from "tabler-icons-react"
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
  const [openedSearch, handlers] = useDisclosure(false);

  const stringList = config().appNames;
  // const randomString = process.env.VERCEL_ENV==="preview" ? "βeta" : getRandomString(new Date(), stringList);
  const randomString = "βeta";
  const officialAppName = config().siteName

  return (
    <Group px="md" h="100%" justify="space-between" >
      {!openedSearch && (
        <>
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
          <Group className="w-2/6" visibleFrom="sm">
            <Search />
          </Group>
        </>
      )}
      {openedSearch && <Search  close={handlers.close} />}
      {!openedSearch && (<Group >
        <Authenticated>
          <Group hiddenFrom="sm">
            <ActionIcon variant="default" color="gray" size="xl" aria-label="Search" onClick={() => handlers.toggle()}>
              <SearchIcon size={28} />
            </ActionIcon>
          </Group>
          <Text className="hidden md:block">{user?.fullName}</Text>
          <Avatar component={Link} href="/configuracion" alt={`${user?.fullName} image`} radius="xl" placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAQAAACROWYpAAAAHklEQVR42mNk+M9ANmAc1TyqeVTzqOZRzaOah7NmAJ7UHgH+uhixAAAAAElFTkSuQmCC" src={user?.imageUrl} />
          {/* <ColorSchemeToggle /> */}
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
      )}
    </Group>
  );
};
