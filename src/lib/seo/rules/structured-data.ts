import type { SeoRule } from "../types";

export const structuredDataRule: SeoRule = {
  id: "structured-data",
  name: "Structured data",
  category: "Technical SEO",
  weight: 5,
  severity: "warning",

  check: ({ structuredData }) => {
    if (structuredData.length === 0) {
      return {
        status: "info",
        message: "No structured data was found.",
        explanation:
          "OpenSEO could not find any JSON-LD structured data on the audited page.",
        suggestion:
          "Consider adding relevant Schema.org structured data when it provides useful information about the page.",
      };
    }

    const invalidBlocks = structuredData.filter((block) => !block.valid);
    const validBlocks = structuredData.filter((block) => block.valid);

    if (invalidBlocks.length > 0) {
      return {
        status: "warning",
        message: `${invalidBlocks.length} ${
          invalidBlocks.length === 1
            ? "structured data block contains"
            : "structured data blocks contain"
        } invalid JSON.`,
        explanation:
          "Invalid JSON-LD cannot be reliably interpreted by search engines.",
        suggestion:
          "Fix the JSON syntax in the affected JSON-LD blocks.",
        details: invalidBlocks.map(
          (block, index) =>
            `Block ${index + 1}: ${
              block.error ?? "Invalid JSON-LD."
            }`,
        ),
      };
    }

    const types = [
      ...new Set(
        validBlocks.flatMap((block) => block.types),
      ),
    ];

    if (types.length === 0) {
      return {
        status: "warning",
        message: `${structuredData.length} ${
          structuredData.length === 1
            ? "structured data block was"
            : "structured data blocks were"
        } found, but no @type was detected.`,
        explanation:
          "JSON-LD was found and parsed successfully, but the structured data does not declare a recognizable @type.",
        suggestion:
          "Add an appropriate Schema.org @type to describe the content represented by the structured data.",
      };
    }

    return {
      status: "pass",
      message: `${structuredData.length} ${
        structuredData.length === 1
          ? "structured data block"
          : "structured data blocks"
      } detected.`,
      explanation:
        "OpenSEO found valid JSON-LD structured data with identifiable Schema.org types.",
      details: types.map((type) => `@type: ${type}`),
    };
  },
};