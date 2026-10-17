/**
 * JSON-LD com o "<" escapado. Os posts vêm de arquivos do repositório, mas
 * título e FAQ são texto livre: sem o escape, um "</script>" digitado num
 * campo fecharia a tag. É a recomendação do guia de JSON-LD do Next.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
