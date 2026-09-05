"use client";

import clsx from "clsx";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/app/components/Spiner";
import { SearchBox } from "@/app/components/SearchBox";
import { useApiData } from "@/app/hooks/useApiData";
import { ComicIssuesInfoTable } from "@/app/components/ComicIssuesInfoTable";
import type { ComicIssueItemType } from "@/app/components/ComicIssueItemDetails";

type ComicIssuesApiType = {
  series_id: string;
  series_name: string;
  items: ComicIssueItemType[];
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

  const requestUrl = getURL({ creatorId, seriesId, searchString });

  const { data, error, isValidating } = useApiData<ComicIssuesApiType>(
    requestUrl,
    {
      keepPreviousData: true,
      fallbackData: undefined,
    },
  );

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
      {isValidating && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
          <Spinner />
        </div>
      )}
      {error && <div className="text-center text-red-500">Failed to load </div>}
      <section className="flex flex-col items-center justify-center">
        {!isValidating && tableItems.length > 0 && (
          <ComicIssuesInfoTable
            itemList={tableItems}
            onClickCallBack={(id) => {
              router.push(`/comic-issues/${id}`);
            }}
          />
        )}
        {!isValidating && tableItems.length == 0 && (
          <div className="w-100 text-center">(No data)</div>
        )}
        <div className="my-8">&nbsp;</div>
      </section>
    </div>
  );
}

function getURL({
  creatorId,
  seriesId,
  searchString,
}: {
  creatorId?: string;
  seriesId?: string;
  searchString?: string;
}) {
  const normalizedSearchString = searchString?.trim();

  if (normalizedSearchString) {
    return `/api/comic-issues/search?q=${encodeURIComponent(normalizedSearchString)}`;
  }

  if (creatorId) {
    return `/api/comic-creators/${creatorId}/issues`;
  }

  if (seriesId) {
    return `/api/comic-series/${seriesId}/issues`;
  }

  return "/api/comic-issues";
}
