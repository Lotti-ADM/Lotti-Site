import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CategoryNav } from "@/components/blog/CategoryNav";
import { JsonLd } from "@/components/blog/JsonLd";
import { PostCard } from "@/components/blog/PostCard";
import { categories } from "@/content/blog/categories";
import { siteConfig } from "@/config/site";
import { getAllPosts, getFeaturedPosts, getPostsByCategory } from "@/lib/blog";

const description =
  "Captação, atendimento, funil de vendas, contratos e aluguéis: guias práticos para corretores e imobiliárias pequenas organizarem a operação.";

export function generateMetadata(): Metadata {
  const hasPosts = getAllPosts().length > 0;
  return {
    title: "Blog de Gestão Imobiliária para Corretores",
    description,
    alternates: { canonical: "/blog" },
    openGraph: { type: "website", url: "/blog", title: "Blog da Lotti", description },
    // Sem post publicado a página é casca vazia — não vale indexar.
    ...(hasPosts ? {} : { robots: { index: false, follow: true } }),
  };
}

export default function BlogPage() {
  const posts = getAllPosts();
  const [lead, ...rest] = posts;
  const featured = getFeaturedPosts().slice(0, 4);

  return (
    <>
      <Header />
      <main className="pt-28 sm:pt-32">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${siteConfig.url}/blog#blog`,
            name: "Blog da Lotti",
            description,
            url: `${siteConfig.url}/blog`,
            inLanguage: "pt-BR",
            publisher: {
              "@type": "Organization",
              "@id": `${siteConfig.url}/#organization`,
              name: siteConfig.name,
              url: siteConfig.url,
            },
          }}
        />

        <header className="shell">
          <p className="eyebrow">Blog da Lotti</p>
          <h1 className="mt-5 max-w-3xl text-display text-balance">
            Gestão imobiliária na prática
          </h1>
          <p className="mt-6 max-w-2xl text-lead text-muted">{description}</p>
          <div className="mt-10">
            <CategoryNav />
          </div>
        </header>

        {lead ? (
          <section aria-label="Destaque" className="shell mt-12 sm:mt-16">
            <PostCard post={lead} variant="lead" headingLevel="h2" />
          </section>
        ) : (
          <section className="shell mt-12 sm:mt-16">
            <div className="card px-6 py-12 text-center sm:px-12">
              <p className="text-h3 font-semibold">Os primeiros artigos estão em preparação.</p>
              <p className="mx-auto mt-3 max-w-md text-muted">
                Enquanto isso, conheça como a Lotti organiza a operação da imobiliária.
              </p>
              <Link href="/" className="btn btn-primary mt-8">
                Conhecer a Lotti
                <ArrowRight aria-hidden size={16} className="btn-arrow" />
              </Link>
            </div>
          </section>
        )}

        {/* Guias por silo — o atalho fixo para os assuntos centrais (padrão do
            bloco "Um guia completo para você" do blog do ZAP). */}
        <section aria-labelledby="assuntos" className="section">
          <div className="shell">
            <h2 id="assuntos" className="text-h2">
              Assuntos
            </h2>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const count = getPostsByCategory(category.id).length;
                return (
                  <li key={category.id}>
                    <Link
                      href={`/blog/${category.id}`}
                      className="card group flex h-full flex-col gap-3 p-6"
                    >
                      <span className="flex items-center justify-between gap-4 font-semibold">
                        {category.label}
                        <ArrowRight
                          aria-hidden
                          size={16}
                          className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                        />
                      </span>
                      <span className="text-small text-muted">{category.description}</span>
                      <span className="mt-auto pt-2 text-small text-muted" data-numeric>
                        {count === 0 ? "Em breve" : count === 1 ? "1 artigo" : `${count} artigos`}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {rest.length > 0 && (
          <section aria-labelledby="recentes" className="section pt-0">
            <div className="shell">
              <h2 id="recentes" className="text-h2">
                Mais recentes
              </h2>
              <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        {featured.length > 0 && (
          <section aria-labelledby="mais-lidas" className="section bg-surface">
            <div className="shell">
              <h2 id="mais-lidas" className="text-h2">
                Mais lidas
              </h2>
              <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                {featured.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
