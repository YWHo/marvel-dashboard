import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const mockedUsePathname = jest.mocked(usePathname);

describe("Navbar", () => {
  it("renders links to all primary application routes", () => {
    mockedUsePathname.mockReturnValue("/");

    render(<Navbar />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Issues" })).toHaveAttribute(
      "href",
      "/comic-issues",
    );
    expect(screen.getByRole("link", { name: "Series" })).toHaveAttribute(
      "href",
      "/comic-series",
    );
    expect(screen.getByRole("link", { name: "Creators" })).toHaveAttribute(
      "href",
      "/comic-creators",
    );
  });

  it("marks only Home as active on the landing route", () => {
    mockedUsePathname.mockReturnValue("/");

    render(<Navbar />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Issues" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(screen.getByRole("link", { name: "Series" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(screen.getByRole("link", { name: "Creators" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it.each([
    { pathname: "/comic-issues", activeLabel: "Issues" },
    { pathname: "/comic-issues/issue-101", activeLabel: "Issues" },
    { pathname: "/comic-series", activeLabel: "Series" },
    { pathname: "/comic-series/series-202", activeLabel: "Series" },
    { pathname: "/comic-creators", activeLabel: "Creators" },
    { pathname: "/comic-creators/creator-303", activeLabel: "Creators" },
  ])(
    "marks $activeLabel as active for $pathname",
    ({ pathname, activeLabel }) => {
      mockedUsePathname.mockReturnValue(pathname);

      render(<Navbar />);

      const activeLink = screen.getByRole("link", { name: activeLabel });
      expect(activeLink).toHaveAttribute("aria-current", "page");
      expect(activeLink).toHaveClass("bg-red-600");

      const inactiveLinks = screen
        .getAllByRole("link")
        .filter((link) => link !== activeLink);
      inactiveLinks.forEach((link) => {
        expect(link).not.toHaveAttribute("aria-current");
        expect(link).not.toHaveClass("bg-red-600");
      });
    },
  );

  it("does not mark a navigation item active on an unrelated route", () => {
    mockedUsePathname.mockReturnValue("/heroes/character-404");

    render(<Navbar />);

    screen.getAllByRole("link").forEach((link) => {
      expect(link).not.toHaveAttribute("aria-current");
      expect(link).not.toHaveClass("bg-red-600");
    });
  });
});
