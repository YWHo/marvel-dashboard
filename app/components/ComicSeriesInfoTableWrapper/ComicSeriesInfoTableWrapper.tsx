"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/app/components/Spiner";
import { useApiData } from "@/app/hooks/useApiData";
import {
  type ComicSeriesItemType,
  ComicSeriesInfoTable,
} from "@/app/components/ComicSeriesInfoTable";

type ComicSeriesType = {
  total: number;
  limit: number;
  offset: number;
  has_next: boolean;
  items: ComicSeriesItemType[];
};

export function ComicSeriesInfoTableWrapper() {
  const router = useRouter();
  const requestUrl = "/api/comic-series";
  const { data, error, isValidating } = useApiData<ComicSeriesType>(requestUrl, {
    keepPreviousData: true,
    fallbackData: undefined,
  });

  const comicSeriesData = data;

  const tableItems =
    comicSeriesData?.items && !error ? comicSeriesData.items : [];

  return (
    <div className="relative min-h-[100px]: max-w-screen-lg mt-8">
      <h1 className="text-3xl m-4 text-center text-blue-200 font-serif font-extrabold">
        The Marvel comic series
      </h1>
      {isValidating && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
          <Spinner />
        </div>
      )}
      {error && <div className="text-center text-red-500">Failed to load </div>}
      <section className="flex flex-col items-center justify-center">
        <ComicSeriesInfoTable itemList={tableItems} onClickCallBack={(id) => {
          router.push(`/comic-series/${id}`);
        }} />
        <div className="my-8">&nbsp;</div>
      </section>
    </div>
  );
}
