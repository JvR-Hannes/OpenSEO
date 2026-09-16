import { describe, expect, it, vi } from "vitest";
import { fetchPage } from "./fetch-page";

describe("fetchPage", () => {
  it("rejects redirects to private IP addresses", async () => {
    await expect(
      fetchPage(
        "https://httpbin.org/redirect-to?url=http%3A%2F%2F127.0.0.1%2F",
      ),
    ).rejects.toThrow();
  });

  it("rejects excessive redirects", async () => {
  await expect(
    fetchPage("https://httpbin.org/redirect/11"),
  ).rejects.toThrow("Too many redirects");
});

it("handles request timeouts", async () => {
  vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(
    new DOMException("The operation was aborted.", "TimeoutError"),
  );

  await expect(fetchPage("https://example.com")).rejects.toThrow();

  vi.restoreAllMocks();
});

it("rejects HTML documents that exceed the size limit", async () => {
  const oversizedHtml = "x".repeat(2_000_001);

  vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
    new Response(oversizedHtml, {
      status: 200,
      headers: {
        "content-type": "text/html",
      },
    }),
  );

  await expect(fetchPage("https://example.com")).rejects.toThrow(
    "The HTML document is too large to audit.",
  );

  vi.restoreAllMocks();
});
});