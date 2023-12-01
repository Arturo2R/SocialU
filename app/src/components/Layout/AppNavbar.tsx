import Link from "next/link";
import { useState } from 'react';
import { Group, Code } from '@mantine/core';
import {
  IconBellRinging,
  IconFingerprint,
  IconKey,
  IconSettings,
  Icon2fa,
  IconDatabaseImport,
  IconReceipt2,
  IconSwitchHorizontal,
  IconLogout,
} from '@tabler/icons-react';
// import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './NavbarSimple.module.css';
import { useAuth } from "../../context/AuthContext";
import Protected from "../Protected";
import Config from "../../config"

// const data = [
//   { link: '', label: 'Notifications', icon: IconBellRinging },
//   { link: '', label: 'Billing', icon: IconReceipt2 },
//   { link: '', label: 'Security', icon: IconFingerprint },
//   { link: '', label: 'SSH Keys', icon: IconKey },
//   { link: '', label: 'Databases', icon: IconDatabaseImport },
//   { link: '', label: 'Authentication', icon: Icon2fa },
//   { link: '', label: 'Other Settings', icon: IconSettings },
// ];
  const data = Config().sidebar

export function AppNavbar() {
  // const { classes, cx } = useStyles();
  const { logout } = useAuth();
  const [active, setActive] = useState('Billing');

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke="1.5" />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          {/* <MantineLogo size={28} /> */}
          <Code fw={700}>v3.1.2</Code>
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