import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { delay, http, HttpResponse } from "msw";
import { ComicSeriesInfoTableWrapper } from "./ComicSeriesInfoTableWrapper";

const apiUrl = "/api/comic-series";

const meta = {
  title: "Comic Series/ComicSeriesInfoTableWrapper",
  component: ComicSeriesInfoTableWrapper,
  decorators: [
    (Story) => (
      <main className="min-h-screen bg-black px-3 py-1 text-gray-100">
        <Story />
      </main>
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
      within(canvas.getByRole("banner")).getByRole("navigation", {
        name: "Pagination",
      }),
    ).toBeInTheDocument();
    await expect(
      await canvas.findByText("The Amazing Spider-Man"),
    ).toBeInTheDocument();
    await expect(canvas.getAllByRole("row")).toHaveLength(4);
  },
};

export const Paginated: Story = {
  parameters: {
    msw: [
      http.get(apiUrl, ({ request }) => {
        const offset = Number(new URL(request.url).searchParams.get("offset"));
        const isSecondPage = offset === 20;

        return HttpResponse.json({
          total: 21,
          limit: 20,
          offset,
          has_next: !isSecondPage,
          items: [
            isSecondPage
              ? { id: "series-202", name: "Fantastic Four", issueCount: 416 }
              : {
                  id: "series-101",
                  name: "The Amazing Spider-Man",
                  issueCount: 1234,
                },
          ],
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
      await canvas.findByText("The Amazing Spider-Man"),
    ).toBeInTheDocument();
    await userEvent.click(nextButton);
    await expect(await canvas.findByText("Fantastic Four")).toBeInTheDocument();
    await expect(nextButton).toBeDisabled();
    await expect(
      canvas.getByRole("heading", { name: "The Marvel comic series" }),
    ).toHaveFocus();
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
    const canvas = within(canvasElement);
    await expect(
      canvasElement.querySelector(".animate-spin"),
    ).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Previous" }))
      .toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Next" })).toBeDisabled();
    await expect(canvas.getByText("Loading page…")).toBeInTheDocument();
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
    await expect(canvas.getByText("Pagination unavailable"))
      .toBeInTheDocument();
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
