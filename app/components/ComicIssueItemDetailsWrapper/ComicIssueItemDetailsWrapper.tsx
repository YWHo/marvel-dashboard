"use client";

import { Spinner } from "@/app/components/Spiner";
import { useApiQuery } from "@/app/hooks/useApiQuery";
import { comicIssueKeys } from "@/app/lib/queryKeys";
import {
  type ComicIssueItemDetailsType,
  ComicIssueItemDetails,
} from "@/app/components/ComicIssueItemDetails";

type ComicIssueItemDetailsWrapperProps = {
  issueId?: string;
};

export function ComicIssueItemDetailsWrapper({
  issueId,
}: ComicIssueItemDetailsWrapperProps) {
  const normalizedIssueId = issueId ?? "";
  const requestUrl = `/api/comic-issues/${normalizedIssueId}`;
  const { data, error, isPending, isFetching } =
    useApiQuery<ComicIssueItemDetailsType>({
      queryKey: comicIssueKeys.detail(normalizedIssueId),
      requestUrl,
      enabled: Boolean(issueId),
    });
  const isInitialLoading = isPending && isFetching;

  const detailsObj: ComicIssueItemDetailsType | Record<string, never> =
    data?.id && data?.title && !error ? data : {};

  return (
    <div className="relative mx-auto mt-14 min-h-100 w-full max-w-6xl px-2 pb-16 sm:px-4">
      <h1 className="sr-only">Marvel comic issue details</h1>
      {isInitialLoading && (
        <div className="absolute left-1/2 top-24 z-10 -translate-x-1/2">
          <Spinner />
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-700 bg-red-950/60 p-6 text-center text-red-200">
          Failed to load this comic issue. Please try again later.
        </div>
      )}
      <section className="flex flex-col items-center justify-center">
        {!isInitialLoading && detailsObj.id && (
          <ComicIssueItemDetails
            itemDetails={detailsObj as ComicIssueItemDetailsType}
          />
        )}
        {!isInitialLoading && !error && !detailsObj.id && (
          <div className="w-full rounded-xl border border-gray-700 bg-gray-900 p-6 text-center text-gray-300">
            No issue details are available.
          </div>
        )}
      </section>
    </div>
  );
}
