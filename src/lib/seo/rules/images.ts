import type { SeoRule } from "../types";

export const imageAltRule: SeoRule = {
  id: "image-alt",
  name: "Image alt text",
  category: "Accessibility",
  weight: 10,
  severity: "warning",

  check({ page }) {
    const images = page.$("img");

    if (images.length === 0) {
      return {
        status: "pass",
        message: "No images were found on the page.",
      };
    }

    const missingAlt = images.filter((_, element) => {
      return !page.$(element).attr("alt")?.trim();
    }).length;

    if (missingAlt > 0) {
      return {
        status: "warning",
        message: `${missingAlt} of ${images.length} images are missing an alt attribute.`,
        explanation:
          "Alternative text helps people using assistive technology understand informative images and provides text context when an image cannot be displayed.",
        suggestion:
          "Add meaningful alt text to informative images. Use alt=\"\" for purely decorative images.",
      };
    }

    return {
      status: "pass",
      message: "All images have an alt attribute.",
    };
  },
};
