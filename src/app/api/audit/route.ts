import { NextResponse } from "next/server";
import { z } from "zod";
import { runSeoAudit } from "@/lib/seo/engine";

const requestSchema = z.object({
  url: z.string().trim().min(1, "Please enter a URL."),
});

function normalizeUrl(input: string) {
  const trimmed = input.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return new URL(trimmed);
  }

  return new URL(`https://${trimmed}`);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please enter a URL." },
        { status: 400 },
      );
    }

    let url: URL;

    try {
      url = normalizeUrl(parsed.data.url);
    } catch {
      return NextResponse.json(
        { error: "Please provide a valid website URL." },
        { status: 400 },
      );
    }

    const report = await runSeoAudit(url.toString());

    return NextResponse.json(report);
  } catch (error) {
    console.error("Audit error:", error);

    return NextResponse.json(
      {
        error:
          "OpenSEO could not fetch that website. Check the URL and try again.",
      },
      { status: 502 },
    );
  }
}
