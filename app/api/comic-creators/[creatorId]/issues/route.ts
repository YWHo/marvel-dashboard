import { NextRequest, NextResponse } from "next/server";
import { baseURL } from "@/app/lib/constants";
import { fetchData, getServerCacheKey, getTargetUrl } from "@/app/lib/helpers";

type ReqParams = {
  params: Promise<{ creatorId: string }>;
};

// Get all issues by a creator.
export async function GET(req: NextRequest, { params }: ReqParams) {
  const { creatorId } = await params;
  const targetBaseUrl = `${baseURL}/v1/creators/${creatorId}/issues`;
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
