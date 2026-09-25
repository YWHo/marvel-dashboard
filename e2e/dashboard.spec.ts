import { expect, test, type Page } from "@playwright/test";

test("renders the landing page and links to comic issues", async ({ page }) => {
  await mockJson(page, "/api/comic-issues", {
    total: 0,
    limit: 20,
    offset: 0,
    has_next: false,
    items: [],
  });
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
  await mockPaginatedJson(
    page,
    "/api/comic-issues",
    paginatedPayload(issue("issue-101", "Amazing Fantasy #15"), true, 0),
    paginatedPayload(issue("issue-303", "The Avengers #1"), false, 20),
  );
  await mockJson(page, "/api/comic-issues/search", {
    total: 1,
    limit: 20,
    offset: 0,
    has_next: false,
    items: [
      {
        id: "issue-202",
        title: "Spider-Man #1",
        issueNumber: "1",
        detailUrl: "https://example.test/issues/issue-202",
        seriesId: 2002,
        seriesName: "Spider-Man",
        onSaleDate: "1990-01-01T12:00:00.000Z",
        unlimitedDate: "2008-01-15T12:00:00.000Z",
        yearPage: "1990",
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

  const loadMoreButton = page.getByRole("button", { name: "Load more" });
  await loadMoreButton.click();
  await expect(page.getByText("The Avengers #1")).toBeVisible();
  await expect(page.getByText("Amazing Fantasy #15")).toBeVisible();
  await expect(loadMoreButton).not.toBeVisible();

  await page
    .getByRole("searchbox", { name: "Search comic issues by title" })
    .fill("Spider Man");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Spider-Man #1")).toBeVisible();
  await expect(page.getByText("Amazing Fantasy #15")).not.toBeVisible();

  await page
    .getByRole("searchbox", { name: "Search comic issues by title" })
    .fill("");

  await expect(page.getByText("Amazing Fantasy #15")).toBeVisible();
  await expect(page.getByText("Spider-Man #1")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Search" })).toBeDisabled();
});

test("renders the Series page with series data", async ({ page }) => {
  await mockPaginatedJson(
    page,
    "/api/comic-series",
    paginatedPayload(
      { id: "series-202", name: "The Amazing Spider-Man", issueCount: 1234 },
      true,
      0,
    ),
    paginatedPayload(
      { id: "series-303", name: "Fantastic Four", issueCount: 416 },
      false,
      20,
    ),
  );

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

  const previousButton = page.getByRole("button", { name: "Previous" });
  const nextButton = page.getByRole("button", { name: "Next", exact: true });
  await expect(previousButton).toBeDisabled();
  await nextButton.click();
  await expect(page.getByText("Fantastic Four")).toBeVisible();
  await expect(nextButton).toBeDisabled();
});

test("renders the Creators page with creator data", async ({ page }) => {
  await mockPaginatedJson(
    page,
    "/api/comic-creators",
    paginatedPayload(
      { id: "creator-303", name: "Stan Lee", issueCount: 1559 },
      true,
      0,
    ),
    paginatedPayload(
      { id: "creator-404", name: "Jack Kirby", issueCount: 680 },
      false,
      20,
    ),
  );

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

  const previousButton = page.getByRole("button", { name: "Previous" });
  const nextButton = page.getByRole("button", { name: "Next", exact: true });
  await expect(previousButton).toBeDisabled();
  await nextButton.click();
  await expect(page.getByText("Jack Kirby")).toBeVisible();
  await expect(nextButton).toBeDisabled();
});

function issue(id: string, title: string) {
  return {
    id,
    title,
    issueNumber: "1",
    detailUrl: `https://example.test/issues/${id}`,
    seriesId: 1001,
    seriesName: title,
    onSaleDate: "1962-08-10T12:00:00.000Z",
    unlimitedDate: "2007-11-13T12:00:00.000Z",
    yearPage: "1962",
  };
}

function paginatedPayload<T>(item: T, hasNext: boolean, offset: number) {
  return {
    total: 21,
    limit: 20,
    offset,
    has_next: hasNext,
    items: [item],
  };
}

async function mockJson(page: Page, pathname: string, payload: unknown) {
  await page.route(
    (url) => url.pathname === pathname,
    async (route) => {
      await route.fulfill({ json: payload });
    },
  );
}

async function mockPaginatedJson(
  page: Page,
  pathname: string,
  firstPage: unknown,
  secondPage: unknown,
) {
  await page.route(
    (url) => url.pathname === pathname,
    async (route) => {
      const offset = new URL(route.request().url()).searchParams.get("offset");
      await route.fulfill({ json: offset === "20" ? secondPage : firstPage });
    },
  );
}
