import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // O selo de dev flutua sobre o canto da página e atrapalha a revisão visual.
  devIndicators: false,

  // Os posts do blog são .mdx importados por src/lib/blog.ts — não viram rota
  // sozinhos, porque não ficam dentro de src/app.
  pageExtensions: ["ts", "tsx", "mdx"],

  images: {
    // As capturas do produto tem 1919px de largura. Sem esse teto o next/image
    // chegava a pedir a variante de 3840px — um upscale caro do mesmo PNG.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },

  // A rota de Open Graph lê o TTF do disco em tempo de build. O tracing
  // automático não enxerga esse caminho, então declaramos o arquivo.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./assets/Sora-Regular.woff", "./assets/Sora-Bold.woff"],
  },

  poweredByHeader: false,

  // Cabeçalhos de segurança das páginas. A CSP fica só nas diretivas que não
  // mexem em script/estilo: o Next injeta scripts inline na hidratação, e o
  // nonce obrigaria toda página a ser dinâmica (perde o cache estático).
  // As rotas /api ficam de fora — o webhook do Asaas mora lá e não se mexe.
  async headers() {
    return [
      {
        source: "/:path((?!api/).*)",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

// Plugins por nome (string): o Turbopack não aceita funções na config do MDX.
// rehype-slug dá id aos títulos — é dele que o sumário do post depende.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-slug"],
  },
});

export default withMDX(nextConfig);
