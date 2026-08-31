import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { delay, http, HttpResponse } from "msw";
import { SWRConfig } from "swr";
import { ComicCreatorsInfoTableWrapper } from "./ComicCreatorsInfoTableWrapper";

const apiUrl = "/api/comic-creators";

const meta = {
  title: "Comic Creators/ComicCreatorsInfoTableWrapper",
  component: ComicCreatorsInfoTableWrapper,
  decorators: [
    (Story) => (
      <SWRConfig
        value={{
          dedupingInterval: 0,
          provider: () => new Map(),
        }}
      >
        <main className="min-h-screen bg-black px-3 py-1 text-gray-100">
          <Story />
        </main>
      </SWRConfig>
    ),
  ],
} satisfies Meta<typeof ComicCreatorsInfoTableWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Populated: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: "/comic-creators" },
    },
    msw: [
      http.get(apiUrl, () =>
        HttpResponse.json({
          total: 3,
          limit: 20,
          offset: 0,
          has_next: false,
          items: [
            { id: "creator-101", name: "Stan Lee", issueCount: 1559 },
            { id: "creator-202", name: "Jack Kirby", issueCount: 680 },
            { id: "creator-303", name: "Marie Severin", issueCount: 245 },
          ],
        }),
      ),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByRole("heading", {
        name: "The Marvel comic creators",
      }),
    ).toBeInTheDocument();
    await expect(await canvas.findByText("Stan Lee")).toBeInTheDocument();
    await expect(canvas.getAllByRole("row")).toHaveLength(4);
  },
};

export const Loading: Story = {
  parameters: {
    msw: [
      http.get(apiUrl, async () => {
        await delay("infinite");
        return HttpResponse.json({});
      }),
    ],
  },
  async play({ canvasElement }) {
    await expect(
      canvasElement.querySelector(".animate-spin"),
    ).toBeInTheDocument();
  },
};

export const Error: Story = {
  parameters: {
    msw: [
      http.get(apiUrl, () =>
        HttpResponse.json(
          { message: "Creator service unavailable" },
          { status: 503 },
        ),
      ),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText("Failed to load")).toBeInTheDocument();
    await expect(canvas.getAllByRole("row")).toHaveLength(1);
  },
};

export const Empty: Story = {
  parameters: {
    msw: [
      http.get(apiUrl, () =>
        HttpResponse.json({
          total: 0,
          limit: 20,
          offset: 0,
          has_next: false,
          items: [],
        }),
      ),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("table")).toBeInTheDocument();
    await expect(canvas.getAllByRole("row")).toHaveLength(1);
  },
};
