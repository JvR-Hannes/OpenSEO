import type { SeoRule } from "../types";

export const imageResourcesRule: SeoRule = {
  id: "image-resources",
  name: "Image resource integrity",
  category: "Technical SEO",
  weight: 5,
  severity: "warning",

  check({ imageResourceChecks }) {
    if (imageResourceChecks.length === 0) {
      return {
        status: "info",
        message: "No image resources were found on the page.",
      };
    }

    const broken = imageResourceChecks.filter((check) => !check.ok);

    if (broken.length > 0) {
      return {
        status: "warning",
        message: `${broken.length} of ${imageResourceChecks.length} image resources could not be loaded.`,
        details: broken.map((check) => {
          if (check.status !== null) {
            return `${check.url} — HTTP ${check.status}`;
          }

          return `${check.url} — ${check.error ?? "Unknown error"}`;
        }),
        suggestion:
          "Check the affected image URLs and make sure the resources are publicly accessible and return a successful HTTP response.",
      };
    }

    return {
      status: "pass",
      message: `All ${imageResourceChecks.length} image resources are reachable.`,
    };
  },
};