import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { delay, http, HttpResponse } from "msw";
import { ComicIssuesInfoTableWrapper } from "./ComicIssuesInfoTableWrapper";

const issueItems = [
  {
    id: "issue-101",
    title: "Amazing Fantasy #15",
    issueNumber: "15",
    detailUrl: "https://www.marvel.com/comics/issue/issue-101",
    seriesId: 1001,
    seriesName: "Amazing Fantasy",
    onSaleDate: "1962-08-10T12:00:00.000Z",
    unlimitedDate: "2007-11-13T12:00:00.000Z",
    yearPage: "1962",
  },
  {
    id: "issue-202",
    title: "The Avengers #1",
    issueNumber: "1",
    detailUrl: "https://www.marvel.com/comics/issue/issue-202",
    seriesId: 2002,
    seriesName: "The Avengers",
    onSaleDate: "1963-09-01T12:00:00.000Z",
    unlimitedDate: "2008-01-15T12:00:00.000Z",
    yearPage: "1963",
  },
];

const meta = {
  title: "Comic Issues/ComicIssuesInfoTableWrapper",
  component: ComicIssuesInfoTableWrapper,
  decorators: [
    (Story) => (
      <main className="min-h-screen bg-black px-3 py-1 text-gray-100">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof ComicIssuesInfoTableWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllIssues: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: "/comic-issues" },
    },
    msw: [
      http.get("/api/comic-issues", () =>
        HttpResponse.json({
          total: issueItems.length,
          limit: 20,
          offset: 0,
          has_next: false,
          items: issueItems,
        }),
      ),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByRole("heading", { name: "The Marvel comic issues" }),
    ).toBeInTheDocument();
    await expect(await canvas.findByText("Amazing Fantasy #15"))
      .toBeInTheDocument();
    await expect(canvas.getAllByRole("row")).toHaveLength(3);
  },
};

export const Paginated: Story = {
  parameters: {
    msw: [
      http.get("/api/comic-issues", ({ request }) => {
        const offset = Number(new URL(request.url).searchParams.get("offset"));
        const isSecondPage = offset === 20;

        return HttpResponse.json({
          total: 21,
          limit: 20,
          offset,
          has_next: !isSecondPage,
          items: [isSecondPage ? issueItems[1] : issueItems[0]],
        });
      }),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const previousButton = await canvas.findByRole("button", {
      name: "Previous",
    });
    const nextButton = canvas.getByRole("button", { name: "Next" });

    await expect(previousButton).toBeDisabled();
    await expect(
      await canvas.findByText("Amazing Fantasy #15"),
    ).toBeInTheDocument();
    await userEvent.click(nextButton);
    await expect(await canvas.findByText("The Avengers #1")).toBeInTheDocument();
    await expect(nextButton).toBeDisabled();
    await expect(
      canvas.getByRole("heading", { name: "The Marvel comic issues" }),
    ).toHaveFocus();
  },
};

export const IssuesByCreator: Story = {
  args: {
    creatorId: "creator-101",
  },
  parameters: {
    msw: [
      http.get("/api/comic-creators/:creatorId/issues", () =>
        HttpResponse.json({ items: issueItems }),
      ),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText("The Avengers #1"))
      .toBeInTheDocument();
  },
};

export const IssuesBySeries: Story = {
  args: {
    seriesId: "series-1001",
  },
  parameters: {
    msw: [
      http.get("/api/comic-series/:seriesId/issues", () =>
        HttpResponse.json({
          series_id: "series-1001",
          series_name: "Amazing Fantasy",
          items: [issueItems[0]],
        }),
      ),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByRole("heading", { name: "Amazing Fantasy" }),
    ).toBeInTheDocument();
    await expect(canvas.getByText("Amazing Fantasy #15")).toBeInTheDocument();
  },
};

export const SearchIssues: Story = {
  args: {
    showSearchBar: true,
  },
  parameters: {
    msw: [
      http.get("/api/comic-issues", () =>
        HttpResponse.json({
          total: issueItems.length,
          limit: 20,
          offset: 0,
          has_next: false,
          items: issueItems,
        }),
      ),
      http.get("/api/comic-issues/search", ({ request }) => {
        const query = new URL(request.url).searchParams.get("q");

        return HttpResponse.json({
          total: query === "Amazing Fantasy" ? 1 : 0,
          limit: 20,
          offset: 0,
          has_next: false,
          items: query === "Amazing Fantasy" ? [issueItems[0]] : [],
        });
      }),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const searchInput = await canvas.findByRole("searchbox", {
      name: "Search comic issues by title",
    });

    await userEvent.type(searchInput, "Amazing Fantasy");
    await userEvent.click(canvas.getByRole("button", { name: "Search" }));

    await expect(await canvas.findByText("Amazing Fantasy #15"))
      .toBeInTheDocument();
    await expect(canvas.queryByText("The Avengers #1")).not.toBeInTheDocument();
  },
};

export const Loading: Story = {
  parameters: {
    msw: [
      http.get("/api/comic-issues", async () => {
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
      http.get("/api/comic-issues", () =>
        HttpResponse.json(
          { message: "Issue service unavailable" },
          { status: 503 },
        ),
      ),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText("Failed to load")).toBeInTheDocument();
    await expect(canvas.getByText("(No data)")).toBeInTheDocument();
  },
};

export const Empty: Story = {
  parameters: {
    msw: [
      http.get("/api/comic-issues", () =>
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

    await expect(await canvas.findByText("(No data)")).toBeInTheDocument();
    await expect(canvas.queryByRole("table")).not.toBeInTheDocument();
  },
};
