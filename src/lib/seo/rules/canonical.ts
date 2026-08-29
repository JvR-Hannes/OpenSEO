import type { SeoRule } from "../types";

export const canonicalRule: SeoRule = {
  id: "canonical",
  name: "Canonical URL",
  category: "Technical SEO",
  weight: 10,
  severity: "warning",

  check({ page }) {
    const canonicals = page.$('link[rel="canonical"]');
    const href = canonicals.first().attr("href")?.trim();

    if (!href) {
      return {
        status: "warning",
        message: "No canonical URL was found.",
        explanation:
          "A canonical URL helps search engines understand which URL should be treated as the preferred version when similar or duplicate URLs exist.",
        suggestion:
          "Add a canonical link element when the page needs to declare a preferred URL.",
      };
    }

    if (canonicals.length > 1) {
      return {
        status: "fail",
        severity: "error",
        message: `Found ${canonicals.length} canonical link elements.`,
        explanation:
          "Multiple canonical declarations can create conflicting signals about the preferred URL.",
        suggestion: "Keep one canonical URL per page.",
      };
    }

    return {
      status: "pass",
      message: `Canonical found: ${href}`,
    };
  },
};
