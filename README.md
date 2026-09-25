# Marvel Dashboard

A Next.js dashboard for browsing Marvel comic issues, series, and creators.

Live site: [marvel-dashboard-ten.vercel.app](https://marvel-dashboard-ten.vercel.app/)

## Architecture

- Next.js App Router renders pages and local API proxy routes under `app/api/`.
- Client Components request only local `/api/...` URLs.
- Server route handlers proxy the unauthenticated upstream API at `https://marvel.emreparker.com`.
- TanStack Query manages client-side server state through one app-level `QueryClientProvider`.
- Storybook uses isolated query clients and MSW handlers; Playwright mocks the local API boundary.

## Query and Retry Policy

Query-key factories in `app/lib/queryKeys.ts` separate characters, creators, issues, and series. Keys include every input that can change a response, including resource URL, IDs, endpoint mode, search text, sort direction, limit, and offset where applicable. Keys never contain credentials.

The shared query client disables automatic retries, focus refetches, and reconnect refetches. Errors therefore remain visible until the user retries or another explicit request is made.

## Pagination and Infinite Scrolling

Paginated list endpoints use this shared contract:

```ts
type PaginatedResponse<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  has_next: boolean;
};
```

- Creator and series lists use explicit Previous/Next controls and retain existing rows while the next page loads.
- The top-level issue list uses `useInfiniteQuery`, starting at offset `0` and deriving the next offset from `lastPage.offset + lastPage.limit`.
- Issue pages are flattened and deduplicated by issue ID.
- Search uses a distinct query key and restarts at offset `0`; clearing search returns to `/api/comic-issues`.
- An Intersection Observer sentinel requests the next page only when `hasNextPage && !isFetchingNextPage`.
- The observer disconnects after intersection, on unmount, and when no next page remains.
- Browsers without Intersection Observer receive a visible Load More fallback.

## Why TanStack Query

The project migrated from SWR because TanStack Query provides a first-class `useInfiniteQuery` model, structured query keys, explicit pagination state, and clear separation between initial and next-page failures. This reduces manual page accumulation and cache coordination.

The tradeoff is a larger API surface and an application provider. SWR would remain a good smaller choice for simple request-and-cache screens, but TanStack Query better demonstrates pagination, retry control, and infinite server-state workflows in this project.

## Upstream Data

The official Marvel API is no longer available. This project uses the unofficial [Marvel Comics API](https://marvel.emreparker.com), whose source is available at [emreparker/marvel-comics](https://github.com/emreparker/marvel-comics). No API credentials are required.

## Local Development

Requirements: pnpm and a current Node.js release.

```sh
git clone https://github.com/YWHo/marvel-dashboard.git
cd marvel-dashboard
pnpm install --frozen-lockfile
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```sh
pnpm build
pnpm start
```

## Quality Checks

```sh
pnpm test
pnpm test:coverage
pnpm storybook:build
pnpm test:e2e
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```
