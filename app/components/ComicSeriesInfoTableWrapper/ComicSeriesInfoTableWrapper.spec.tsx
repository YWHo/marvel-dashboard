import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { ComicSeriesInfoTableWrapper } from "./ComicSeriesInfoTableWrapper";
import { useApiData } from "@/app/hooks/useApiData";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/hooks/useApiData", () => ({
  useApiData: jest.fn(),
}));

jest.mock("@/app/components/Spiner", () => ({
  Spinner: () => <div>Loading comic series</div>,
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

describe("ComicSeriesInfoTableWrapper", () => {
  beforeEach(() => {
    mockedUseRouter.mockReturnValue(router);
  });

  it("loads series and navigates to the selected series", async () => {
    const user = userEvent.setup();
    mockedUseApiData.mockReturnValue({
      data: {
        total: 1,
        limit: 20,
        offset: 0,
        has_next: false,
        items: [
          { id: "series-303", name: "Uncanny X-Men", issueCount: 544 },
        ],
      },
      error: undefined,
      isValidating: false,
    } as ReturnType<typeof useApiData>);

    render(<ComicSeriesInfoTableWrapper />);

    expect(mockedUseApiData).toHaveBeenCalledWith("/api/comic-series", {
      keepPreviousData: true,
      fallbackData: undefined,
    });
    expect(
      screen.getByRole("heading", { name: "The Marvel comic series" }),
    ).toBeInTheDocument();

    await user.click(screen.getByText("Uncanny X-Men"));

    expect(push).toHaveBeenCalledWith("/comic-series/series-303");
  });

  it("shows a spinner while series data is validating", () => {
    mockedUseApiData.mockReturnValue({
      data: undefined,
      error: undefined,
      isValidating: true,
    } as ReturnType<typeof useApiData>);

    render(<ComicSeriesInfoTableWrapper />);

    expect(screen.getByText("Loading comic series")).toBeInTheDocument();
  });

  it("shows an error without rendering stale series rows", () => {
    mockedUseApiData.mockReturnValue({
      data: {
        total: 1,
        limit: 20,
        offset: 0,
        has_next: false,
        items: [{ id: "stale-series", name: "Stale Series", issueCount: 1 }],
      },
      error: new Error("API unavailable"),
      isValidating: false,
    } as ReturnType<typeof useApiData>);

    render(<ComicSeriesInfoTableWrapper />);

    expect(screen.getByText("Failed to load")).toBeInTheDocument();
    expect(screen.queryByText("Stale Series")).not.toBeInTheDocument();
  });
});
