import type { PageData, StructuredDataBlock } from "../types";

export function extractStructuredData(
  page: PageData,
): StructuredDataBlock[] {
  const blocks: StructuredDataBlock[] = [];

  page.$('script[type="application/ld+json"]').each((_, element) => {
    const raw = page.$(element).html()?.trim() ?? "";

    if (!raw) {
      blocks.push({
        raw,
        valid: false,
        types: [],
        error: "The JSON-LD block is empty.",
      });

      return;
    }

    try {
      const parsed = JSON.parse(raw);
      const types = extractTypes(parsed);

      blocks.push({
        raw,
        valid: true,
        types,
      });
    } catch (error) {
      blocks.push({
        raw,
        valid: false,
        types: [],
        error:
          error instanceof Error
            ? error.message
            : "The JSON-LD block contains invalid JSON.",
      });
    }
  });

  return blocks;
}

function extractTypes(value: unknown): string[] {
  const types: string[] = [];

  if (Array.isArray(value)) {
    for (const item of value) {
      types.push(...extractTypes(item));
    }

    return [...new Set(types)];
  }

  if (!value || typeof value !== "object") {
    return types;
  }

  const object = value as Record<string, unknown>;

  if (typeof object["@type"] === "string") {
    types.push(object["@type"]);
  }

  if (Array.isArray(object["@type"])) {
    types.push(
      ...object["@type"].filter(
        (type): type is string => typeof type === "string",
      ),
    );
  }

  return [...new Set(types)];
}