import { getCache, setCache } from "../cacheHelper";

export function getServerCacheKey(reqUrl: string, targetBaseUrl: string): string {
  const urlObject = new URL(targetBaseUrl);

  // Append incoming query parameters to the target URL
  const incomingSearchParams = new URL(reqUrl).searchParams;
  incomingSearchParams.forEach((value, key) => {
    urlObject.searchParams.append(key, value);
  });

  return urlObject.toString();
}

export function getTargetUrl(reqUrl: string, targetBaseUrl: string): string {
  const timeStamp = getTimestamp("iso");
  const urlObject = new URL(targetBaseUrl);

  // Append incoming query parameters to the target URL
  const incomingSearchParams = new URL(reqUrl).searchParams;
  incomingSearchParams.forEach((value, key) => {
    urlObject.searchParams.append(key, value);
  });

  // Add new query parameters
  urlObject.searchParams.append("ts", timeStamp as string);

  return urlObject.toString();
}

/**
 * Generates a timestamp in various formats.
 * @param format - The format of the timestamp ('unix', 'unix-seconds', 'iso', or 'locale').
 * @returns The current timestamp in the specified format.
 */
export function getTimestamp(
  format: "unix" | "unix-seconds" | "iso" | "locale" = "unix"
): string | number {
  const now = new Date();

  switch (format) {
    case "unix":
      return now.getTime(); // Unix timestamp in milliseconds
    case "unix-seconds":
      return Math.floor(now.getTime() / 1000); // Unix timestamp in seconds
    case "iso":
      return now.toISOString(); // ISO 8601 format
    case "locale":
      return now.toLocaleString(); // Locale string format
    default:
      throw new Error("Unsupported timestamp format");
  }
}

/**
 * Fetches data from the specified URL, handles caching, and manages errors.
 *
 * @param {string} url - The target URL to fetch data from.
 * @param {Headers} headers - Headers to forward with the fetch request.
 * @param {string} cacheKey - Unique key for caching the fetched data.
 * @returns {Promise<{ data?: any, error?: string, status?: number, isCached: boolean }>}
 *          Returns an object containing the fetched data, error message, status code, and caching status.
 */
type FetchDataResult<T> =
  | { data: T; error?: undefined; status?: undefined }
  | { data?: undefined; error: string; status: number };

export async function fetchData<T = unknown>(
  url: string,
  headers: Headers,
  cacheKey: string,
): Promise<FetchDataResult<T>> {
  const cachedData = getCache(cacheKey) as T | undefined;
  if (cachedData) {
    console.log(`\n+ Returning cached response for: "${cacheKey}"`);
    return { data: cachedData };
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers, // Forward headers from the original request
    });

    if (!response.ok) {
      return {
        error: `Error fetching data: ${response.statusText}`,
        status: response.status,
      };
    }

    const data = (await response.json()) as T;
    setCache(cacheKey, data); // Cache the data for future requests

    return { data };
  } catch (error) {
    return { error: (error as Error).message, status: 500 };
  }
}
