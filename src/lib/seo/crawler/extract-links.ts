import type { InternalLink, PageData } from "../types";

const IGNORED_PROTOCOLS = [
  "mailto:",
  "tel:",
  "javascript:",
  "data:",
  "blob:",
];

export function extractInternalLinks(page: PageData): InternalLink[] {
  const links: InternalLink[] = [];
  const seen = new Set<string>();

  const pageUrl = new URL(page.url);

  page.$("a[href]").each((_, element) => {
    const href = page.$(element).attr("href");

    if (!href) {
      return;
    }

    const trimmedHref = href.trim();

    if (trimmedHref.startsWith("#")){
      return;
    }

    if (!trimmedHref) {
      return;
    }

    const lowerHref = trimmedHref.toLowerCase();

    if (IGNORED_PROTOCOLS.some((protocol) => lowerHref.startsWith(protocol))) {
      return;
    }

    let resolvedUrl: URL;

    try {
      resolvedUrl = new URL(trimmedHref, page.url);
    } catch {
      return;
    }

    if (
      resolvedUrl.protocol !== "http:" &&
      resolvedUrl.protocol !== "https:"
    ) {
      return;
    }

    if (resolvedUrl.hostname !== pageUrl.hostname) {
      return;
    }

    resolvedUrl.hash = "";

    if (resolvedUrl.pathname.length > 1) {
      resolvedUrl.pathname = resolvedUrl.pathname.replace(/\/+$/, "");
    }

    const normalizedUrl = resolvedUrl.toString();

    if (seen.has(normalizedUrl)) {
      return;
    }

    seen.add(normalizedUrl);

    links.push({
      href: trimmedHref,
      url: normalizedUrl,
      text: page.$(element).text().trim(),
    });
  });

  return links;
}