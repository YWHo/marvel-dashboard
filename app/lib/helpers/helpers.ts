import { createHash } from "crypto";
import parseHtml from "html-react-parser";
import { InfoList, MarvelResponseDataResultType, MarvelResponseDataResultThumbnailType } from "@/app/lib/type-definitions";
import { getCache, setCache } from "../cacheHelper";

export function mapToInfoList(items: MarvelResponseDataResultType[]): InfoList {
  if (!items) return [];
  return Array.from(items).map((item) => {
    let description = "";
    if (typeof item.description == "string" && item.description.length > 0) {
      description = item.description;
    } else if (
      Array.isArray(item.textObjects) &&
      item.textObjects?.length > 0 &&
      typeof item.textObjects[0] == "object" &&
      typeof item.textObjects[0].text == "string" &&
      item.textObjects[0].text.length > 0
    ) {
      description = parseHtml(item.textObjects?.[0]?.text) as string;
    }
    const imageURL = getImageURLFromThumbnail(item.thumbnail);

    return {
      id: item.id,
      title: item?.name? item.name : item.title || "",
      description: description,
      imageURL: imageURL,
    };
  });
}

type ThumbnailProps = MarvelResponseDataResultThumbnailType | null | undefined;

export function getImageURLFromThumbnail(thumbnail: ThumbnailProps) {
  if (thumbnail && typeof thumbnail == "object") {
    if (
      typeof thumbnail.path == "string" &&
      typeof thumbnail.extension == "string"
    ) {
      return `${thumbnail.path}.${thumbnail.extension}`;
    }
  }
  return "";
}

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
  // const apiKeyPublic = process.env.MARVEL_ACCESS_PUBLIC_KEY;
  // const apiKeyPrivate = process.env.MARVEL_ACCESS_PRIVATE_KEY;
  const timeStamp = getTimestamp("iso");
  // const hash = generateMD5(`${timeStamp}`);
  const urlObject = new URL(targetBaseUrl);

  // Append incoming query parameters to the target URL
  const incomingSearchParams = new URL(reqUrl).searchParams;
  incomingSearchParams.forEach((value, key) => {
    urlObject.searchParams.append(key, value);
  });

  // Add new query parameters
  urlObject.searchParams.append("ts", timeStamp as string);
  // urlObject.searchParams.append("apikey", apiKeyPublic as string);
  // urlObject.searchParams.append("hash", hash);

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
 * Generates an MD5 hash for the given input.
 * @param input - The input string to hash.
 * @returns The MD5 hash as a hexadecimal string.
 */
export function generateMD5(input: string): string {
  return createHash("md5").update(input).digest("hex");
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
export async function fetchData(
  url: string,
  headers: Headers,
  cacheKey: string
) {
  const cachedData = getCache(cacheKey);
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

    const data = await response.json();
    setCache(cacheKey, data); // Cache the data for future requests

    return { data };
  } catch (error) {
    return { error: (error as Error).message, status: 500 };
  }
}
