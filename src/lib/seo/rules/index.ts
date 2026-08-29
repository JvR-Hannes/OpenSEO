import type { SeoRule } from "../types";
import { indexabilityRule } from "./indexability";
import { titleRule } from "./title";
import { metaDescriptionRule } from "./meta-description";
import { h1Rule } from "./h1";
import { canonicalRule } from "./canonical";
import { openGraphRule } from "./open-graph";
import { imageAltRule } from "./images";
import { viewportRule } from "./viewport";
import { robotsRule } from "./robots";
import { sitemapRule } from "./sitemap";

export const seoRules: SeoRule[] = [indexabilityRule, titleRule, metaDescriptionRule, h1Rule, canonicalRule, openGraphRule, imageAltRule, viewportRule, robotsRule, sitemapRule];
