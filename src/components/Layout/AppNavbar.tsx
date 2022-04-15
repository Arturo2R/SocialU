import { Button, Group, Navbar } from "@mantine/core";
import { NextLink } from "@mantine/next";
import Link from "next/link";
import React from "react";
import { Send } from "tabler-icons-react";

type Props = {
  opened: boolean;
};

const AppNavbar = ({ opened }: Props) => {
  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
    >
      <Group spacing={5}>
        <Link href="/crear">
          <Button
            className="w-full"
            rightIcon={<Send />}
            variant="subtle"
            color="orange"
            size="md"
          >
            Crear Post
          </Button>
        </Link>
      </Group>
    </Navbar>
  );
};

export default AppNavbar;
