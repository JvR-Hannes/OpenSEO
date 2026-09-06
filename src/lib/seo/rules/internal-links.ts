import type { SeoRule } from "../types";

export const internalLinksRule: SeoRule = {
  id: "internal-links",
  name: "Internal links",
  category: "Technical SEO",
  weight: 10,
  severity: "error",

  check: ({ internalLinkChecks }) => {
    if (internalLinkChecks.length === 0) {
      return {
        status: "info",
        message: "No internal links were found to check.",
        explanation:
          "OpenSEO could not find any same-site links on the audited page.",
        suggestion:
          "Make sure important pages are connected through internal links.",
      };
    }

    const brokenLinks = internalLinkChecks.filter(
      ({ check }) =>
        check.statusCode !== null &&
        check.statusCode >= 400 &&
        check.statusCode < 600,
    );

    const failedChecks = internalLinkChecks.filter(
      ({ check }) => !check.ok && check.statusCode === null,
    );

    const redirectedLinks = internalLinkChecks.filter(
      ({ check }) => check.redirectCount > 0 && check.ok,
    );

    const longRedirectChains = internalLinkChecks.filter(
      ({ check }) => check.redirectCount >= 2 && check.ok,
    );

    if (brokenLinks.length > 0) {
      return {
        status: "fail",
        message: `${brokenLinks.length} broken internal ${
          brokenLinks.length === 1 ? "link" : "links"
        } found.`,
        explanation:
          "Broken internal links can lead users and search engines to unavailable pages.",
        suggestion:
          "Fix, remove, or redirect broken internal links to valid destinations.",
        details: brokenLinks.map(
          ({ url, check }) => `${check.statusCode} — ${url}`,
        ),
      };
    }

    if (failedChecks.length > 0) {
      return {
        status: "fail",
        message: `${failedChecks.length} internal ${
          failedChecks.length === 1 ? "link could" : "links could"
        } not be checked.`,
        explanation:
          "OpenSEO could not successfully retrieve one or more internal URLs.",
        suggestion:
          "Check the affected URLs for network errors, timeouts, or server availability problems.",
        details: failedChecks.map(
          ({ url, check }) => `${check.error ?? "Unknown error"} — ${url}`,
        ),
      };
    }

    if (longRedirectChains.length > 0) {
      return {
        status: "warning",
        message: `${longRedirectChains.length} internal ${
          longRedirectChains.length === 1 ? "link uses" : "links use"
        } multiple redirects.`,
        explanation:
          "Multiple redirects between an internal link and its destination can add unnecessary crawl and request overhead.",
        suggestion:
          "Update internal links to point directly to the final destination URL.",
        details: longRedirectChains.map(
          ({ url, check }) =>
            `${check.redirectCount} redirects — ${url} → ${check.finalUrl}`,
        ),
      };
    }

    if (redirectedLinks.length > 0) {
      return {
        status: "info",
        message: `${redirectedLinks.length} internal ${
          redirectedLinks.length === 1 ? "link redirects" : "links redirect"
        }.`,
        explanation:
          "The checked internal links ultimately resolve successfully but require one or more redirects.",
        suggestion:
          "Where practical, update internal links to point directly to their final URLs.",
        details: redirectedLinks.map(
          ({ url, check }) =>
            `${check.redirectCount} redirect${
              check.redirectCount === 1 ? "" : "s"
            } — ${url} → ${check.finalUrl}`,
        ),
      };
    }

    return {
      status: "pass",
      message: `All ${internalLinkChecks.length} checked internal ${
        internalLinkChecks.length === 1 ? "link" : "links"
      } are reachable.`,
      explanation:
        "The checked internal links returned successful HTTP responses.",
    };
  },
};