import Link from "next/link";
import { useState } from 'react';
import { Group, Code } from '@mantine/core';
import {
  IconLogout,
} from '@tabler/icons-react';
// import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './NavbarSimple.module.css';
import { useAuth } from "../../context/AuthContext";
import Protected from "../Protected";
import Config from "../../config"

  const data = Config().sidebar
  const version = Config().version

export function AppNavbar() {
  // const { classes, cx } = useStyles();
  const { logout } = useAuth();
  const [active, setActive] = useState('Billing');

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke="1.5" />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          {/* <MantineLogo size={28} /> */}
          <Code fw={700}>{version}</Code>
        </Group>
        <Protected.Component>
          {links}
        </Protected.Component>
      </div>

      <div className={classes.footer}>
        {/* <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a> */}
        <Protected.Component>
          <a href="#" className={classes.link} onClick={() => logout()}>
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Logout</span>
          </a>
        </Protected.Component>
      </div>
    </nav>
  );
}

export default AppNavbar;