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
import { redirectChainRule } from "./redirect-chain";
import { finalUrlIntegrityRule } from "./final-url-integrity";
import { httpResponseRule } from "./http-response";

export const seoRules: SeoRule[] = [httpResponseRule, redirectChainRule, finalUrlIntegrityRule, indexabilityRule, titleRule, metaDescriptionRule, h1Rule, canonicalRule, openGraphRule, imageAltRule, viewportRule, robotsRule, sitemapRule];
