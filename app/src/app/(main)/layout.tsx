"use client"
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AppHeader } from "@components/AppHeader"
import styles from "@components/Layout/Layout.module.css"
import AppNavbar from "@components/Layout/AppNavbar";
import React from "react";
import AppFooter from "@components/Layout/AppFooter";
import { usePathname } from "next/navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname()
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
        />
      </AppShell.Header>
      {/* <AppShell.Aside hidden={router.pathname != "/"} >
          <FilterByTags />
        </AppShell.Aside> */}
      <AppShell.Footer hiddenFrom="sm" hidden={pathname !== "/"} ><AppFooter /></AppShell.Footer>
      <AppShell.Navbar className={styles.nav} p="md">
        <AppNavbar />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default MainLayout;