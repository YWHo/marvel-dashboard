import { fetchApiData } from "./fetchApiData";

const mockedFetch = jest.fn();

describe("fetchApiData", () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, "fetch", {
      configurable: true,
      writable: true,
      value: mockedFetch,
    });
  });

  beforeEach(() => {
    mockedFetch.mockReset();
  });

  it("returns a successful JSON response", async () => {
    const payload = { id: "issue-101", title: "Amazing Fantasy #15" };
    const json = jest.fn().mockResolvedValue(payload);
    mockedFetch.mockResolvedValue({
      ok: true,
      json,
    } as unknown as Response);
    const signal = new AbortController().signal;

    await expect(
      fetchApiData<typeof payload>("/api/comic-issues/issue-101", { signal }),
    ).resolves.toEqual(payload);
    expect(mockedFetch).toHaveBeenCalledWith("/api/comic-issues/issue-101", {
      signal,
    });
    expect(json).toHaveBeenCalledTimes(1);
  });

  it("throws an error containing the upstream status", async () => {
    mockedFetch.mockResolvedValue({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
    } as Response);

    await expect(fetchApiData("/api/comic-issues")).rejects.toThrow(
      "Request failed with status 503: Service Unavailable",
    );
  });
});
