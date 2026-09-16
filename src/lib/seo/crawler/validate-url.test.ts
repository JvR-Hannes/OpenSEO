import { describe, expect, it } from "vitest";
import { validateUrl } from "./validate-url";

describe("validateUrl", () => {
  it("rejects localhost", async () => {
    await expect(validateUrl("http://localhost:3000")).rejects.toThrow(
      "Localhost URLs are not allowed.",
    );
  });

  it("rejects 127.0.0.1", async () => {
    await expect(validateUrl("http://127.0.0.1")).rejects.toThrow(
      "Private or local IP addresses are not allowed.",
    );
  });

  it("rejects private 192.168.x.x addresses", async () => {
    await expect(validateUrl("http://192.168.1.1")).rejects.toThrow(
      "Private or local IP addresses are not allowed.",
    );
  });

  it("rejects private 10.x.x.x addresses", async () => {
    await expect(validateUrl("http://10.0.0.1")).rejects.toThrow(
      "Private or local IP addresses are not allowed.",
    );
  });

  it("rejects private 172.16.x.x addresses", async () => {
    await expect(validateUrl("http://172.16.0.1")).rejects.toThrow(
      "Private or local IP addresses are not allowed.",
    );
  });

  it("rejects link-local addresses", async () => {
    await expect(validateUrl("http://169.254.1.1")).rejects.toThrow(
      "Private or local IP addresses are not allowed.",
    );
  });

  it("rejects non-HTTP protocols", async () => {
    await expect(validateUrl("ftp://example.com")).rejects.toThrow(
      "Only HTTP and HTTPS URLs are allowed.",
    );
  });

  it("rejects invalid URLs", async () => {
    await expect(validateUrl("not-a-valid-url")).rejects.toThrow(
      "Invalid URL.",
    );
  });
});