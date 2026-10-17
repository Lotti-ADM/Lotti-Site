import Image from "next/image";
import type { Post } from "@/lib/blog";

type Props = {
  post: Post;
  /** Capa do artigo ou do destaque: entra no LCP, então carrega sem lazy. */
  priority?: boolean;
  sizes: string;
  className?: string;
};

/**
 * Capa do post. Sem imagem, desenha o campo de lâminas da marca com o nome do
 * silo — melhor que uma foto genérica de banco de imagem.
 */
export function PostCover({ post, priority = false, sizes, className = "" }: Props) {
  const frame = `relative aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] ${className}`;

  if (post.cover) {
    return (
      <div className={`${frame} bg-surface`}>
        <Image
          src={post.cover.src}
          alt={post.cover.alt}
          width={post.cover.width}
          height={post.cover.height}
          sizes={sizes}
          // `priority` foi descontinuado no Next 16; a doc recomenda este par.
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div aria-hidden className={`${frame} bg-ink`}>
      <div className="blade-field opacity-80">
        <div className="blade" style={{ left: "38%", width: "18%" }} />
        <div className="blade" style={{ left: "62%", width: "12%" }} />
      </div>
      <span className="absolute bottom-4 left-4 text-small font-semibold text-paper/80">
        {post.categoryData.label}
      </span>
    </div>
  );
}
