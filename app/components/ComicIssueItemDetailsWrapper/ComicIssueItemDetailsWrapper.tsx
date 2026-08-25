"use client";

import { Spinner } from "@/app/components/Spiner";
import { useApiData } from "@/app/hooks/useApiData";
import { type ComicIssueItemDetailsType, ComicIssuesDetails } from "@/app/components/ComicIssueItemDetails";

type ComicIssueItemDetailsWrapperProps = {
  issueId?: string;
};

export function ComicIssueItemDetailsWrapper({
  issueId,
}: ComicIssueItemDetailsWrapperProps) {
  const requestUrl = `/api/comic-issues/${issueId}`;
  const { data, error, isValidating } = useApiData<ComicIssueItemDetailsType>(
    requestUrl,
    {
      keepPreviousData: true,
      fallbackData: undefined,
    },
  );

  const detailsObj: ComicIssueItemDetailsType | Record<string, never> =
    data?.id && data?.title && !error ? data : {};

  return (
    <div className="relative mx-auto mt-14 min-h-100 w-full max-w-6xl px-2 pb-16 sm:px-4">
      <h1 className="sr-only">
        Marvel comic issue details
      </h1>
      {isValidating && (
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
        {!isValidating && detailsObj.id && (
          <ComicIssuesDetails itemDetails={detailsObj as ComicIssueItemDetailsType} />
        )}
        {!isValidating && !error && !detailsObj.id && (
          <div className="w-full rounded-xl border border-gray-700 bg-gray-900 p-6 text-center text-gray-300">
            No issue details are available.
          </div>
        )}
      </section>
    </div>
  );
}
