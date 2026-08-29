import type { SeoRule } from "../types";

export const sitemapRule: SeoRule = {
  id: "sitemap",
  name: "XML sitemap",
  category: "Technical SEO",
  weight: 10,
  severity: "warning",
  check({ sitemap }) {
    if (!sitemap.exists) return {
      status: "info", severity: "info",
      message: "No readable XML sitemap was found.",
      explanation: "An XML sitemap helps search engines discover important URLs, especially on larger or frequently changing sites.",
      suggestion: "Consider publishing an XML sitemap and referencing it from robots.txt.",
    };

    if (sitemap.type === "urlset") {
      if (sitemap.urls.length === 0) return {
        status: "warning",
        message: "The sitemap exists but contains no URLs.",
        explanation: "An empty sitemap does not provide search engines with useful URL discovery signals.",
        suggestion: "Add the site's canonical, indexable URLs to the sitemap.",
      };
      return { status: "pass", message: `Sitemap found with ${sitemap.urls.length} URL(s).` };
    }

    if (sitemap.type === "sitemapindex") return {
      status: "pass",
      message: `Sitemap index found with ${sitemap.childSitemaps.length} child sitemap(s).`,
    };

    return {
      status: "warning",
      message: "A sitemap resource was found but could not be recognized as a standard XML sitemap.",
      explanation: "OpenSEO could not identify a standard sitemap URL set or sitemap index.",
      suggestion: "Validate the sitemap XML and ensure it follows the XML sitemap protocol.",
    };
  },
};
