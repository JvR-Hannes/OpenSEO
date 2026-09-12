import type { SeoRule } from "../types";

export const sitemapRule: SeoRule = {
  id: "sitemap",
  name: "XML sitemap",
  category: "Technical SEO",
  weight: 10,
  severity: "warning",

  check({ sitemap }) {
    if (!sitemap.exists) {
      const details = sitemap.fetchError
        ? [sitemap.fetchError]
        : [];

      return {
        status: "info",
        severity: "info",
        message: "No readable XML sitemap was found.",
        explanation:
          "An XML sitemap helps search engines discover important URLs, especially on larger or frequently changing sites.",
        details,
        suggestion:
          "Consider publishing an XML sitemap and referencing it from robots.txt.",
      };
    }

    if (sitemap.statusCode < 200 || sitemap.statusCode >= 300) {
      return {
        status: "warning",
        message: `Sitemap returned HTTP ${sitemap.statusCode}.`,
        explanation:
          "The sitemap resource should return a successful HTTP response so search engines can retrieve it reliably.",
        suggestion:
          "Make sure the sitemap URL is publicly accessible and returns an HTTP 2xx response.",
      };
    }

    if (sitemap.type === "urlset") {
      if (sitemap.urls.length === 0) {
        return {
          status: "warning",
          message: "The sitemap exists but contains no URLs.",
          explanation:
            "An empty sitemap does not provide search engines with useful URL discovery signals.",
          suggestion:
            "Add the site's canonical, indexable URLs to the sitemap.",
        };
      }

      return {
        status: "pass",
        message: `Sitemap found with ${sitemap.urls.length} URL(s).`,
        details: [
          `Sitemap URL: ${sitemap.url}`,
          `HTTP status: ${sitemap.statusCode}`,
        ],
      };
    }

    if (sitemap.type === "sitemapindex") {
      if (sitemap.childSitemaps.length === 0) {
        return {
          status: "warning",
          message:
            "The sitemap index exists but contains no child sitemaps.",
          explanation:
            "A sitemap index is useful only when it references one or more child sitemap files.",
          suggestion:
            "Add valid child sitemap URLs to the sitemap index.",
        };
      }

      return {
        status: "pass",
        message: `Sitemap index found with ${sitemap.childSitemaps.length} child sitemap(s).`,
        details: [
          `Sitemap URL: ${sitemap.url}`,
          `HTTP status: ${sitemap.statusCode}`,
        ],
      };
    }

    return {
      status: "warning",
      message:
        "A sitemap resource was found but could not be recognized as a standard XML sitemap.",
      explanation:
        "OpenSEO could not identify a standard sitemap URL set or sitemap index.",
      suggestion:
        "Validate the sitemap XML and ensure it follows the XML sitemap protocol.",
    };
  },
};