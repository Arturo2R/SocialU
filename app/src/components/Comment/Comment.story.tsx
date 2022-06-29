import { Meta, Story } from '@storybook/react';

import { Comment ,  CommentProps} from "./Comment"

export default {
  component: Comment,
  title: "Comment",
}as Meta;


const Template: Story<CommentProps> = (args) => (<Comment {...args} />);

export const Default = Template.bind({});

Default.args = {
  author: { image: "https://lh3.googleusercontent.com/a/AATXAJwFnFSPQYlB6BQICJqQjb1vvLoQ7ak2V3tlJ4PV=s96-c", name: "Anuel"},
  id: "rhjkw", 
  content: "Que pasa mis cuates porque tan rabiosos",
};

export const Anonimo = Template.bind({});

Anonimo.args = {
  id: "rhjkw", 
  author: "anonimo",
  content: "Que pasa mis cuates porque tan rabiosos",
};