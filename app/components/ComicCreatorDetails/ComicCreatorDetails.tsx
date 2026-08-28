"use client";

import { Spinner } from "@/app/components/Spiner";
import { useApiData } from "@/app/hooks/useApiData";

type ComicCreatorDetailsApiType = {
  id: string;
  name: string;
  roles: {
    role: string;
    issueCount: string;
  }[];
  totalIssues: number;
};

type ComicCreatorDetailsProps = {
  creatorId: string;
};

export function ComicCreatorDetails({ creatorId }: ComicCreatorDetailsProps) {
  const requestUrl = `/api/comic-creators/${creatorId}`;
  const { data, error, isValidating } = useApiData<ComicCreatorDetailsApiType>(
    requestUrl,
    {
      keepPreviousData: true,
      fallbackData: undefined,
    },
  );

  const roles = data?.roles && !error ? data.roles : [];

  if (isValidating) {
    return (
      <div className="mx-auto mt-14 flex min-h-48 w-full items-center justify-center rounded-xl border border-gray-700 bg-gray-900 sm:w-150 md:w-175 lg:w-225">
        <span className="sr-only">Loading creator details</span>
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
        Failed to load this creator. Please try again later.
      </div>
    );
  }

  if (!data?.id || !data.name) {
    return (
      <div className="mx-auto mt-14 w-full rounded-xl border border-gray-700 bg-gray-900 p-6 text-center text-gray-300 sm:w-150 md:w-175 lg:w-225">
        No creator details are available.
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
            className="flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-950 text-2xl font-black text-blue-100 shadow-lg"
          >
            {getInitials(data.name)}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
              Marvel creator
            </p>
            <h1 className="mt-1 wrap-break-word text-2xl font-extrabold leading-tight text-blue-100 sm:text-3xl">
              {data.name}
            </h1>
            <p className="mt-1 text-sm text-gray-400">Creator ID: {data.id}</p>
          </div>
        </div>

        <div className="shrink-0 rounded-lg border border-blue-800 bg-blue-950/70 px-5 py-3 sm:text-right">
          <p className="text-3xl font-black text-white">
            {data.totalIssues.toLocaleString()}
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
            Total issues
          </p>
        </div>
      </header>

      <section
        aria-labelledby="creator-roles-heading"
        className="border-t border-gray-800 bg-gray-900/70 p-5 sm:p-7"
      >
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
              Contributions
            </p>
            <h2
              id="creator-roles-heading"
              className="mt-1 text-xl font-bold text-blue-100"
            >
              Roles and credits
            </h2>
          </div>
          <p className="text-sm text-gray-400">
            {roles.length} {roles.length === 1 ? "role" : "roles"}
          </p>
        </div>

        {roles.length > 0 ? (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((item) => (
              <li
                key={`${data.name}_${item.role}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-gray-700 bg-gray-950/80 p-4 transition-colors hover:border-blue-700"
              >
                <span className="font-semibold capitalize text-gray-100">
                  {item.role || "Contributor"}
                </span>
                <span className="rounded-full bg-blue-950 px-2.5 py-1 text-xs font-bold text-blue-200">
                  {formatIssueCount(item.issueCount)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-lg border border-gray-700 bg-gray-950/60 p-4 text-gray-400">
            Role information is unavailable for this creator.
          </p>
        )}
      </section>
    </article>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatIssueCount(issueCount: string) {
  const count = Number(issueCount);

  if (!Number.isFinite(count)) return issueCount || "0";
  return `${count.toLocaleString()} ${count === 1 ? "issue" : "issues"}`;
}
