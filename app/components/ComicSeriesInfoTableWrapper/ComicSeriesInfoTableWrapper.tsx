"use client";

import { useRouter } from "next/navigation";
import { Spinner } from "@/app/components/Spiner";
import { useApiQuery } from "@/app/hooks/useApiQuery";
import { buildApiUrl } from "@/app/lib/api";
import { comicSeriesKeys } from "@/app/lib/queryKeys";
import type { PaginatedResponse } from "@/app/lib/type-definitions";
import {
  type ComicSeriesItemType,
  ComicSeriesInfoTable,
} from "@/app/components/ComicSeriesInfoTable";

export function ComicSeriesInfoTableWrapper() {
  const router = useRouter();
  const pagination = { limit: 20, offset: 0 };
  const requestUrl = buildApiUrl("/api/comic-series", pagination);
  const { data, error, isPending } = useApiQuery<
    PaginatedResponse<ComicSeriesItemType>
  >({
    queryKey: comicSeriesKeys.list(pagination),
    requestUrl,
  });

  const tableItems =
    data?.items && !error ? data.items : [];

  return (
    <div className="relative min-h-[100px]: max-w-5xl mt-14">
      <h1 className="text-3xl m-4 text-center text-blue-200 font-serif font-extrabold">
        The Marvel comic series
      </h1>
      {isPending && (
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
