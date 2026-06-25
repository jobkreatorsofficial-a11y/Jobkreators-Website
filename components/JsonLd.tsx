/**
 * JsonLd — renders a schema.org JSON-LD block. Server component; the Next.js 16
 * recommended way to inject structured data is a <script type="application/ld+json">
 * rendered in the route. Pass a plain JSON-serializable object.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Data is author-controlled (no user input), so this is safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
