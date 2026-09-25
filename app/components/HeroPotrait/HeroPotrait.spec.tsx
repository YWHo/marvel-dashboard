import { render, screen } from "@testing-library/react";
import { useApiQuery } from "@/app/hooks/useApiQuery";
import { characterKeys } from "@/app/lib/queryKeys";
import { HeroPotrait } from "./HeroPotrait";

jest.mock("@/app/hooks/useApiQuery", () => ({
  useApiQuery: jest.fn(),
}));

jest.mock("@/app/lib/helpers", () => ({
  getImageURLFromThumbnail: (thumbnail?: {
    extension?: string;
    path?: string;
  }) =>
    thumbnail?.path && thumbnail.extension
      ? `${thumbnail.path}.${thumbnail.extension}`
      : "",
}));

const mockedUseApiQuery = jest.mocked(useApiQuery);

describe("HeroPotrait", () => {
  it("loads and renders the requested character", () => {
    mockedUseApiQuery.mockReturnValue({
      data: {
        data: {
          results: [
            {
              id: 1009610,
              name: "Spider-Man",
              thumbnail: {
                path: "https://example.test/spider-man",
                extension: "jpg",
              },
            },
          ],
        },
      },
      error: null,
      isPending: false,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<HeroPotrait id="1009610" />);

    expect(mockedUseApiQuery).toHaveBeenCalledWith({
      queryKey: characterKeys.detail("1009610"),
      requestUrl: "/api/characters/1009610",
    });
    expect(
      screen.getByRole("heading", { name: "Spider-Man" }),
    ).toBeInTheDocument();
    expect(
      screen
        .getByRole("img", { name: "Centered Landing Image" })
        .getAttribute("src"),
    ).toContain(encodeURIComponent("https://example.test/spider-man.jpg"));
  });

  it("renders loading and error states", () => {
    mockedUseApiQuery.mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
    } as unknown as ReturnType<typeof useApiQuery>);

    const { rerender } = render(<HeroPotrait id="1009610" />);

    expect(screen.getByText("loading...a Hero's Potrait")).toBeInTheDocument();

    mockedUseApiQuery.mockReturnValue({
      data: undefined,
      error: new Error("API unavailable"),
      isPending: false,
    } as unknown as ReturnType<typeof useApiQuery>);
    rerender(<HeroPotrait id="1009610" />);

    expect(screen.getByText("failed to get the Hero")).toBeInTheDocument();
  });
});
