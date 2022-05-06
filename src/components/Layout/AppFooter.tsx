import { Button, Footer, Group } from "@mantine/core";
import React from "react";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { Send } from "tabler-icons-react";
import ProtectedComponent from "../Protected";
import Protected from "../Protected";

const AppFooter = () => {
  const matches = useMediaQuery("(min-width: 700px)");
  return (
    // <Footer height={60} p="md">
    //   {matches && (
    //     <Group position="center" spacing="xs" grow>
    //       <Button>11</Button>
    //       <Button>21</Button>
    //       <Button>31</Button>
    //     </Group>
    //   )}
    // </Footer>
    <Protected.Component>
      <Footer height={60} p="xs">
        <Group grow>
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
      </Footer>
    </Protected.Component>
  );
};

export default AppFooter;
