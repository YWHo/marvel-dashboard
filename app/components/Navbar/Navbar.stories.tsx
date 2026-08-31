import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Navbar } from "./Navbar";

const meta = {
  title: "Navigation/Navbar",
  component: Navbar,
  decorators: [
    (Story) => (
      <div className="min-h-40 bg-gray-950 pt-16 text-gray-100">
        <Story />
        <p className="px-6 py-4 text-sm text-gray-400">
          Page content begins below the fixed navigation bar.
        </p>
      </div>
    ),
  ],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: "/" },
    },
  },
};

export const Issues: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: "/comic-issues" },
    },
  },
};

export const IssueDetails: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: "/comic-issues/issue-101" },
    },
  },
};

export const Series: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: "/comic-series" },
    },
  },
};

export const Creators: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: "/comic-creators" },
    },
  },
};

export const NoActiveItem: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: "/heroes/character-101" },
    },
  },
};
