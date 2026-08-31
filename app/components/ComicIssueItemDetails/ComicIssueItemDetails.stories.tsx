import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import {
  ComicIssueItemDetails,
  type ComicIssueItemDetailsType,
} from "./ComicIssueItemDetails";

const completeIssue: ComicIssueItemDetailsType = {
  id: "issue-101",
  title: "Amazing Fantasy #15",
  issueNumber: "15",
  detailUrl: "https://www.marvel.com/comics/issue/issue-101",
  seriesId: 1001,
  seriesName: "Amazing Fantasy",
  onSaleDate: new Date("1962-08-10T12:00:00.000Z"),
  unlimitedDate: new Date("2007-11-13T12:00:00.000Z"),
  yearPage: "1962",
  digitalId: 2002,
  description:
    "Peter Parker gains extraordinary abilities and learns that with great power comes great responsibility.",
  modified: "2026-01-15T12:00:00.000Z",
  pageCount: 36,
  creators: [
    { id: "creator-101", name: "Stan Lee", role: "writer" },
    { id: "creator-202", name: "Steve Ditko", role: "penciller" },
    { id: "creator-303", name: "Artie Simek", role: "letterer" },
  ],
  cover: {
    path: "/images/marvel-comics",
    extension: "webp",
  },
};

const meta = {
  title: "Comic Issues/ComicIssueItemDetails",
  component: ComicIssueItemDetails,
  args: {
    itemDetails: completeIssue,
  },
  decorators: [
    (Story) => (
      <main className="flex min-h-screen justify-center bg-black px-3 py-8 text-gray-100">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof ComicIssueItemDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Complete: Story = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("heading", { name: "Amazing Fantasy #15" }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("img", { name: "Amazing Fantasy #15 cover" }),
    ).toBeInTheDocument();
    await expect(canvas.getByText("Stan Lee")).toBeInTheDocument();
    await expect(canvas.getByText("3 creators")).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: "Amazing Fantasy" }))
      .toHaveAttribute("href", "/comic-series/1001");
  },
};

export const WithoutCoverOrCreators: Story = {
  args: {
    itemDetails: {
      ...completeIssue,
      id: "issue-202",
      title: "Untitled Marvel Issue",
      detailUrl: "",
      seriesName: "",
      description: "",
      digitalId: 0,
      creators: [],
      cover: { path: "", extension: "" },
    },
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Cover image unavailable")).toBeInTheDocument();
    await expect(
      canvas.getByText("No description is available for this issue."),
    ).toBeInTheDocument();
    await expect(
      canvas.getByText("Creator information is unavailable."),
    ).toBeInTheDocument();
    await expect(
      canvas.queryByRole("link", { name: /View on Marvel/ }),
    ).not.toBeInTheDocument();
  },
};

export const LongContent: Story = {
  args: {
    itemDetails: {
      ...completeIssue,
      id: "issue-303",
      title:
        "The Astonishingly Long and Unexpected Adventures of Earth’s Mightiest Heroes #1000",
      description:
        "Earth’s mightiest heroes confront a threat spanning multiple timelines. "
        + "Old alliances are tested, new heroes answer the call, and every decision changes the future of the Marvel Universe.\n\n"
        + "This story demonstrates how the layout handles long titles and multi-paragraph descriptions without relying on live API data.",
      creators: [
        ...completeIssue.creators,
        { id: "creator-404", name: "A Creator With a Very Long Display Name", role: "colorist" },
      ],
    },
  },
};
