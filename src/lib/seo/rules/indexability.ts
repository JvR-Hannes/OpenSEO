import type { SeoRule } from "../types";

export const indexabilityRule: SeoRule = {
  id: "indexability",
  name: "Indexability",
  category: "Technical SEO",
  weight: 20,
  severity: "critical",
  check({ page }) {
    const robotsMeta = page.$("meta[name=\"robots\"]").attr("content")?.trim() ?? "";
    const googlebotMeta = page.$("meta[name=\"googlebot\"]").attr("content")?.trim() ?? "";
    const xRobotsTag = page.responseHeaders["x-robots-tag"] ?? "";
    const sources = [robotsMeta, googlebotMeta, xRobotsTag];

    const noindex = sources.some((value) => /(^|[,;\s])noindex([,;\s]|$)/i.test(value));
    if (noindex) {
      return {
        status: "fail",
        message: "The page contains a noindex directive.",
        explanation: "A noindex directive tells compliant search engines not to include the page in search results.",
        suggestion: "If this page should appear in search, remove the noindex directive and verify the response headers and meta tags.",
      };
    }

    return { status: "pass", message: "No noindex directive was detected on the page." };
  },
};
