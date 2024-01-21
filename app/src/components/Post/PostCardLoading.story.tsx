import { Meta, StoryObj } from "@storybook/react";
import PostCardLoading from "./PostCardLoading";

const meta: Meta<typeof PostCardLoading> = {
  component: PostCardLoading,
};

export default meta;

type Story = StoryObj<PostCardProps>;

export const Cargando: Story = {
    args: {}
}