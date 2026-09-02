import * as cheerio from "cheerio";
import type { PageData } from "../types";

const MAX_HTML_BYTES = 2_000_000;
const TIMEOUT_MS = 15_000;
const MAX_REDIRECTS = 10;

export async function fetchPage(url: string): Promise<PageData> {
  const requestedUrl = url;
  const redirectChain: string[] = [];

  let currentUrl = url;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
    const response = await fetch(currentUrl, {
      headers: {
        "User-Agent":
          "OpenSEO/0.2 (+https://github.com/your-org/openseo)",
        Accept: "text/html,application/xhtml+xml",
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

      redirectChain.push(nextUrl);

      currentUrl = nextUrl;

      continue;
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok) {
      throw new Error(`Website returned HTTP ${response.status}.`);
    }

    if (!contentType.includes("text/html")) {
      throw new Error("The URL did not return an HTML document.");
    }

    const html = await response.text();

    if (new TextEncoder().encode(html).byteLength > MAX_HTML_BYTES) {
      throw new Error("The HTML document is too large to audit.");
    }

    const responseHeaders: Record<string, string> = {};

    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      url: response.url || currentUrl,
      requestedUrl,
      html,
      $: cheerio.load(html),
      statusCode: response.status,
      contentType,
      responseHeaders,

      redirect: {
        occurred: redirectChain.length > 0,
        chain: redirectChain,
        count: redirectChain.length,
      },
    };
  }

  throw new Error(
    `Too many redirects. The crawler stopped after ${MAX_REDIRECTS} redirects.`,
  );
}