import { NextRequest, NextResponse } from "next/server";
import { baseURL } from "@/app/lib/constants";
import { fetchData, getServerCacheKey, getTargetUrl } from "@/app/lib/helpers";
import type { PaginatedResponse } from "@/app/lib/type-definitions";

// Search issues by title.
export async function GET(req: NextRequest) {
  const targetBaseUrl = `${baseURL}/v1/search/issues`;
  const targetUrl = getTargetUrl(req.url, targetBaseUrl);
  const cacheKey = getServerCacheKey(req.url, targetBaseUrl);
  const { data, error, status } = await fetchData<
    PaginatedResponse<Record<string, unknown>>
  >(
    targetUrl,
    req.headers,
    cacheKey,
  );

  if (error) {
    return NextResponse.json({ message: error }, { status });
  }

  return NextResponse.json(data);
}
