import { checkLink } from "./check-link";

export type ImageResourceCheck = {
  src: string;
  url: string;
  status: number | null;
  ok: boolean;
  error?: string;
};

export async function checkImageResources(
  urls: string[],
): Promise<ImageResourceCheck[]> {
  const results: ImageResourceCheck[] = [];
  const concurrency = 5;

  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);

    const batchResults = await Promise.all(
      batch.map(async (url): Promise<ImageResourceCheck> => {
        try {
          const result = await checkLink(url);

          return {
            src: url,
            url,
            status: result.statusCode,
            ok: result.ok,
            error: result.error,
          };
        } catch (error) {
          return {
            src: url,
            url,
            status: null,
            ok: false,
            error:
              error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
    );

    results.push(...batchResults);
  }

  return results;
}
