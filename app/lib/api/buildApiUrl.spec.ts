import { buildApiUrl } from "./buildApiUrl";

describe("buildApiUrl", () => {
  it("adds encoded query parameters to a relative API URL", () => {
    expect(
      buildApiUrl("/api/comic-issues", {
        limit: 20,
        offset: 0,
        q: "Spider Man",
      }),
    ).toBe("/api/comic-issues?limit=20&offset=0&q=Spider+Man");
  });

  it("updates pagination without dropping existing filters or ordering", () => {
    expect(
      buildApiUrl(
        "/api/comic-issues?limit=20&offset=0&q=Thor&orderBy=-title",
        { offset: 20 },
      ),
    ).toBe(
      "/api/comic-issues?limit=20&offset=20&q=Thor&orderBy=-title",
    );
  });

  it("removes cleared parameters while preserving the remaining query", () => {
    expect(
      buildApiUrl("/api/comic-issues?limit=20&offset=40&q=Thor", {
        offset: 0,
        q: "",
      }),
    ).toBe("/api/comic-issues?limit=20&offset=0");
  });
});
