import { Navbar } from '@mantine/core'
import React from 'react'

type Props = {
  opened: boolean,
}

const AppNavbar = ({opened}: Props) => {
  return (
    <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
          {/* <Group spacing={5} className={classes.links}>
            {navLinks}
          </Group> */}
    </Navbar>
  )
}

export default AppNavbar