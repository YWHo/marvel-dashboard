"use client";

import { Spinner } from "@/app/components/Spiner";
import { useApiData } from "@/app/hooks/useApiData";

type ComicSeriesDetailsApiType = {
  seriesId: string;
  seriesName: string;
  issueCount: number;
  firstIssueDate: string;
  lastIssueDate: string;
};

type ComicSeriesDetailsProps = {
  seriesId: string;
};

export function ComicSeriesDetails({ seriesId }: ComicSeriesDetailsProps) {
  const requestUrl = `/api/comic-series/${seriesId}`;
  const { data, error, isValidating } = useApiData<ComicSeriesDetailsApiType>(
    requestUrl,
    {
      keepPreviousData: true,
      fallbackData: undefined,
    },
  );

  if (isValidating) {
    return (
      <div className="mx-auto mt-14 flex min-h-48 w-full items-center justify-center rounded-xl border border-gray-700 bg-gray-900 sm:w-150 md:w-175 lg:w-225">
        <span className="sr-only">Loading series details</span>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="mx-auto mt-14 w-full rounded-xl border border-red-700 bg-red-950/60 p-6 text-center text-red-200 sm:w-150 md:w-175 lg:w-225"
      >
        Failed to load this series. Please try again later.
      </div>
    );
  }

  if (!data?.seriesId || !data.seriesName) {
    return (
      <div className="mx-auto mt-14 w-full rounded-xl border border-gray-700 bg-gray-900 p-6 text-center text-gray-300 sm:w-150 md:w-175 lg:w-225">
        No series details are available.
      </div>
    );
  }

  return (
    <article className="mx-auto mt-14 w-full overflow-hidden rounded-xl border border-blue-700/60 bg-gray-950 text-gray-100 shadow-xl shadow-black/25 sm:w-150 md:w-175 lg:w-225">
      <div className="h-1.5 bg-red-600" />

      <header className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="flex min-w-0 items-center gap-4">
          <div
            aria-hidden="true"
            className="flex size-16 shrink-0 items-center justify-center rounded-lg border-2 border-blue-500 bg-blue-950 text-2xl font-black text-blue-100 shadow-lg"
          >
            S
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
              Marvel comic series
            </p>
            <h1 className="mt-1 wrap-break-word text-2xl font-extrabold leading-tight text-blue-100 sm:text-3xl">
              {data.seriesName}
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Series ID: {data.seriesId}
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-lg border border-blue-800 bg-blue-950/70 px-5 py-3 sm:text-right">
          <p className="text-3xl font-black text-white">
            {data.issueCount.toLocaleString()}
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
            {data.issueCount === 1 ? "Published issue" : "Published issues"}
          </p>
        </div>
      </header>

      <section
        aria-labelledby="publication-run-heading"
        className="border-t border-gray-800 bg-gray-900/70 p-5 sm:p-7"
      >
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
              Series history
            </p>
            <h2
              id="publication-run-heading"
              className="mt-1 text-xl font-bold text-blue-100"
            >
              Publication run
            </h2>
          </div>
          <p className="rounded-full border border-blue-800 bg-blue-950/70 px-3 py-1 text-sm font-semibold text-blue-200">
            {getPublicationRange(data.firstIssueDate, data.lastIssueDate)}
          </p>
        </div>

        <div className="relative mt-5 grid gap-3 sm:grid-cols-2 sm:gap-5">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 hidden h-0.5 w-8 -translate-x-1/2 bg-blue-800 sm:block"
          />
          <PublicationDate
            label="First issue"
            value={data.firstIssueDate}
            markerClassName="bg-blue-500"
          />
          <PublicationDate
            label="Latest issue"
            value={data.lastIssueDate}
            markerClassName="bg-red-500"
          />
        </div>
      </section>
    </article>
  );
}

type PublicationDateProps = {
  label: string;
  markerClassName: string;
  value: string | undefined;
};

function PublicationDate({
  label,
  markerClassName,
  value,
}: PublicationDateProps) {
  return (
    <div className="relative rounded-lg border border-gray-700 bg-gray-950/80 p-4">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`size-2.5 rounded-full ${markerClassName}`}
        />
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          {label}
        </h3>
      </div>
      <p className="mt-2 text-lg font-semibold text-gray-100">
        {formatDate(value)}
      </p>
    </div>
  );
}

function formatDate(value: Date | string | undefined) {
  if (!value) return "Not available";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

function getPublicationRange(
  firstIssueDate: string | undefined,
  lastIssueDate: string | undefined,
) {
  const firstYear = getYear(firstIssueDate);
  const lastYear = getYear(lastIssueDate);

  if (!firstYear && !lastYear) return "Dates unavailable";
  if (!firstYear) return `Through ${lastYear}`;
  if (!lastYear) return `From ${firstYear}`;
  if (firstYear === lastYear) return firstYear;
  return `${firstYear}–${lastYear}`;
}

function getYear(value: string | undefined) {
  if (!value) return undefined;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : String(date.getFullYear());
}
