export type LinkCheckResult = {
  url: string;
  statusCode: number | null;
  contentType: string;
  finalUrl: string | null;
  redirectCount: number;
  ok: boolean;
  error?: string;
};

const TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 10;

export async function checkLink(url: string): Promise<LinkCheckResult> {
  let currentUrl = url;
  let redirectCount = 0;

  try {
    while (redirectCount <= MAX_REDIRECTS) {
      const response = await fetch(currentUrl, {
        headers: {
          "User-Agent":
            "OpenSEO/0.2 (+https://github.com/your-org/openseo)",
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "manual",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      const location = response.headers.get("location");

      const isRedirect =
        response.status >= 300 &&
        response.status < 400 &&
        Boolean(location);

      if (isRedirect && location) {
        currentUrl = new URL(location, currentUrl).toString();
        redirectCount++;
        continue;
      }

      const contentType = response.headers.get("content-type") ?? "";

      return {
        url,
        statusCode: response.status,
        contentType,
        finalUrl: currentUrl,
        redirectCount,
        ok: response.status >= 200 && response.status < 300,
      };
    }

    return {
      url,
      statusCode: null,
      contentType: "",
      finalUrl: currentUrl,
      redirectCount,
      ok: false,
      error: `Too many redirects. The link exceeded ${MAX_REDIRECTS} redirects.`,
    };
  } catch (error) {
    return {
      url,
      statusCode: null,
      contentType: "",
      finalUrl: null,
      redirectCount,
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "The link could not be checked.",
    };
  }
}