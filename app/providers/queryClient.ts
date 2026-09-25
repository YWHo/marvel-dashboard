import { QueryClient } from "@tanstack/react-query";

type CreateQueryClientOptions = {
  gcTime?: number;
};

export function createQueryClient({
  gcTime,
}: CreateQueryClientOptions = {}) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        ...(gcTime === undefined ? {} : { gcTime }),
      },
    },
  });
}
