import { NextRequest, NextResponse } from "next/server";
import { baseURL } from "@/app/lib/constants";
import { fetchData, getServerCacheKey, getTargetUrl } from "@/app/lib/helpers";

type ReqParams = {
  params: Promise<{ seriesId: string }>;
};

// GET the details of a series
export async function GET(req: NextRequest, { params }: ReqParams) {
  const { seriesId } = await params;
  const targetBaseUrl = `${baseURL}/v1/series/${seriesId}`;
  const targetUrl = getTargetUrl(req.url, targetBaseUrl);
  const cacheKey = getServerCacheKey(req.url, targetBaseUrl);
  const { data, error, status } = await fetchData(
    targetUrl,
    req.headers,
    cacheKey,
  );

  if (error) {
    return NextResponse.json({ message: error }, { status });
  }

  return NextResponse.json(data);
}
