import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { ComicCreatorsInfoTableWrapper } from "./ComicCreatorsInfoTableWrapper";
import { useApiData } from "@/app/hooks/useApiData";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/hooks/useApiData", () => ({
  useApiData: jest.fn(),
}));

jest.mock("@/app/components/Spiner", () => ({
  Spinner: () => <div>Loading creators</div>,
}));

const mockedUseRouter = jest.mocked(useRouter);
const mockedUseApiData = jest.mocked(useApiData);
const push = jest.fn();
const router = {
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  push,
  replace: jest.fn(),
  prefetch: jest.fn(),
  bfcacheId: "test-router",
} satisfies ReturnType<typeof useRouter>;

describe("ComicCreatorsInfoTableWrapper", () => {
  beforeEach(() => {
    mockedUseRouter.mockReturnValue(router);
  });

  it("loads creators and navigates to the selected creator", async () => {
    const user = userEvent.setup();
    mockedUseApiData.mockReturnValue({
      data: {
        total: 1,
        limit: 20,
        offset: 0,
        has_next: false,
        items: [{ id: "creator-303", name: "Steve Ditko", issueCount: 64 }],
      },
      error: undefined,
      isValidating: false,
    } as ReturnType<typeof useApiData>);

    render(<ComicCreatorsInfoTableWrapper />);

    expect(mockedUseApiData).toHaveBeenCalledWith("/api/comic-creators", {
      keepPreviousData: true,
      fallbackData: undefined,
    });
    expect(
      screen.getByRole("heading", { name: "The Marvel comic creators" }),
    ).toBeInTheDocument();

    await user.click(screen.getByText("Steve Ditko"));

    expect(push).toHaveBeenCalledWith("/comic-creators/creator-303");
  });

  it("shows loading and error feedback without stale creator rows", () => {
    mockedUseApiData.mockReturnValue({
      data: {
        total: 1,
        limit: 20,
        offset: 0,
        has_next: false,
        items: [{ id: "stale-creator", name: "Stale Creator", issueCount: 1 }],
      },
      error: new Error("API unavailable"),
      isValidating: true,
    } as ReturnType<typeof useApiData>);

    render(<ComicCreatorsInfoTableWrapper />);

    expect(screen.getByText("Loading creators")).toBeInTheDocument();
    expect(screen.getByText("Failed to load")).toBeInTheDocument();
    expect(screen.queryByText("Stale Creator")).not.toBeInTheDocument();
  });
});
