import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ComicCreatorsInfoTable } from "./ComicCreatorsInfoTable";

const creators = [
  { id: "creator-101", name: "Stan Lee", issueCount: 1559 },
  { id: "creator-202", name: "Jack Kirby", issueCount: 680 },
  { id: "creator-303", name: "Marie Severin", issueCount: 245 },
];

const meta = {
  title: "Comic Creators/ComicCreatorsInfoTable",
  component: ComicCreatorsInfoTable,
  args: {
    itemList: creators,
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
} satisfies Meta<typeof ComicCreatorsInfoTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Populated: Story = {
  async play({ args, canvasElement }) {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Stan Lee")).toBeInTheDocument();
    await expect(canvas.getByText("1559")).toBeInTheDocument();
    await expect(canvas.getAllByRole("row")).toHaveLength(4);

    await userEvent.click(canvas.getByText("Jack Kirby"));
    await expect(args.onClickCallBack).toHaveBeenCalledWith("creator-202");
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

export const LongCreatorNames: Story = {
  args: {
    itemList: [
      {
        id: "creator-404",
        name: "Christopher James Priest and the Marvel Editorial Team",
        issueCount: 128,
      },
      {
        id: "creator-505",
        name: "A Creator With an Exceptionally Long Display Name",
        issueCount: 3,
      },
    ],
  },
};
