import { render, screen } from "@testing-library/react";
import { ComicSeriesDetails } from "./ComicSeriesDetails";
import { useApiQuery } from "@/app/hooks/useApiQuery";
import { comicSeriesKeys } from "@/app/lib/queryKeys";

jest.mock("@/app/hooks/useApiQuery", () => ({
  useApiQuery: jest.fn(),
}));

jest.mock("@/app/components/Spiner", () => ({
  Spinner: () => <div>Loading series</div>,
}));

const mockedUseApiQuery = jest.mocked(useApiQuery);

describe("ComicSeriesDetails", () => {
  it("renders series metadata and its publication range", () => {
    const firstIssueDate = "1963-03-01T12:00:00.000Z";
    const lastIssueDate = "2025-07-16T12:00:00.000Z";
    mockedUseApiQuery.mockReturnValue({
      data: {
        seriesId: "series-101",
        seriesName: "The Amazing Spider-Man",
        issueCount: 1234,
        firstIssueDate,
        lastIssueDate,
      },
      error: null,
      isPending: false,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicSeriesDetails seriesId="series-101" />);

    expect(mockedUseApiQuery).toHaveBeenCalledWith({
      queryKey: comicSeriesKeys.detail("series-101"),
      requestUrl: "/api/comic-series/series-101",
    });
    expect(
      screen.getByRole("heading", { name: "The Amazing Spider-Man" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Series ID: series-101")).toBeInTheDocument();
    expect(screen.getByText((1234).toLocaleString())).toBeInTheDocument();
    expect(screen.getByText("Published issues")).toBeInTheDocument();
    expect(screen.getByText("1963–2025")).toBeInTheDocument();
    expect(screen.getByText(formatDate(firstIssueDate))).toBeInTheDocument();
    expect(screen.getByText(formatDate(lastIssueDate))).toBeInTheDocument();
  });

  it("uses singular issue wording for a one-issue series", () => {
    mockedUseApiQuery.mockReturnValue({
      data: {
        seriesId: "series-202",
        seriesName: "Marvel One-Shot",
        issueCount: 1,
        firstIssueDate: "2024-01-15T12:00:00.000Z",
        lastIssueDate: "2024-01-15T12:00:00.000Z",
      },
      error: null,
      isPending: false,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicSeriesDetails seriesId="series-202" />);

    expect(screen.getByText("Published issue")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("shows unavailable publication dates for invalid API values", () => {
    mockedUseApiQuery.mockReturnValue({
      data: {
        seriesId: "series-303",
        seriesName: "Unknown Publication Run",
        issueCount: 5,
        firstIssueDate: "invalid-date",
        lastIssueDate: "",
      },
      error: null,
      isPending: false,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicSeriesDetails seriesId="series-303" />);

    expect(screen.getByText("Dates unavailable")).toBeInTheDocument();
    expect(screen.getAllByText("Not available")).toHaveLength(2);
  });

  it("renders the loading state", () => {
    mockedUseApiQuery.mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicSeriesDetails seriesId="series-404" />);

    expect(screen.getByText("Loading series")).toBeInTheDocument();
    expect(screen.getByText("Loading series details")).toBeInTheDocument();
  });

  it("renders error and empty-data states", () => {
    mockedUseApiQuery.mockReturnValue({
      data: undefined,
      error: new Error("API unavailable"),
      isPending: false,
    } as unknown as ReturnType<typeof useApiQuery>);

    const { rerender } = render(
      <ComicSeriesDetails seriesId="series-505" />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to load this series. Please try again later.",
    );

    mockedUseApiQuery.mockReturnValue({
      data: undefined,
      error: null,
      isPending: false,
    } as unknown as ReturnType<typeof useApiQuery>);
    rerender(<ComicSeriesDetails seriesId="series-505" />);

    expect(
      screen.getByText("No series details are available."),
    ).toBeInTheDocument();
  });
});

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
