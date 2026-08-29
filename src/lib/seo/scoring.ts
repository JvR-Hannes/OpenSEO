import type { AuditResult, AuditSummary, AuditStatus, SeoRule } from "./types";

const STATUS_SCORE: Record<AuditStatus, number> = { pass: 1, info: 1, warning: 0.5, fail: 0 };

export function calculateScore(rules: SeoRule[], results: AuditResult[]) {
  const maxScore = rules.reduce((total, rule) => total + rule.weight, 0);
  const earnedScore = results.reduce((total, result) => total + result.weight * STATUS_SCORE[result.status], 0);
  const score = maxScore === 0 ? 0 : Math.round((earnedScore / maxScore) * 100);
  return { score: Math.max(0, Math.min(100, score)), maxScore };
}

export function createSummary(results: AuditResult[]): AuditSummary {
  return results.reduce<AuditSummary>((summary, result) => {
    if (result.status === "pass") summary.passed += 1;
    if (result.status === "info") summary.info += 1;
    if (result.status === "warning") summary.warnings += 1;
    if (result.severity === "error" && result.status === "fail") summary.errors += 1;
    if (result.severity === "critical" && result.status === "fail") summary.critical += 1;
    return summary;
  }, { passed: 0, info: 0, warnings: 0, errors: 0, critical: 0 });
}
