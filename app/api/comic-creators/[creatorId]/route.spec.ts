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

describe("GET /api/comic-creators/[creatorId]", () => {
  const creatorId = faker.string.uuid();
  const targetUrl = `https://example.test/v1/creators/${creatorId}`;

  beforeEach(() => {
    mockedGetTargetUrl.mockReturnValue(targetUrl);
    mockedGetServerCacheKey.mockReturnValue("comic-creator-cache-key");
  });

  it("returns creator details", async () => {
    const payload = {
      id: creatorId,
      name: faker.person.fullName(),
      roles: Array.from({ length: 2 }, () => ({
        role: faker.helpers.arrayElement(["writer", "artist", "editor"]),
        issueCount: faker.number.int({ min: 1, max: 200 }).toString(),
      })),
      totalIssues: faker.number.int({ min: 2, max: 500 }),
    };
    mockedFetchData.mockResolvedValue({ data: payload });
    const request = new NextRequest(
      `http://localhost/api/comic-creators/${creatorId}`,
    );

    const response = await GET(request, {
      params: Promise.resolve({ creatorId }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(payload);
    expect(mockedGetTargetUrl).toHaveBeenCalledWith(
      request.url,
      expect.stringContaining(`/v1/creators/${creatorId}`),
    );
    expect(mockedFetchData).toHaveBeenCalledWith(
      targetUrl,
      request.headers,
      "comic-creator-cache-key",
    );
  });

  it("forwards upstream API errors", async () => {
    const status = faker.helpers.arrayElement([404, 502, 503]);
    const error = faker.lorem.sentence();
    mockedFetchData.mockResolvedValue({ error, status });
    const request = new NextRequest(
      `http://localhost/api/comic-creators/${creatorId}`,
    );

    const response = await GET(request, {
      params: Promise.resolve({ creatorId }),
    });

    expect(response.status).toBe(status);
    await expect(response.json()).resolves.toEqual({ message: error });
  });
});
