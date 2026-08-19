"use client";

import React from "react";
import clsx from "clsx";
import type { OnClickCallbackType } from "@/app/lib/type-definitions";

export type ComicSeriesItemType = {
  id: number;
  name: string;
  issueCount: number;
};

type ComicSeriesInfoTableProps = {
  className?: string;
  onClickCallBack?: OnClickCallbackType;
  itemList: ComicSeriesItemType[];
};

export function ComicSeriesInfoTable({ className, onClickCallBack, itemList = [] }: ComicSeriesInfoTableProps) {
  return (
    <div className={clsx("relative min-h-[100px]: max-w-screen-lg mt-8", className)}>
      <ul className="flex-grow min-h-[100px] w-[290px] sm:w-[600px] md:w-[800px] lg:w-[900px] flex flex-col list-none p-0 overflow-y-auto gap-y-2">
        {itemList.map((item, i) => (
          <ComicSeriesItem key={`${i}_${item.name.substring(5)}`} {...item} onClickCallback={onClickCallBack}/>
        ))}
      </ul>
    </div>
  );
}

type ComicSeriesItemProps = ComicSeriesItemType & {
  className?: string;
  onClickCallback?: OnClickCallbackType
};

function ComicSeriesItem({
  className,
  id,
  name,
  issueCount = 0,
  onClickCallback = () => {}
}: ComicSeriesItemProps) {
  return (
    <li
      className={clsx(
        "flex w-full border-b border-gray-500 p-4 bg-gray-900 rounded cursor-pointer",
        className,
      )}
      onClick={() => onClickCallback(id)}
    >
      <div className="w-[8ch] pr-1">{id}</div>
      <div className="grow">{name}</div>
      <div className="w-[4ch] pl-1 text-right">{issueCount}</div>
    </li>
  );
}
