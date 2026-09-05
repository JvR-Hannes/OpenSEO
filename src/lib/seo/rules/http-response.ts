import type { SeoRule } from "../types";

export const httpResponseRule: SeoRule = {
  id: "http-response",
  name: "HTTP response",
  category: "Technical SEO",
  weight: 10,
  severity: "critical",

  check: ({ page }) => {
    const { statusCode, contentType, url } = page;

    if (statusCode >= 200 && statusCode < 300) {
      if (!contentType.toLowerCase().includes("text/html")) {
        return {
          status: "warning",
          message: `The page returned ${statusCode}, but the response is not HTML.`,
          details: [
            `URL: ${url}`,
            `Status: ${statusCode}`,
            `Content-Type: ${contentType || "unknown"}`,
          ],
          explanation:
            "OpenSEO expects a crawlable HTML document when auditing a web page. Non-HTML responses may not contain the SEO elements required for a page audit.",
          suggestion:
            "Make sure the URL points to an HTML document intended to be indexed.",
        };
      }

      return {
        status: "pass",
        message: `The page returned a successful HTTP ${statusCode} response.`,
        details: [
          `URL: ${url}`,
          `Status: ${statusCode}`,
          `Content-Type: ${contentType || "unknown"}`,
        ],
      };
    }

    if (statusCode >= 300 && statusCode < 400) {
      return {
        status: "info",
        message: `The page returned HTTP ${statusCode}.`,
        details: [
          `URL: ${url}`,
          `Status: ${statusCode}`,
        ],
        explanation:
          "Redirect responses are handled separately by OpenSEO's redirect-chain analysis.",
      };
    }

    if (statusCode === 404 || statusCode === 410) {
      return {
        status: "fail",
        message: `The page returned HTTP ${statusCode} and is not available.`,
        details: [
          `URL: ${url}`,
          `Status: ${statusCode}`,
        ],
        explanation:
          "A page returning 404 or 410 cannot be retrieved as a valid page by search engines.",
        suggestion:
          "Restore the page, redirect it to a relevant replacement, or remove references to the URL.",
      };
    }

    if (statusCode >= 500 && statusCode < 600) {
      return {
        status: "fail",
        message: `The server returned HTTP ${statusCode}.`,
        details: [
          `URL: ${url}`,
          `Status: ${statusCode}`,
        ],
        explanation:
          "Server errors can prevent search engines from successfully crawling and indexing the page.",
        suggestion:
          "Investigate the server or application error and ensure the URL consistently returns a successful response.",
      };
    }

    if (statusCode >= 400 && statusCode < 500) {
      return {
        status: "fail",
        message: `The page returned HTTP ${statusCode}.`,
        details: [
          `URL: ${url}`,
          `Status: ${statusCode}`,
        ],
        explanation:
          "Client error responses indicate that the requested resource could not be retrieved successfully.",
        suggestion:
          "Check the URL and server configuration and ensure the page returns the expected response.",
      };
    }

    return {
      status: "warning",
      message: `The page returned an unexpected HTTP status: ${statusCode}.`,
      details: [
        `URL: ${url}`,
        `Status: ${statusCode}`,
      ],
      explanation:
        "Unexpected HTTP responses can affect how reliably search engines crawl and process a page.",
      suggestion:
        "Investigate the HTTP response and make sure the URL returns the expected status.",
    };
  },
};