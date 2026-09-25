import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useApiQuery } from "@/app/hooks/useApiQuery";
import { characterKeys } from "@/app/lib/queryKeys";
import { RowDisplayType } from "@/app/lib/type-definitions";
import { InfoTable } from "./InfoTable";

jest.mock("@/app/hooks/useApiQuery", () => ({
  useApiQuery: jest.fn(),
}));

jest.mock("@/app/lib/helpers", () => ({
  mapToInfoList: () => [
    {
      id: 1009610,
      title: "Spider-Man",
      description: "Friendly neighbourhood hero",
      imageURL: "https://example.test/spider-man.jpg",
    },
  ],
}));

jest.mock("@/app/components/Spiner", () => ({
  Spinner: () => <div>Loading information</div>,
}));

const mockedUseApiQuery = jest.mocked(useApiQuery);

describe("InfoTable", () => {
  beforeEach(() => {
    mockedUseApiQuery.mockReturnValue({
      data: {
        data: {
          total: 25,
          results: [{ id: 1009610, name: "Spider-Man" }],
        },
      },
      error: null,
      isPending: false,
    } as unknown as ReturnType<typeof useApiQuery>);
  });

  it("includes pagination, sorting, and search values in the query key", async () => {
    const user = userEvent.setup();

    render(
      <InfoTable
        baseUrl="/api/characters"
        dataType={RowDisplayType.WITH_IMAGE}
        hasSearchBox
        hasSortButtons
        orderByType="name"
        searchByType="nameStartsWith"
      />,
    );

    expect(mockedUseApiQuery).toHaveBeenLastCalledWith({
      queryKey: characterKeys.resource("/api/characters", {
        limit: 10,
        offset: 0,
        orderBy: "name",
      }),
      requestUrl: "/api/characters?limit=10&offset=0&orderBy=name",
      enabled: true,
      initialData: undefined,
    });

    await user.type(screen.getByRole("searchbox", { name: "Search" }), "Spi");
    await user.click(screen.getByRole("button", { name: "Go" }));

    expect(mockedUseApiQuery).toHaveBeenLastCalledWith({
      queryKey: characterKeys.resource("/api/characters", {
        limit: 10,
        offset: 0,
        orderBy: "name",
        nameStartsWith: "Spi",
      }),
      requestUrl:
        "/api/characters?limit=10&offset=0&orderBy=name&nameStartsWith=Spi",
      enabled: true,
      initialData: undefined,
    });

    await user.click(screen.getByRole("button", { name: /Next.Page/ }));

    expect(mockedUseApiQuery).toHaveBeenLastCalledWith({
      queryKey: characterKeys.resource("/api/characters", {
        limit: 10,
        offset: 10,
        orderBy: "name",
        nameStartsWith: "Spi",
      }),
      requestUrl:
        "/api/characters?limit=10&offset=10&orderBy=name&nameStartsWith=Spi",
      enabled: true,
      initialData: undefined,
    });

    await user.click(screen.getByRole("button", { name: "Descending" }));

    expect(mockedUseApiQuery).toHaveBeenLastCalledWith({
      queryKey: characterKeys.resource("/api/characters", {
        limit: 10,
        offset: 0,
        orderBy: "-name",
        nameStartsWith: "Spi",
      }),
      requestUrl:
        "/api/characters?limit=10&offset=0&orderBy=-name&nameStartsWith=Spi",
      enabled: true,
      initialData: undefined,
    });

    await user.click(screen.getByRole("button", { name: /Next.Page/ }));
    await user.clear(screen.getByRole("searchbox", { name: "Search" }));

    expect(mockedUseApiQuery).toHaveBeenLastCalledWith({
      queryKey: characterKeys.resource("/api/characters", {
        limit: 10,
        offset: 0,
        orderBy: "-name",
      }),
      requestUrl: "/api/characters?limit=10&offset=0&orderBy=-name",
      enabled: true,
      initialData: undefined,
    });
  });

  it("disables the query and shows loading feedback appropriately", () => {
    mockedUseApiQuery.mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
    } as unknown as ReturnType<typeof useApiQuery>);

    const { rerender } = render(
      <InfoTable baseUrl="" dataType={RowDisplayType.SIMPLE} />,
    );

    expect(mockedUseApiQuery).toHaveBeenLastCalledWith({
      queryKey: characterKeys.resource("", { limit: 10, offset: 0 }),
      requestUrl: "",
      enabled: false,
      initialData: undefined,
    });
    expect(screen.getByText("Loading information")).toBeInTheDocument();

    mockedUseApiQuery.mockReturnValue({
      data: undefined,
      error: null,
      isPending: false,
    } as unknown as ReturnType<typeof useApiQuery>);
    rerender(<InfoTable baseUrl="" dataType={RowDisplayType.SIMPLE} />);

    expect(screen.getByText("(No data)")).toBeInTheDocument();
  });
});
