import { checkLink, type LinkCheckResult } from "./check-link";
import type { InternalLink } from "../types";

const MAX_LINKS = 50;
const CONCURRENCY = 5;

export type InternalLinkCheck = InternalLink & {
  check: LinkCheckResult;
};

export async function checkInternalLinks(
  links: InternalLink[],
): Promise<InternalLinkCheck[]> {
  const linksToCheck = links.slice(0, MAX_LINKS);
  const results: InternalLinkCheck[] = [];

  for (let i = 0; i < linksToCheck.length; i += CONCURRENCY) {
    const batch = linksToCheck.slice(i, i + CONCURRENCY);

    const batchResults = await Promise.all(
      batch.map(async (link) => {
        const check = await checkLink(link.url);

        return {
          ...link,
          check,
        };
      }),
    );

    results.push(...batchResults);
  }

  return results;
}