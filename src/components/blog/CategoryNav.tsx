import Link from "next/link";
import { categories } from "@/content/blog/categories";

/**
 * Filtro por silo. São links para páginas estáticas, não um filtro em
 * JavaScript: cada silo tem URL própria, indexável, e funciona sem script.
 */
export function CategoryNav({ active }: { active?: string }) {
  const items: { id?: string; label: string; href: string }[] = [
    { label: "Todos", href: "/blog" },
    ...categories.map((c) => ({ id: c.id, label: c.label, href: `/blog/${c.id}` })),
  ];

  return (
    <nav aria-label="Assuntos do blog" className="-mx-1 overflow-x-auto">
      <ul className="flex w-max gap-2 px-1 pb-1">
        {items.map((item) => {
          const current = item.id === active;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={[
                  "inline-flex rounded-full border px-4 py-2 text-small font-medium transition-colors",
                  current
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-ink hover:border-ink hover:bg-surface",
                ].join(" ")}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
