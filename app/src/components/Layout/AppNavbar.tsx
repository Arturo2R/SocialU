import { Code, createStyles, getStylesRef, Group, Navbar, rem } from "@mantine/core";
import Link from "next/link";
import React, { useState } from "react";
import {Logout} from "tabler-icons-react";
import { useAuth } from "../../context/AuthContext";
import Protected from "../Protected";
import Config from "../../config"


const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  title: {
    textTransform: 'uppercase',
    letterSpacing: rem(-0.25),
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,

      [`& .${getStylesRef('icon')}`]: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      },
    },
  },

  linkIcon: {
    ref: getStylesRef('icon'),
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      [`& .${getStylesRef('icon')}`]: {
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      },
    },
  },

  footer: {
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingTop: theme.spacing.md,
  },
}));

const data = Config().sidebar

interface Props {
  opened: boolean;
}

export default function NavbarSimple({ opened }: Props) {
  const { logout } = useAuth();
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
      // height={700}
      width={{ sm: 300 }}
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
    >
      <Protected.Component>
      <>
        <Navbar.Section grow mt="md">
          {links}
        </Navbar.Section>

        <Navbar.Section className={classes.footer}>
          <a href="#" className={classes.link} onClick={() => logout()}>
            <Logout className={classes.linkIcon} />
            <span>Salir de la cuenta</span>
          </a>

          {/* <Group className={cx(classes.header, "bottom-0")} position="apart">
             <MantineLogo /> 
            <Code sx={{ fontWeight: 700 }}>{Config().version}</Code>
          </Group> */}
        </Navbar.Section>
      </>
      </Protected.Component>
    </Navbar>
  );
}
