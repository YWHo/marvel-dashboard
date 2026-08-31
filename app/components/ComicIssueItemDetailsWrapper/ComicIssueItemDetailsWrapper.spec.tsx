import { render, screen } from "@testing-library/react";
import { ComicIssueItemDetailsWrapper } from "./ComicIssueItemDetailsWrapper";
import { useApiData } from "@/app/hooks/useApiData";

jest.mock("@/app/hooks/useApiData", () => ({
  useApiData: jest.fn(),
}));

jest.mock("@/app/components/Spiner", () => ({
  Spinner: () => <div>Loading issue details</div>,
}));

const mockedUseApiData = jest.mocked(useApiData);

describe("ComicIssueItemDetailsWrapper", () => {
  it("loads and displays the requested comic issue", () => {
    mockedUseApiData.mockReturnValue({
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
      error: undefined,
      isValidating: false,
    } as ReturnType<typeof useApiData>);

    render(<ComicIssueItemDetailsWrapper issueId="issue-202" />);

    expect(mockedUseApiData).toHaveBeenCalledWith(
      "/api/comic-issues/issue-202",
      { keepPreviousData: true, fallbackData: undefined },
    );
    expect(
      screen.getByRole("heading", { name: "The Mighty Thor #1" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Jane Writer")).toBeInTheDocument();
  });

  it("shows a spinner while the issue is loading", () => {
    mockedUseApiData.mockReturnValue({
      data: undefined,
      error: undefined,
      isValidating: true,
    } as ReturnType<typeof useApiData>);

    render(<ComicIssueItemDetailsWrapper issueId="issue-202" />);

    expect(screen.getByText("Loading issue details")).toBeInTheDocument();
    expect(
      screen.queryByText("No issue details are available."),
    ).not.toBeInTheDocument();
  });

  it("shows error and empty-data states", () => {
    mockedUseApiData.mockReturnValue({
      data: undefined,
      error: new Error("API unavailable"),
      isValidating: false,
    } as ReturnType<typeof useApiData>);

    const { rerender } = render(
      <ComicIssueItemDetailsWrapper issueId="issue-202" />,
    );

    expect(
      screen.getByText("Failed to load this comic issue. Please try again later."),
    ).toBeInTheDocument();

    mockedUseApiData.mockReturnValue({
      data: undefined,
      error: undefined,
      isValidating: false,
    } as ReturnType<typeof useApiData>);
    rerender(<ComicIssueItemDetailsWrapper issueId="issue-202" />);

    expect(
      screen.getByText("No issue details are available."),
    ).toBeInTheDocument();
  });
});
