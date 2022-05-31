import { Meta, Story } from '@storybook/react';
// import React from 'react';import React from "react";

import { Post, PostProps } from "./Post";

export default {
  component: Post,
  title: "Post",
}as Meta;


const Template: Story<PostProps> = (args) => (<div className="max-w-md"><Post {...args} /></div>);

export const Default = Template.bind({});

Default.args = {
  title: "Post title",
  image: "https://source.unsplash.com/random/300x400",
  description: "CUal quier vaina",
  author: "anonimo",
};

export const Simple = Template.bind({});

Simple.args = {
  ...Default.args,
  event: true,
  postId: "kljfsld",
  author: {
    image: "/profile.jpg",
    name: "Arturo R",
    id: "fsdkldj",
  },
  asistants: [
    {
      user: { 
        name: "Juan",
        image: "https://source.unsplash.com/random/30x40",
        ref: "user/kljlafds",
      }
    },
  ],
};
