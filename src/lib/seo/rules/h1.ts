import type { SeoRule } from "../types";

export const h1Rule: SeoRule = {
  id: "h1",
  name: "H1 heading",
  category: "On-page SEO",
  weight: 15,
  severity: "error",

  check({ page }) {
    const count = page.$("h1").length;

    if (count === 0) {
      return {
        status: "fail",
        message: "No H1 heading was found.",
        explanation:
          "The primary heading gives users and search engines a strong indication of the main topic of the page.",
        suggestion:
          "Add a clear H1 that describes the primary topic of the page.",
      };
    }

    if (count > 1) {
      return {
        status: "warning",
        message: `Found ${count} H1 headings.`,
        explanation:
          "Multiple H1 elements are allowed by modern HTML, but several competing primary headings can make page structure less clear.",
        suggestion:
          "Review the headings and make sure the page has one obvious primary heading.",
      };
    }

    return {
      status: "pass",
      message: "Exactly one H1 heading was found.",
    };
  },
};
