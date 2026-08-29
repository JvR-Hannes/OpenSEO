import { fetchPage } from "./crawler/fetch-page";
import { fetchRobots } from "./crawler/fetch-robots";
import { fetchSitemap } from "./crawler/fetch-sitemap";
import { seoRules } from "./rules";
import { calculateScore, createSummary } from "./scoring";
import type { AuditReport, AuditResult } from "./types";

export async function runSeoAudit(url: string): Promise<AuditReport> {
  const page = await fetchPage(url);
  const robots = await fetchRobots(page.url);
  const sitemap = await fetchSitemap(page.url, robots);
  const context = { page, robots, sitemap };

  const results: AuditResult[] = seoRules.map((rule) => {
    const checked = rule.check(context);
    return { id: rule.id, name: rule.name, category: rule.category, weight: rule.weight, severity: checked.severity ?? rule.severity, status: checked.status, message: checked.message, explanation: checked.explanation, suggestion: checked.suggestion };
  });

  const { score, maxScore } = calculateScore(seoRules, results);
  return { url: page.url, score, maxScore, results, summary: createSummary(results), crawledAt: new Date().toISOString() };
}
