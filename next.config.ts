import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O selo de dev flutua sobre o canto da página e atrapalha a revisão visual.
  devIndicators: false,

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

export default nextConfig;
