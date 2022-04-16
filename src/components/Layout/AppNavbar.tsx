// import { Button, Group, Navbar } from "@mantine/core";
// import { NextLink } from "@mantine/next";
// import Link from "next/link";
// import React from "react";
// import { Send } from "tabler-icons-react";

// type Props = {
//   opened: boolean;
// };

// const AppNavbar = ({ opened }: Props) => {
//   return (
//     <Navbar
//       p="md"
//       hiddenBreakpoint="sm"
//       hidden={!opened}
//       width={{ sm: 200, lg: 300 }}
//     >
//       <Group spacing={5}>
//         <Link href="/crear">
//           <Button
//             className="w-full"
//             rightIcon={<Send />}
//             variant="subtle"
//             color="orange"
//             size="md"
//           >
//             Crear Post
//           </Button>
//         </Link>
//       </Group>
//     </Navbar>
//   );
// };

// export default AppNavbar;

import React, { MouseEvent, useState } from "react";
import { createStyles, Navbar, Group, Code } from "@mantine/core";
import {
  BellRinging,
  Fingerprint,
  Key,
  Settings,
  TwoFA,
  DatabaseImport,
  Receipt2,
  SwitchHorizontal,
  Logout,
  Send,
} from "tabler-icons-react";
import Link from "next/link";
// import { MantineLogo } from "../../shared/MantineLogo";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.fn.rgba(theme.colors[theme.primaryColor][8], 0.25)
            : theme.colors[theme.primaryColor][0],
        color:
          theme.colorScheme === "dark"
            ? theme.white
            : theme.colors[theme.primaryColor][7],
        [`& .${icon}`]: {
          color:
            theme.colors[theme.primaryColor][
              theme.colorScheme === "dark" ? 5 : 7
            ],
        },
      },
    },
  };
});

const data = [
  { link: "/", label: "Feed", icon: BellRinging },
  { link: "/crear", label: "Crear Post", icon: Send },
  // { link: "/", label: "Security", icon: Fingerprint },
  // { link: "/", label: "SSH Keys", icon: Key },
  // { link: "/", label: "Databases", icon: DatabaseImport },
  // { link: "/", label: "Authentication", icon: TwoFA },
  { link: "/", label: "Configuración", icon: Settings },
];

interface Props {
  opened: boolean;
}

export default function NavbarSimple({ opened }: Props) {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("Billing");

  const links = data.map((item) => (
    <Link href={item.link} key={item.label}>
      <a
        onClick={() => {
          setActive(item.label);
        }}
        className={cx(classes.link, {
          [classes.linkActive]: item.label === active,
        })}
      >
        <item.icon color="orange" className={classes.linkIcon} />
        <span>{item.label}</span>
      </a>
    </Link>
  ));

  return (
    <Navbar
      height={700}
      width={{ sm: 300 }}
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
    >
      <Navbar.Section>
        <Group className={classes.header} position="apart">
          {/* <MantineLogo /> */}
          <Code sx={{ fontWeight: 700 }}>v.0.01.2</Code>
        </Group>
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        {/* <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <SwitchHorizontal className={classes.linkIcon} />
          <span>Change account</span>
        </a> */}

        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <Logout className={classes.linkIcon} />
          <span>Salir de la cuenta</span>
        </a>
      </Navbar.Section>
    </Navbar>
  );
}
