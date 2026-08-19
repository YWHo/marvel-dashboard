"use client";

import React from "react";
import useSWR from "swr";
import { Spinner } from "@/app/components/Spiner";

import {
  type ComicIssueItemType,
  ComicIssuesInfoTable,
} from "@/app/components/ComicIssuesInfoTable";

const fetcher = (url: string) => {
  if (!url || url.length == 0) return null;
  return fetch(url).then((res) => res.json());
};

type ComicIssuesType = {
  series_id: number;
  series_name: string;
  items: ComicIssueItemType[];
};

type ComicIssuesInfoTableWrapperProps = {
  seriesId: string;
};

export function ComicIssuesInfoTableWrapper({
  seriesId,
}: ComicIssuesInfoTableWrapperProps) {
  const requestUrl = `/api/comic-series/${seriesId}/issues`;
  const { data, error, isValidating } = useSWR(requestUrl, fetcher, {
    keepPreviousData: true,
    fallbackData: undefined,
  });

  const comicIssuesData: ComicIssuesType = data;

  const tableItems =
    comicIssuesData?.items && !error ? comicIssuesData.items : [];

  const seriesName =
    comicIssuesData?.series_name && !error
      ? comicIssuesData.series_name
      : undefined;

  return (
    <div className="relative min-h-[100px]: max-w-screen-lg mt-8">
      <h1 className="text-3xl m-4 text-center text-blue-200 font-serif font-extrabold">
        The Marvel comic issues
      </h1>
      {seriesName && (
        <h2 className="text-1xl text-center font-serif">{seriesName}</h2>
      )}
      {isValidating && (
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
          <Spinner />
        </div>
      )}
      {error && <div className="text-center text-red-500">Failed to load </div>}
      <section className="flex flex-col items-center justify-center">
        {!isValidating && tableItems.length > 0 && (
          <ComicIssuesInfoTable itemList={comicIssuesData?.items} />
        )}
        {!isValidating && tableItems.length == 0 && (
          <div className="w-100 text-center">(No data)</div>
        )}
        <div className="my-8">&nbsp;</div>
      </section>
    </div>
  );
}
