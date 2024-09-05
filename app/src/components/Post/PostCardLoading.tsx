
import { Card, Group, Skeleton } from '@mantine/core'
import React from 'react'
import styles from "./Post.module.css"


type Props = {
    ascardwidth?: boolean
}

const PostCardLoading = (props: Props) => {
  return (
   <article className={"max-w-sm px"}>
    <Card withBorder p="xs" radius="md">
        <Card.Section className={styles.mainImage}>
            <Skeleton height="200" className="w-full"/>
        </Card.Section>
        <Skeleton mt={6} width="50%" height={25}/>
        <Group>
            <Skeleton mt={6} circle height={30}/>
            <Skeleton mt={6} width="30%" height={12}/>
        </Group>
        <Skeleton height={12} mt={10} radius="xl" />
        <Skeleton height={12} mt={6} radius="xl" />
        <Skeleton height={12} mt={6} width="70%" radius="xl" />
    </Card>
   </article> 
  )
}



export default PostCardLoading