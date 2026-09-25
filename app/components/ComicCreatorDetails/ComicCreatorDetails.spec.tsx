import { render, screen } from "@testing-library/react";
import { ComicCreatorDetails } from "./ComicCreatorDetails";
import { useApiQuery } from "@/app/hooks/useApiQuery";
import { comicCreatorKeys } from "@/app/lib/queryKeys";

jest.mock("@/app/hooks/useApiQuery", () => ({
  useApiQuery: jest.fn(),
}));

jest.mock("@/app/components/Spiner", () => ({
  Spinner: () => <div>Loading creator details</div>,
}));

const mockedUseApiQuery = jest.mocked(useApiQuery);

describe("ComicCreatorDetails", () => {
  it("renders creator details and roles", () => {
    mockedUseApiQuery.mockReturnValue({
      data: {
        id: "creator-123",
        name: "Stan Lee",
        roles: [
          { role: "writer", issueCount: "42" },
          { role: "editor", issueCount: "7" },
        ],
        totalIssues: 49,
      },
      error: null,
      isPending: false,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicCreatorDetails creatorId="creator-123" />);

    expect(mockedUseApiQuery).toHaveBeenCalledWith({
      queryKey: comicCreatorKeys.detail("creator-123"),
      requestUrl: "/api/comic-creators/creator-123",
    });
    expect(
      screen.getByRole("heading", { name: "Stan Lee" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Creator ID: creator-123")).toBeInTheDocument();
    expect(screen.getByText("49")).toBeInTheDocument();
    expect(screen.getByText("writer")).toBeInTheDocument();
    expect(screen.getByText("42 issues")).toBeInTheDocument();
    expect(screen.getByText("editor")).toBeInTheDocument();
    expect(screen.getByText("7 issues")).toBeInTheDocument();
  });

  it("renders an error state", () => {
    mockedUseApiQuery.mockReturnValue({
      data: undefined,
      error: new Error("API unavailable"),
      isPending: false,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicCreatorDetails creatorId="creator-123" />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to load this creator",
    );
  });

  it("renders the loading state", () => {
    mockedUseApiQuery.mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
    } as unknown as ReturnType<typeof useApiQuery>);

    render(<ComicCreatorDetails creatorId="creator-123" />);

    expect(screen.getAllByText("Loading creator details")).toHaveLength(2);
  });
});
