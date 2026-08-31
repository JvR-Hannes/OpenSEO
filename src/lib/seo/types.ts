import type { CheerioAPI } from "cheerio";

export type AuditStatus = "pass" | "info" | "warning" | "fail";

export type Severity = "info" | "warning" | "error" | "critical";

export type SeoCategory =
  | "Technical SEO"
  | "On-page SEO"
  | "Social"
  | "Accessibility";

export type RedirectHop = {
  from: string;
  to: string;
  statusCode: number;
};

export type PageData = {
  url: string;
  html: string;
  $: CheerioAPI;
  statusCode: number;
  contentType: string;
  responseHeaders: Record<string, string>;
  redirects: RedirectHop[];
};

export type RobotsData = {
  url: string;
  exists: boolean;
  statusCode: number;
  content: string;
  userAgents: string[];
  disallow: string[];
  allow: string[];
  sitemaps: string[];
  fetchError?: string;
};

export type SitemapData = {
  url: string;
  exists: boolean;
  statusCode: number;
  content: string;
  type: "urlset" | "sitemapindex" | "unknown";
  urls: string[];
  childSitemaps: string[];
  fetchError?: string;
};

export type AuditContext = {
  page: PageData;
  robots: RobotsData;
  sitemap: SitemapData;
};

export type RuleCheckResult = {
  status: AuditStatus;
  message: string;
  explanation?: string;
  suggestion?: string;
  severity?: Severity;
};

export type SeoRule = {
  id: string;
  name: string;
  category: SeoCategory;
  weight: number;
  severity: Severity;
  check: (context: AuditContext) => RuleCheckResult;
};

export type AuditResult = RuleCheckResult & {
  id: string;
  name: string;
  category: SeoCategory;
  weight: number;
  severity: Severity;
};

export type AuditSummary = {
  passed: number;
  info: number;
  warnings: number;
  errors: number;
  critical: number;
};

export type AuditReport = {
  url: string;
  score: number;
  maxScore: number;
  results: AuditResult[];
  summary: AuditSummary;
  crawledAt: string;
};