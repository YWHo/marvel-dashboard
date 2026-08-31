"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

export type ComicIssueItemType = {
  id: string;
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
    id: string;
    name: string;
    role: string;
  }[];
  cover: {
    path: string;
    extension: string;
  };
};

type ComicIssueItemDetailsProps = {
  className?: string;
  itemDetails: ComicIssueItemDetailsType;
};

export function ComicIssueItemDetails({
  className,
  itemDetails,
}: ComicIssueItemDetailsProps) {
  const imageUrl =
    itemDetails?.cover?.path && itemDetails?.cover?.extension
      ? `${itemDetails.cover.path}.${itemDetails.cover.extension}`
      : undefined;
  const creators = itemDetails.creators ?? [];

  const formatDate = (value: Date | string | undefined) => {
    if (!value) return "Not available";

    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "Not available"
      : date.toLocaleDateString(undefined, {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };

  return (
    <article
      className={clsx(
        "w-full max-w-5xl overflow-hidden rounded-2xl border border-blue-700/60 bg-gray-950 text-gray-100 shadow-2xl shadow-black/30",
        className,
      )}
    >
      <div className="h-1.5 bg-red-600" />

      <div className="grid gap-8 p-4 sm:p-6 lg:grid-cols-[minmax(240px,340px)_minmax(0,1fr)] lg:p-8">
        <div>
          <figure className="overflow-hidden rounded-xl border border-gray-700 bg-gray-900 shadow-xl">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`${itemDetails.title} cover`}
                width={680}
                height={1020}
                sizes="(max-width: 1024px) 90vw, 340px"
                className="aspect-2/3 w-full object-cover"
              />
            ) : (
              <div className="flex aspect-2/3 items-center justify-center bg-linear-to-br from-blue-950 to-gray-900 p-8 text-center text-gray-400">
                Cover image unavailable
              </div>
            )}
          </figure>

          <div className="mt-4 flex flex-wrap gap-2">
            <DetailBadge label="Issue" value={itemDetails.issueNumber} />
            <DetailBadge label="Pages" value={itemDetails.pageCount} />
            {itemDetails.yearPage && (
              <DetailBadge label="Year" value={itemDetails.yearPage} />
            )}
          </div>
        </div>

        <div className="min-w-0">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-red-500">
            Marvel comic issue
          </p>
          <h2 className="text-3xl font-extrabold leading-tight text-blue-100 sm:text-4xl">
            {itemDetails.title}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-400">
            {itemDetails.seriesName && (
              <Link
                href={`/comic-series/${itemDetails.seriesId}`}
                className="font-semibold text-blue-300 transition-colors hover:text-blue-100 hover:underline"
              >
                {itemDetails.seriesName}
              </Link>
            )}
            <span>Marvel ID: {itemDetails.id}</span>
          </div>

          <section className="mt-7">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
              Description
            </h3>
            <p className="mt-3 whitespace-pre-line leading-7 text-gray-200">
              {itemDetails.description?.trim() ||
                "No description is available for this issue."}
            </p>
          </section>

          <dl className="mt-8 grid grid-cols-1 overflow-hidden rounded-xl border border-gray-700 bg-gray-900/70 sm:grid-cols-2">
            <DetailField label="On sale" value={formatDate(itemDetails.onSaleDate)} />
            <DetailField
              label="Marvel Unlimited"
              value={formatDate(itemDetails.unlimitedDate)}
            />
            <DetailField label="Last modified" value={formatDate(itemDetails.modified)} />
            <DetailField
              label="Digital ID"
              value={itemDetails.digitalId || "Not available"}
            />
          </dl>

          {itemDetails.detailUrl && (
            <a
              href={itemDetails.detailUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center rounded-lg bg-red-600 px-5 py-3 font-bold text-white transition-colors hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
            >
              View on Marvel
              <span aria-hidden="true" className="ml-2">
                ↗
              </span>
            </a>
          )}
        </div>
      </div>

      <section className="border-t border-gray-800 bg-gray-900/60 p-4 sm:p-6 lg:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">
              Credits
            </p>
            <h3 className="mt-1 text-2xl font-bold text-blue-100">Creators</h3>
          </div>
          <span className="text-sm text-gray-400">
            {creators.length} {creators.length === 1 ? "creator" : "creators"}
          </span>
        </div>

        {creators.length > 0 ? (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {creators.map((creator) => (
              <li
                key={`${creator.id}-${creator.role}`}
                className="rounded-lg border border-gray-700 bg-gray-950/80 p-4"
              >
                <p className="font-semibold text-gray-100">{creator.name}</p>
                <p className="mt-1 text-sm capitalize text-blue-300">
                  {creator.role || "Contributor"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-400">Creator information is unavailable.</p>
        )}
      </section>
    </article>
  );
}

type DetailBadgeProps = {
  label: string;
  value: number | string;
};

function DetailBadge({ label, value }: DetailBadgeProps) {
  return (
    <span className="rounded-full border border-blue-700 bg-blue-950/80 px-3 py-1 text-xs font-semibold text-blue-100">
      {label}: {value || "N/A"}
    </span>
  );
}

type DetailFieldProps = {
  label: string;
  value: number | string;
};

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="border-b border-gray-800 p-4 last:border-b-0 sm:odd:border-r sm:nth-last-2:border-b-0">
      <dt className="text-xs font-bold uppercase tracking-wider text-gray-500">
        {label}
      </dt>
      <dd className="mt-1 font-medium text-gray-100">{value}</dd>
    </div>
  );
}
