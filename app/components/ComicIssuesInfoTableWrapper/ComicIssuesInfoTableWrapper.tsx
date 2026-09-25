"use client";

import clsx from "clsx";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/app/components/Spiner";
import { SearchBox } from "@/app/components/SearchBox";
import { useApiQuery } from "@/app/hooks/useApiQuery";
import { useInfiniteComicIssues } from "@/app/hooks/useInfiniteComicIssues";
import { COMIC_LIST_PAGE_LIMIT } from "@/app/lib/constants";
import {
  comicCreatorKeys,
  comicIssueKeys,
  comicSeriesKeys,
} from "@/app/lib/queryKeys";
import { ComicIssuesInfoTable } from "@/app/components/ComicIssuesInfoTable";
import type { ComicIssueItemType } from "@/app/components/ComicIssueItemDetails";

type EmbeddedComicIssuesApiType = {
  items: ComicIssueItemType[];
  series_id?: string;
  series_name?: string;
};

type ComicIssuesInfoTableWrapperProps = {
  className?: string;
  creatorId?: string;
  seriesId?: string;
  showSearchBar?: boolean;
};

export function ComicIssuesInfoTableWrapper({
  className,
  creatorId,
  seriesId,
  showSearchBar = false,
}: ComicIssuesInfoTableWrapperProps) {
  const [searchString, setSearchString] = useState("");
  const router = useRouter();
  const isTopLevelList = !creatorId && !seriesId;

  const infiniteQuery = useInfiniteComicIssues({
    creatorId,
    enabled: isTopLevelList,
    limit: COMIC_LIST_PAGE_LIMIT,
    searchText: searchString,
    seriesId,
  });
  const embeddedRequest = getEmbeddedRequestOptions({ creatorId, seriesId });
  const embeddedQuery = useApiQuery<EmbeddedComicIssuesApiType>({
    queryKey: embeddedRequest.queryKey,
    requestUrl: embeddedRequest.requestUrl,
    enabled: !isTopLevelList,
  });

  const error = isTopLevelList ? infiniteQuery.error : embeddedQuery.error;
  const isPending = isTopLevelList
    ? infiniteQuery.isPending
    : embeddedQuery.isPending;
  const tableItems = isTopLevelList
    ? getUniqueIssues(
        infiniteQuery.data?.pages.flatMap((page) => page.items) ?? [],
      )
    : embeddedQuery.data?.items && !embeddedQuery.error
      ? embeddedQuery.data.items
      : [];
  const seriesName =
    !isTopLevelList && embeddedQuery.data?.series_name && !embeddedQuery.error
      ? embeddedQuery.data.series_name
      : undefined;
  const canLoadMore =
    infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage;

  return (
    <div className={clsx("relative min-h-[100px] max-w-5xl", className)}>
      <h1 className="text-3xl m-4 text-center text-blue-200 font-serif font-extrabold">
        The Marvel comic issues
      </h1>
      {seriesName && (
        <h2 className="text-1xl text-center font-serif">{seriesName}</h2>
      )}
      {showSearchBar && (
        <div className="mx-auto mt-6 flex max-w-md justify-center px-4">
          <SearchBox
            inputLabel="Search comic issues by title"
            placeholder="Search comic issues..."
            onSearchCallback={setSearchString}
          />
        </div>
      )}
      {isPending && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
          <Spinner />
        </div>
      )}
      {error && <div className="text-center text-red-500">Failed to load </div>}
      <section className="flex flex-col items-center justify-center">
        {!isPending && tableItems.length > 0 && (
          <ComicIssuesInfoTable
            itemList={tableItems}
            onClickCallBack={(id) => {
              router.push(`/comic-issues/${id}`);
            }}
          />
        )}
        {!isPending && tableItems.length == 0 && (
          <div className="w-100 text-center">(No data)</div>
        )}
        {!isPending &&
          !error &&
          isTopLevelList &&
          infiniteQuery.hasNextPage && (
            <button
              type="button"
              disabled={!canLoadMore}
              onClick={() => {
                if (canLoadMore) void infiniteQuery.fetchNextPage();
              }}
              className="mt-5 min-w-40 rounded-lg border border-blue-400/60 bg-blue-900 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 disabled:cursor-not-allowed disabled:border-gray-700 disabled:bg-gray-800 disabled:text-gray-400"
            >
              {infiniteQuery.isFetchingNextPage
                ? "Loading more…"
                : "Load more"}
            </button>
          )}
        <div className="my-8">&nbsp;</div>
      </section>
    </div>
  );
}

function getEmbeddedRequestOptions({
  creatorId,
  seriesId,
}: {
  creatorId?: string;
  seriesId?: string;
}) {
  if (creatorId) {
    return {
      queryKey: comicCreatorKeys.issues(creatorId),
      requestUrl: `/api/comic-creators/${creatorId}/issues`,
    };
  }

  if (seriesId) {
    return {
      queryKey: comicSeriesKeys.issues(seriesId),
      requestUrl: `/api/comic-series/${seriesId}/issues`,
    };
  }

  return {
    queryKey: comicIssueKeys.list(),
    requestUrl: "",
  };
}

function getUniqueIssues(items: ComicIssueItemType[]) {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}
