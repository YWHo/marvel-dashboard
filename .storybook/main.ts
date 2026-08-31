import type { StorybookConfig } from "@storybook/nextjs-vite";

const config = {
  stories: ["../app/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "msw-storybook-addon",
  ],
  staticDirs: ["../public"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
} satisfies StorybookConfig;

export default config;
