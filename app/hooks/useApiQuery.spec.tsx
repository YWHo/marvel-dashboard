import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { fetchApiData } from "@/app/lib/api";
import { comicIssueKeys } from "@/app/lib/queryKeys";
import { createQueryClient } from "@/app/providers/queryClient";
import { useApiQuery } from "./useApiQuery";

jest.mock("@/app/lib/api", () => ({
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

describe("useApiQuery", () => {
  it("fetches and caches data under the supplied query key", async () => {
    const payload = { id: "issue-101", title: "Amazing Fantasy #15" };
    const queryKey = comicIssueKeys.detail(payload.id);
    const requestUrl = `/api/comic-issues/${payload.id}`;
    const { queryClient, wrapper } = createWrapper();
    mockedFetchApiData.mockResolvedValue(payload);

    const { result } = renderHook(
      () =>
        useApiQuery<typeof payload>({
          queryKey,
          requestUrl,
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(payload);
    expect(queryClient.getQueryData(queryKey)).toEqual(payload);
    expect(mockedFetchApiData).toHaveBeenCalledWith(requestUrl, {
      signal: expect.any(AbortSignal),
    });
  });

  it("does not fetch when the query is disabled", () => {
    const { wrapper } = createWrapper();

    const { result } = renderHook(
      () =>
        useApiQuery({
          queryKey: comicIssueKeys.detail(""),
          requestUrl: "/api/comic-issues/",
          enabled: false,
        }),
      { wrapper },
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockedFetchApiData).not.toHaveBeenCalled();
  });

  it("inherits the query client's no-retry default", async () => {
    const { wrapper } = createWrapper();
    mockedFetchApiData.mockRejectedValue(new Error("API unavailable"));

    const { result } = renderHook(
      () =>
        useApiQuery({
          queryKey: comicIssueKeys.list(),
          requestUrl: "/api/comic-issues",
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(new Error("API unavailable"));
    expect(mockedFetchApiData).toHaveBeenCalledTimes(1);
  });
});
