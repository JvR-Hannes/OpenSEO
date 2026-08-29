import type { SeoRule } from "../types";

export const viewportRule: SeoRule = {
  id: "viewport",
  name: "Mobile viewport",
  category: "Technical SEO",
  weight: 5,
  severity: "warning",

  check({ page }) {
    const viewport = page.$('meta[name="viewport"]').attr("content")?.trim();

    if (!viewport) {
      return {
        status: "warning",
        message: "No mobile viewport meta tag was found.",
        explanation:
          "The viewport declaration helps browsers render pages correctly across different device widths.",
        suggestion:
          'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
      };
    }

    return {
      status: "pass",
      message: "A mobile viewport meta tag is present.",
    };
  },
};
