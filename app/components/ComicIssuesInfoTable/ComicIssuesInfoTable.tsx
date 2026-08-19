"use client";

import React from "react";
import clsx from "clsx";

export type ComicIssueItemType = {
  id: number;
  title: string;
  issueNumber: string;
  detailUrl: string;
  seriesId: number;
  seriesName: string;
  onSaleDate: Date;
  unlimitedDate: Date;
  yearPage: string;
};

type ComicIssuesInfoTableProps = {
  className?: string;
  itemList: ComicIssueItemType[];
};

export function ComicIssuesInfoTable({
  className,
  itemList = [],
}: ComicIssuesInfoTableProps) {
  if (!itemList || itemList.length === 0) {
    return <div className="w-100 text-center">(No data)</div>;
  }
  return (
    <div
      className={clsx(
        "relative min-h-[100px]: max-w-screen-lg mt-8",
        className,
      )}
    >
      <ul className="flex-grow min-h-[100px] w-[290px] sm:w-[600px] md:w-[800px] lg:w-[900px] flex flex-col list-none p-0 overflow-y-auto gap-y-2">
        {itemList.map((item, i) => (
          <ComicIssuesItem
            key={`${item.id}_${item.title.substring(5)}`}
            {...item}
          />
        ))}
      </ul>
    </div>
  );
}

type ComicSeriesItemProps = ComicIssueItemType & {
  className?: string;
};

function ComicIssuesItem({
  className,
  id,
  title,
  issueNumber,
  detailUrl,
  onSaleDate,
  unlimitedDate,
  yearPage,
}: ComicSeriesItemProps) {
  const onSaleDateStr = new Date(onSaleDate).toLocaleDateString();
  const unlimitedDateStr = new Date(unlimitedDate).toLocaleDateString();

  return (
    <li
      className={clsx(
        "flex w-full border-b border-gray-500 p-4 bg-gray-900 rounded",
        className,
      )}
    >
      <div className="w-[8ch] pr-1">{id}</div>
      <div className="grow">{title}</div>
      <div className="w-[4ch] px-1 text-right">{yearPage}</div>
      <div className="w-[10ch] pr-1">{onSaleDateStr}</div>
      <div className="w-[10ch] pl-1">{unlimitedDateStr}</div>
    </li>
  );
}
