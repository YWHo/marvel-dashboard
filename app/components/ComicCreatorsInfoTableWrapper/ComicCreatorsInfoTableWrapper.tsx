"use client";

import { useRouter } from "next/navigation";
import { Spinner } from "@/app/components/Spiner";
import { useApiData } from "@/app/hooks/useApiData";
import {
  type ComicCreatorsItemType,
  ComicCreatorsInfoTable,
} from "@/app/components/ComicCreatorsInfoTable";

type ComicCreatorsApiType = {
  total: number;
  limit: number;
  offset: number;
  has_next: boolean;
  items: ComicCreatorsItemType[];
};

export function ComicCreatorsInfoTableWrapper() {
  const router = useRouter();

  const requestUrl = "/api/comic-creators";
  const { data, error, isValidating } = useApiData<ComicCreatorsApiType>(
    requestUrl,
    {
      keepPreviousData: true,
      fallbackData: undefined,
    },
  );
  const tableItems = data?.items && !error ? data.items : [];

  return (
    <div className="relative min-h-[100px]: max-w-5xl mt-8">
      <h1 className="text-3xl m-4 text-center text-blue-200 font-serif font-extrabold">
        The Marvel comic creators
      </h1>
      {isValidating && (
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
