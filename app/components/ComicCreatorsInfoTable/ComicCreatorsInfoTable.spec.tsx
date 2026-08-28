import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComicCreatorsInfoTable } from "./ComicCreatorsInfoTable";

describe("ComicCreatorsInfoTable", () => {
  const creators = [
    { id: "creator-101", name: "Jack Kirby", issueCount: 87 },
    { id: "creator-202", name: "Stan Lee", issueCount: 125 },
  ];

  it("renders creator rows and column headings", () => {
    render(<ComicCreatorsInfoTable itemList={creators} />);

    expect(screen.getByRole("columnheader", { name: "ID" })).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Name" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Issue Count" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Jack Kirby")).toBeInTheDocument();
    expect(screen.getByText("Stan Lee")).toBeInTheDocument();
    expect(screen.getByText("87")).toBeInTheDocument();
    expect(screen.getByText("125")).toBeInTheDocument();
  });

  it("passes the selected creator ID to the click callback", async () => {
    const user = userEvent.setup();
    const onClickCallBack = jest.fn();
    render(
      <ComicCreatorsInfoTable
        itemList={creators}
        onClickCallBack={onClickCallBack}
      />,
    );

    await user.click(screen.getByText("Jack Kirby"));

    expect(onClickCallBack).toHaveBeenCalledTimes(1);
    expect(onClickCallBack).toHaveBeenCalledWith("creator-101");
  });
});
