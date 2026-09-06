export default function TestLinksPage() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1>OpenSEO Internal Link Test</h1>

      <p>
        This page is intentionally used to test OpenSEO internal link checking.
      </p>

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
    </main>
  );
}
