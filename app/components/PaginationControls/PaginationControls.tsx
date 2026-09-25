"use client";

import clsx from "clsx";

type PaginationControlsProps = {
  className?: string;
  hasNextPage: boolean;
  isFetching: boolean;
  isUnavailable?: boolean;
  itemCount: number;
  limit: number;
  offset: number;
  onPageChange: (offset: number) => void;
  total: number;
};

export function PaginationControls({
  className,
  hasNextPage,
  isFetching,
  isUnavailable = false,
  itemCount,
  limit,
  offset,
  onPageChange,
  total,
}: PaginationControlsProps) {
  const hasPreviousPage = offset > 0;
  const firstItem = itemCount > 0 ? offset + 1 : 0;
  const lastItem = itemCount > 0 ? offset + itemCount : 0;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <nav
      aria-label="Pagination"
      className={clsx(
        "grid w-full max-w-xl grid-cols-2 items-center gap-2 sm:flex sm:justify-center sm:gap-3",
        className,
      )}
    >
      <button
        type="button"
        disabled={isFetching || isUnavailable || !hasPreviousPage}
        onClick={() => onPageChange(Math.max(0, offset - limit))}
        className="col-start-1 row-start-2 min-w-0 rounded-lg border border-blue-400/60 bg-blue-900 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 disabled:cursor-not-allowed disabled:border-gray-700 disabled:bg-gray-800 disabled:text-gray-500 sm:order-1 sm:min-w-32"
      >
        Previous
      </button>
      <p
        aria-live="polite"
        className="col-span-2 col-start-1 row-start-1 text-center text-sm text-gray-300 sm:order-2 sm:min-w-56"
      >
        {isFetching
          ? "Loading page…"
          : isUnavailable
            ? "Pagination unavailable"
            : `Page ${currentPage} of ${totalPages} · ${firstItem}–${lastItem} of ${total}`}
      </p>
      <button
        type="button"
        disabled={isFetching || isUnavailable || !hasNextPage}
        onClick={() => onPageChange(offset + limit)}
        className="col-start-2 row-start-2 min-w-0 rounded-lg border border-blue-400/60 bg-blue-900 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 disabled:cursor-not-allowed disabled:border-gray-700 disabled:bg-gray-800 disabled:text-gray-500 sm:order-3 sm:min-w-32"
      >
        Next
      </button>
    </nav>
  );
}
