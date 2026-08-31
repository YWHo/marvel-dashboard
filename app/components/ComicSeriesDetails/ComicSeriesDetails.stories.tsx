import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { delay, http, HttpResponse } from "msw";
import { SWRConfig } from "swr";
import { ComicSeriesDetails } from "./ComicSeriesDetails";

const apiUrl = "/api/comic-series/:seriesId";

const meta = {
  title: "Comic Series/ComicSeriesDetails",
  component: ComicSeriesDetails,
  args: {
    seriesId: "series-101",
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
} satisfies Meta<typeof ComicSeriesDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LongPublicationRun: Story = {
  parameters: {
    msw: [
      http.get(apiUrl, () =>
        HttpResponse.json({
          seriesId: "series-101",
          seriesName: "The Amazing Spider-Man",
          issueCount: 1234,
          firstIssueDate: "1963-03-01T12:00:00.000Z",
          lastIssueDate: "2025-07-16T12:00:00.000Z",
        }),
      ),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByRole("heading", { name: "The Amazing Spider-Man" }),
    ).toBeInTheDocument();
    await expect(canvas.getByText("1,234")).toBeInTheDocument();
    await expect(canvas.getByText("Published issues")).toBeInTheDocument();
    await expect(canvas.getByText("1963–2025")).toBeInTheDocument();
  },
};

export const SingleIssue: Story = {
  args: {
    seriesId: "series-202",
  },
  parameters: {
    msw: [
      http.get(apiUrl, () =>
        HttpResponse.json({
          seriesId: "series-202",
          seriesName: "Marvel One-Shot",
          issueCount: 1,
          firstIssueDate: "2024-01-15T12:00:00.000Z",
          lastIssueDate: "2024-01-15T12:00:00.000Z",
        }),
      ),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByRole("heading", { name: "Marvel One-Shot" }),
    ).toBeInTheDocument();
    await expect(canvas.getByText("Published issue")).toBeInTheDocument();
    await expect(canvas.getByText("2024")).toBeInTheDocument();
  },
};

export const OngoingSeries: Story = {
  args: {
    seriesId: "series-303",
  },
  parameters: {
    msw: [
      http.get(apiUrl, () =>
        HttpResponse.json({
          seriesId: "series-303",
          seriesName: "A Newly Launched Ongoing Marvel Series",
          issueCount: 8,
          firstIssueDate: "2025-02-05T12:00:00.000Z",
          lastIssueDate: "",
        }),
      ),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText("From 2025")).toBeInTheDocument();
    await expect(canvas.getByText("Not available")).toBeInTheDocument();
  },
};

export const UnknownStartDate: Story = {
  args: {
    seriesId: "series-404",
  },
  parameters: {
    msw: [
      http.get(apiUrl, () =>
        HttpResponse.json({
          seriesId: "series-404",
          seriesName: "Recovered Marvel Archive",
          issueCount: 42,
          firstIssueDate: "",
          lastIssueDate: "2023-09-20T12:00:00.000Z",
        }),
      ),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText("Through 2023")).toBeInTheDocument();
    await expect(canvas.getByText("Not available")).toBeInTheDocument();
  },
};

export const DatesUnavailable: Story = {
  args: {
    seriesId: "series-505",
  },
  parameters: {
    msw: [
      http.get(apiUrl, () =>
        HttpResponse.json({
          seriesId: "series-505",
          seriesName: "Unknown Publication Run",
          issueCount: 5,
          firstIssueDate: "invalid-date",
          lastIssueDate: "",
        }),
      ),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByText("Dates unavailable"),
    ).toBeInTheDocument();
    await expect(canvas.getAllByText("Not available")).toHaveLength(2);
  },
};

export const Loading: Story = {
  args: {
    seriesId: "series-loading",
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
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByText("Loading series details"),
    ).toBeInTheDocument();
  },
};

export const Error: Story = {
  args: {
    seriesId: "series-error",
  },
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

    await expect(await canvas.findByRole("alert")).toHaveTextContent(
      "Failed to load this series",
    );
  },
};

export const NoDetails: Story = {
  args: {
    seriesId: "series-missing",
  },
  parameters: {
    msw: [http.get(apiUrl, () => HttpResponse.json({}))],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByText("No series details are available."),
    ).toBeInTheDocument();
  },
};
