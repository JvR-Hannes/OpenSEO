import type { SeoRule } from "../types";

export const redirectChainRule: SeoRule = {
  id: "redirect-chain",
  name: "Redirect chain",
  category: "Technical SEO",
  weight: 5,
  severity: "warning",

  check: ({ page }) => {
    const { count, chain } = page.redirect;

    if (count === 0) {
      return {
        status: "pass",
        message: "The requested URL does not redirect.",
      };
    }

    if (count === 1) {
      return {
        status: "info",
        message: "The requested URL redirects once before reaching the final URL.",
        details: chain,
      };
    }

    if (count === 2) {
      return {
        status: "warning",
        message: "The requested URL uses two redirects. Consider reducing the redirect chain.",
        details: chain,
      };
    }

    return {
      status: "fail",
      message: `The requested URL uses ${count} redirects. Long redirect chains should be reduced.`,
      details: chain,
    };
  },
};