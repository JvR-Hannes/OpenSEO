const TIMEOUT_MS = 10_000;
const MAX_TEXT_BYTES = 1_000_000;

export async function fetchTextResource(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "OpenSEO/0.3",
        Accept: "text/plain, text/xml, application/xml, application/rss+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const content = await response.text();

    if (new TextEncoder().encode(content).byteLength > MAX_TEXT_BYTES) {
      return { ok: false, statusCode: response.status, content: "", finalUrl: response.url, error: "Resource is too large to inspect." };
    }

    return { ok: response.ok, statusCode: response.status, content, finalUrl: response.url };
  } catch (error) {
    return { ok: false, statusCode: 0, content: "", finalUrl: url, error: error instanceof Error ? error.message : "Request failed." };
  }
}
