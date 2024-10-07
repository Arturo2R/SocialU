import { AppShell, useMantineTheme } from "@mantine/core";
// import { useRouter } from "next/router";
// import Script from "next/script";
import { ReactNode, } from "react";
import { useAuth } from "@context/AuthContext";
import AppFooter from "./AppFooter";
import { AppHeader } from "./AppHeader";
import AppNavbar from "./AppNavbar";
// import { BellRinging, Send, Settings } from 'tabler-icons-react';
import { useDisclosure } from '@mantine/hooks';
import styles from "./Layout.module.css"

// const Google1Tap= lazy(() => import('../Google1Tap.client'));

type LayoutProps = {
  children: ReactNode;
};


function Layout({ children }: LayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  // const router = useRouter();
  const { user, loginWithMicrosoft } = useAuth();
  const theme = useMantineTheme();

  // const [opened, setOpened] = useState<boolean>(false);

  return (
    <AppShell
      footer={{ height: 50, }}
      header={{ height: 70 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      // aside={{ breakpoint: 'sm', width: 250, collapsed: { mobile: true } }}
      padding="md"
    >
      <AppShell.Header>
        <AppHeader
          opened={opened}
          setOpened={toggle}
          color={theme.colors.gray[6]}
          user={user}
        // loginProvider={loginWithMicrosoft}
        />
      </AppShell.Header>
      {/* <AppShell.Aside hidden={router.pathname != "/"} >
        <FilterByTags />
      </AppShell.Aside> */}
      <AppShell.Footer ><AppFooter /></AppShell.Footer>
      <AppShell.Navbar className={styles.nav} p="md">
        <AppNavbar />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default Layout;