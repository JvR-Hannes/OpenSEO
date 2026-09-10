export default function TestStructuredDataPage() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1>OpenSEO Structured Data Test</h1>

      <p>
        This page is intentionally used to test OpenSEO structured data
        detection.
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "OpenSEO",
            url: "http://localhost:3000",
          }),
        }}
      />
    </main>
  );
}
