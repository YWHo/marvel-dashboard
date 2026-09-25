import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { keepPreviousData } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ComicCreatorsInfoTableWrapper } from "./ComicCreatorsInfoTableWrapper";
import { useApiQuery } from "@/app/hooks/useApiQuery";
import { comicCreatorKeys } from "@/app/lib/queryKeys";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/hooks/useApiQuery", () => ({
  useApiQuery: jest.fn(),
}));

jest.mock("@/app/components/Spiner", () => ({
  Spinner: () => <div>Loading creators</div>,
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

describe("ComicCreatorsInfoTableWrapper", () => {
  beforeEach(() => {
    mockedUseRouter.mockReturnValue(router);
  });

  it("loads creators and navigates to the selected creator", async () => {
    const user = userEvent.setup();
    mockedUseApiQuery.mockReturnValue({
      data: {
        total: 1,
        limit: 20,
        offset: 0,
        has_next: false,
        items: [{ id: "creator-303", name: "Steve Ditko", issueCount: 64 }],
      },
      error: null,
      isFetching: false,
      isPending: false,
      isPlaceholderData: false,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicCreatorsInfoTableWrapper />);

    expect(mockedUseApiQuery).toHaveBeenCalledWith({
      queryKey: comicCreatorKeys.list({ limit: 20, offset: 0 }),
      requestUrl: "/api/comic-creators?limit=20&offset=0",
      placeholderData: keepPreviousData,
    });
    expect(
      screen.getByRole("heading", { name: "The Marvel comic creators" }),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole("banner")).getByRole("navigation", {
        name: "Pagination",
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByText("Steve Ditko"));

    expect(push).toHaveBeenCalledWith("/comic-creators/creator-303");
  });

  it("requests another page and focuses the list heading", async () => {
    const user = userEvent.setup();
    mockedUseApiQuery.mockReturnValue({
      data: {
        total: 40,
        limit: 20,
        offset: 0,
        has_next: true,
        items: [{ id: "creator-101", name: "Stan Lee", issueCount: 1559 }],
      },
      error: null,
      isFetching: false,
      isPending: false,
      isPlaceholderData: false,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicCreatorsInfoTableWrapper />);

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(mockedUseApiQuery).toHaveBeenLastCalledWith({
      queryKey: comicCreatorKeys.list({ limit: 20, offset: 20 }),
      requestUrl: "/api/comic-creators?limit=20&offset=20",
      placeholderData: keepPreviousData,
    });
    expect(
      screen.getByRole("heading", { name: "The Marvel comic creators" }),
    ).toHaveFocus();
  });

  it("keeps current rows visible while another page is fetching", () => {
    mockedUseApiQuery.mockReturnValue({
      data: {
        total: 40,
        limit: 20,
        offset: 0,
        has_next: true,
        items: [{ id: "creator-101", name: "Stan Lee", issueCount: 1559 }],
      },
      error: null,
      isFetching: true,
      isPending: false,
      isPlaceholderData: true,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicCreatorsInfoTableWrapper />);

    expect(screen.getByText("Stan Lee")).toBeInTheDocument();
    expect(screen.getByText("Loading page…")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("shows loading and error feedback without stale creator rows", () => {
    mockedUseApiQuery.mockReturnValue({
      data: {
        total: 1,
        limit: 20,
        offset: 0,
        has_next: false,
        items: [{ id: "stale-creator", name: "Stale Creator", issueCount: 1 }],
      },
      error: new Error("API unavailable"),
      isFetching: false,
      isPending: true,
      isPlaceholderData: false,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicCreatorsInfoTableWrapper />);

    expect(screen.getByText("Loading creators")).toBeInTheDocument();
    expect(screen.getByText("Failed to load")).toBeInTheDocument();
    expect(screen.queryByText("Stale Creator")).not.toBeInTheDocument();
  });
});
