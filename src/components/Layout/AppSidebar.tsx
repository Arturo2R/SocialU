import { MediaQuery, Aside, Text } from '@mantine/core'
import React from 'react'

type Props = {}

const AppSidebar = (props: Props) => {
  return (
    <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
        <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
          <Text>Application sidebar</Text>
        </Aside>
    </MediaQuery>
  )
}

export default AppSidebar