export async function fetchApiData<Data>(
  url: string,
  init?: RequestInit,
): Promise<Data> {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}: ${response.statusText}`,
    );
  }

  return response.json() as Promise<Data>;
}
