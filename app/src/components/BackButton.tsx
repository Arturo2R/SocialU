import { ActionIcon } from '@mantine/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { ChevronLeft } from 'tabler-icons-react'

type BackButtonProps = {
    id:string
}

const BackButton = ({id}: BackButtonProps) => {
  const router = useRouter()
  return (
    <ActionIcon
              //component={Link} 
              //scroll={false}
              onClick={() => router.back()}
             // href={{
               // pathname: `/`,
                //query: { nrf: true },
                // hash: id,
              //}}
              variant="light" 
              color="gray" 
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