export type QueryParameters = Readonly<
  Record<string, boolean | number | string | undefined>
>;

export const comicCreatorKeys = {
  all: ["comic-creators"] as const,
  lists: () => [...comicCreatorKeys.all, "list"] as const,
  list: (parameters: QueryParameters = {}) =>
    [...comicCreatorKeys.lists(), parameters] as const,
  details: () => [...comicCreatorKeys.all, "detail"] as const,
  detail: (creatorId: string) =>
    [...comicCreatorKeys.details(), creatorId] as const,
  issues: (creatorId: string, parameters: QueryParameters = {}) =>
    [...comicCreatorKeys.detail(creatorId), "issues", parameters] as const,
};

export const comicIssueKeys = {
  all: ["comic-issues"] as const,
  lists: () => [...comicIssueKeys.all, "list"] as const,
  list: (parameters: QueryParameters = {}) =>
    [...comicIssueKeys.lists(), parameters] as const,
  infinite: (parameters: QueryParameters) =>
    [...comicIssueKeys.all, "infinite", parameters] as const,
  details: () => [...comicIssueKeys.all, "detail"] as const,
  detail: (issueId: string) =>
    [...comicIssueKeys.details(), issueId] as const,
};

export const comicSeriesKeys = {
  all: ["comic-series"] as const,
  lists: () => [...comicSeriesKeys.all, "list"] as const,
  list: (parameters: QueryParameters = {}) =>
    [...comicSeriesKeys.lists(), parameters] as const,
  details: () => [...comicSeriesKeys.all, "detail"] as const,
  detail: (seriesId: string) =>
    [...comicSeriesKeys.details(), seriesId] as const,
  issues: (seriesId: string, parameters: QueryParameters = {}) =>
    [...comicSeriesKeys.detail(seriesId), "issues", parameters] as const,
};
