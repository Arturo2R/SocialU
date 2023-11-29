import {
  Avatar,
  Burger,
  Button,
  Group,
  Header,
  MediaQuery,
  Text,
  Title,
  Image,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { NextLink } from "@mantine/next";
import { UserCredential } from "firebase/auth";
import { random } from "nanoid";
// import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ColorSchemeToggle } from "../ColorSchemeToggle/ColorSchemeToggle";

interface AppHeaderProps {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  color: any;
  user: User | null;
  loginProvider: () => Promise<UserCredential>;
}

export const AppHeader = ({
  opened,
  setOpened,
  color,
  user,
  loginProvider
}: AppHeaderProps) => {
  const matches = useMediaQuery("(min-width: 450px)");

  function getRandomString(date:Date, stringList:string[]):string {
    const randomIndex = Math.floor(date.getDate() % stringList.length);
    return stringList[randomIndex];
}

  const stringList = ['Campus Gossip',"Chisme.app","Desembuchalo", 'Chismes En La U', 'Student Secrets', "Campus Confessions","UniConfesiones", "UniLeaks", "Campus Help", "Campus Connect", ];
  const randomString = getRandomString(new Date(), stringList);

  return (
    <Header height={70} p="md">
      <div className="flex justify-between items-center h-full">
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={color}
            mr="xl"
            title="Hamburger"
          />
        </MediaQuery>
        <Link href="/">
          <Group>
            {/* <div className="flex space-x-2"> */}
            <Image src="/logologo.svg" width={30} height={30} alt="Social U Logo" />
              <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                <Title order={3}>UX •</Title>
              </MediaQuery>
              <MediaQuery query="(max-width: 400px)" styles={{ display: "none" }}>
                <Title order={3}>{randomString}</Title>
              </MediaQuery>
            {/* </div> */}
          </Group>
        </Link>
        <Group>
          {user?.displayName && (
            <MediaQuery smallerThan="md" styles={{ display: "none" }}>
              <Text>{user?.displayName}</Text>
            </MediaQuery>
          )}
          {user?.photoURL && <Avatar alt={`${user.displayName} image`} radius="xl" placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAQAAACROWYpAAAAHklEQVR42mNk+M9ANmAc1TyqeVTzqOZRzaOah7NmAJ7UHgH+uhixAAAAAElFTkSuQmCC" src={user?.photoURL} />}
          {(user === null)&&(loginProvider) && (
              <Button
                size={matches ? "md" : "xs"}
                color="orange"
                onClick={loginProvider}
              >
                Iniciar Sesión
              </Button>
          )}
          {(user === null)&&(!loginProvider) && (
            <Link href="/welcome" >
              <Button
                size={matches ? "md" : "xs"}
                
                color="orange"
              >
                Iniciar Sesión
              </Button>
             </Link>

          )}

          {user && <ColorSchemeToggle />}
        </Group>
      </div>
    </Header>
  );
};
