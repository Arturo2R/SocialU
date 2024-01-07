import { Meta, StoryObj } from '@storybook/react';

import { Comment ,  CommentProps} from "./Comment"

const meta : Meta<typeof Comment> = {
  component: Comment,
  title: "Components/Comment",
}
export default meta;

type Story = StoryObj<CommentProps>

export const Default: Story = {
  args: {
    author: { image: "https://lh3.googleusercontent.com/a/AATXAJwFnFSPQYlB6BQICJqQjb1vvLoQ7ak2V3tlJ4PV=s96-c", name: "Anuel"},
    id: "rhjkw", 
    content: "Que pasa mis cuates porque tan rabiosos",
  }
}

export const Anonimo: Story = {
  args: {
    id: "rhjkw",
    author: "anonimo",
    content: "Que pasa mis cuates porque tan rabiosos",
  }
}
