import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaginationControls } from "./PaginationControls";

describe("PaginationControls", () => {
  it("disables Previous on the first page and requests the next offset", async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();

    render(
      <PaginationControls
        hasNextPage
        isFetching={false}
        itemCount={20}
        limit={20}
        offset={0}
        onPageChange={onPageChange}
        total={45}
      />,
    );

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByText("Page 1 of 3 · 1–20 of 45")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(onPageChange).toHaveBeenCalledWith(20);
  });

  it("disables Next on the final page and requests the previous offset", async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();

    render(
      <PaginationControls
        hasNextPage={false}
        isFetching={false}
        itemCount={5}
        limit={20}
        offset={40}
        onPageChange={onPageChange}
        total={45}
      />,
    );

    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(screen.getByText("Page 3 of 3 · 41–45 of 45")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous" }));

    expect(onPageChange).toHaveBeenCalledWith(20);
  });

  it("disables both controls and announces a page fetch", () => {
    render(
      <PaginationControls
        hasNextPage
        isFetching
        itemCount={20}
        limit={20}
        offset={20}
        onPageChange={jest.fn()}
        total={45}
      />,
    );

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(screen.getByText("Loading page…")).toBeInTheDocument();
  });

  it("disables both controls when pagination is unavailable", () => {
    render(
      <PaginationControls
        hasNextPage
        isFetching={false}
        isUnavailable
        itemCount={0}
        limit={20}
        offset={20}
        onPageChange={jest.fn()}
        total={45}
      />,
    );

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(screen.getByText("Pagination unavailable")).toBeInTheDocument();
  });
});
