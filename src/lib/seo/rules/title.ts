import type { SeoRule } from "../types";

export const titleRule: SeoRule = {
  id: "title",
  name: "Page title",
  category: "On-page SEO",
  weight: 20,
  severity: "error",

  check({ page }) {
    const title = page.$("title").first().text().trim();

    if (!title) {
      return {
        status: "fail",
        message: "The page does not have a <title> element.",
        explanation:
          "The title helps search engines and users understand what the page is about and is commonly displayed in search results.",
        suggestion:
          "Add a unique, descriptive <title> element to the page.",
      };
    }

    if (title.length < 20 || title.length > 60) {
      return {
        status: "warning",
        message: `The title is ${title.length} characters long.`,
        explanation:
          "Very short titles can lack context, while very long titles may be truncated in search results.",
        suggestion:
          "Review the title and keep it concise while clearly describing the page.",
      };
    }

    return {
      status: "pass",
      message: `Title found: "${title}"`,
    };
  },
};
