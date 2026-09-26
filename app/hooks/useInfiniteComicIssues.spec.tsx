import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { fetchApiData } from "@/app/lib/api";
import { comicIssueKeys } from "@/app/lib/queryKeys";
import { createQueryClient } from "@/app/providers/queryClient";
import type { PaginatedResponse } from "@/app/lib/type-definitions";
import type { ComicIssueItemType } from "@/app/components/ComicIssueItemDetails";
import { useInfiniteComicIssues } from "./useInfiniteComicIssues";

jest.mock("@/app/lib/api", () => ({
  ...jest.requireActual("@/app/lib/api"),
  fetchApiData: jest.fn(),
}));

const mockedFetchApiData = jest.mocked(fetchApiData);

function createWrapper() {
  const queryClient = createQueryClient({ gcTime: Infinity });

  return {
    queryClient,
    wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    },
  };
}

function issue(id: string): ComicIssueItemType {
  return {
    id,
    title: `Issue ${id}`,
    issueNumber: id,
    detailUrl: `https://example.test/issues/${id}`,
    seriesId: 101,
    seriesName: "Test Series",
    onSaleDate: new Date("2026-01-01T00:00:00.000Z"),
    unlimitedDate: new Date("2026-02-01T00:00:00.000Z"),
    yearPage: "2026",
  };
}

function page(
  items: ComicIssueItemType[],
  offset: number,
  hasNext: boolean,
): PaginatedResponse<ComicIssueItemType> {
  return {
    items,
    total: 3,
    limit: 2,
    offset,
    has_next: hasNext,
  };
}

describe("useInfiniteComicIssues", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("accumulates pages and requests the next offset", async () => {
    const firstPage = page([issue("101"), issue("202")], 0, true);
    const finalPage = page([issue("202"), issue("303")], 2, false);
    mockedFetchApiData.mockImplementation(async (url) =>
      url.includes("offset=2") ? finalPage : firstPage,
    );
    const { wrapper } = createWrapper();

    const { result } = renderHook(
      () => useInfiniteComicIssues({ limit: 2 }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages).toEqual([firstPage]);
    expect(result.current.hasNextPage).toBe(true);

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(result.current.data?.pages).toEqual([firstPage, finalPage]);
    expect(result.current.hasNextPage).toBe(false);
    expect(mockedFetchApiData).toHaveBeenNthCalledWith(
      2,
      "/api/comic-issues?limit=2&offset=2",
      { signal: expect.any(AbortSignal) },
    );
  });

  it("stops on a final first page", async () => {
    mockedFetchApiData.mockResolvedValue(page([issue("101")], 0, false));
    const { wrapper } = createWrapper();

    const { result } = renderHook(
      () => useInfiniteComicIssues({ limit: 2 }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.hasNextPage).toBe(false);
    expect(mockedFetchApiData).toHaveBeenCalledTimes(1);
  });

  it("surfaces errors without retrying", async () => {
    mockedFetchApiData.mockRejectedValue(new Error("Issue API unavailable"));
    const { wrapper } = createWrapper();

    const { result } = renderHook(
      () => useInfiniteComicIssues({ limit: 20 }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(new Error("Issue API unavailable"));
    expect(mockedFetchApiData).toHaveBeenCalledTimes(1);
  });

  it("starts search results again at offset zero", async () => {
    const firstPage = page([issue("101"), issue("202")], 0, true);
    const finalPage = page([issue("303")], 2, false);
    mockedFetchApiData.mockImplementation(async (url) =>
      url.includes("offset=2") ? finalPage : firstPage,
    );
    const { wrapper } = createWrapper();

    const { result, rerender } = renderHook(
      ({ searchText }) =>
        useInfiniteComicIssues({ limit: 2, searchText }),
      { initialProps: { searchText: "" }, wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() => expect(result.current.hasNextPage).toBe(true));
    await act(async () => {
      await result.current.fetchNextPage();
    });
    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    rerender({ searchText: "Spider Man" });

    await waitFor(() => expect(mockedFetchApiData).toHaveBeenCalledTimes(3));
    expect(mockedFetchApiData).toHaveBeenLastCalledWith(
      "/api/comic-issues/search?limit=2&offset=0&q=Spider+Man",
      { signal: expect.any(AbortSignal) },
    );
  });

  it("keys disabled creator queries by endpoint inputs", () => {
    const { queryClient, wrapper } = createWrapper();
    const queryKey = comicIssueKeys.infinite({
      endpointMode: "creator",
      searchText: "",
      creatorId: "creator-101",
      seriesId: "series-202",
      limit: 20,
    });

    renderHook(
      () =>
        useInfiniteComicIssues({
          creatorId: "creator-101",
          enabled: false,
          limit: 20,
          seriesId: "series-202",
        }),
      { wrapper },
    );

    expect(queryClient.getQueryState(queryKey)?.fetchStatus).toBe("idle");
    expect(mockedFetchApiData).not.toHaveBeenCalled();
  });
});
