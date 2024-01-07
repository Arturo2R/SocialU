import type { Meta, StoryObj } from '@storybook/react';
// import React from 'react';import React from "react";

// import { Post, PostProps } from "./Post";
import {Button} from "@mantine/core"
import { DEFAULT_COLOR } from '../../constants';

const meta: Meta<typeof Button> = {
  component: Button,
}

export default meta;

interface ButtonProps {
  children: string,
  variant: "filled" | "light" | "default" | "subtle" | "outline" | "white" | "gradient"
  gradient?: {from: string, to: string}
  loaderPosition?: "right" | "left"  
  loading?: boolean
  color: string
}

type Story = StoryObj<ButtonProps>;

export const Primary: Story = {
  args: {
    children: "Button",
    variant: 'filled',
    color: DEFAULT_COLOR
  }
}

