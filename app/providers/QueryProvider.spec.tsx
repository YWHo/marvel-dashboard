import { render, screen } from "@testing-library/react";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { QueryProvider } from "./QueryProvider";

describe("QueryProvider", () => {
  it("renders children with the expected query defaults", () => {
    let queryClient: QueryClient | undefined;

    function Consumer() {
      queryClient = useQueryClient();
      return <div>Query context is available</div>;
    }

    render(
      <QueryProvider>
        <Consumer />
      </QueryProvider>,
    );

    expect(screen.getByText("Query context is available")).toBeInTheDocument();
    expect(queryClient?.getDefaultOptions().queries).toMatchObject({
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });
  });

  it("keeps the same query client when the provider rerenders", () => {
    const observedClients: QueryClient[] = [];

    function Consumer({ label }: { label: string }) {
      observedClients.push(useQueryClient());
      return <div>{label}</div>;
    }

    const { rerender } = render(
      <QueryProvider>
        <Consumer label="First render" />
      </QueryProvider>,
    );

    rerender(
      <QueryProvider>
        <Consumer label="Second render" />
      </QueryProvider>,
    );

    expect(screen.getByText("Second render")).toBeInTheDocument();
    expect(observedClients).toHaveLength(2);
    expect(observedClients[1]).toBe(observedClients[0]);
  });
});
