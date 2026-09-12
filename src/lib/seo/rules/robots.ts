import type { SeoRule } from "../types";

export const robotsRule: SeoRule = {
  id: "robots-txt",
  name: "robots.txt",
  category: "Technical SEO",
  weight: 5,
  severity: "warning",

  check({ robots }) {
    if (!robots.exists) {
      return {
        status: "info",
        severity: "info",
        message: "No robots.txt file was found.",
        explanation:
          "robots.txt is optional, but it can provide crawler guidance and advertise sitemap locations.",
        suggestion:
          "Add a robots.txt file if you need to control crawler access or publish your sitemap location.",
      };
    }

    if (robots.fetchError) {
      return {
        status: "warning",
        message: "robots.txt could not be fetched successfully.",
        explanation:
          "The robots.txt resource could not be retrieved successfully.",
        details: [
          robots.fetchError,
          `HTTP status: ${robots.statusCode}`,
        ],
        suggestion:
          "Make sure robots.txt is publicly accessible and returns a successful HTTP response.",
      };
    }

    if (robots.content.trim() === "") {
      return {
        status: "warning",
        message: "robots.txt exists but is empty.",
        explanation:
          "An empty robots.txt file provides no crawler directives or sitemap declarations.",
        suggestion:
          "Add appropriate User-agent, Allow, Disallow, or Sitemap directives if needed.",
      };
    }

    if (robots.disallow.some((path) => path === "/")) {
      return {
        status: "warning",
        message: "robots.txt disallows / for the wildcard user-agent.",
        explanation:
          "A wildcard Disallow: / directive tells compliant crawlers not to crawl the site's URLs.",
        suggestion:
          "If this is a public website, review the wildcard robots.txt rules before relying on organic search traffic.",
      };
    }

    const details: string[] = [];

    if (robots.userAgents.length > 0) {
      details.push(
        `User-agents: ${robots.userAgents.join(", ")}`,
      );
    }

    if (robots.allow.length > 0) {
      details.push(
        `Allow rules: ${robots.allow.length}`,
      );
    }

    if (robots.disallow.length > 0) {
      details.push(
        `Disallow rules: ${robots.disallow.length}`,
      );
    }

    if (robots.sitemaps.length > 0) {
      details.push(
        `Sitemaps declared: ${robots.sitemaps.length}`,
      );
    }

    return {
      status: "pass",
      message: `robots.txt found with ${robots.disallow.length} wildcard disallow rule(s).`,
      details,
    };
  },
};