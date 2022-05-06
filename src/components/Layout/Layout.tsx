import React, { ReactNode, useEffect, useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Group,
  createStyles,
  Title,
} from "@mantine/core";
import AppNavbar from "./AppNavbar";
import AppFooter from "./AppFooter";
import Image from "next/image";
import AppSidebar from "./AppSidebar";
import { ColorSchemeToggle } from "../ColorSchemeToggle/ColorSchemeToggle";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";

const classes = createStyles((theme) => ({
  links: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 3 : 7],
    },
  },
}));

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { loginWithGoogleOneTap } = useAuth();
  const theme = useMantineTheme();

  const [opened, setOpened] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>();
  const [hecho, setHecho] = useState<boolean>(false);
  // const items = navLinks.map((link) => (
  //   <a
  //     key={link.label}
  //     href={link.link}
  //     // className={cx(classes.link, { [classes.linkActive]: active === link.link })}
  //     onClick={(event) => {
  //       event.preventDefault();
  //       setActive(link.link);
  //     }}
  //   >
  //     {link.label}
  //   </a>
  // ));

  useEffect(() => {
    globalThis?.window?.google?.accounts?.id?.initialize({
      client_id:
        "931771205523-v4jmgj8eu0cbuhqm4hep94q7lg3odpkm.apps.googleusercontent.com",
      callback: console.log,
      auto_select: true,
    });
    console.log("Tirado");
    globalThis?.window?.google?.accounts?.id?.prompt();
    return () => {
      setHecho(true);
    };
  }, [hecho]);

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={<AppNavbar opened={opened} />}
      aside={<AppSidebar />}
      footer={router.pathname === "/" ? <AppFooter /> : <></>}
      header={
        <Header height={70} p="md">
          <div className="flex h-full items-center justify-between">
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Link href="/">
              <Group>
                <Image src="/logologo.svg" width={30} height={30} />
                <Title className=' {font-family:"inter";} text-2xl'>
                  Social/U
                </Title>
              </Group>
            </Link>
            <ColorSchemeToggle />
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}
