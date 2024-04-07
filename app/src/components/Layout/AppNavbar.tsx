import Link from "next/link";
import { useState } from 'react';
import { Group, Code, NavLink } from '@mantine/core';
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


  const links = data.map((item) => (
    <NavLink
        label={item.label}
        leftSection={<item.icon className={classes.linkIcon} stroke="1.5" />}
        href={item.link}
        key={item.label}
        component={Link}
      />
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        {/* <Group className={classes.header} justify="space-between"> */}
          {/* <MantineLogo size={28} /> */}
        {/* </Group> */}
        {/* <Protected.Component> */}
          {links}
        {/* </Protected.Component> */}
      </div>

      {/* <Code fw={700}>{version}</Code> */}
      <div className={classes.footer}>
        {/* <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a> */}
        <Protected.Component>
          <a href="#" className={classes.link} onClick={() => logout()}>
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Cerrar Sesión</span>
          </a>
        </Protected.Component>
      </div>
    </nav>
  );
}

export default AppNavbar;
