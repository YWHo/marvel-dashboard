import type { ReactElement } from "react";
import {
  QueryClientProvider,
  type QueryClient,
} from "@tanstack/react-query";
import {
  render,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";
import { createQueryClient } from "@/app/providers/queryClient";

type QueryRenderOptions = Omit<RenderOptions, "wrapper"> & {
  queryClient?: QueryClient;
};

type QueryRenderResult = RenderResult & {
  queryClient: QueryClient;
};

export function renderWithQueryClient(
  ui: ReactElement,
  { queryClient = createQueryClient({ gcTime: Infinity }), ...options }:
    QueryRenderOptions = {},
): QueryRenderResult {
  const result = render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    options,
  );

  return { ...result, queryClient };
}
