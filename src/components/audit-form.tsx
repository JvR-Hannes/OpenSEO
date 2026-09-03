"use client";

import { useState } from "react";
import type {
  AuditReport,
  AuditResult,
  AuditStatus,
  Severity,
} from "@/lib/seo/types";

export function AuditForm() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runAudit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setReport(null);

    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Audit failed.");
      }

      setReport(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while running the audit.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={runAudit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com"
          className="min-w-0 flex-1 rounded-xl border border-neutral-800 bg-neutral-950 px-5 py-4 text-white outline-none transition focus:border-neutral-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-white px-7 py-4 font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Auditing..." : "Run audit"}
        </button>
      </form>

      {error && (
        <div className="mt-5 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {report && <AuditResults report={report} />}
    </div>
  );
}

function AuditResults({ report }: { report: AuditReport }) {
  const grouped = report.results.reduce<Record<string, AuditResult[]>>(
    (groups, result) => {
      (groups[result.category] ??= []).push(result);
      return groups;
    },
    {},
  );

  return (
    <section className="mt-10">
      <div className="mb-6 rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-neutral-500">Audit result</p>
            <h2 className="mt-1 break-all text-xl font-semibold">
              {report.url}
            </h2>
          </div>

          <div className="sm:text-right">
            <div className="text-5xl font-bold">{report.score}</div>
            <div className="text-sm text-neutral-500">SEO score / 100</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <SummaryCard label="Passed" value={report.summary.passed} />
          <SummaryCard label="Info" value={report.summary.info} />
          <SummaryCard label="Warnings" value={report.summary.warnings} />
          <SummaryCard label="Errors" value={report.summary.errors} />
          <SummaryCard label="Critical" value={report.summary.critical} />
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([category, results]) => (
          <section key={category}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500">
              {category}
            </h3>

            <div className="space-y-3">
              {results.map((result) => (
                <AuditResultCard key={result.id} result={result} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function AuditResultCard({ result }: { result: AuditResult }) {
  return (
    <article className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5">
      {" "}
      <div className="flex gap-4">
        {" "}
        <StatusIcon status={result.status} />{" "}
        <div className="min-w-0 flex-1">
          {" "}
          <div className="flex flex-wrap items-center gap-2">
            {" "}
            <h4 className="font-semibold">{result.name}</h4>{" "}
            <ResultBadge result={result} />{" "}
            <span className="text-xs text-neutral-600">
              {" "}
              {result.weight} pts{" "}
            </span>{" "}
          </div>{" "}
          <p className="mt-2 text-sm leading-6 text-neutral-400">
            {" "}
            {result.message}{" "}
          </p>{" "}
          {result.explanation && (
            <div className="mt-4 rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
              {" "}
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                {" "}
                Why this matters{" "}
              </p>{" "}
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                {" "}
                {result.explanation}{" "}
              </p>{" "}
            </div>
          )}{" "}
          {result.suggestion && (
            <div className="mt-3 rounded-lg bg-neutral-900 p-4 text-sm text-neutral-300">
              {" "}
              <span className="font-semibold text-white">Fix: </span>{" "}
              {result.suggestion}{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </article>
  );
}

function ResultBadge({ result }: { result: AuditResult }) {
  if (result.status === "pass") {
    return null;
  }
  if (result.status === "info") {
    return (
      <span className="rounded-full border border-neutral-800 px-2 py-0.5 text-[11px] text-neutral-500">
        {" "}
        Info{" "}
      </span>
    );
  }
  return <SeverityBadge severity={result.severity} />;
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
      <div className="text-2xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-neutral-500">{label}</div>
    </div>
  );
}

function StatusIcon({ status }: { status: AuditStatus }) {
  const symbol =
    status === "pass"
      ? "✓"
      : status === "info"
        ? "i"
        : status === "warning"
          ? "!"
          : "×";

  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-700 text-sm font-bold">
      {symbol}
    </div>
  );
}

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className="rounded-full border border-neutral-800 px-2 py-0.5 text-[11px] capitalize text-neutral-500">
      {severity}
    </span>
  );
}
