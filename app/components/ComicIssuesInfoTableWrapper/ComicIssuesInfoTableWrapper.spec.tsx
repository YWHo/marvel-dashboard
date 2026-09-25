import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { keepPreviousData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ComicIssuesInfoTableWrapper } from "./ComicIssuesInfoTableWrapper";
import { useApiQuery } from "@/app/hooks/useApiQuery";
import {
  comicCreatorKeys,
  comicIssueKeys,
  comicSeriesKeys,
} from "@/app/lib/queryKeys";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/hooks/useApiQuery", () => ({
  useApiQuery: jest.fn(),
}));

jest.mock("@/app/components/Spiner", () => ({
  Spinner: () => <div>Loading comic issues</div>,
}));

const mockedUseRouter = jest.mocked(useRouter);
const mockedUseApiQuery = jest.mocked(useApiQuery);
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
  total: 1,
  limit: 20,
  offset: 0,
  has_next: false,
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
    mockedUseApiQuery.mockReturnValue({
      data: apiData,
      error: null,
      isFetching: false,
      isPending: false,
      isPlaceholderData: false,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicIssuesInfoTableWrapper />);

    expect(mockedUseApiQuery).toHaveBeenCalledWith({
      queryKey: comicIssueKeys.list({ limit: 20, offset: 0 }),
      requestUrl: "/api/comic-issues?limit=20&offset=0",
      placeholderData: keepPreviousData,
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
      expectedQueryKey: comicCreatorKeys.issues("creator-101"),
    },
    {
      props: { seriesId: "series-202" },
      expectedUrl: "/api/comic-series/series-202/issues",
      expectedQueryKey: comicSeriesKeys.issues("series-202"),
    },
    {
      props: { creatorId: "creator-101", seriesId: "series-202" },
      expectedUrl: "/api/comic-creators/creator-101/issues",
      expectedQueryKey: comicCreatorKeys.issues("creator-101"),
    },
  ])(
    "selects $expectedUrl as its data source",
    ({ props, expectedUrl, expectedQueryKey }) => {
      mockedUseApiQuery.mockReturnValue({
        data: { ...apiData, items: [] },
        error: null,
        isFetching: false,
        isPending: false,
        isPlaceholderData: false,
      } as unknown as ReturnType<typeof useApiQuery>);

      render(<ComicIssuesInfoTableWrapper {...props} />);

      expect(mockedUseApiQuery).toHaveBeenCalledWith({
        queryKey: expectedQueryKey,
        requestUrl: expectedUrl,
        placeholderData: undefined,
      });
      expect(
        screen.queryByRole("navigation", { name: "Pagination" }),
      ).not.toBeInTheDocument();
    },
  );

  it("loads title search results and restores all issues when cleared", async () => {
    const user = userEvent.setup();
    mockedUseApiQuery.mockReturnValue({
      data: { ...apiData, has_next: true },
      error: null,
      isFetching: false,
      isPending: false,
      isPlaceholderData: false,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicIssuesInfoTableWrapper showSearchBar />);

    const searchInput = screen.getByRole("searchbox", {
      name: "Search comic issues by title",
    });
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(mockedUseApiQuery).toHaveBeenLastCalledWith({
      queryKey: comicIssueKeys.list({ limit: 20, offset: 20 }),
      requestUrl: "/api/comic-issues?limit=20&offset=20",
      placeholderData: keepPreviousData,
    });

    await user.type(searchInput, "  Spider Man  ");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(mockedUseApiQuery).toHaveBeenLastCalledWith({
      queryKey: comicIssueKeys.search({
        limit: 20,
        offset: 0,
        query: "Spider Man",
      }),
      requestUrl:
        "/api/comic-issues/search?limit=20&offset=0&q=Spider+Man",
      placeholderData: keepPreviousData,
    });

    await user.clear(searchInput);

    expect(mockedUseApiQuery).toHaveBeenLastCalledWith({
      queryKey: comicIssueKeys.list({ limit: 20, offset: 0 }),
      requestUrl: "/api/comic-issues?limit=20&offset=0",
      placeholderData: keepPreviousData,
    });
  });

  it("does not show search controls unless requested", () => {
    mockedUseApiQuery.mockReturnValue({
      data: { ...apiData, items: [] },
      error: null,
      isFetching: false,
      isPending: false,
      isPlaceholderData: false,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicIssuesInfoTableWrapper />);

    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("shows loading and error feedback without stale issue rows", () => {
    mockedUseApiQuery.mockReturnValue({
      data: apiData,
      error: new Error("API unavailable"),
      isFetching: false,
      isPending: true,
      isPlaceholderData: false,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicIssuesInfoTableWrapper />);

    expect(screen.getByText("Loading comic issues")).toBeInTheDocument();
    expect(screen.getByText("Failed to load")).toBeInTheDocument();
    expect(screen.queryByText("Fantastic Four #1")).not.toBeInTheDocument();
  });

  it("renders an empty-data message for a successful empty response", () => {
    mockedUseApiQuery.mockReturnValue({
      data: { ...apiData, items: [] },
      error: null,
      isFetching: false,
      isPending: false,
      isPlaceholderData: false,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicIssuesInfoTableWrapper />);

    expect(screen.getByText("(No data)")).toBeInTheDocument();
  });
});
