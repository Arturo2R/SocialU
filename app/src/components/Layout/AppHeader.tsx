import {
  Avatar,
  Burger,
  Button,
  Group,
  Text,
  Title,
  Image,
} from "@mantine/core";
import { UserCredential } from "firebase/auth";
import Link from "next/link";
import React from "react";
import { ColorSchemeToggle } from "../ColorSchemeToggle/ColorSchemeToggle";
import { DEFAULT_COLOR } from "../../constants";
import config from "../../config";

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

  function getRandomString(date:Date, stringList:string[]):string {
    const randomIndex = Math.floor(date.getDate() % stringList.length);
    return stringList[randomIndex];
  }

  const stringList = config().appNames;
  const randomString = getRandomString(new Date(), stringList);
  const officialAppName = config().siteName

  return (
      <Group px="md" h="100%" justify="space-between" >
        
        <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={color}
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
          {user?.displayName && (
              <Text  className="hidden md:block">{user?.displayName}</Text>
          )}
          {user && (
              <Avatar alt={`${user.displayName} image`} radius="xl" placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAQAAACROWYpAAAAHklEQVR42mNk+M9ANmAc1TyqeVTzqOZRzaOah7NmAJ7UHgH+uhixAAAAAElFTkSuQmCC" src={user?.photoURL} />
          )}
          {(user === null)&&(loginProvider) && (
              <Button
                size="xs"
                color={DEFAULT_COLOR}
                onClick={loginProvider}
              >
                Iniciar Sesión
              </Button>
          )}
          {(user === null)&&(!loginProvider) && (
              <Button
                component={Link}
                href="/welcome"
                size="xs"
                color={DEFAULT_COLOR}
              >
                Iniciar Sesión
              </Button>

          )}
          
          {user?.photoURL && <Avatar alt={`${user.displayName} image`} className="hidden sm:inline-block" radius="xl" placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAQAAACROWYpAAAAHklEQVR42mNk+M9ANmAc1TyqeVTzqOZRzaOah7NmAJ7UHgH+uhixAAAAAElFTkSuQmCC" src={user?.photoURL} />}

          {user && <ColorSchemeToggle />}
        </Group>

        
      </Group>
  );
};
