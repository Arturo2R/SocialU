import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/**/*.story.@(js|jsx|mjs|ts|tsx)",
  ],

  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    'storybook-dark-mode',
    "@storybook/addon-interactions",
    "@storybook/addon-styling-webpack"
  ],

  "framework": {
    "name": "@storybook/nextjs",
    "options": {}
  },

  "docs": {},

  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
};
export default config;