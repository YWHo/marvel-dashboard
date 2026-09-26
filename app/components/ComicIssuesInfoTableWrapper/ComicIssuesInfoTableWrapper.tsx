"use client";

import clsx from "clsx";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/app/components/Spiner";
import { SearchBox } from "@/app/components/SearchBox";
import { ListToolbar } from "@/app/components/ListToolbar";
import { useApiQuery } from "@/app/hooks/useApiQuery";
import { useInfiniteComicIssues } from "@/app/hooks/useInfiniteComicIssues";
import { useIntersectionObserver } from "@/app/hooks/useIntersectionObserver";
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
  const loadNextPage = useCallback(() => {
    if (
      isTopLevelList &&
      infiniteQuery.hasNextPage &&
      !infiniteQuery.isFetchingNextPage
    ) {
      void infiniteQuery.fetchNextPage();
    }
  }, [
    infiniteQuery.fetchNextPage,
    infiniteQuery.hasNextPage,
    infiniteQuery.isFetchingNextPage,
    isTopLevelList,
  ]);
  const isNextPageError =
    isTopLevelList && infiniteQuery.isFetchNextPageError;
  const { isSupported: isIntersectionObserverSupported, targetRef } =
    useIntersectionObserver({
      enabled: canLoadMore && !isNextPageError,
      onIntersect: loadNextPage,
    });
  const isInitialError =
    Boolean(error) && (isTopLevelList ? !infiniteQuery.data : true);

  return (
    <div className={clsx("relative min-h-[100px] max-w-5xl", className)}>
      <ListToolbar
        sticky={isTopLevelList}
        title="The Marvel comic issues"
        className={clsx(!isTopLevelList && "border-b-0 bg-transparent shadow-none")}
      >
        {showSearchBar && (
          <SearchBox
            inputLabel="Search comic issues by title"
            placeholder="Search comic issues..."
            onSearchCallback={setSearchString}
          />
        )}
      </ListToolbar>
      {seriesName && (
        <h2 className="text-1xl text-center font-serif">{seriesName}</h2>
      )}
      {isPending && (
        <div
          role="status"
          aria-live="polite"
          className="flex min-h-40 items-start justify-center pt-10"
        >
          <Spinner />
          <span className="sr-only">Loading comic issues…</span>
        </div>
      )}
      <section className="flex flex-col items-center justify-center">
        {!isPending && tableItems.length > 0 && (
          <ComicIssuesInfoTable
            itemList={tableItems}
            onClickCallBack={(id) => {
              router.push(`/comic-issues/${id}`);
            }}
          />
        )}
        {!isPending && !error && tableItems.length == 0 && (
          <div className="w-100 text-center">(No data)</div>
        )}
        {isInitialError && (
          <div className="mt-5 text-center text-red-400" role="alert">
            <p>Failed to load comic issues.</p>
            {isTopLevelList && (
              <button
                type="button"
                onClick={() => void infiniteQuery.refetch()}
                className="mt-3 rounded-lg border border-red-400/60 px-5 py-2 font-semibold text-white hover:bg-red-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
              >
                Retry
              </button>
            )}
          </div>
        )}
        {!isPending && !isInitialError && isTopLevelList && (
          <div aria-live="polite" className="mt-5 text-center">
            {infiniteQuery.isFetchingNextPage && (
              <p role="status" className="text-blue-200">
                Loading more comic issues…
              </p>
            )}
            {isNextPageError && (
              <div className="text-red-400">
                <p>Could not load more comic issues.</p>
                <button
                  type="button"
                  onClick={loadNextPage}
                  className="mt-3 rounded-lg border border-red-400/60 px-5 py-2 font-semibold text-white hover:bg-red-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
                >
                  Retry loading more
                </button>
              </div>
            )}
            {!isNextPageError &&
              !infiniteQuery.isFetchingNextPage &&
              tableItems.length > 0 &&
              !infiniteQuery.hasNextPage && (
                <p className="text-gray-400">End of comic issues.</p>
              )}
          </div>
        )}
        {!isPending &&
          !isInitialError &&
          !isNextPageError &&
          isTopLevelList &&
          infiniteQuery.hasNextPage &&
          !isIntersectionObserverSupported && (
            <button
              type="button"
              disabled={!canLoadMore}
              onClick={loadNextPage}
              className="mt-5 min-w-40 rounded-lg border border-blue-400/60 bg-blue-900 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 disabled:cursor-not-allowed disabled:border-gray-700 disabled:bg-gray-800 disabled:text-gray-400"
            >
              {infiniteQuery.isFetchingNextPage
                ? "Loading more…"
                : "Load more"}
            </button>
          )}
        {isTopLevelList &&
          isIntersectionObserverSupported &&
          infiniteQuery.hasNextPage &&
          !isNextPageError && (
            <div
              ref={targetRef}
              aria-hidden="true"
              className="h-px w-full"
              data-testid="comic-issues-sentinel"
            />
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
