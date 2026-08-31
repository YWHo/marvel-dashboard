import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ComicSeriesInfoTable } from "./ComicSeriesInfoTable";

const series = [
  { id: "series-101", name: "The Amazing Spider-Man", issueCount: 1234 },
  { id: "series-202", name: "Fantastic Four", issueCount: 416 },
  { id: "series-303", name: "Uncanny X-Men", issueCount: 544 },
];

const meta = {
  title: "Comic Series/ComicSeriesInfoTable",
  component: ComicSeriesInfoTable,
  args: {
    itemList: series,
    onClickCallBack: fn(),
  },
  decorators: [
    (Story) => (
      <main className="min-h-screen bg-black px-3 py-1 text-gray-100">
        <div className="flex justify-center">
          <Story />
        </div>
      </main>
    ),
  ],
} satisfies Meta<typeof ComicSeriesInfoTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Populated: Story = {
  async play({ args, canvasElement }) {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("The Amazing Spider-Man")).toBeInTheDocument();
    await expect(canvas.getByText("1234")).toBeInTheDocument();
    await expect(canvas.getAllByRole("row")).toHaveLength(4);

    await userEvent.click(canvas.getByText("Fantastic Four"));
    await expect(args.onClickCallBack).toHaveBeenCalledWith("series-202");
  },
};

export const Empty: Story = {
  args: {
    itemList: [],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("table")).toBeInTheDocument();
    await expect(canvas.getAllByRole("row")).toHaveLength(1);
  },
};

export const LongSeriesNames: Story = {
  args: {
    itemList: [
      {
        id: "series-404",
        name: "The Astonishingly Long and Unexpected Adventures of Earth’s Mightiest Heroes",
        issueCount: 128,
      },
      {
        id: "series-505",
        name: "A Marvel Comic Series With an Exceptionally Long Display Name",
        issueCount: 3,
      },
    ],
  },
};
