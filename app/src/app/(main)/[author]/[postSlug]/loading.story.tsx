import type { Meta, StoryObj } from '@storybook/react';
 
import LoadingPage from './loading';
 
const meta: Meta<typeof LoadingPage> = {
  component: LoadingPage,
  title: "LoadingPage",
};
 
export default meta;

type Story = StoryObj<{}>;

export const Default: Story = {}