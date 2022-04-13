import { Header, MediaQuery, Burger, Group, Title } from '@mantine/core'
import React from 'react'
import { theme } from 'twin.macro'

type AppHederProps = {

}

const AppHeader = (AppHeder: AppHeaderProps) => {
  return (
  <Header height={70} p="md">
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color="gray"
              mr="xl"
            />
          </MediaQuery>

            <Group>
              <Image src="/logologo.svg" width={30} height={30} />
              <Title className='text-2xl'>SocialU</Title>
          </Group>
        </div>
      </Header>
  )
}

export default AppHeader