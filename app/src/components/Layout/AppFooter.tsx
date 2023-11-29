import { Button, Footer, Group, MediaQuery } from "@mantine/core";
// import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import React from "react";
import { Send } from "tabler-icons-react";

const AppFooter = () => {
  // const matches = useMediaQuery("(min-width: 700px)");
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
    // <Protected.Component>
    // <MediaQuery largerThan="sm" styles={{ display: "none" }}>
      <Footer height={60} p="xs">
        <Group grow>
          <Link href="/crear">
            <Button
              fullWidth={true}
              rightIcon={<Send />}
              variant="subtle"
              color="orange"
              size="md"
              title="Crear Post"
            >
              Crear Post
            </Button>
          </Link>
        </Group>
      </Footer>
    // </MediaQuery>
    // </Protected.Component>
  );
};

export default AppFooter;
