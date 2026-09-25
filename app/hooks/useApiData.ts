import useSWR, { type SWRConfiguration, type SWRResponse } from "swr";
import { fetchApiData } from "@/app/lib/api";

export const fetcher = fetchApiData;

export function useApiData<Data = any>(
  requestUrl: string,
  options?: SWRConfiguration<Data>,
): SWRResponse<Data> {
  return useSWR<Data>(requestUrl || null, fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    ...options,
  });
}
