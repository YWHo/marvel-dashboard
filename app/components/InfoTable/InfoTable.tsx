"use client";

import React, { useState } from "react";
import useSWR from "swr";
import clsx from "clsx";
import type {
  InfoList,
  OnClickCallbackType,
  SortOrder,
} from "@/app/lib/type-definitions";
import { RowDisplayType } from "@/app/lib/type-definitions";
import { RowComponentWithImage } from "./RowComponentWithImage";
import { RowComponentSimple } from "./RowComponentSimple";
import { SearchBox } from "@/app/components/SearchBox";
import { SortButtons } from "@/app/components/SortButtons";
import { Spinner } from "@/app/components/Spiner";
import { DualDirectionButtons } from "@/app/components/DualDirectionButtons";
import { mapToInfoList } from "@/app/lib/helpers";

const fetcher = (url: string) => {
  if (!url || url.length == 0) return null;
  return fetch(url).then((res) => res.json());
};

type Props = {
  baseUrl: string;
  className?: string;
  dataType: RowDisplayType;
  disablePointer?: boolean;
  hasSearchBox?: boolean;
  hasSortButtons?: boolean;
  onClickCallback?: OnClickCallbackType;
  orderByType?: string;
  mockData?: InfoList;
  searchByType?: string;
  
};

export function InfoTable({
  baseUrl,
  dataType,
  className,
  disablePointer,
  hasSearchBox,
  hasSortButtons,
  mockData,
  onClickCallback,
  orderByType,
  searchByType,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<SortOrder>("ascending");
  const [offset, setOffset] = useState(0);
  const limit = 10;
  let totalItems = 0;

  const orderingRequest = orderByType
    ? sortDirection == "ascending"
      ? `&orderBy=${orderByType}`
      : `&orderBy=-${orderByType}`
    : "";
  const searchRequest =
    searchByType?.length && searchTerm.length
      ? `&${searchByType}=${searchTerm}`
      : "";
  const requestUrl = baseUrl
    ? `${baseUrl}?limit=${limit}&offset=${offset}${orderingRequest}${searchRequest}`
    : "";

  const { data, error, isValidating } = useSWR(requestUrl, fetcher, {
    keepPreviousData: true,
    fallbackData: mockData,
  });

  const tableItems = data && !error ? mapToInfoList(data.data?.results) : [];

  if (mockData && mockData.length > 0) {
    totalItems = mockData.length;
  } else if (data && !error) {
    try {
      totalItems = data.data.total;
    } catch (err) {
      console.log("Unexpected results: err:\n", err);
    }
  }

  if (!isValidating && (!tableItems || tableItems.length === 0)) {
    return <div className="w-100 text-center">(No data)</div>;
  }

  const handlePrevPage = () => {
    if (offset > 0) {
      const count = offset - limit;
      if (count < 0) {
        setOffset(0);
      } else {
        setOffset(count);
      }
    }
  };

  const handleNextPage = () => {
    const count = offset + limit;
    if (count < totalItems) {
      setOffset(count);
    }
  };

  return (
    <div
      className={clsx(
        "relative min-h-[100px]: max-w-screen-lg mt-8",
        className
      )}
    >
      {isValidating && (
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
          <Spinner />
        </div>
      )}
      {error && <div className="text-center text-red-500">Failed to load </div>}
      <div className="flex flex-col gap-y-1 md:flex-row md:gap-x-4 mt-11 mb-2 md:justify-center items-center">
        {hasSearchBox ? (
          <SearchBox buttonText="Go" onSearchCallback={setSearchTerm} />
        ) : (
          ""
        )}
        {hasSortButtons ? (
          <SortButtons onSortCallback={setSortDirection} />
        ) : (
          ""
        )}
        <DualDirectionButtons
          isLoading={isValidating}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
        />
      </div>
      <ul className="flex-grow min-h-[100px] w-[290px] sm:w-[600px] md:w-[800px] lg:w-[900px] flex flex-col list-none p-0 overflow-y-auto gap-y-2">
        {dataType == RowDisplayType.WITH_IMAGE &&
          tableItems.map((item) => (
            <RowComponentWithImage
              className={clsx({"cursor-pointer": !disablePointer})}
              key={item.id}
              {...item}
              onClickCallback={onClickCallback}
            />
          ))}
        {dataType == RowDisplayType.SIMPLE &&
          tableItems.map((item, i) => (
            <RowComponentSimple
              className={clsx({"cursor-pointer": !disablePointer})}
              key={`${i}_${item.title.substring(5)}`}
              {...item}
            />
          ))}
      </ul>
    </div>
  );
}
