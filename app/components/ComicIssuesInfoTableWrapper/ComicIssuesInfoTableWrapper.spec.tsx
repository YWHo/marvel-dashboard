import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { ComicIssuesInfoTableWrapper } from "./ComicIssuesInfoTableWrapper";
import { useApiQuery } from "@/app/hooks/useApiQuery";
import { useInfiniteComicIssues } from "@/app/hooks/useInfiniteComicIssues";
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

jest.mock("@/app/hooks/useInfiniteComicIssues", () => ({
  useInfiniteComicIssues: jest.fn(),
}));

jest.mock("@/app/components/Spiner", () => ({
  Spinner: () => <div>Loading comic issues</div>,
}));

const mockedUseRouter = jest.mocked(useRouter);
const mockedUseApiQuery = jest.mocked(useApiQuery);
const mockedUseInfiniteComicIssues = jest.mocked(useInfiniteComicIssues);
const fetchNextPage = jest.fn();
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

const issue = {
  id: "issue-303",
  title: "Fantastic Four #1",
  issueNumber: "1",
  detailUrl: "https://example.test/issues/issue-303",
  seriesId: 303,
  seriesName: "Fantastic Four",
  onSaleDate: new Date("1961-11-08T00:00:00.000Z"),
  unlimitedDate: new Date("2007-11-13T00:00:00.000Z"),
  yearPage: "1961",
};

const firstPage = {
  total: 2,
  limit: 20,
  offset: 0,
  has_next: true,
  items: [issue],
};

function mockInfiniteQuery(overrides: Record<string, unknown> = {}) {
  mockedUseInfiniteComicIssues.mockReturnValue({
    data: { pages: [firstPage], pageParams: [0] },
    error: null,
    fetchNextPage,
    hasNextPage: true,
    isFetchingNextPage: false,
    isPending: false,
    ...overrides,
  } as unknown as ReturnType<typeof useInfiniteComicIssues>);
}

describe("ComicIssuesInfoTableWrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseRouter.mockReturnValue(router);
    mockInfiniteQuery();
    mockedUseApiQuery.mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
    } as unknown as ReturnType<typeof useApiQuery>);
  });

  it("accumulates unique issue pages and navigates to a selected issue", async () => {
    const user = userEvent.setup();
    mockInfiniteQuery({
      data: {
        pages: [
          firstPage,
          {
            ...firstPage,
            offset: 20,
            has_next: false,
            items: [
              issue,
              { ...issue, id: "issue-404", title: "Fantastic Four #2" },
            ],
          },
        ],
        pageParams: [0, 20],
      },
      hasNextPage: false,
    });

    render(<ComicIssuesInfoTableWrapper />);

    expect(mockedUseInfiniteComicIssues).toHaveBeenCalledWith({
      creatorId: undefined,
      enabled: true,
      limit: 20,
      searchText: "",
      seriesId: undefined,
    });
    expect(screen.getAllByText("Fantastic Four #1")).toHaveLength(1);
    expect(screen.getByText("Fantastic Four #2")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Load more" }))
      .not.toBeInTheDocument();

    await user.click(screen.getByText("Fantastic Four #1"));

    expect(push).toHaveBeenCalledWith("/comic-issues/issue-303");
  });

  it("loads another page only while a next page is available", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<ComicIssuesInfoTableWrapper />);

    await user.click(screen.getByRole("button", { name: "Load more" }));

    expect(fetchNextPage).toHaveBeenCalledTimes(1);

    mockInfiniteQuery({ isFetchingNextPage: true });
    rerender(<ComicIssuesInfoTableWrapper />);

    expect(screen.getByRole("button", { name: "Loading more…" }))
      .toBeDisabled();
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
  ])(
    "keeps $expectedUrl finite",
    ({ props, expectedUrl, expectedQueryKey }) => {
      mockedUseApiQuery.mockReturnValue({
        data: {
          items: [issue],
          series_id: "series-202",
          series_name: "Fantastic Four",
        },
        error: null,
        isPending: false,
      } as unknown as ReturnType<typeof useApiQuery>);

      render(<ComicIssuesInfoTableWrapper {...props} />);

      expect(mockedUseApiQuery).toHaveBeenCalledWith({
        queryKey: expectedQueryKey,
        requestUrl: expectedUrl,
        enabled: true,
      });
      expect(mockedUseInfiniteComicIssues).toHaveBeenCalledWith({
        creatorId: props.creatorId,
        enabled: false,
        limit: 20,
        searchText: "",
        seriesId: props.seriesId,
      });
      expect(screen.queryByRole("button", { name: "Load more" }))
        .not.toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Fantastic Four" }),
      ).toBeInTheDocument();
    },
  );

  it("starts a fresh infinite query when search is entered or cleared", async () => {
    const user = userEvent.setup();

    render(<ComicIssuesInfoTableWrapper showSearchBar />);

    const searchInput = screen.getByRole("searchbox", {
      name: "Search comic issues by title",
    });
    await user.type(searchInput, "  Spider Man  ");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(mockedUseInfiniteComicIssues).toHaveBeenLastCalledWith({
      creatorId: undefined,
      enabled: true,
      limit: 20,
      searchText: "Spider Man",
      seriesId: undefined,
    });

    await user.clear(searchInput);

    expect(mockedUseInfiniteComicIssues).toHaveBeenLastCalledWith({
      creatorId: undefined,
      enabled: true,
      limit: 20,
      searchText: "",
      seriesId: undefined,
    });
  });

  it("renders initial loading, error, and empty states", () => {
    mockInfiniteQuery({
      data: undefined,
      error: null,
      hasNextPage: false,
      isPending: true,
    });
    const { rerender } = render(<ComicIssuesInfoTableWrapper />);

    expect(screen.getByText("Loading comic issues")).toBeInTheDocument();

    mockInfiniteQuery({
      data: undefined,
      error: new Error("API unavailable"),
      hasNextPage: false,
      isPending: false,
    });
    rerender(<ComicIssuesInfoTableWrapper />);

    expect(screen.getByText("Failed to load")).toBeInTheDocument();

    mockInfiniteQuery({
      data: { pages: [{ ...firstPage, items: [] }], pageParams: [0] },
      hasNextPage: false,
    });
    rerender(<ComicIssuesInfoTableWrapper />);

    expect(screen.getByText("(No data)")).toBeInTheDocument();
  });

  it("disables the finite query on the top-level list", () => {
    render(<ComicIssuesInfoTableWrapper />);

    expect(mockedUseApiQuery).toHaveBeenCalledWith({
      queryKey: comicIssueKeys.list(),
      requestUrl: "",
      enabled: false,
    });
  });
});
