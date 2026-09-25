"use client";

import clsx from "clsx";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/app/components/Spiner";
import { SearchBox } from "@/app/components/SearchBox";
import { useApiQuery } from "@/app/hooks/useApiQuery";
import { buildApiUrl } from "@/app/lib/api";
import {
  comicCreatorKeys,
  comicIssueKeys,
  comicSeriesKeys,
} from "@/app/lib/queryKeys";
import { ComicIssuesInfoTable } from "@/app/components/ComicIssuesInfoTable";
import type { ComicIssueItemType } from "@/app/components/ComicIssueItemDetails";
import type { PaginatedResponse } from "@/app/lib/type-definitions";

type ComicIssuesApiType = PaginatedResponse<ComicIssueItemType> & {
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

  const requestOptions = getRequestOptions({
    creatorId,
    seriesId,
    searchString,
  });

  const { data, error, isPending } = useApiQuery<ComicIssuesApiType>({
    queryKey: requestOptions.queryKey,
    requestUrl: requestOptions.requestUrl,
  });

  const tableItems = data?.items && !error ? data.items : [];

  const seriesName = data?.series_name && !error ? data.series_name : undefined;

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
        <div className="my-8">&nbsp;</div>
      </section>
    </div>
  );
}

function getRequestOptions({
  creatorId,
  seriesId,
  searchString,
}: {
  creatorId?: string;
  seriesId?: string;
  searchString?: string;
}) {
  const normalizedSearchString = searchString?.trim();
  const pagination = { limit: 20, offset: 0 };

  if (normalizedSearchString) {
    return {
      queryKey: comicIssueKeys.search({
        ...pagination,
        query: normalizedSearchString,
      }),
      requestUrl: buildApiUrl("/api/comic-issues/search", {
        ...pagination,
        q: normalizedSearchString,
      }),
    };
  }

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
    queryKey: comicIssueKeys.list(pagination),
    requestUrl: buildApiUrl("/api/comic-issues", pagination),
  };
}
