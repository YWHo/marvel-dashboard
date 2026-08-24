"use client";

import clsx from "clsx";
import type { OnClickCallbackType } from "@/app/lib/type-definitions";
import type { ReactNode } from "react";

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

export function ComicSeriesInfoTable({
  className,
  onClickCallBack,
  itemList = [],
}: ComicSeriesInfoTableProps) {
  return (
    <div className={clsx("relative min-h-[100px]: max-w-5xl mt-8", className)}>
      <table className="block w-full min-[600px]:table min-[600px]:table-fixed min-h-25 sm:w-150 md:w-175 lg:w-225 min-[600px]:[&_td:nth-child(3)]:text-right [&_td]:p-1.5 min-[600px]:[&_td]:p-2 min-[900px]:[&_td]:p-4 [&_th]:p-4 border-separate border-spacing-y-1">
        <colgroup>
          <col className="w-[8ch] pr-1 whitespace-nowrap" />
          <col className="w-auto" />
          <col className="w-[11ch] pl-1 min-[600px]:text-right" />
        </colgroup>
        <thead className="hidden min-[600px]:table-header-group">
          <tr className={clsx("p-4 bg-gray-900 rounded", className)}>
            <th className="border-b border-gray-500 text-left" scope="col">
              ID
            </th>
            <th className="border-b border-gray-500 text-left" scope="col">
              Name
            </th>
            <th className="border-b border-gray-500 text-right" scope="col">
              Issue Count
            </th>
          </tr>
        </thead>
        <tbody className="block min-[600px]:table-row-group">
          {itemList.map((item, i) => (
            <ComicSeriesItem
              key={`${i}_${item.name.substring(5)}`}
              {...item}
              onClickCallback={onClickCallBack}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

type ComicSeriesItemProps = ComicSeriesItemType & {
  className?: string;
  onClickCallback?: OnClickCallbackType;
};

function ComicSeriesItem({
  className,
  id,
  name,
  issueCount = 0,
  onClickCallback = () => {},
}: ComicSeriesItemProps) {
  return (
    <tr
      className={clsx(
        "block min-[600px]:table-row p-4 bg-gray-900 rounded cursor-pointer border-b border-gray-500 mb-2",
        className,
      )}
      onClick={() => onClickCallback(id)}
    >
      <ComicSeriesItemCell label="ID">{id}</ComicSeriesItemCell>
      <ComicSeriesItemCell label="Name">{name}</ComicSeriesItemCell>
      <ComicSeriesItemCell label="IssueCount">{issueCount}</ComicSeriesItemCell>
    </tr>
  );
}

type ComicSeriesItemCellProps = {
  children: ReactNode;
  label: string;
};

function ComicSeriesItemCell({ children, label }: ComicSeriesItemCellProps) {
  return (
    <td className="min-[600px]:border-b min-[600px]:border-gray-500 block min-[600px]:table-cell">
      <div className="grid min-w-0 grid-cols-1 min-[350px]:grid-cols-[11ch_minmax(0,1fr)] gap-1 min-[350px]:gap-x-2  min-[600px]:block">
        <span className="font-semibold min-[600px]:hidden">{label}</span>
        <span className="pl-1.5 min-[350px]:pl-0">{children}</span>
      </div>
    </td>
  );
}
