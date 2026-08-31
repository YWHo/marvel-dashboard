import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import type { ComicIssueItemType } from "@/app/components/ComicIssueItemDetails";
import { ComicIssuesInfoTable } from "./ComicIssuesInfoTable";

const issues: ComicIssueItemType[] = [
  {
    id: "issue-101",
    title: "Amazing Fantasy #15",
    issueNumber: "15",
    detailUrl: "https://www.marvel.com/comics/issue/issue-101",
    seriesId: 1001,
    seriesName: "Amazing Fantasy",
    onSaleDate: new Date("1962-08-10T12:00:00.000Z"),
    unlimitedDate: new Date("2007-11-13T12:00:00.000Z"),
    yearPage: "1962",
  },
  {
    id: "issue-202",
    title: "The Avengers #1",
    issueNumber: "1",
    detailUrl: "https://www.marvel.com/comics/issue/issue-202",
    seriesId: 2002,
    seriesName: "The Avengers",
    onSaleDate: new Date("1963-09-01T12:00:00.000Z"),
    unlimitedDate: new Date("2008-01-15T12:00:00.000Z"),
    yearPage: "1963",
  },
  {
    id: "issue-303",
    title: "Fantastic Four #1",
    issueNumber: "1",
    detailUrl: "https://www.marvel.com/comics/issue/issue-303",
    seriesId: 3003,
    seriesName: "Fantastic Four",
    onSaleDate: new Date("1961-11-08T12:00:00.000Z"),
    unlimitedDate: new Date("2007-10-02T12:00:00.000Z"),
    yearPage: "1961",
  },
];

const meta = {
  title: "Comic Issues/ComicIssuesInfoTable",
  component: ComicIssuesInfoTable,
  args: {
    itemList: issues,
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
} satisfies Meta<typeof ComicIssuesInfoTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Populated: Story = {
  async play({ args, canvasElement }) {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Amazing Fantasy #15")).toBeInTheDocument();
    await expect(canvas.getByText("The Avengers #1")).toBeInTheDocument();
    await expect(canvas.getAllByRole("row")).toHaveLength(4);

    await userEvent.click(canvas.getByText("Fantastic Four #1"));
    await expect(args.onClickCallBack).toHaveBeenCalledWith("issue-303");
  },
};

export const Empty: Story = {
  args: {
    itemList: [],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("(No data)")).toBeInTheDocument();
    await expect(canvas.queryByRole("table")).not.toBeInTheDocument();
  },
};

export const LongIssueTitles: Story = {
  args: {
    itemList: [
      {
        ...issues[0],
        id: "issue-404",
        title:
          "The Astonishingly Long and Unexpected Adventures of Earth’s Mightiest Heroes #1000",
      },
      {
        ...issues[1],
        id: "issue-505",
        title: "A Very Long Comic Issue Title Designed to Exercise Responsive Table Wrapping",
      },
    ],
  },
};
