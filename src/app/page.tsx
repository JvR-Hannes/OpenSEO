import { AuditForm } from "@/components/audit-form";

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-16">
        <header className="mb-20">
          <div className="mb-4 inline-flex rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-sm text-neutral-400">
            Open source · Developer first
          </div>

          <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
            SEO auditing without the paywall.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-400">
            OpenSEO checks the technical and on-page SEO of your website and
            tells you exactly what needs fixing.
          </p>
        </header>

        <AuditForm />

        <footer className="mt-auto pt-20 text-sm text-neutral-600">
          OpenSEO is open source. Built for developers.
        </footer>
      </section>
    </main>
  );
}
