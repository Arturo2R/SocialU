import { Button, Group } from "@mantine/core";
// import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import React from "react";
import { Send } from "tabler-icons-react";
import { DEFAULT_COLOR } from "../../constants";

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
        <Group grow>
            <Button 
              component={Link}
              href="/crear"
              fullWidth={true}
              rightSection={<Send />}
              variant="subtle"
              color={DEFAULT_COLOR}
              size="md"
              title="Crear Post"
            >
              Crear Post
            </Button>
        </Group>
    // </MediaQuery>
    // </Protected.Component>
  );
};

export default AppFooter;
