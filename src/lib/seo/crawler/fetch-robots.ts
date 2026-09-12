import { fetchTextResource } from "./fetch-resource";
import type { RobotsData } from "../types";

function parseRobots(content: string) {
  const userAgents = new Set<string>();
  const disallow: string[] = [];
  const allow: string[] = [];
  const sitemaps: string[] = [];

  let currentUserAgents: string[] = [];

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.split("#", 1)[0].trim();

    if (!line) {
      continue;
    }

    const separator = line.indexOf(":");

    if (separator === -1) {
      continue;
    }

    const field = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();

    if (field === "user-agent") {
      if (!value) {
        currentUserAgents = [];
        continue;
      }

      currentUserAgents = [value];
      userAgents.add(value);

      continue;
    }

    if (field === "sitemap") {
      if (value) {
        sitemaps.push(value);
      }

      continue;
    }

    const appliesToWildcard = currentUserAgents.some(
      (userAgent) => userAgent === "*",
    );

    if (!appliesToWildcard) {
      continue;
    }

    if (field === "disallow" && value) {
      disallow.push(value);
    }

    if (field === "allow" && value) {
      allow.push(value);
    }
  }

  return {
    userAgents: [...userAgents],
    disallow,
    allow,
    sitemaps,
  };
}

export async function fetchRobots(siteUrl: string): Promise<RobotsData> {
  const origin = new URL(siteUrl).origin;
  const url = `${origin}/robots.txt`;

  const result = await fetchTextResource(url);

  if (!result.ok) {
    return {
      url,
      exists: false,
      statusCode: result.statusCode,
      content: "",
      userAgents: [],
      disallow: [],
      allow: [],
      sitemaps: [],
      fetchError:
        result.error ?? `HTTP ${result.statusCode}`,
    };
  }

  return {
    url: result.finalUrl,
    exists: true,
    statusCode: result.statusCode,
    content: result.content,
    ...parseRobots(result.content),
  };
}