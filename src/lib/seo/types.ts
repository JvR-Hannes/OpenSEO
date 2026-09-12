import type { CheerioAPI } from "cheerio";
import { InternalLinkCheck } from "./crawler/check-internal-links";
import { ExternalLinkCheck } from "./crawler/check-external-links";
import { ImageResourceCheck } from "./crawler/check-image-resources";

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

export type InternalLink = {
  href: string;
  url: string;
  text: string;
};

export type ExternalLink = {
  href: string;
  url: string;
  text: string;
};

export type StructuredDataBlock = {
  raw: string;
  valid: boolean;
  types: string[];
  context?: string;
  error?: string;
};

export type PageData = {
  url: string;
  requestedUrl: string;
  html: string;
  $: CheerioAPI;
  statusCode: number;
  contentType: string;
  responseHeaders: Record<string, string>;
  redirect: {
    occurred: boolean;
    chain: string[];
    count: number;
  };
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
  links: InternalLink[];
  internalLinkChecks: InternalLinkCheck[];
  externalLinkChecks: ExternalLinkCheck[];
  structuredData: StructuredDataBlock[];
  imageResourceChecks: ImageResourceCheck[];
};

export type RuleCheckResult = {
  status: AuditStatus;
  message: string;
  explanation?: string;
  suggestion?: string;
  details?: string[];
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