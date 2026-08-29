import type { SeoRule } from "../types";

export const openGraphRule: SeoRule = {
  id: "open-graph",
  name: "Open Graph metadata",
  category: "Social",
  weight: 10,
  severity: "warning",

  check({ page }) {
    const title = page.$('meta[property="og:title"]').attr("content")?.trim();
    const image = page.$('meta[property="og:image"]').attr("content")?.trim();

    if (!title || !image) {
      const missing = [
        !title ? "og:title" : null,
        !image ? "og:image" : null,
      ].filter(Boolean);

      return {
        status: "warning",
        message: `Missing Open Graph metadata: ${missing.join(", ")}.`,
        explanation:
          "Open Graph metadata controls how pages are represented when shared on many social platforms and messaging applications.",
        suggestion:
          "Add at least og:title and og:image, then consider og:description and og:url.",
      };
    }

    return {
      status: "pass",
      message: "og:title and og:image are present.",
    };
  },
};
