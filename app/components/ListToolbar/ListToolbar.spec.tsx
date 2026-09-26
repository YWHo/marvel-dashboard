import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { ListToolbar } from "./ListToolbar";

describe("ListToolbar", () => {
  it("renders a sticky heading and controls", () => {
    const headingRef = createRef<HTMLHeadingElement>();

    render(
      <ListToolbar headingRef={headingRef} title="Comic series">
        <button type="button">Next</button>
      </ListToolbar>,
    );

    expect(screen.getByRole("banner")).toHaveClass("sticky", "top-12");
    expect(headingRef.current).toBe(
      screen.getByRole("heading", { name: "Comic series" }),
    );
    expect(headingRef.current).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  it("supports a non-sticky embedded heading", () => {
    render(<ListToolbar sticky={false} title="Related issues" />);

    expect(screen.getByRole("banner")).not.toHaveClass("sticky");
  });
});
