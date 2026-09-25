import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { fetchApiData } from "@/app/lib/api";

type ApiQueryOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey,
> = Omit<
  UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  "queryFn" | "queryKey"
> & {
  queryKey: TQueryKey;
  requestUrl: string;
};

export function useApiQuery<
  TQueryFnData,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>({
  queryKey,
  requestUrl,
  ...options
}: ApiQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...options,
    queryKey,
    queryFn: ({ signal }) => fetchApiData<TQueryFnData>(requestUrl, { signal }),
  });
}
