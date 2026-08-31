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

describe("GET /api/comic-series/[seriesId]", () => {
  const seriesId = faker.string.uuid();
  const targetUrl = `https://example.test/v1/series/${seriesId}`;

  beforeEach(() => {
    mockedGetTargetUrl.mockReturnValue(targetUrl);
    mockedGetServerCacheKey.mockReturnValue("comic-series-detail-cache-key");
  });

  it("returns comic-series details", async () => {
    const firstIssueDate = faker.date.past({ years: 20 });
    const payload = {
      seriesId,
      seriesName: faker.commerce.productName(),
      issueCount: faker.number.int({ min: 1, max: 1000 }),
      firstIssueDate: firstIssueDate.toISOString(),
      lastIssueDate: faker.date
        .between({ from: firstIssueDate, to: new Date() })
        .toISOString(),
    };
    mockedFetchData.mockResolvedValue({ data: payload });
    const request = new NextRequest(
      `http://localhost/api/comic-series/${seriesId}`,
    );

    const response = await GET(request, {
      params: Promise.resolve({ seriesId }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(payload);
    expect(mockedGetTargetUrl).toHaveBeenCalledWith(
      request.url,
      expect.stringContaining(`/v1/series/${seriesId}`),
    );
    expect(mockedFetchData).toHaveBeenCalledWith(
      targetUrl,
      request.headers,
      "comic-series-detail-cache-key",
    );
  });

  it("forwards upstream API errors", async () => {
    const status = faker.helpers.arrayElement([404, 502, 503]);
    const error = faker.lorem.sentence();
    mockedFetchData.mockResolvedValue({ error, status });
    const request = new NextRequest(
      `http://localhost/api/comic-series/${seriesId}`,
    );

    const response = await GET(request, {
      params: Promise.resolve({ seriesId }),
    });

    expect(response.status).toBe(status);
    await expect(response.json()).resolves.toEqual({ message: error });
  });
});
