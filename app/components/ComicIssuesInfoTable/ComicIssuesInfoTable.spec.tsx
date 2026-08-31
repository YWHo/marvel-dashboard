import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComicIssueItemType } from "@/app/components/ComicIssueItemDetails";
import { ComicIssuesInfoTable } from "./ComicIssuesInfoTable";

const issues: ComicIssueItemType[] = [
  {
    id: "issue-101",
    title: "Amazing Fantasy #15",
    issueNumber: "15",
    detailUrl: "https://example.test/issues/issue-101",
    seriesId: 1001,
    seriesName: "Amazing Fantasy",
    onSaleDate: new Date("1962-08-10T00:00:00.000Z"),
    unlimitedDate: new Date("2007-11-13T00:00:00.000Z"),
    yearPage: "1962",
  },
  {
    id: "issue-202",
    title: "The Avengers #1",
    issueNumber: "1",
    detailUrl: "https://example.test/issues/issue-202",
    seriesId: 2002,
    seriesName: "The Avengers",
    onSaleDate: new Date("1963-09-01T00:00:00.000Z"),
    unlimitedDate: new Date("2008-01-15T00:00:00.000Z"),
    yearPage: "1963",
  },
];

describe("ComicIssuesInfoTable", () => {
  it("renders issue rows, headings, and formatted dates", () => {
    render(<ComicIssuesInfoTable itemList={issues} />);

    expect(screen.getByRole("columnheader", { name: "ID" })).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Name" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Year Page" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Amazing Fantasy #15")).toBeInTheDocument();
    expect(screen.getByText("The Avengers #1")).toBeInTheDocument();
    expect(
      screen.getByText(issues[0].onSaleDate.toLocaleDateString()),
    ).toBeInTheDocument();
    expect(
      screen.getByText(issues[1].unlimitedDate.toLocaleDateString()),
    ).toBeInTheDocument();
  });

  it("passes the selected issue ID to the click callback", async () => {
    const user = userEvent.setup();
    const onClickCallBack = jest.fn();
    render(
      <ComicIssuesInfoTable
        itemList={issues}
        onClickCallBack={onClickCallBack}
      />,
    );

    await user.click(screen.getByText("Amazing Fantasy #15"));

    expect(onClickCallBack).toHaveBeenCalledTimes(1);
    expect(onClickCallBack).toHaveBeenCalledWith("issue-101");
  });

  it("renders an empty-data message when no issues are available", () => {
    render(<ComicIssuesInfoTable itemList={[]} />);

    expect(screen.getByText("(No data)")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
