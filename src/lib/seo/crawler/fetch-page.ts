import * as cheerio from "cheerio";
import type { PageData } from "../types";

const MAX_HTML_BYTES = 2_000_000;
const TIMEOUT_MS = 15_000;

export async function fetchPage(url: string): Promise<PageData> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "OpenSEO/0.2 (+https://github.com/your-org/openseo)",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

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
    url: response.url,
    html,
    $: cheerio.load(html),
    statusCode: response.status,
    contentType,
    responseHeaders,
  };
}
