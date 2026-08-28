import { render, screen } from "@testing-library/react";
import { ComicCreatorDetails } from "./ComicCreatorDetails";
import { useApiData } from "@/app/hooks/useApiData";

jest.mock("@/app/hooks/useApiData", () => ({
  useApiData: jest.fn(),
}));

jest.mock("@/app/components/Spiner", () => ({
  Spinner: () => <div>Loading creator details</div>,
}));

const mockedUseApiData = jest.mocked(useApiData);

describe("ComicCreatorDetails", () => {
  it("renders creator details and roles", () => {
    mockedUseApiData.mockReturnValue({
      data: {
        id: "creator-123",
        name: "Stan Lee",
        roles: [
          { role: "writer", issueCount: "42" },
          { role: "editor", issueCount: "7" },
        ],
        totalIssues: 49,
      },
      error: undefined,
      isValidating: false,
    } as ReturnType<typeof useApiData>);

    render(<ComicCreatorDetails creatorId="creator-123" />);

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
    mockedUseApiData.mockReturnValue({
      data: undefined,
      error: new Error("API unavailable"),
      isValidating: false,
    } as ReturnType<typeof useApiData>);

    render(<ComicCreatorDetails creatorId="creator-123" />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to load this creator",
    );
  });
});
