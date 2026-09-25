"use client";

import { useRouter } from "next/navigation";
import { Spinner } from "@/app/components/Spiner";
import { useApiQuery } from "@/app/hooks/useApiQuery";
import { buildApiUrl } from "@/app/lib/api";
import { comicCreatorKeys } from "@/app/lib/queryKeys";
import type { PaginatedResponse } from "@/app/lib/type-definitions";
import {
  type ComicCreatorsItemType,
  ComicCreatorsInfoTable,
} from "@/app/components/ComicCreatorsInfoTable";

export function ComicCreatorsInfoTableWrapper() {
  const router = useRouter();

  const pagination = { limit: 20, offset: 0 };
  const requestUrl = buildApiUrl("/api/comic-creators", pagination);
  const { data, error, isPending } = useApiQuery<
    PaginatedResponse<ComicCreatorsItemType>
  >({
    queryKey: comicCreatorKeys.list(pagination),
    requestUrl,
  });
  const tableItems = data?.items && !error ? data.items : [];

  return (
    <div className="relative min-h-[100px]: max-w-5xl mt-14">
      <h1 className="text-3xl m-4 text-center text-blue-200 font-serif font-extrabold">
        The Marvel comic creators
      </h1>
      {isPending && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
          <Spinner />
        </div>
      )}
      {error && <div className="text-center text-red-500">Failed to load </div>}
      <section className="flex flex-col items-center justify-center">
        <ComicCreatorsInfoTable
          itemList={tableItems}
          onClickCallBack={(id) => {
            router.push(`/comic-creators/${id}`);
          }}
        />
        <div className="my-8">&nbsp;</div>
      </section>
    </div>
  );
}
