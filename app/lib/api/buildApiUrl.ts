export type ApiQueryParameters = Readonly<
  Record<string, boolean | number | string | null | undefined>
>;

const LOCAL_URL_ORIGIN = "http://localhost";

export function buildApiUrl(
  baseUrl: string,
  parameters: ApiQueryParameters = {},
) {
  if (!baseUrl) return "";

  const isAbsoluteUrl = /^[a-z][a-z\d+.-]*:/i.test(baseUrl);
  const url = new URL(baseUrl, LOCAL_URL_ORIGIN);

  Object.entries(parameters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      url.searchParams.delete(key);
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return isAbsoluteUrl
    ? url.toString()
    : `${url.pathname}${url.search}${url.hash}`;
}
