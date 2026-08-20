import useSWR, { type SWRConfiguration, type SWRResponse } from "swr";

export const fetcher = async <Data>(url: string): Promise<Data> => {
  const response = await fetch(url);
  return response.json() as Promise<Data>;
};

export function useApiData<Data = any>(
  requestUrl: string,
  options?: SWRConfiguration<Data>,
): SWRResponse<Data> {
  return useSWR<Data>(requestUrl || null, fetcher, options);
}
