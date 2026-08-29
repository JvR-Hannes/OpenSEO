import type { SeoRule } from "../types";

export const metaDescriptionRule: SeoRule = {
  id: "meta-description",
  name: "Meta description",
  category: "On-page SEO",
  weight: 15,
  severity: "error",

  check({ page }) {
    const description = page.$('meta[name="description"]')
      .attr("content")
      ?.trim();

    if (!description) {
      return {
        status: "fail",
        message: "No meta description was found.",
        explanation:
          "A useful meta description can help search engines understand the page and can influence the text shown to users in search results.",
        suggestion:
          "Add a unique meta description that accurately summarizes the page.",
      };
    }

    if (description.length < 50 || description.length > 160) {
      return {
        status: "warning",
        message: `The meta description is ${description.length} characters long.`,
        explanation:
          "Descriptions that are extremely short may lack useful context, while long descriptions may be truncated.",
        suggestion:
          "Rewrite it so it is concise, specific, and useful to someone deciding whether to visit the page.",
      };
    }

    return {
      status: "pass",
      message: "A meta description is present and within the recommended review range.",
    };
  },
};
