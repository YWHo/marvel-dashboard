import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { delay, http, HttpResponse } from "msw";
import { SWRConfig } from "swr";
import { ComicCreatorDetails } from "./ComicCreatorDetails";

const apiUrl = "/api/comic-creators/:creatorId";

const meta = {
  title: "Comic Creators/ComicCreatorDetails",
  component: ComicCreatorDetails,
  args: {
    creatorId: "creator-101",
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
} satisfies Meta<typeof ComicCreatorDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithMultipleRoles: Story = {
  parameters: {
    msw: [
      http.get(apiUrl, () =>
        HttpResponse.json({
          id: "creator-101",
          name: "Stan Lee",
          roles: [
            { role: "writer", issueCount: "1240" },
            { role: "editor", issueCount: "318" },
            { role: "producer", issueCount: "1" },
          ],
          totalIssues: 1559,
        }),
      ),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByRole("heading", { name: "Stan Lee" }),
    ).toBeInTheDocument();
    await expect(canvas.getByText("1,559")).toBeInTheDocument();
    await expect(canvas.getByText("3 roles")).toBeInTheDocument();
    await expect(canvas.getByText("1 issue")).toBeInTheDocument();
  },
};

export const WithOneRole: Story = {
  args: {
    creatorId: "creator-202",
  },
  parameters: {
    msw: [
      http.get(apiUrl, () =>
        HttpResponse.json({
          id: "creator-202",
          name: "Jack Kirby",
          roles: [{ role: "penciller", issueCount: "680" }],
          totalIssues: 680,
        }),
      ),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(await canvas.findByText("1 role")).toBeInTheDocument();
    await expect(canvas.getByText("penciller")).toBeInTheDocument();
  },
};

export const WithoutRoles: Story = {
  args: {
    creatorId: "creator-303",
  },
  parameters: {
    msw: [
      http.get(apiUrl, () =>
        HttpResponse.json({
          id: "creator-303",
          name: "Marie Severin",
          roles: [],
          totalIssues: 0,
        }),
      ),
    ],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByText("Role information is unavailable for this creator."),
    ).toBeInTheDocument();
    await expect(canvas.getByText("0 roles")).toBeInTheDocument();
  },
};

export const Loading: Story = {
  args: {
    creatorId: "creator-loading",
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
      await canvas.findByText("Loading creator details"),
    ).toBeInTheDocument();
  },
};

export const Error: Story = {
  args: {
    creatorId: "creator-error",
  },
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

    await expect(await canvas.findByRole("alert")).toHaveTextContent(
      "Failed to load this creator",
    );
  },
};

export const NoDetails: Story = {
  args: {
    creatorId: "creator-missing",
  },
  parameters: {
    msw: [http.get(apiUrl, () => HttpResponse.json({}))],
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByText("No creator details are available."),
    ).toBeInTheDocument();
  },
};
