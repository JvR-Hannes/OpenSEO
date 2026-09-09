import type { SeoRule } from "../types";

export const externalLinksRule: SeoRule = {
  id: "external-links",
  name: "External links",
  category: "Technical SEO",
  weight: 5,
  severity: "warning",

  check: ({ externalLinkChecks }) => {
    if (externalLinkChecks.length === 0) {
      return {
        status: "info",
        message: "No external links were found to check.",
        explanation:
          "OpenSEO could not find any links pointing to another domain on the audited page.",
        suggestion:
          "No action is required, but make sure important third-party resources are linked correctly when appropriate.",
      };
    }

    const brokenLinks = externalLinkChecks.filter(
      ({ check }) =>
        check.statusCode === 404 || check.statusCode === 410,
    );

    const failedChecks = externalLinkChecks.filter(
      ({ check }) => !check.ok && check.statusCode === null,
    );

    const serverErrors = externalLinkChecks.filter(
      ({ check }) =>
        check.statusCode !== null &&
        check.statusCode >= 500 &&
        check.statusCode < 600,
    );

    const otherClientErrors = externalLinkChecks.filter(
      ({ check }) =>
        check.statusCode !== null &&
        check.statusCode >= 400 &&
        check.statusCode < 500 &&
        check.statusCode !== 404 &&
        check.statusCode !== 410,
    );

    const longRedirectChains = externalLinkChecks.filter(
      ({ check }) => check.redirectCount >= 2 && check.ok,
    );

    const redirectedLinks = externalLinkChecks.filter(
      ({ check }) =>
        check.redirectCount > 0 &&
        check.redirectCount < 2 &&
        check.ok,
    );

    if (brokenLinks.length > 0) {
      return {
        status: "warning",
        message: `${brokenLinks.length} broken external ${
          brokenLinks.length === 1 ? "link" : "links"
        } found.`,
        explanation:
          "Broken external links can lead users to unavailable third-party resources and create a poorer browsing experience.",
        suggestion:
          "Remove, replace, or update broken external links where appropriate.",
        details: brokenLinks.map(
          ({ url, check }) => `${check.statusCode} — ${url}`,
        ),
      };
    }

    if (failedChecks.length > 0) {
      return {
        status: "warning",
        message: `${failedChecks.length} external ${
          failedChecks.length === 1 ? "link could" : "links could"
        } not be checked.`,
        explanation:
          "OpenSEO could not successfully retrieve one or more external URLs.",
        suggestion:
          "Review the affected URLs manually to determine whether they are still available.",
        details: failedChecks.map(
          ({ url, check }) =>
            `${check.error ?? "Unknown error"} — ${url}`,
        ),
      };
    }

    if (serverErrors.length > 0) {
      return {
        status: "warning",
        message: `${serverErrors.length} external ${
          serverErrors.length === 1 ? "link returned" : "links returned"
        } server errors.`,
        explanation:
          "The linked external servers returned 5xx responses when OpenSEO checked them.",
        suggestion:
          "Verify the affected links and replace them if the destination is no longer reliable.",
        details: serverErrors.map(
          ({ url, check }) => `${check.statusCode} — ${url}`,
        ),
      };
    }

    if (otherClientErrors.length > 0) {
      return {
        status: "info",
        message: `${otherClientErrors.length} external ${
          otherClientErrors.length === 1 ? "link could not" : "links could not"
        } be verified.`,
        explanation:
          "Some external websites restrict automated requests or require authentication, so a 4xx response does not always mean the destination is broken.",
        suggestion:
          "Review these external URLs manually when they are important to the page.",
        details: otherClientErrors.map(
          ({ url, check }) => `${check.statusCode} — ${url}`,
        ),
      };
    }

    if (longRedirectChains.length > 0) {
      return {
        status: "warning",
        message: `${longRedirectChains.length} external ${
          longRedirectChains.length === 1 ? "link uses" : "links use"
        } multiple redirects.`,
        explanation:
          "Multiple redirects can add unnecessary request overhead before users reach an external destination.",
        suggestion:
          "Where practical, update links to point directly to the final destination.",
        details: longRedirectChains.map(
          ({ url, check }) =>
            `${check.redirectCount} redirects — ${url} → ${check.finalUrl}`,
        ),
      };
    }

    if (redirectedLinks.length > 0) {
      return {
        status: "info",
        message: `${redirectedLinks.length} external ${
          redirectedLinks.length === 1 ? "link redirects" : "links redirect"
        }.`,
        explanation:
          "The checked external links ultimately resolve successfully but require a redirect.",
        suggestion:
          "Where practical, update links to point directly to their final destinations.",
        details: redirectedLinks.map(
          ({ url, check }) =>
            `${check.redirectCount} redirect — ${url} → ${check.finalUrl}`,
        ),
      };
    }

    return {
      status: "pass",
      message: `All ${externalLinkChecks.length} checked external ${
        externalLinkChecks.length === 1 ? "link" : "links"
      } are reachable.`,
      explanation:
        "The checked external links returned successful HTTP responses.",
    };
  },
};