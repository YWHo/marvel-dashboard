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
    <div className="relative min-h-[100px]: max-w-5xl mt-8">
      <h1 className="text-3xl m-4 text-center text-blue-200 font-serif font-extrabold">
        The details of Marvel issue
      </h1>
      {detailsObj.title && (
        <h2 className="text-1xl text-center font-serif">{detailsObj.title}</h2>
      )}
      {isValidating && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
          <Spinner />
        </div>
      )}
      {error && <div className="text-center text-red-500">Failed to load </div>}
      <section className="flex flex-col items-center justify-center">
        {!isValidating && detailsObj.id && (
          <ComicIssuesDetails itemDetails={detailsObj as ComicIssueItemDetailsType} />
        )}
        {!isValidating && !detailsObj.id && (
          <div className="w-100 text-center">(No data)</div>
        )}
        <div className="my-8">&nbsp;</div>
      </section>
    </div>
  );
}
