import { Avatar, Group, Text } from "@mantine/core";

interface Props {
    isAnonimus: boolean;
    asBussiness: boolean;
    org?: {
        name: string;
        image: string;
    };
    user: {
        name: string;
        image: string;
    }
}

export const UserInfoOnComment = ({isAnonimus, asBussiness, org, user}: Props) => {
    if (asBussiness || !isAnonimus) {
        return (
            <Group justify="flex-start">
                <Avatar size={22} src={asBussiness ? org?.image : user.image} alt={asBussiness ? org?.image : user.image} radius="xl" />
                <Text size="sm" c="dimmed">
                    {asBussiness ? org?.name : user.name}
                </Text>
            
            </Group>
        )
    }
    return (<Text size="sm" c="dimmed">Anónimo</Text>)

}