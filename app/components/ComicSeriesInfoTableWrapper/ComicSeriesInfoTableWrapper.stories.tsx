import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { delay, http, HttpResponse } from "msw";
import { SWRConfig } from "swr";
import { ComicSeriesInfoTableWrapper } from "./ComicSeriesInfoTableWrapper";

const apiUrl = "/api/comic-series";

const meta = {
  title: "Comic Series/ComicSeriesInfoTableWrapper",
  component: ComicSeriesInfoTableWrapper,
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
} satisfies Meta<typeof ComicSeriesInfoTableWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Populated: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: "/comic-series" },
    },
    msw: [
      http.get(apiUrl, () =>
        HttpResponse.json({
          total: 3,
          limit: 20,
          offset: 0,
          has_next: false,
          items: [
            {
              id: "series-101",
              name: "The Amazing Spider-Man",
              issueCount: 1234,
            },
            { id: "series-202", name: "Fantastic Four", issueCount: 416 },
            { id: "series-303", name: "Uncanny X-Men", issueCount: 544 },
          ],
        }),
      ),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByRole("heading", {
        name: "The Marvel comic series",
      }),
    ).toBeInTheDocument();
    await expect(
      await canvas.findByText("The Amazing Spider-Man"),
    ).toBeInTheDocument();
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
          { message: "Series service unavailable" },
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
