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
        suggestion:
          "Keep one canonical URL per page.",
      };
    }

    let canonicalUrl: URL;

    try {
      canonicalUrl = new URL(href, page.url);
    } catch {
      return {
        status: "fail",
        severity: "error",
        message: "The canonical URL is invalid.",
        explanation:
          "The canonical href could not be resolved into a valid HTTP or HTTPS URL.",
        details: [`Canonical: ${href}`],
        suggestion:
          "Use a valid absolute or page-relative canonical URL.",
      };
    }

    if (
      canonicalUrl.protocol !== "http:" &&
      canonicalUrl.protocol !== "https:"
    ) {
      return {
        status: "fail",
        severity: "error",
        message: "The canonical URL does not use HTTP or HTTPS.",
        explanation:
          "Canonical URLs should resolve to publicly accessible HTTP or HTTPS resources.",
        details: [`Canonical: ${canonicalUrl.toString()}`],
        suggestion:
          "Use an HTTP or HTTPS canonical URL.",
      };
    }

    if (canonicalUrl.hash) {
      return {
        status: "warning",
        message: "The canonical URL contains a fragment.",
        explanation:
          "URL fragments identify a location within a document and are generally not appropriate for canonical URL declarations.",
        details: [`Canonical: ${canonicalUrl.toString()}`],
        suggestion:
          "Remove the URL fragment from the canonical URL.",
      };
    }

    if (canonicalUrl.origin !== new URL(page.url).origin) {
      return {
        status: "warning",
        message: "The canonical URL points to a different origin.",
        explanation:
          "Cross-origin canonicals can be intentional, but they should only be used when the page is deliberately canonicalized to another site.",
        details: [
          `Page: ${page.url}`,
          `Canonical: ${canonicalUrl.toString()}`,
        ],
        suggestion:
          "Verify that the cross-origin canonical is intentional.",
      };
    }

    return {
      status: "pass",
      message: `Canonical found: ${canonicalUrl.toString()}`,
    };
  },
};