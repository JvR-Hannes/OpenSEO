# OpenSEO v0.3

Open-source SEO auditing for developers.

## v0.3 — Technical SEO discovery

Adds:

- `robots.txt` discovery and parsing
- wildcard crawler rules
- sitemap discovery from `robots.txt` and `/sitemap.xml`
- sitemap XML parsing
- sitemap URL counting
- sitemap index detection
- page indexability detection
- `noindex` detection in robots meta, googlebot meta, and `X-Robots-Tag`
- informational findings that do not reduce the score
- expanded audit summary

### Current weighted rules

| Rule | Category | Weight | Default severity |
| --- | --- | ---: | --- |
| Indexability | Technical SEO | 20 | Critical |
| Page title | On-page SEO | 20 | Error |
| Meta description | On-page SEO | 15 | Error |
| H1 heading | On-page SEO | 15 | Error |
| Canonical URL | Technical SEO | 10 | Warning |
| Open Graph | Social | 10 | Warning |
| Image alt text | Accessibility | 10 | Warning |
| Mobile viewport | Technical SEO | 5 | Warning |
| robots.txt | Technical SEO | 5 | Warning |
| XML sitemap | Technical SEO | 10 | Warning |

Total: 120 weighted points. Score is normalized to 100.

### Scoring

- Pass = 100% of rule weight
- Info = 100% of rule weight
- Warning = 50% of rule weight
- Fail = 0% of rule weight

Severity describes importance; status describes the result.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Architecture

```text
src/lib/seo/
├── crawler/
│   ├── fetch-page.ts
│   ├── fetch-resource.ts
│   ├── fetch-robots.ts
│   └── fetch-sitemap.ts
├── rules/
│   ├── canonical.ts
│   ├── h1.ts
│   ├── images.ts
│   ├── index.ts
│   ├── indexability.ts
│   ├── meta-description.ts
│   ├── open-graph.ts
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── title.ts
│   └── viewport.ts
├── engine.ts
├── scoring.ts
└── types.ts
```
