import Link from "next/link";
import { formatDate, type Post } from "@/lib/blog";
import { PostCover } from "./PostCover";

type Props = {
  post: Post;
  /** "lead" é o destaque da home do blog: imagem grande e resumo visível. */
  variant?: "default" | "lead";
  headingLevel?: "h2" | "h3";
};

export function PostCard({ post, variant = "default", headingLevel: Heading = "h3" }: Props) {
  const lead = variant === "lead";

  return (
    <article
      className={
        lead
          ? "group grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-12"
          : "group flex flex-col gap-4"
      }
    >
      <Link href={post.url} tabIndex={-1} aria-hidden>
        <PostCover
          post={post}
          priority={lead}
          sizes={lead ? "(min-width: 1024px) 680px, 100vw" : "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"}
          className="transition-opacity duration-300 group-hover:opacity-90"
        />
      </Link>

      <div className="flex flex-col gap-3">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted">
          <Link
            href={`/blog/${post.category}`}
            className="font-semibold text-forest transition-colors hover:text-ink"
          >
            {post.categoryData.label}
          </Link>
          <span aria-hidden className="h-3 w-px bg-line" />
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.draft && (
            <span className="rounded-full bg-surface px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-ink">
              Rascunho
            </span>
          )}
        </p>

        <Heading
          className={
            lead
              ? "text-h2 text-balance"
              : "text-[1.1875rem] font-semibold leading-snug tracking-[-0.015em] text-balance"
          }
        >
          <Link href={post.url} className="transition-colors hover:text-forest">
            {post.title}
          </Link>
        </Heading>

        {lead && <p className="text-lead text-muted">{post.description}</p>}
      </div>
    </article>
  );
}
