import { fetchPage } from "./crawler/fetch-page";
import { fetchRobots } from "./crawler/fetch-robots";
import { fetchSitemap } from "./crawler/fetch-sitemap";
import { extractInternalLinks } from "./crawler/extract-links";
import { checkInternalLinks } from "./crawler/check-internal-links";
import { extractExternalLinks } from "./crawler/extract-external-links";
import { checkExternalLinks } from "./crawler/check-external-links";
import { extractStructuredData } from "./crawler/extract-structured.data";
import { extractImageResources } from "./crawler/extract-image-resources";
import { checkImageResources } from "./crawler/check-image-resources";
import { seoRules } from "./rules";
import { calculateScore, createSummary } from "./scoring";
import type { AuditReport, AuditResult } from "./types";

export async function runSeoAudit(url: string): Promise<AuditReport> {
  const page = await fetchPage(url);
  const robots = await fetchRobots(page.url);
  const sitemap = await fetchSitemap(page.url, robots);
  const links = extractInternalLinks(page);
  const internalLinkChecks = await checkInternalLinks(links);
  const externalLinks = extractExternalLinks(page);
  const externalLinkChecks = await checkExternalLinks(externalLinks);
  const structuredData = extractStructuredData(page);
  const imageResources = extractImageResources(page);
  const imageResourceChecks = await checkImageResources(imageResources);

  const context = {
    page,
    robots,
    sitemap,
    links,
    internalLinkChecks,
    externalLinkChecks,
    structuredData,
    imageResourceChecks,
  };

  const results: AuditResult[] = seoRules.map((rule) => {
    const checked = rule.check(context);

    return {
      id: rule.id,
      name: rule.name,
      category: rule.category,
      weight: rule.weight,
      severity: checked.severity ?? rule.severity,
      status: checked.status,
      message: checked.message,
      explanation: checked.explanation,
      suggestion: checked.suggestion,
      details: checked.details,
    };
  });

  const { score, maxScore } = calculateScore(seoRules, results);

  return {
    url: page.url,
    score,
    maxScore,
    results,
    summary: createSummary(results),
    crawledAt: new Date().toISOString(),
  };
}