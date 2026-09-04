import type { SeoRule } from "../types";

export const finalUrlIntegrityRule: SeoRule = {
  id: "final-url-integrity",
  name: "Final URL integrity",
  category: "Technical SEO",
  weight: 5,
  severity: "warning",

  check: ({ page }) => {
    const canonicalHref = page.$('link[rel="canonical"]').attr("href");

    if (!canonicalHref) {
      return {
        status: "info",
        message:
          "No canonical URL is available to compare with the final URL.",
        explanation:
          "Final URL integrity checks whether the page's canonical URL agrees with the URL that was ultimately reached.",
      };
    }

    let canonicalUrl: URL;

    try {
      canonicalUrl = new URL(canonicalHref, page.url);
    } catch {
      return {
        status: "warning",
        message: "The canonical URL could not be parsed as a valid URL.",
        details: [`Canonical: ${canonicalHref}`],
      };
    }

    const finalUrl = new URL(page.url);

    const normalizedFinal = normalizeUrl(finalUrl);
    const normalizedCanonical = normalizeUrl(canonicalUrl);

    if (normalizedFinal === normalizedCanonical) {
      return {
        status: "pass",
        message: "The canonical URL matches the final URL.",
      };
    }

    return {
      status: "warning",
      message: "The canonical URL does not match the final URL.",
      details: [
        `Final URL: ${finalUrl.toString()}`,
        `Canonical: ${canonicalUrl.toString()}`,
      ],
      explanation:
        "When a page redirects to one URL but declares a different canonical URL, search engines may receive conflicting signals about which URL should be indexed.",
      suggestion:
        "Review the redirect target and canonical URL and make sure they represent the same preferred page URL.",
    };
  },
};

function normalizeUrl(url: URL): string {
  const normalized = new URL(url.toString());

  normalized.hash = "";

  if (normalized.pathname.length > 1) {
    normalized.pathname = normalized.pathname.replace(/\/+$/, "");
  }

  return normalized.toString();
}