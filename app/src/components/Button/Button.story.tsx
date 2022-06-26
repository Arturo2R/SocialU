import { Meta, Story } from '@storybook/react';
// import React from 'react';import React from "react";

// import { Post, PostProps } from "./Post";
import {Button} from "@mantine/core"

export default {
  component: Button,
  title: "Button",
}as Meta;

interface ButtonProps {
  children: string,
  variant: "filled" | "light" | "default" | "subtle" | "outline" | "white" | "gradient"
  gradient?: {from: string, to: string}
  loaderPosition?: "right" | "left"  
  loading?: boolean
  color: "orange"
}


const Template: Story<ButtonProps> = (args) => (<Button {...args} />);

export const Default = Template.bind({});

Default.args = {
  children: "Texto",
  color: "orange",
  variant: "light",
  loading: false
};

// export const Simple = Template.bind({});

// Simple.args = {
//   ...Default.args,
//   event: true,
//   postId: "kljfsld",
//   author: {
//     image: "/profile.jpg",
//     name: "Arturo R",
//     id: "fsdkldj",
//   },
//   asistants: [
//     {
//       user: { 
//         name: "Juan",
//         image: "https://source.unsplash.com/random/30x40",
//         ref: "user/kljlafds",
//       }
//     },
//   ],
// };