import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { delay, http, HttpResponse } from "msw";
import { SWRConfig } from "swr";
import { ComicIssueItemDetailsWrapper } from "./ComicIssueItemDetailsWrapper";

const apiUrl = "/api/comic-issues/:issueId";

const meta = {
  title: "Comic Issues/ComicIssueItemDetailsWrapper",
  component: ComicIssueItemDetailsWrapper,
  args: {
    issueId: "issue-101",
  },
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
} satisfies Meta<typeof ComicIssueItemDetailsWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loaded: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: "/comic-issues/issue-101" },
    },
    msw: [
      http.get(apiUrl, () =>
        HttpResponse.json({
          id: "issue-101",
          title: "Amazing Fantasy #15",
          issueNumber: "15",
          detailUrl: "https://www.marvel.com/comics/issue/issue-101",
          seriesId: 1001,
          seriesName: "Amazing Fantasy",
          onSaleDate: "1962-08-10T12:00:00.000Z",
          unlimitedDate: "2007-11-13T12:00:00.000Z",
          yearPage: "1962",
          digitalId: 2002,
          description: "Spider-Man makes his first appearance.",
          modified: "2026-01-15T12:00:00.000Z",
          pageCount: 36,
          creators: [
            { id: "creator-101", name: "Stan Lee", role: "writer" },
            { id: "creator-202", name: "Steve Ditko", role: "penciller" },
          ],
          cover: {
            path: "/images/marvel-comics",
            extension: "webp",
          },
        }),
      ),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByRole("heading", { name: "Amazing Fantasy #15" }),
    ).toBeInTheDocument();
    await expect(canvas.getByText("Stan Lee")).toBeInTheDocument();
  },
};

export const Loading: Story = {
  args: {
    issueId: "issue-loading",
  },
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
  args: {
    issueId: "issue-error",
  },
  parameters: {
    msw: [
      http.get(apiUrl, () =>
        HttpResponse.json(
          { message: "Issue service unavailable" },
          { status: 503 },
        ),
      ),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByText(
        "Failed to load this comic issue. Please try again later.",
      ),
    ).toBeInTheDocument();
  },
};

export const NoDetails: Story = {
  args: {
    issueId: "issue-missing",
  },
  parameters: {
    msw: [http.get(apiUrl, () => HttpResponse.json({}))],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByText("No issue details are available."),
    ).toBeInTheDocument();
  },
};
