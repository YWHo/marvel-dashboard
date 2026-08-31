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

describe("GET /api/comic-issues", () => {
  beforeEach(() => {
    mockedGetTargetUrl.mockReturnValue("https://example.test/v1/issues");
    mockedGetServerCacheKey.mockReturnValue("comic-issues-cache-key");
  });

  it("returns the comic-issue list payload", async () => {
    const payload = {
      total: faker.number.int({ min: 2, max: 500 }),
      limit: 20,
      offset: 0,
      has_next: faker.datatype.boolean(),
      items: Array.from({ length: 2 }, () => ({
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        issueNumber: faker.number.int({ min: 1, max: 100 }).toString(),
        detailUrl: faker.internet.url(),
        seriesId: faker.number.int({ min: 1, max: 10000 }),
        seriesName: faker.commerce.productName(),
        onSaleDate: faker.date.past().toISOString(),
        unlimitedDate: faker.date.recent().toISOString(),
        yearPage: faker.date.past().getFullYear().toString(),
      })),
    };
    mockedFetchData.mockResolvedValue({ data: payload });
    const request = new NextRequest(
      "http://localhost/api/comic-issues?limit=20&offset=0",
    );

    const response = await GET(request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(payload);
    expect(mockedGetTargetUrl).toHaveBeenCalledWith(
      request.url,
      expect.stringContaining("/v1/issues"),
    );
    expect(mockedFetchData).toHaveBeenCalledWith(
      "https://example.test/v1/issues",
      request.headers,
      "comic-issues-cache-key",
    );
  });

  it("forwards upstream API errors", async () => {
    const status = faker.helpers.arrayElement([502, 503, 504]);
    const error = faker.lorem.sentence();
    mockedFetchData.mockResolvedValue({ error, status });

    const response = await GET(
      new NextRequest("http://localhost/api/comic-issues"),
    );

    expect(response.status).toBe(status);
    await expect(response.json()).resolves.toEqual({ message: error });
  });
});
