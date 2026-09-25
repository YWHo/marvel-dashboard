"use client";

type PaginationControlsProps = {
  hasNextPage: boolean;
  isFetching: boolean;
  itemCount: number;
  limit: number;
  offset: number;
  onPageChange: (offset: number) => void;
  total: number;
};

export function PaginationControls({
  hasNextPage,
  isFetching,
  itemCount,
  limit,
  offset,
  onPageChange,
  total,
}: PaginationControlsProps) {
  const hasPreviousPage = offset > 0;
  const firstItem = itemCount > 0 ? offset + 1 : 0;
  const lastItem = itemCount > 0 ? offset + itemCount : 0;

  return (
    <nav
      aria-label="Pagination"
      className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
    >
      <button
        type="button"
        disabled={isFetching || !hasPreviousPage}
        onClick={() => onPageChange(Math.max(0, offset - limit))}
        className="min-w-32 rounded-lg border border-blue-400/60 bg-blue-900 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 disabled:cursor-not-allowed disabled:border-gray-700 disabled:bg-gray-800 disabled:text-gray-500"
      >
        Previous
      </button>
      <p aria-live="polite" className="min-w-44 text-center text-sm text-gray-300">
        {isFetching
          ? "Loading page…"
          : `Showing ${firstItem}–${lastItem} of ${total}`}
      </p>
      <button
        type="button"
        disabled={isFetching || !hasNextPage}
        onClick={() => onPageChange(offset + limit)}
        className="min-w-32 rounded-lg border border-blue-400/60 bg-blue-900 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 disabled:cursor-not-allowed disabled:border-gray-700 disabled:bg-gray-800 disabled:text-gray-500"
      >
        Next
      </button>
    </nav>
  );
}
