/** Server-only caller supplies verified facts. Escape HTML-significant input. */
export function StructuredData({ value }: { value: unknown }) {
  if (!value) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replace(/</g, "\\u003c") }} />;
}
