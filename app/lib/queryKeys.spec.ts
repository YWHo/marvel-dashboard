import {
  characterKeys,
  comicCreatorKeys,
  comicIssueKeys,
  comicSeriesKeys,
} from "./queryKeys";

describe("query keys", () => {
  it("builds character keys with every response parameter", () => {
    expect(characterKeys.list({ limit: 20, offset: 40 })).toEqual([
      "characters",
      "list",
      { limit: 20, offset: 40 },
    ]);
    expect(characterKeys.comics("character-101", { orderBy: "title" })).toEqual(
      [
        "characters",
        "detail",
        "character-101",
        "comics",
        { orderBy: "title" },
      ],
    );
    expect(
      characterKeys.resource("/api/characters/character-101/events", {
        limit: 10,
        offset: 20,
      }),
    ).toEqual([
      "characters",
      "resource",
      "/api/characters/character-101/events",
      { limit: 10, offset: 20 },
    ]);
  });

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

  it("separates issue lists, searches, and details", () => {
    expect(comicIssueKeys.list({ limit: 20 })).toEqual([
      "comic-issues",
      "list",
      { limit: 20 },
    ]);
    expect(comicIssueKeys.search({ query: "Spider Man" })).toEqual([
      "comic-issues",
      "search",
      { query: "Spider Man" },
    ]);
    expect(comicIssueKeys.detail("issue-101")).toEqual([
      "comic-issues",
      "detail",
      "issue-101",
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
