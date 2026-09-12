import * as cheerio from "cheerio";

import { fetchTextResource } from "./fetch-resource";

import type { RobotsData, SitemapData } from "../types";

function parseSitemap(content: string) {
  const $ = cheerio.load(content, { xmlMode: true });

  const urls = $("urlset > url > loc")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);

  const childSitemaps = $("sitemapindex > sitemap > loc")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);

  if (urls.length || $("urlset").length) {
    return {
      type: "urlset" as const,
      urls,
      childSitemaps: [],
    };
  }

  if (childSitemaps.length || $("sitemapindex").length) {
    return {
      type: "sitemapindex" as const,
      urls: [],
      childSitemaps,
    };
  }

  return {
    type: "unknown" as const,
    urls: [],
    childSitemaps: [],
  };
}

function validateUrls(urls: string[]) {
  return urls.filter((url) => {
    try {
      const parsed = new URL(url);

      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  });
}

export async function fetchSitemap(
  siteUrl: string,
  robots: RobotsData,
): Promise<SitemapData> {
  const origin = new URL(siteUrl).origin;

  const candidates = [
    ...robots.sitemaps,
    `${origin}/sitemap.xml`,
  ].filter((value, index, array) => {
    return array.indexOf(value) === index;
  });

  let lastError = "No readable sitemap was found.";

  for (const candidate of candidates) {
    try {
      const candidateUrl = new URL(candidate, origin).toString();

      const result = await fetchTextResource(candidateUrl);

      if (!result.ok) {
        lastError =
          result.error ?? `HTTP ${result.statusCode}`;

        continue;
      }

      const parsed = parseSitemap(result.content);

      if (parsed.type === "unknown") {
        lastError = "Sitemap format could not be identified.";
        continue;
      }

      if (
        parsed.type === "urlset" &&
        parsed.urls.length === 0
      ) {
        lastError = "Sitemap exists but contains no URLs.";
        continue;
      }

      if (
        parsed.type === "sitemapindex" &&
        parsed.childSitemaps.length === 0
      ) {
        lastError =
          "Sitemap index exists but contains no child sitemaps.";
        continue;
      }

      const urls = validateUrls(parsed.urls);

      const childSitemaps = validateUrls(
        parsed.childSitemaps,
      );

      return {
        url: result.finalUrl,
        exists: true,
        statusCode: result.statusCode,
        content: result.content,
        type: parsed.type,
        urls,
        childSitemaps,
      };
    } catch (error) {
      lastError =
        error instanceof Error
          ? error.message
          : "Unknown sitemap error.";
    }
  }

  return {
    url: candidates[0] ?? `${origin}/sitemap.xml`,
    exists: false,
    statusCode: 0,
    content: "",
    type: "unknown",
    urls: [],
    childSitemaps: [],
    fetchError: lastError,
  };
}