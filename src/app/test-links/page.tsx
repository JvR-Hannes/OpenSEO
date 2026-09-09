export default function TestLinksPage() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1>OpenSEO Link Integrity Test</h1>

      <p>
        This page is intentionally used to test OpenSEO internal and external
        link checking.
      </p>

      <h2>Internal links</h2>

      <nav>
        <ul>
          <li>
            <a href="/">Valid homepage link</a>
          </li>

          <li>
            <a href="/this-page-does-not-exist">Broken internal link</a>
          </li>
        </ul>
      </nav>

      <h2>External links</h2>

      <nav>
        <ul>
          <li>
            <a href="https://example.com">Valid external link</a>
          </li>

          <li>
            <a href="https://example.com/this-page-does-not-exist">
              Broken external link
            </a>
          </li>
        </ul>
      </nav>
    </main>
  );
}
