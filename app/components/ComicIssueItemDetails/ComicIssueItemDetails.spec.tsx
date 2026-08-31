import { render, screen } from "@testing-library/react";
import {
  ComicIssuesDetails,
  type ComicIssueItemDetailsType,
} from "./ComicIssueItemDetails";

const issue: ComicIssueItemDetailsType = {
  id: "issue-101",
  title: "Amazing Fantasy #15",
  issueNumber: "15",
  detailUrl: "https://www.marvel.com/comics/issue/issue-101",
  seriesId: 1001,
  seriesName: "Amazing Fantasy",
  onSaleDate: new Date("1962-08-10T00:00:00.000Z"),
  unlimitedDate: new Date("2007-11-13T00:00:00.000Z"),
  yearPage: "1962",
  digitalId: 2002,
  description: "Spider-Man makes his first appearance.",
  modified: "2026-01-15T00:00:00.000Z",
  pageCount: 36,
  creators: [
    { id: "creator-1", name: "Stan Lee", role: "writer" },
    { id: "creator-2", name: "Steve Ditko", role: "penciller" },
  ],
  cover: {
    path: "https://cdn.example.test/amazing-fantasy-15",
    extension: "jpg",
  },
};

describe("ComicIssuesDetails", () => {
  it("renders issue metadata, links, cover, and creator credits", () => {
    render(<ComicIssuesDetails itemDetails={issue} />);

    expect(
      screen.getByRole("heading", { name: "Amazing Fantasy #15" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Marvel ID: issue-101")).toBeInTheDocument();
    expect(
      screen.getByText("Spider-Man makes his first appearance."),
    ).toBeInTheDocument();
    expect(screen.getByText("Issue: 15")).toBeInTheDocument();
    expect(screen.getByText("Pages: 36")).toBeInTheDocument();
    expect(screen.getByText("Year: 1962")).toBeInTheDocument();
    expect(screen.getByText("Stan Lee")).toBeInTheDocument();
    expect(screen.getByText("writer")).toBeInTheDocument();
    expect(screen.getByText("Steve Ditko")).toBeInTheDocument();
    expect(screen.getByText("2 creators")).toBeInTheDocument();

    expect(screen.getByRole("img", { name: "Amazing Fantasy #15 cover" }))
      .toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Amazing Fantasy" }))
      .toHaveAttribute("href", "/comic-series/1001");
    expect(screen.getByRole("link", { name: /View on Marvel/ }))
      .toHaveAttribute("href", issue.detailUrl);
  });

  it("renders fallbacks when optional issue information is unavailable", () => {
    render(
      <ComicIssuesDetails
        itemDetails={{
          ...issue,
          detailUrl: "",
          seriesName: "",
          description: " ",
          modified: "invalid-date",
          digitalId: 0,
          creators: [],
          cover: { path: "", extension: "" },
        }}
      />,
    );

    expect(screen.getByText("Cover image unavailable")).toBeInTheDocument();
    expect(
      screen.getByText("No description is available for this issue."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Creator information is unavailable."),
    ).toBeInTheDocument();
    expect(screen.getByText("0 creators")).toBeInTheDocument();
    expect(screen.getAllByText("Not available")).toHaveLength(2);
    expect(screen.queryByRole("link", { name: /View on Marvel/ }))
      .not.toBeInTheDocument();
  });
});
