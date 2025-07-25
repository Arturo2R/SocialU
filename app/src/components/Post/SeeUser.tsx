import { Anchor, Avatar, Group, Text } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { DEFAULT_COLOR } from "@lib/constants";
// import { Url } from "url";

type Props = {
  id: string;
  name: string;
  image?: string;
};

const SeeUser = ({ id, name, image }: Props) => (
  <Anchor component={Link} href={`/${id}`}>
    <Group gap="xs"
      wrap="nowrap"
    >
      {image ? (
        <Avatar size="sm" src={image} alt={` a photo of ${name}`} radius="xl" />
      ) : (
        <Avatar
          size="sm"
          color={DEFAULT_COLOR}
          alt={`${name} dosent have a photo to share`}
          radius="xl"
        />
      )}
      <Text truncate="end">{name}</Text>
    </Group>
  </Anchor>
);

export default SeeUser;
