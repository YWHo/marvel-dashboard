import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComicSeriesInfoTable } from "./ComicSeriesInfoTable";

const series = [
  { id: "series-101", name: "Amazing Spider-Man", issueCount: 925 },
  { id: "series-202", name: "Fantastic Four", issueCount: 416 },
];

describe("ComicSeriesInfoTable", () => {
  it("renders series rows and column headings", () => {
    render(<ComicSeriesInfoTable itemList={series} />);

    expect(screen.getByRole("columnheader", { name: "ID" })).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Name" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Issue Count" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Amazing Spider-Man")).toBeInTheDocument();
    expect(screen.getByText("Fantastic Four")).toBeInTheDocument();
    expect(screen.getByText("925")).toBeInTheDocument();
    expect(screen.getByText("416")).toBeInTheDocument();
  });

  it("passes the selected series ID to the click callback", async () => {
    const user = userEvent.setup();
    const onClickCallBack = jest.fn();
    render(
      <ComicSeriesInfoTable
        itemList={series}
        onClickCallBack={onClickCallBack}
      />,
    );

    await user.click(screen.getByText("Amazing Spider-Man"));

    expect(onClickCallBack).toHaveBeenCalledTimes(1);
    expect(onClickCallBack).toHaveBeenCalledWith("series-101");
  });

  it("renders no data rows for an empty series list", () => {
    render(<ComicSeriesInfoTable itemList={[]} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(1);
  });
});
