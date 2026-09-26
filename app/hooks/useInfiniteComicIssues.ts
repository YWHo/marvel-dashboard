import { useInfiniteQuery } from "@tanstack/react-query";
import { buildApiUrl, fetchApiData } from "@/app/lib/api";
import { comicIssueKeys } from "@/app/lib/queryKeys";
import type { ComicIssueItemType } from "@/app/components/ComicIssueItemDetails";
import type { PaginatedResponse } from "@/app/lib/type-definitions";

type ComicIssuesEndpointMode = "all" | "creator" | "search" | "series";

type UseInfiniteComicIssuesOptions = {
  creatorId?: string;
  enabled?: boolean;
  limit: number;
  searchText?: string;
  seriesId?: string;
};

export function useInfiniteComicIssues({
  creatorId,
  enabled = true,
  limit,
  searchText,
  seriesId,
}: UseInfiniteComicIssuesOptions) {
  const normalizedSearchText = searchText?.trim() ?? "";
  const endpointMode = getEndpointMode({
    creatorId,
    searchText: normalizedSearchText,
    seriesId,
  });
  const endpointUrl = getEndpointUrl({
    creatorId,
    endpointMode,
    seriesId,
  });

  return useInfiniteQuery({
    queryKey: comicIssueKeys.infinite({
      endpointMode,
      searchText: normalizedSearchText,
      creatorId: creatorId ?? "",
      seriesId: seriesId ?? "",
      limit,
    }),
    queryFn: ({ pageParam, signal }) =>
      fetchApiData<PaginatedResponse<ComicIssueItemType>>(
        buildApiUrl(endpointUrl, {
          limit,
          offset: pageParam,
          q: endpointMode === "search" ? normalizedSearchText : undefined,
        }),
        { signal },
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.has_next ? lastPage.offset + lastPage.limit : undefined,
    enabled,
  });
}

function getEndpointMode({
  creatorId,
  searchText,
  seriesId,
}: {
  creatorId?: string;
  searchText: string;
  seriesId?: string;
}): ComicIssuesEndpointMode {
  if (searchText) return "search";
  if (creatorId) return "creator";
  if (seriesId) return "series";
  return "all";
}

function getEndpointUrl({
  creatorId,
  endpointMode,
  seriesId,
}: {
  creatorId?: string;
  endpointMode: ComicIssuesEndpointMode;
  seriesId?: string;
}) {
  if (endpointMode === "search") return "/api/comic-issues/search";
  if (endpointMode === "creator") {
    return `/api/comic-creators/${creatorId}/issues`;
  }
  if (endpointMode === "series") {
    return `/api/comic-series/${seriesId}/issues`;
  }
  return "/api/comic-issues";
}
