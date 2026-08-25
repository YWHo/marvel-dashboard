import useSWR, { type SWRConfiguration, type SWRResponse } from "swr";

export const fetcher = async <Data>(url: string): Promise<Data> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}: ${response.statusText}`,
    );
  }

  return response.json() as Promise<Data>;
};

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
