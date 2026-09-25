/** @jest-environment node */

import { faker } from "@faker-js/faker";
import { NextRequest } from "next/server";
import { GET } from "./route";
import {
  fetchData,
  getServerCacheKey,
  getTargetUrl,
} from "@/app/lib/helpers";

jest.mock("@/app/lib/helpers", () => ({
  fetchData: jest.fn(),
  getServerCacheKey: jest.fn(),
  getTargetUrl: jest.fn(),
}));

const mockedFetchData = jest.mocked(fetchData);
const mockedGetServerCacheKey = jest.mocked(getServerCacheKey);
const mockedGetTargetUrl = jest.mocked(getTargetUrl);

describe("GET /api/comic-series", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetTargetUrl.mockReturnValue("https://example.test/v1/series");
    mockedGetServerCacheKey.mockReturnValue("comic-series-cache-key");
  });

  it.each([
    { page: "first", limit: 10, offset: 0, total: 25, hasNext: true },
    { page: "middle", limit: 10, offset: 10, total: 25, hasNext: true },
    { page: "final", limit: 10, offset: 20, total: 25, hasNext: false },
  ])("returns the $page series page", async ({ limit, offset, total, hasNext }) => {
    const payload = {
      total,
      limit,
      offset,
      has_next: hasNext,
      items: Array.from({ length: 2 }, () => ({
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        issueCount: faker.number.int({ min: 1, max: 100 }),
      })),
    };
    mockedFetchData.mockResolvedValue({ data: payload });

    const request = new NextRequest(
      `http://localhost/api/comic-series?limit=${limit}&offset=${offset}&orderBy=name`,
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(payload);
    expect(mockedGetTargetUrl).toHaveBeenCalledWith(
      request.url,
      expect.stringContaining("/v1/series"),
    );
    expect(mockedGetServerCacheKey).toHaveBeenCalledWith(
      request.url,
      expect.stringContaining("/v1/series"),
    );
    expect(mockedFetchData).toHaveBeenCalledWith(
      "https://example.test/v1/series",
      request.headers,
      "comic-series-cache-key",
    );
  });

  it("forwards upstream API errors", async () => {
    const status = faker.helpers.arrayElement([502, 503, 504]);
    const error = faker.lorem.sentence();
    mockedFetchData.mockResolvedValue({ error, status });

    const response = await GET(
      new NextRequest("http://localhost/api/comic-series"),
    );

    expect(response.status).toBe(status);
    await expect(response.json()).resolves.toEqual({ message: error });
  });
});
