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

describe("GET /api/comic-issues/[issueId]", () => {
  const issueId = faker.string.uuid();
  const targetUrl = `https://example.test/v1/issues/${issueId}`;

  beforeEach(() => {
    mockedGetTargetUrl.mockReturnValue(targetUrl);
    mockedGetServerCacheKey.mockReturnValue("comic-issue-cache-key");
  });

  it("returns comic-issue details", async () => {
    const payload = {
      id: issueId,
      title: faker.commerce.productName(),
      issueNumber: faker.number.int({ min: 1, max: 100 }).toString(),
      detailUrl: faker.internet.url(),
      seriesId: faker.number.int({ min: 1, max: 10000 }),
      seriesName: faker.commerce.productName(),
      onSaleDate: faker.date.past().toISOString(),
      unlimitedDate: faker.date.recent().toISOString(),
      yearPage: faker.date.past().getFullYear().toString(),
      digitalId: faker.number.int({ min: 1, max: 100000 }),
      description: faker.lorem.paragraph(),
      modified: faker.date.recent().toISOString(),
      pageCount: faker.number.int({ min: 20, max: 80 }),
      creators: Array.from({ length: 2 }, () => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        role: faker.helpers.arrayElement(["writer", "penciller", "editor"]),
      })),
      cover: {
        path: faker.image.url(),
        extension: faker.helpers.arrayElement(["jpg", "png"]),
      },
    };
    mockedFetchData.mockResolvedValue({ data: payload });
    const request = new NextRequest(
      `http://localhost/api/comic-issues/${issueId}`,
    );

    const response = await GET(request, {
      params: Promise.resolve({ issueId }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(payload);
    expect(mockedGetTargetUrl).toHaveBeenCalledWith(
      request.url,
      expect.stringContaining(`/v1/issues/${issueId}`),
    );
    expect(mockedFetchData).toHaveBeenCalledWith(
      targetUrl,
      request.headers,
      "comic-issue-cache-key",
    );
  });

  it("forwards upstream API errors", async () => {
    const status = faker.helpers.arrayElement([404, 502, 503]);
    const error = faker.lorem.sentence();
    mockedFetchData.mockResolvedValue({ error, status });
    const request = new NextRequest(
      `http://localhost/api/comic-issues/${issueId}`,
    );

    const response = await GET(request, {
      params: Promise.resolve({ issueId }),
    });

    expect(response.status).toBe(status);
    await expect(response.json()).resolves.toEqual({ message: error });
  });
});
