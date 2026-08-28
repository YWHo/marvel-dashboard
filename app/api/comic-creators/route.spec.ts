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

describe("GET /api/comic-creators", () => {
  beforeEach(() => {
    mockedGetTargetUrl.mockReturnValue("https://example.test/v1/creators");
    mockedGetServerCacheKey.mockReturnValue("comic-creators-cache-key");
  });

  it("returns the creator list payload", async () => {
    const payload = {
      total: faker.number.int({ min: 2, max: 500 }),
      limit: 20,
      offset: 0,
      has_next: faker.datatype.boolean(),
      items: Array.from({ length: 2 }, () => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        issueCount: faker.number.int({ min: 0, max: 500 }),
      })),
    };
    mockedFetchData.mockResolvedValue({ data: payload });
    const request = new NextRequest(
      "http://localhost/api/comic-creators?limit=20&offset=0",
    );

    const response = await GET(request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(payload);
    expect(mockedGetTargetUrl).toHaveBeenCalledWith(
      request.url,
      expect.stringContaining("/v1/creators"),
    );
    expect(mockedFetchData).toHaveBeenCalledWith(
      "https://example.test/v1/creators",
      request.headers,
      "comic-creators-cache-key",
    );
  });

  it("forwards upstream API errors", async () => {
    const status = faker.helpers.arrayElement([502, 503, 504]);
    const error = faker.lorem.sentence();
    mockedFetchData.mockResolvedValue({ error, status });

    const response = await GET(
      new NextRequest("http://localhost/api/comic-creators"),
    );

    expect(response.status).toBe(status);
    await expect(response.json()).resolves.toEqual({ message: error });
  });
});
