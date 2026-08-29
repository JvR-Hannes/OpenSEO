import * as cheerio from "cheerio";
import { fetchTextResource } from "./fetch-resource";
import type { RobotsData, SitemapData } from "../types";

function parseSitemap(content: string) {
  const $ = cheerio.load(content, { xmlMode: true });
  const urls = $("urlset > url > loc").map((_, el) => $(el).text().trim()).get().filter(Boolean);
  const childSitemaps = $("sitemapindex > sitemap > loc").map((_, el) => $(el).text().trim()).get().filter(Boolean);

  if (urls.length || $("urlset").length) return { type: "urlset" as const, urls, childSitemaps: [] };
  if (childSitemaps.length || $("sitemapindex").length) return { type: "sitemapindex" as const, urls: [], childSitemaps };
  return { type: "unknown" as const, urls: [], childSitemaps: [] };
}

export async function fetchSitemap(siteUrl: string, robots: RobotsData): Promise<SitemapData> {
  const origin = new URL(siteUrl).origin;
  const candidates = [...robots.sitemaps, `${origin}/sitemap.xml`].filter((v, i, a) => a.indexOf(v) === i);

  for (const candidate of candidates) {
    try {
      const candidateUrl = new URL(candidate, origin).toString();
      const result = await fetchTextResource(candidateUrl);
      if (!result.ok) continue;
      const parsed = parseSitemap(result.content);
      if (parsed.type !== "unknown") return { url: result.finalUrl, exists: true, statusCode: result.statusCode, content: result.content, ...parsed };
    } catch {
      // Continue with the next candidate.
    }
  }

  return { url: candidates[0] ?? `${origin}/sitemap.xml`, exists: false, statusCode: 0, content: "", type: "unknown", urls: [], childSitemaps: [], fetchError: "No readable sitemap was found." };
}
