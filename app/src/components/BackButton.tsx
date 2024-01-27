import { ActionIcon } from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import { ChevronLeft } from 'tabler-icons-react'

type BackButtonProps = {
    id:string
}

const BackButton = ({id}: BackButtonProps) => {
  return (
    <ActionIcon
              scroll={false}
              href={{
                pathname: `/`,
                query: { nrf: true },
                hash: id,
              }}
              variant="light" 
              color="gray" 
              component={Link} 
              classNames={{ 
                root: "!flex justify-items-center" 
                }} 
              className="z-10" 
              display="flow" 
              mb="-44px" ml="10px" size="lg" radius="xl" 
              >
              <ChevronLeft />
    </ActionIcon>
  )
}

export default BackButton