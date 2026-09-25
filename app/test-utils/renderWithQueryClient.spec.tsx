import { screen } from "@testing-library/react";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { renderWithQueryClient } from "./renderWithQueryClient";

describe("renderWithQueryClient", () => {
  it("creates an isolated query client with test-safe defaults", () => {
    let observedClient: QueryClient | undefined;

    function Consumer() {
      observedClient = useQueryClient();
      return <div>Rendered with query client</div>;
    }

    const firstRender = renderWithQueryClient(<Consumer />);

    expect(screen.getByText("Rendered with query client")).toBeInTheDocument();
    expect(observedClient).toBe(firstRender.queryClient);
    expect(firstRender.queryClient.getDefaultOptions().queries).toMatchObject({
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      gcTime: Infinity,
    });

    firstRender.unmount();

    const secondRender = renderWithQueryClient(<div>Second render</div>);

    expect(secondRender.queryClient).not.toBe(firstRender.queryClient);
  });
});
