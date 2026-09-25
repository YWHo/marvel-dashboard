import {
  comicCreatorKeys,
  comicIssueKeys,
  comicSeriesKeys,
} from "./queryKeys";

describe("query keys", () => {
  it("builds comic creator keys", () => {
    expect(comicCreatorKeys.detail("creator-101")).toEqual([
      "comic-creators",
      "detail",
      "creator-101",
    ]);
    expect(comicCreatorKeys.issues("creator-101", { offset: 20 })).toEqual([
      "comic-creators",
      "detail",
      "creator-101",
      "issues",
      { offset: 20 },
    ]);
  });

  it("separates finite lists, infinite lists, and details", () => {
    expect(comicIssueKeys.list({ limit: 20 })).toEqual([
      "comic-issues",
      "list",
      { limit: 20 },
    ]);
    expect(comicIssueKeys.detail("issue-101")).toEqual([
      "comic-issues",
      "detail",
      "issue-101",
    ]);
    expect(
      comicIssueKeys.infinite({
        endpointMode: "search",
        searchText: "Spider Man",
        creatorId: "",
        seriesId: "",
        limit: 20,
      }),
    ).toEqual([
      "comic-issues",
      "infinite",
      {
        endpointMode: "search",
        searchText: "Spider Man",
        creatorId: "",
        seriesId: "",
        limit: 20,
      },
    ]);
  });

  it("builds comic series keys", () => {
    expect(comicSeriesKeys.list({ offset: 20 })).toEqual([
      "comic-series",
      "list",
      { offset: 20 },
    ]);
    expect(comicSeriesKeys.issues("series-101", { limit: 10 })).toEqual([
      "comic-series",
      "detail",
      "series-101",
      "issues",
      { limit: 10 },
    ]);
  });
});
