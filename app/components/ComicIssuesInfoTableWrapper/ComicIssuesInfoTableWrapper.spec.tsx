import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { ComicIssuesInfoTableWrapper } from "./ComicIssuesInfoTableWrapper";
import { useApiData } from "@/app/hooks/useApiData";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/hooks/useApiData", () => ({
  useApiData: jest.fn(),
}));

jest.mock("@/app/components/Spiner", () => ({
  Spinner: () => <div>Loading comic issues</div>,
}));

const mockedUseRouter = jest.mocked(useRouter);
const mockedUseApiData = jest.mocked(useApiData);
const push = jest.fn();
const router = {
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  push,
  replace: jest.fn(),
  prefetch: jest.fn(),
  bfcacheId: "test-router",
} satisfies ReturnType<typeof useRouter>;

const apiData = {
  series_id: "series-303",
  series_name: "Fantastic Four",
  items: [
    {
      id: "issue-303",
      title: "Fantastic Four #1",
      issueNumber: "1",
      detailUrl: "https://example.test/issues/issue-303",
      seriesId: 303,
      seriesName: "Fantastic Four",
      onSaleDate: new Date("1961-11-08T00:00:00.000Z"),
      unlimitedDate: new Date("2007-11-13T00:00:00.000Z"),
      yearPage: "1961",
    },
  ],
};

describe("ComicIssuesInfoTableWrapper", () => {
  beforeEach(() => {
    mockedUseRouter.mockReturnValue(router);
  });

  it("loads issues, displays the series name, and navigates to an issue", async () => {
    const user = userEvent.setup();
    mockedUseApiData.mockReturnValue({
      data: apiData,
      error: undefined,
      isValidating: false,
    } as ReturnType<typeof useApiData>);

    render(<ComicIssuesInfoTableWrapper />);

    expect(mockedUseApiData).toHaveBeenCalledWith("/api/comic-issues", {
      keepPreviousData: true,
      fallbackData: undefined,
    });
    expect(
      screen.getByRole("heading", { name: "The Marvel comic issues" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Fantastic Four" }),
    ).toBeInTheDocument();

    await user.click(screen.getByText("Fantastic Four #1"));

    expect(push).toHaveBeenCalledWith("/comic-issues/issue-303");
  });

  it.each([
    {
      props: { creatorId: "creator-101" },
      expectedUrl: "/api/comic-creators/creator-101/issues",
    },
    {
      props: { seriesId: "series-202" },
      expectedUrl: "/api/comic-series/series-202/issues",
    },
    {
      props: { creatorId: "creator-101", seriesId: "series-202" },
      expectedUrl: "/api/comic-creators/creator-101/issues",
    },
  ])("selects $expectedUrl as its data source", ({ props, expectedUrl }) => {
    mockedUseApiData.mockReturnValue({
      data: { ...apiData, items: [] },
      error: undefined,
      isValidating: false,
    } as ReturnType<typeof useApiData>);

    render(<ComicIssuesInfoTableWrapper {...props} />);

    expect(mockedUseApiData).toHaveBeenCalledWith(expectedUrl, {
      keepPreviousData: true,
      fallbackData: undefined,
    });
  });

  it("shows loading and error feedback without stale issue rows", () => {
    mockedUseApiData.mockReturnValue({
      data: apiData,
      error: new Error("API unavailable"),
      isValidating: true,
    } as ReturnType<typeof useApiData>);

    render(<ComicIssuesInfoTableWrapper />);

    expect(screen.getByText("Loading comic issues")).toBeInTheDocument();
    expect(screen.getByText("Failed to load")).toBeInTheDocument();
    expect(screen.queryByText("Fantastic Four #1")).not.toBeInTheDocument();
  });

  it("renders an empty-data message for a successful empty response", () => {
    mockedUseApiData.mockReturnValue({
      data: { ...apiData, items: [] },
      error: undefined,
      isValidating: false,
    } as ReturnType<typeof useApiData>);

    render(<ComicIssuesInfoTableWrapper />);

    expect(screen.getByText("(No data)")).toBeInTheDocument();
  });
});
