import React, { ReactNode } from "react";

import { Post, PostProps } from "./Post";

export default {
  component: Post,
  title: "Post",
};

const Template = (args: PostProps) => <Post {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "Post title",
  image: "https://source.unsplash.com/random/300x400",
  description: "CUal quier vaina",
  event: true,
  postId: "kljfsld",
  author: {
    image: "https://source.unsplash.com/random/30x40",
    name: "Arturo R",
    id: "fsdkldj",
  },
  asistants: [
    {
      name: "Juan",
      id: "kljlafds",
      avatar: "https://source.unsplash.com/random/30x40",
    },
  ],
};

export const Simple = Template.bind({});
Simple.args = {
  title: "Un Post simple",
  description: "Es es un post demasiado simple",
  postId: "fsldkfs",
  author: "anonimo",
};
