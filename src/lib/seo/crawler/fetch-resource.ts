import { validateUrl } from "./validate-url";

const TIMEOUT_MS = 10_000;
const MAX_TEXT_BYTES = 1_000_000;
const MAX_REDIRECTS = 10;

export async function fetchTextResource(url: string) {
  try {
    await validateUrl(url);

    let currentUrl = url;
    let redirectCount = 0;

    while (redirectCount <= MAX_REDIRECTS) {
      const response = await fetch(currentUrl, {
        headers: {
          "User-Agent": "OpenSEO/0.3",
          Accept:
            "text/plain, text/xml, application/xml, application/rss+xml",
        },
        redirect: "manual",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      const location = response.headers.get("location");

      const isRedirect =
        response.status >= 300 &&
        response.status < 400 &&
        Boolean(location);

      if (isRedirect && location) {
        const nextUrl = new URL(location, currentUrl).toString();

        await validateUrl(nextUrl);

        currentUrl = nextUrl;
        redirectCount++;

        continue;
      }

      const content = await response.text();

      if (new TextEncoder().encode(content).byteLength > MAX_TEXT_BYTES) {
        return {
          ok: false,
          statusCode: response.status,
          content: "",
          finalUrl: currentUrl,
          error: "Resource is too large to inspect.",
        };
      }

      return {
        ok: response.ok,
        statusCode: response.status,
        content,
        finalUrl: response.url || currentUrl,
      };
    }

    return {
      ok: false,
      statusCode: 0,
      content: "",
      finalUrl: currentUrl,
      error: `Too many redirects. The resource exceeded ${MAX_REDIRECTS} redirects.`,
    };
  } catch (error) {
    return {
      ok: false,
      statusCode: 0,
      content: "",
      finalUrl: url,
      error:
        error instanceof Error ? error.message : "Request failed.",
    };
  }
}