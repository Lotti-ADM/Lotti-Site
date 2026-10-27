import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // O selo de dev flutua sobre o canto da página e atrapalha a revisão visual.
  devIndicators: false,

  // Os posts do blog são .mdx importados por src/lib/blog.ts — não viram rota
  // sozinhos, porque não ficam dentro de src/app.
  pageExtensions: ["ts", "tsx", "mdx"],

  images: {
    formats: ["image/avif", "image/webp"],
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

  // Redireciona rotas de autenticação e plataforma para o subdomínio oficial
  async redirects() {
    return [
      {
        source: "/login",
        destination: "https://app.plataformalotti.com.br/login",
        permanent: false,
      },
      {
        source: "/cadastro",
        destination: "https://app.plataformalotti.com.br/cadastro",
        permanent: false,
      },
      {
        source: "/recuperar-senha",
        destination: "https://app.plataformalotti.com.br/recuperar-senha",
        permanent: false,
      },
      {
        source: "/dashboard/:path*",
        destination: "https://app.plataformalotti.com.br/dashboard/:path*",
        permanent: false,
      },
      {
        source: "/painel/:path*",
        destination: "https://app.plataformalotti.com.br/painel/:path*",
        permanent: false,
      },
    ];
  },

  // Cabeçalhos de segurança das páginas e proteção de rastreamento (SEO)
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
      {
        source: "/checkout/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
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
