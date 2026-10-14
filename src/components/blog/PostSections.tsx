import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { Post, TocItem } from "@/lib/blog";

/** "Em resumo": as respostas do post antes do texto, para quem só passa o olho. */
export function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <aside aria-labelledby="em-resumo" className="rounded-[var(--radius-card)] bg-surface p-6 sm:p-8">
      <h2 id="em-resumo" className="eyebrow">
        Em resumo
      </h2>
      <ul className="mt-5 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-body">
            <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 flex-none rounded-full bg-forest" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/**
 * Sumário. Só aparece com duas seções ou mais — um item sozinho é ruído.
 * A página o renderiza duas vezes (mobile e lateral do desktop), por isso
 * nada aqui leva id.
 */
export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.filter((i) => i.level === 2).length < 2) return null;

  return (
    <nav aria-label="Neste artigo" className="border-l border-line pl-5">
      <p aria-hidden className="eyebrow">
        Neste artigo
      </p>
      <ol className="mt-4 grid gap-2.5 text-small">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "pl-4" : undefined}>
            <a
              href={`#${item.id}`}
              className={
                item.level === 2
                  ? "text-ink transition-colors hover:text-forest"
                  : "text-muted transition-colors hover:text-forest"
              }
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** A chamada para o produto vem do silo — o redator não escreve CTA à mão. */
export function CategoryCta({ post }: { post: Post }) {
  const { cta } = post.categoryData;
  return (
    <aside className="on-ink relative overflow-hidden rounded-[var(--radius-card)] bg-ink p-8 text-paper sm:p-10">
      <div aria-hidden className="blade-field opacity-60">
        <div className="blade" style={{ left: "72%", width: "16%" }} />
      </div>
      <div className="relative max-w-xl">
        <p className="eyebrow">Lotti</p>
        <p className="mt-4 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em]">
          {cta.title}
        </p>
        <p className="mt-3 text-paper/75">{cta.text}</p>
        <Link href={cta.href} className="btn btn-inverted mt-6">
          {cta.label}
          <ArrowRight aria-hidden size={16} className="btn-arrow" />
        </Link>
      </div>
    </aside>
  );
}

/** Perguntas em <details>: abre sem JavaScript e o texto continua indexável. */
export function Faq({ items }: { items: Post["faq"] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="perguntas-frequentes">
      <h2 id="perguntas-frequentes" className="text-[1.5rem] font-semibold tracking-[-0.02em]">
        Perguntas frequentes
      </h2>
      <div className="mt-6 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-semibold [&::-webkit-details-marker]:hidden">
              {item.q}
              <span
                aria-hidden
                className="mt-1 text-muted transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Sources({ items }: { items: Post["sources"] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="fontes">
      <h2 id="fontes" className="eyebrow">
        Fontes
      </h2>
      <ol className="mt-4 grid gap-2 text-small">
        {items.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-1.5 text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink"
            >
              {source.label}
              <ExternalLink aria-hidden size={13} className="mt-1 flex-none" />
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function AuthorBox({ post }: { post: Post }) {
  const author = post.authorData;
  return (
    <section aria-label="Sobre o autor" className="card flex gap-5 p-6">
      <span
        aria-hidden
        className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-forest text-small font-semibold text-paper"
      >
        {author.name
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("")}
      </span>
      <div>
        <p className="font-semibold">{author.name}</p>
        <p className="text-small text-muted">{author.role}</p>
        <p className="mt-2 text-small text-muted">{author.bio}</p>
      </div>
    </section>
  );
}
