"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import type { OnClickCallbackType } from "@/app/lib/type-definitions";
import type { ComicIssueItemType } from "@/app/components/ComicIssueItemDetails";

type ComicIssuesInfoTableProps = {
  className?: string;
  onClickCallBack?: OnClickCallbackType;
  itemList: ComicIssueItemType[];
};

export function ComicIssuesInfoTable({
  className,
  onClickCallBack,
  itemList = [],
}: ComicIssuesInfoTableProps) {
  if (!itemList || itemList.length === 0) {
    return <div className="w-100 text-center">(No data)</div>;
  }
  return (
    <div className={clsx("relative min-h-[100px]: max-w-5xl mt-8", className)}>
      <table className="block w-full min-[600px]:table min-[600px]:table-fixed min-h-25 sm:w-150 md:w-175 lg:w-225 min-[600px]:[&_td:nth-child(3)]:text-right [&_td]:p-1.5 min-[600px]:[&_td]:p-2 min-[900px]:[&_td]:p-4 [&_th]:p-4 border-separate border-spacing-y-1">
        <colgroup>
          <col className="w-[8ch] pr-1 whitespace-nowrap" />
          <col className="w-auto" />
          <col className="w-[6ch] pr-1" />
          <col className="w-[11ch] pr-1" />
          <col className="w-[11ch]" />
        </colgroup>
        <thead className="hidden min-[600px]:table-header-group">
          <tr className={clsx("p-4 bg-gray-900 rounded", className)}>
            <th className="border-b border-gray-500 text-left" scope="col">
              ID
            </th>
            <th className="border-b border-gray-500 text-left" scope="col">
              Name
            </th>
            <th className="border-b border-gray-500 text-left" scope="col">
              Year Page
            </th>
            <th className="border-b border-gray-500 text-left" scope="col">
              On Sale Date
            </th>
            <th className="border-b border-gray-500 text-left" scope="col">
              Unlimited Date
            </th>
          </tr>
        </thead>
        <tbody className="block min-[600px]:table-row-group">
          {itemList.map((item, i) => (
            <ComicIssuesItem
              key={`${i}_${item.title.substring(5)}`}
              {...item}
              onClickCallback={onClickCallBack}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

type ComicIssueItemProps = ComicIssueItemType & {
  className?: string;
  onClickCallback?: OnClickCallbackType;
};

function ComicIssuesItem({
  className,
  id,
  title,
  onSaleDate,
  unlimitedDate,
  yearPage,
  onClickCallback = () => {},
}: ComicIssueItemProps) {
  const onSaleDateStr = new Date(onSaleDate).toLocaleDateString();
  const unlimitedDateStr = new Date(unlimitedDate).toLocaleDateString();

  return (
    <tr
      className={clsx(
        "block min-[600px]:table-row p-4 bg-gray-900 rounded cursor-pointer border-b border-gray-500 mb-2",
        className,
      )}
      onClick={() => onClickCallback(id)}
    >
      <ComicIssuesItemCell label="ID">{id}</ComicIssuesItemCell>
      <ComicIssuesItemCell label="Title">{title}</ComicIssuesItemCell>
      <ComicIssuesItemCell label="Year Page">{yearPage}</ComicIssuesItemCell>
      <ComicIssuesItemCell label="On Sale Date">
        {onSaleDateStr}
      </ComicIssuesItemCell>
      <ComicIssuesItemCell label="Unlimited Date">
        {unlimitedDateStr}
      </ComicIssuesItemCell>
    </tr>
  );
}

type ComicIssuesItemCellProps = {
  children: ReactNode;
  label: string;
};

function ComicIssuesItemCell({ children, label }: ComicIssuesItemCellProps) {
  return (
    <td className="min-[600px]:border-b min-[600px]:border-gray-500 block min-[600px]:table-cell">
      <div className="grid min-w-0 grid-cols-1 min-[350px]:grid-cols-[11ch_minmax(0,1fr)] gap-1 min-[350px]:gap-x-2  min-[600px]:block">
        <span className="font-semibold min-[600px]:hidden">{label}</span>
        <span className="pl-1.5 min-[350px]:pl-0">{children}</span>
      </div>
    </td>
  );
}