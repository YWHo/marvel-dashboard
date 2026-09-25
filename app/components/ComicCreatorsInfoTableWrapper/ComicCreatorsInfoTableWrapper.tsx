"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PaginationControls } from "@/app/components/PaginationControls";
import { ListToolbar } from "@/app/components/ListToolbar";
import { Spinner } from "@/app/components/Spiner";
import { useApiQuery } from "@/app/hooks/useApiQuery";
import { buildApiUrl } from "@/app/lib/api";
import { COMIC_LIST_PAGE_LIMIT } from "@/app/lib/constants";
import { comicCreatorKeys } from "@/app/lib/queryKeys";
import type { PaginatedResponse } from "@/app/lib/type-definitions";
import {
  type ComicCreatorsItemType,
  ComicCreatorsInfoTable,
} from "@/app/components/ComicCreatorsInfoTable";

export function ComicCreatorsInfoTableWrapper() {
  const [offset, setOffset] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const router = useRouter();

  const pagination = { limit: COMIC_LIST_PAGE_LIMIT, offset };
  const requestUrl = buildApiUrl("/api/comic-creators", pagination);
  const { data, error, isFetching, isPending, isPlaceholderData } = useApiQuery<
    PaginatedResponse<ComicCreatorsItemType>
  >({
    queryKey: comicCreatorKeys.list(pagination),
    requestUrl,
    placeholderData: keepPreviousData,
  });
  const tableItems = data?.items && !error ? data.items : [];
  const isPageFetching = isFetching && !isPending;

  const handlePageChange = (nextOffset: number) => {
    setOffset(nextOffset);
    headingRef.current?.focus();
  };

  return (
    <div className="relative mt-14 min-h-[100px] max-w-5xl">
      <ListToolbar
        headingRef={headingRef}
        title="The Marvel comic creators"
      >
        <PaginationControls
          hasNextPage={data?.has_next ?? false}
          isFetching={isPending || isPageFetching || isPlaceholderData}
          isUnavailable={Boolean(error)}
          itemCount={tableItems.length}
          limit={COMIC_LIST_PAGE_LIMIT}
          offset={offset}
          onPageChange={handlePageChange}
          total={data?.total ?? 0}
        />
      </ListToolbar>
      {isPending && (
        <div className="flex min-h-40 items-start justify-center pt-10">
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
