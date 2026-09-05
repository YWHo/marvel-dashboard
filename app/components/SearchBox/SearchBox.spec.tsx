import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBox } from "./SearchBox";

describe("SearchBox", () => {
  it("disables searching until a non-whitespace character is entered", async () => {
    const user = userEvent.setup();

    render(<SearchBox onSearchCallback={jest.fn()} />);

    const searchButton = screen.getByRole("button", { name: "Search" });
    const searchInput = screen.getByRole("searchbox", { name: "Search" });

    expect(searchButton).toBeDisabled();

    await user.type(searchInput, "   ");
    expect(searchButton).toBeDisabled();

    await user.type(searchInput, "Thor");
    expect(searchButton).toBeEnabled();
  });

  it("submits a trimmed search term when the button is selected", async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();

    render(
      <SearchBox
        inputLabel="Search comic issues by title"
        onSearchCallback={onSearch}
      />,
    );

    await user.type(
      screen.getByRole("searchbox", { name: "Search comic issues by title" }),
      "  spider-man  ",
    );
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(onSearch).toHaveBeenCalledWith("spider-man");
  });

  it("submits from the keyboard", async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();

    render(<SearchBox onSearchCallback={onSearch} />);

    await user.type(screen.getByRole("searchbox", { name: "Search" }), "Thor{Enter}");

    expect(onSearch).toHaveBeenCalledWith("Thor");
  });

  it("publishes an empty search term when the input is cleared", async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();

    render(<SearchBox onSearchCallback={onSearch} />);

    const searchInput = screen.getByRole("searchbox", { name: "Search" });
    await user.type(searchInput, "Thor");
    await user.click(screen.getByRole("button", { name: "Search" }));
    await user.clear(searchInput);

    expect(onSearch).toHaveBeenLastCalledWith("");
    expect(screen.getByRole("button", { name: "Search" })).toBeDisabled();
  });
});
