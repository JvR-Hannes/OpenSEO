import * as cheerio from "cheerio";
import type { PageData, RedirectHop } from "../types";

const MAX_HTML_BYTES = 2_000_000;
const TIMEOUT_MS = 15_000;
const MAX_REDIRECTS = 10;

export async function fetchPage(url: string): Promise<PageData> {
  let currentUrl = url;
  const redirects: RedirectHop[] = [];

  let response: Response | undefined;

  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    response = await fetch(currentUrl, {
      headers: {
        "User-Agent":
          "OpenSEO/0.2 (+https://github.com/your-org/openseo)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const status = response.status;

    const isRedirect =
      status >= 300 &&
      status < 400 &&
      response.headers.has("location");

    if (!isRedirect) {
      break;
    }

    const location = response.headers.get("location");

    if (!location) {
      break;
    }

    const nextUrl = new URL(location, currentUrl).toString();

    redirects.push({
      from: currentUrl,
      to: nextUrl,
      statusCode: status,
    });

    if (redirects.length >= MAX_REDIRECTS) {
      throw new Error(
        `The URL exceeded the maximum redirect limit of ${MAX_REDIRECTS}.`,
      );
    }

    currentUrl = nextUrl;
  }

  if(!response) {
      throw new Error("Unable to retrieve a response from the website.");
    }

  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok) {
    throw new Error(`Website returned HTTP ${response.status}.`);
  }

  if (!contentType.includes("text/html")) {
    throw new Error("The URL did not return an HTML document.");
  }

  const html = await response.text();

  if (
    new TextEncoder().encode(html).byteLength >
    MAX_HTML_BYTES
  ) {
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
    redirects,
  };
}