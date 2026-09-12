import type { PageData } from "../types";

export function extractImageResources(page: PageData): string[] {
  const resources = new Set<string>();

  page.$("img[src]").each((_, element) => {
    const src = page.$(element).attr("src")?.trim();

    if (!src) {
      return;
    }

    if (
      src.startsWith("data:") ||
      src.startsWith("blob:") ||
      src.startsWith("#")
    ) {
      return;
    }

    try {
      const url = new URL(src, page.url);

      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return;
      }

      url.hash = "";

      resources.add(url.toString());
    } catch {
      // Ignore invalid image URLs.
    }
  });

  return Array.from(resources);
}
