import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { CategoryNav } from "@/components/blog/CategoryNav";
import { JsonLd } from "@/components/blog/JsonLd";
import { PostCard } from "@/components/blog/PostCard";
import { categories, getCategory } from "@/content/blog/categories";
import { siteConfig } from "@/config/site";
import { getPostsByCategory } from "@/lib/blog";

type Props = { params: Promise<{ categoria: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ categoria: c.id }));
}

// Silo fora da lista é 404 — nunca uma página "sem-categoria" gerada sob demanda.
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const category = getCategory(categoria);
  if (!category) return {};

  const path = `/blog/${category.id}`;
  const hasPosts = getPostsByCategory(category.id).length > 0;
  return {
    title: `${category.label} | Blog`,
    description: category.description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, title: category.label, description: category.description },
    ...(hasPosts ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function CategoryPage({ params }: Props) {
  const { categoria } = await params;
  const category = getCategory(categoria);
  if (!category) notFound();

  const posts = getPostsByCategory(category.id);
  const crumbs = [
    { label: "Blog", href: "/blog" },
    { label: category.label, href: `/blog/${category.id}` },
  ];

  return (
    <>
      <Header />
      <main className="pt-28 sm:pt-32">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: crumbs.map((crumb, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: crumb.label,
              item: `${siteConfig.url}${crumb.href}`,
            })),
          }}
        />

        <header className="shell">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-6 max-w-3xl text-display text-balance">{category.label}</h1>
          <p className="mt-6 max-w-2xl text-lead text-muted">{category.description}</p>
          <div className="mt-10">
            <CategoryNav active={category.id} />
          </div>
        </header>

        <section aria-label={`Artigos de ${category.label}`} className="section">
          <div className="shell">
            {posts.length > 0 ? (
              <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} headingLevel="h2" />
                ))}
              </div>
            ) : (
              <div className="card px-6 py-12 text-center sm:px-12">
                <p className="text-h3 font-semibold">Ainda não há artigos neste assunto.</p>
                <Link href="/blog" className="btn btn-secondary mt-8">
                  Ver todos os assuntos
                  <ArrowRight aria-hidden size={16} className="btn-arrow" />
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
