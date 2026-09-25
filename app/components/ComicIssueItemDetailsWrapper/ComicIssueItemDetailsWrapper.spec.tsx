import { render, screen } from "@testing-library/react";
import { ComicIssueItemDetailsWrapper } from "./ComicIssueItemDetailsWrapper";
import { useApiQuery } from "@/app/hooks/useApiQuery";
import { comicIssueKeys } from "@/app/lib/queryKeys";

jest.mock("@/app/hooks/useApiQuery", () => ({
  useApiQuery: jest.fn(),
}));

jest.mock("@/app/components/Spiner", () => ({
  Spinner: () => <div>Loading issue details</div>,
}));

const mockedUseApiQuery = jest.mocked(useApiQuery);

describe("ComicIssueItemDetailsWrapper", () => {
  it("loads and displays the requested comic issue", () => {
    mockedUseApiQuery.mockReturnValue({
      data: {
        id: "issue-202",
        title: "The Mighty Thor #1",
        issueNumber: "1",
        detailUrl: "https://www.marvel.com/comics/issue/issue-202",
        seriesId: 3003,
        seriesName: "The Mighty Thor",
        onSaleDate: "2025-01-10T00:00:00.000Z",
        unlimitedDate: "2025-06-10T00:00:00.000Z",
        yearPage: "2025",
        digitalId: 4004,
        description: "Thor begins a new adventure.",
        modified: "2025-02-01T00:00:00.000Z",
        pageCount: 32,
        creators: [{ id: "creator-5", name: "Jane Writer", role: "writer" }],
        cover: { path: "", extension: "" },
      },
      error: null,
      isPending: false,
      isFetching: false,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicIssueItemDetailsWrapper issueId="issue-202" />);

    expect(mockedUseApiQuery).toHaveBeenCalledWith({
      queryKey: comicIssueKeys.detail("issue-202"),
      requestUrl: "/api/comic-issues/issue-202",
      enabled: true,
    });
    expect(
      screen.getByRole("heading", { name: "The Mighty Thor #1" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Jane Writer")).toBeInTheDocument();
  });

  it("shows a spinner while the issue is loading", () => {
    mockedUseApiQuery.mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
      isFetching: true,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicIssueItemDetailsWrapper issueId="issue-202" />);

    expect(screen.getByText("Loading issue details")).toBeInTheDocument();
    expect(
      screen.queryByText("No issue details are available."),
    ).not.toBeInTheDocument();
  });

  it("shows error and empty-data states", () => {
    mockedUseApiQuery.mockReturnValue({
      data: undefined,
      error: new Error("API unavailable"),
      isPending: false,
      isFetching: false,
    } as unknown as ReturnType<typeof useApiQuery>);

    const { rerender } = render(
      <ComicIssueItemDetailsWrapper issueId="issue-202" />,
    );

    expect(
      screen.getByText("Failed to load this comic issue. Please try again later."),
    ).toBeInTheDocument();

    mockedUseApiQuery.mockReturnValue({
      data: undefined,
      error: null,
      isPending: false,
      isFetching: false,
    } as unknown as ReturnType<typeof useApiQuery>);
    rerender(<ComicIssueItemDetailsWrapper issueId="issue-202" />);

    expect(
      screen.getByText("No issue details are available."),
    ).toBeInTheDocument();
  });

  it("does not request data without an issue ID", () => {
    mockedUseApiQuery.mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
      isFetching: false,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicIssueItemDetailsWrapper />);

    expect(mockedUseApiQuery).toHaveBeenCalledWith({
      queryKey: comicIssueKeys.detail(""),
      requestUrl: "/api/comic-issues/",
      enabled: false,
    });
    expect(screen.queryByText("Loading issue details")).not.toBeInTheDocument();
    expect(
      screen.getByText("No issue details are available."),
    ).toBeInTheDocument();
  });
});
