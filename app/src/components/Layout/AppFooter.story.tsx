import type { Meta, StoryObj } from '@storybook/react';
 
import AppFooter from './AppFooter';
 
const meta: Meta<typeof AppFooter> = {
  component: AppFooter,
  title: "AppFooter",
};
 
export default meta;

type Story = StoryObj<{}>;

export const Default: Story = {}