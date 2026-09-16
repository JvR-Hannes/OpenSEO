import { describe, expect, it } from "vitest";
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
});