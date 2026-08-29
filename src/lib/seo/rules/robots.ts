import type { SeoRule } from "../types";

export const robotsRule: SeoRule = {
  id: "robots-txt",
  name: "robots.txt",
  category: "Technical SEO",
  weight: 5,
  severity: "warning",
  check({ robots }) {
    if (!robots.exists) return {
      status: "info", severity: "info",
      message: "No robots.txt file was found.",
      explanation: "robots.txt is optional, but it can provide crawler guidance and advertise sitemap locations.",
      suggestion: "Add a robots.txt file if you need to control crawler access or publish your sitemap location.",
    };

    if (robots.disallow.some((path) => path === "/")) return {
      status: "warning",
      message: "robots.txt disallows / for the wildcard user-agent.",
      explanation: "A wildcard Disallow: / directive tells compliant crawlers not to crawl the site's URLs.",
      suggestion: "If this is a public website, review the wildcard robots.txt rules before relying on organic search traffic.",
    };

    return { status: "pass", message: `robots.txt found with ${robots.disallow.length} wildcard disallow rule(s).` };
  },
};
