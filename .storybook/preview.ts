import type { Preview } from "@storybook/nextjs-vite";
import { createElement } from "react";
import { mswLoader } from "msw-storybook-addon/csf3";
import { QueryProvider } from "../app/providers/QueryProvider";
import "../app/globals.css";

const preview: Preview = {
  decorators: [
    (Story, context) =>
      createElement(QueryProvider, {
        key: context.id,
        children: createElement(Story),
      }),
  ],
  loaders: [mswLoader()],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
};

export default preview;
