import { AppShell, createStyles, useMantineTheme } from "@mantine/core";
import { useRouter } from "next/router";
// import Script from "next/script";
import { lazy, ReactNode, Suspense, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AppFooter from "./AppFooter";
import { AppHeader } from "./AppHeader";
import AppNavbar from "./AppNavbar";
import { BellRinging, Send, Settings } from 'tabler-icons-react';

// import AppSidebar from "./AppSidebar";

// const classes = createStyles((theme) => ({
//   links: {
//     [theme.fn.smallerThan("xs")]: {
//       display: "none",
//     },
//   },

//   link: {
//     display: "block",
//     lineHeight: 1,
//     padding: "8px 12px",
//     borderRadius: theme.radius.sm,
//     textDecoration: "none",
//     color:
//       theme.colorScheme === "dark"
//         ? theme.colors.dark[0]
//         : theme.colors.gray[7],
//     fontSize: theme.fontSizes.sm,
//     fontWeight: 500,

//     "&:hover": {
//       backgroundColor:
//         theme.colorScheme === "dark"
//           ? theme.colors.dark[6]
//           : theme.colors.gray[0],
//     },
//   },

//   linkActive: {
//     "&, &:hover": {
//       backgroundColor:
//         theme.colorScheme === "dark"
//           ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
//           : theme.colors[theme.primaryColor][0],
//       color:
//         theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 3 : 7],
//     },
//   },
// }));

const Google1Tap= lazy(() => import('../Google1Tap.client'));

type LayoutProps = {
  children: ReactNode;
};

// const buttons= [
//     { route: "/", label: "Feed", icon: BellRinging },
//     { route: "/crear", label: "Crear Post", icon: Send},
//     { route: "/configuracion", label: "Configuración", icon: Settings },
//   ]

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { user, loading, loginWithGoogle, loginWithGoogleOneTap } = useAuth();
  const theme = useMantineTheme();

  const [opened, setOpened] = useState<boolean>(false);
  // const [active, setActive] = useState<boolean>();
  // const [hecho, setHecho] = useState<boolean>(false);
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

  

  return (
    <>
     {loading === false && user === null &&(
      <Suspense fallback={null}>
        <Google1Tap login={loginWithGoogleOneTap} />
      </Suspense>
      )} 
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
        // aside={<AppSidebar />}
        footer={router.pathname === "/" ? <AppFooter /> : <></>}
        header={
          <AppHeader
            opened={opened}
            setOpened={setOpened}
            color={theme.colors.gray[6]}
            user={user}
            loginWithGoogle={loginWithGoogle}
          />
        }
      >
        {children}
      </AppShell>
    </>
  );
}
