import { Group, Paper, Title } from "@mantine/core"
import styles from "./PostPage.module.css"
import { Skeleton } from '@mantine/core';
import BackButton from "@components/BackButton";

const LoadingPost = () => {
    return (
        <Paper classNames={{ root: styles.postPage }}>
            <div className="flex space-x-4">
                <BackButton id={"fda"}  />
                <Skeleton mb="8" height={45} width="65%" radius="lg" />
            </div>
            <Group mb="xs" gap={8}>
                <Skeleton height={24} width="8%" radius="lg" />
                <Skeleton height={24} width="16%" radius="lg"/>
                <Skeleton height={24} width="10%" radius="lg"/>
            </Group>
            <div className="flex flex-col w-full min-h-32 gap-y-2">
                <Skeleton height="18" width="96%" radius="sm" />
                <Skeleton height="18" width="92%"radius="sm" />
                <Skeleton height="18" width="98%"radius="sm" />
                <Skeleton height="18" width="42%"radius="sm" />
            </div>

        <div className="z-10 my-2" />

        <Title order={3} mb="sm">Comentarios • 0</Title>

        </Paper>
    )}

export default LoadingPost