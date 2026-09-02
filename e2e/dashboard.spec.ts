import { expect, test, type Page } from "@playwright/test";

test("renders the landing page and links to comic issues", async ({ page }) => {
  await mockJson(page, "/api/comic-issues", { items: [] });
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Welcome to the Marvel Comic Portal!/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Centered Landing Image" }),
  ).toBeVisible();

  const browseIssues = page.getByRole("link", { name: "Browse Comic Issues" });
  await expect(browseIssues).toHaveAttribute("href", "/comic-issues");
  await browseIssues.click();

  await expect(page).toHaveURL(/\/comic-issues$/);
  await expect(
    page.getByRole("heading", { name: "The Marvel comic issues" }),
  ).toBeVisible();
});

test("renders the Issues page with issue data", async ({ page }) => {
  await mockJson(page, "/api/comic-issues", {
    items: [
      {
        id: "issue-101",
        title: "Amazing Fantasy #15",
        issueNumber: "15",
        detailUrl: "https://example.test/issues/issue-101",
        seriesId: 1001,
        seriesName: "Amazing Fantasy",
        onSaleDate: "1962-08-10T12:00:00.000Z",
        unlimitedDate: "2007-11-13T12:00:00.000Z",
        yearPage: "1962",
      },
    ],
  });

  await page.goto("/comic-issues");

  await expect(
    page.getByRole("heading", { name: "The Marvel comic issues" }),
  ).toBeVisible();
  await expect(page.getByText("Amazing Fantasy #15")).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "On Sale Date" }))
    .toBeVisible();
  await expect(page.getByRole("link", { name: "Issues" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("renders the Series page with series data", async ({ page }) => {
  await mockJson(page, "/api/comic-series", {
    total: 1,
    limit: 20,
    offset: 0,
    has_next: false,
    items: [
      {
        id: "series-202",
        name: "The Amazing Spider-Man",
        issueCount: 1234,
      },
    ],
  });

  await page.goto("/comic-series");

  await expect(
    page.getByRole("heading", { name: "The Marvel comic series" }),
  ).toBeVisible();
  await expect(page.getByText("The Amazing Spider-Man")).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Issue Count" }))
    .toBeVisible();
  await expect(page.getByRole("link", { name: "Series" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("renders the Creators page with creator data", async ({ page }) => {
  await mockJson(page, "/api/comic-creators", {
    total: 1,
    limit: 20,
    offset: 0,
    has_next: false,
    items: [{ id: "creator-303", name: "Stan Lee", issueCount: 1559 }],
  });

  await page.goto("/comic-creators");

  await expect(
    page.getByRole("heading", { name: "The Marvel comic creators" }),
  ).toBeVisible();
  await expect(page.getByText("Stan Lee")).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Issue Count" }))
    .toBeVisible();
  await expect(page.getByRole("link", { name: "Creators" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

async function mockJson(page: Page, pathname: string, payload: unknown) {
  await page.route(
    (url) => url.pathname === pathname,
    async (route) => {
      await route.fulfill({ json: payload });
    },
  );
}
