import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { ComicSeriesInfoTableWrapper } from "./ComicSeriesInfoTableWrapper";
import { useApiQuery } from "@/app/hooks/useApiQuery";
import { comicSeriesKeys } from "@/app/lib/queryKeys";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/hooks/useApiQuery", () => ({
  useApiQuery: jest.fn(),
}));

jest.mock("@/app/components/Spiner", () => ({
  Spinner: () => <div>Loading comic series</div>,
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

describe("ComicSeriesInfoTableWrapper", () => {
  beforeEach(() => {
    mockedUseRouter.mockReturnValue(router);
  });

  it("loads series and navigates to the selected series", async () => {
    const user = userEvent.setup();
    mockedUseApiQuery.mockReturnValue({
      data: {
        total: 1,
        limit: 20,
        offset: 0,
        has_next: false,
        items: [
          { id: "series-303", name: "Uncanny X-Men", issueCount: 544 },
        ],
      },
      error: null,
      isPending: false,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicSeriesInfoTableWrapper />);

    expect(mockedUseApiQuery).toHaveBeenCalledWith({
      queryKey: comicSeriesKeys.list(),
      requestUrl: "/api/comic-series",
    });
    expect(
      screen.getByRole("heading", { name: "The Marvel comic series" }),
    ).toBeInTheDocument();

    await user.click(screen.getByText("Uncanny X-Men"));

    expect(push).toHaveBeenCalledWith("/comic-series/series-303");
  });

  it("shows a spinner while series data is validating", () => {
    mockedUseApiQuery.mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicSeriesInfoTableWrapper />);

    expect(screen.getByText("Loading comic series")).toBeInTheDocument();
  });

  it("shows an error without rendering stale series rows", () => {
    mockedUseApiQuery.mockReturnValue({
      data: {
        total: 1,
        limit: 20,
        offset: 0,
        has_next: false,
        items: [{ id: "stale-series", name: "Stale Series", issueCount: 1 }],
      },
      error: new Error("API unavailable"),
      isPending: false,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicSeriesInfoTableWrapper />);

    expect(screen.getByText("Failed to load")).toBeInTheDocument();
    expect(screen.queryByText("Stale Series")).not.toBeInTheDocument();
  });
});
