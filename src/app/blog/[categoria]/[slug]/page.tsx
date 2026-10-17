import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { JsonLd } from "@/components/blog/JsonLd";
import { PostCard } from "@/components/blog/PostCard";
import { PostCover } from "@/components/blog/PostCover";
import {
  AuthorBox,
  CategoryCta,
  Faq,
  KeyTakeaways,
  Sources,
  TableOfContents,
} from "@/components/blog/PostSections";
import { siteConfig } from "@/config/site";
import { formatDate, getAllPosts, getPost, getRelatedPosts } from "@/lib/blog";

type Props = { params: Promise<{ categoria: string; slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ categoria: post.category, slug: post.slug }));
}

// Só existem os posts do registro; qualquer outra combinação é 404.
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria, slug } = await params;
  const post = getPost(categoria, slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: post.url },
    authors: [{ name: post.authorData.name }],
    openGraph: {
      type: "article",
      url: post.url,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      section: post.categoryData.label,
      authors: [post.authorData.name],
      ...(post.cover
        ? { images: [{ url: post.cover.src, width: post.cover.width, height: post.cover.height, alt: post.cover.alt }] }
        : {}),
    },
    ...(post.draft ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function PostPage({ params }: Props) {
  const { categoria, slug } = await params;
  const post = getPost(categoria, slug);
  if (!post) notFound();

  const { default: Content } = await import(`@/content/blog/posts/${post.slug}.mdx`);
  const related = getRelatedPosts(post);

  const crumbs = [
    { label: "Blog", href: "/blog" },
    { label: post.categoryData.label, href: `/blog/${post.category}` },
    { label: post.title, href: post.url },
  ];

  const absolute = (path: string) => `${siteConfig.url}${path}`;
  const organization = {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
  };

  return (
    <>
      <Header />
      <main className="pt-28 sm:pt-32">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BlogPosting",
                "@id": `${absolute(post.url)}#post`,
                headline: post.title,
                description: post.description,
                datePublished: post.publishedAt,
                dateModified: post.updatedAt ?? post.publishedAt,
                inLanguage: "pt-BR",
                articleSection: post.categoryData.label,
                mainEntityOfPage: absolute(post.url),
                isPartOf: { "@id": `${siteConfig.url}/blog#blog` },
                author:
                  post.authorData.kind === "organization"
                    ? organization
                    : { "@type": "Person", name: post.authorData.name, jobTitle: post.authorData.role },
                publisher: organization,
                ...(post.cover ? { image: absolute(post.cover.src) } : {}),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: crumbs.map((crumb, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  name: crumb.label,
                  item: absolute(crumb.href),
                })),
              },
            ],
          }}
        />

        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16">
          <article className="min-w-0">
            <header className="max-w-3xl">
              <Breadcrumbs items={crumbs} />
              <p className="mt-8 flex flex-col gap-1 text-small text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
                <span className="font-semibold text-forest">{post.categoryData.label}</span>
                <span aria-hidden className="hidden h-3 w-px bg-line sm:block" />
                <span>
                  Publicado em <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </span>
                {post.updatedAt && post.updatedAt !== post.publishedAt && (
                  <>
                    <span aria-hidden className="hidden h-3 w-px bg-line sm:block" />
                    <span>
                      Atualizado em <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
                    </span>
                  </>
                )}
                <span aria-hidden className="hidden h-3 w-px bg-line sm:block" />
                <span data-numeric>{post.readingMinutes} min de leitura</span>
              </p>
              <h1 className="mt-4 text-[clamp(2rem,4.6vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.03em] text-balance">
                {post.title}
              </h1>
              <p className="mt-5 text-lead text-muted">{post.description}</p>
              <p className="mt-5 text-small text-muted">
                Por <span className="font-semibold text-ink">{post.authorData.name}</span>
              </p>
            </header>

            <PostCover post={post} priority sizes="(min-width: 1024px) 800px, 100vw" className="mt-10" />

            <div className="mt-10 grid max-w-[42rem] gap-8">
              <KeyTakeaways items={post.keyTakeaways} />
              {/* No desktop o sumário fica fixo na lateral; aqui, só no mobile. */}
              <div className="lg:hidden">
                <TableOfContents items={post.toc} />
              </div>
            </div>

            <div className="post-body mt-10">
              <Content />
            </div>

            <div className="mt-16 grid max-w-[42rem] gap-12">
              <CategoryCta post={post} />
              <Faq items={post.faq} />
              <Sources items={post.sources} />
              <AuthorBox post={post} />
            </div>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-[calc(var(--header-h)+2rem)]">
              <TableOfContents items={post.toc} />
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="leia-tambem" className="section">
            <div className="shell">
              <h2 id="leia-tambem" className="text-h2">
                Leia também
              </h2>
              <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <PostCard key={item.slug} post={item} />
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
