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
