import React, { useState } from "react";
import useStyles from "./NavBar.styles";
import {
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Divider,
  Tabs,
  Burger,
} from "@mantine/core";
import { useBooleanToggle } from "@mantine/hooks";
import {
  Logout,
  Heart,
  Star,
  Message,
  Settings,
  PlayerPause,
  Trash,
  SwitchHorizontal,
  ChevronDown,
} from "tabler-icons-react";
import Protected from "../Protected";
// import { MantineLogo } from '../../shared/MantineLogo';

interface NavBarProps {
  user: { name: string; image: string };
  tabs: string[];
}

NavBar.defaultProps = {
  user: {
    name: "Jane Spoonfighter",
    email: "janspoon@fighter.dev",
    image:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80",
  },
  tabs: ["Crear Posts", "Ultimos Posts"],
};

export function NavBar({ user, tabs }: NavBarProps) {
  const { classes, theme, cx } = useStyles();
  const [opened, toggleOpened] = useBooleanToggle(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const items = tabs.map((tab) => <Tabs.Tab label={tab} key={tab} />);

  return (
    <div className={classes.header}>
      {/* <Protected.Component> */}
        <Container className={classes.mainSection}>
          <Group position="apart">
            {/* <MantineLogo /> */}
            <p>Logo</p>
            <Burger
              opened={opened}
              onClick={() => toggleOpened()}
              className={classes.burger}
              size="sm"
            />
            <Menu
              size={260}
              placement="end"
              transition="pop-top-right"
              className={classes.userMenu}
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
              control={
                <UnstyledButton
                  className={cx(classes.user, {
                    [classes.userActive]: userMenuOpened,
                  })}
                >
                  <Group spacing={7}>
                    <Avatar
                      src={user.image}
                      alt={user.name}
                      radius="xl"
                      size={20}
                    />
                    <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                      {user.name}
                    </Text>
                    <ChevronDown size={12} />
                  </Group>
                </UnstyledButton>
              }
            >
              <Menu.Item icon={<Heart size={14} color={theme.colors.red[6]} />}>
                Liked posts
              </Menu.Item>
              <Menu.Item
                icon={<Star size={14} color={theme.colors.yellow[6]} />}
              >
                Saved posts
              </Menu.Item>
              <Menu.Item
                icon={<Message size={14} color={theme.colors.blue[6]} />}
              >
                Your comments
              </Menu.Item>
              <Menu.Label>Settings</Menu.Label>
              <Menu.Item icon={<Settings size={14} />}>
                Account settings
              </Menu.Item>
              <Menu.Item icon={<SwitchHorizontal size={14} />}>
                Change account
              </Menu.Item>
              <Menu.Item icon={<Logout size={14} />}>Logout</Menu.Item>
              <Divider />
              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item icon={<PlayerPause size={14} />}>
                Pause subscription
              </Menu.Item>
              <Menu.Item color="red" icon={<Trash size={14} />}>
                Delete account
              </Menu.Item>
            </Menu>
          </Group>
        </Container>
      {/* </Protected.Component> */}
      <Container>
        <Tabs
          variant="outline"
          classNames={{
            root: classes.tabs,
            tabsListWrapper: classes.tabsList,
            tabControl: classes.tabControl,
            tabActive: classes.tabControlActive,
          }}
        >
          {items}
        </Tabs>
      </Container>
    </div>
  );
}
