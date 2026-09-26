import { getServerCacheKey, getTargetUrl } from "./helpers";

describe("API proxy URL helpers", () => {
  const requestUrl =
    "http://localhost/api/comic-issues/search?limit=20&offset=40&q=Spider%20Man&orderBy=-title";
  const targetBaseUrl = "https://example.test/v1/search/issues";

  it.each([
    ["target URL", () => getTargetUrl(requestUrl, targetBaseUrl)],
    ["cache key", () => getServerCacheKey(requestUrl, targetBaseUrl)],
  ])("preserves pagination, search, and ordering in the %s", (_label, buildUrl) => {
    const result = new URL(buildUrl());

    expect(result.origin + result.pathname).toBe(targetBaseUrl);
    expect(result.searchParams.get("limit")).toBe("20");
    expect(result.searchParams.get("offset")).toBe("40");
    expect(result.searchParams.get("q")).toBe("Spider Man");
    expect(result.searchParams.get("orderBy")).toBe("-title");
  });
});
