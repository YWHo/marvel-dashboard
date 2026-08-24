"use client";

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

export type ComicIssueItemDetailsType = ComicIssueItemType & {
  digitalId: number;
  description: string;
  modified: string;
  pageCount: number;
  creators: {
    id: number;
    name: string;
    role: string;
  }[];
};

type ComicIssueItemDetailsProps = {
  className?: string;
  itemDetails: ComicIssueItemDetailsType;
};

export function ComicIssuesDetails({
  className,
  itemDetails,
}: ComicIssueItemDetailsProps) {
  return (
    <div className={clsx("relative min-h-[100px]: max-w-5xl mt-8", className)}>
      <div>title: {itemDetails.title}</div>
      <div>description: {itemDetails.description}</div>
    </div>
  );
}
