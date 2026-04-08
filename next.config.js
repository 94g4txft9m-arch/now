/** @type {import('next').NextConfig} */
// BASE_PATH: GitHub Pages project sites need /repo-name. Omitted for `npm run dev` and Vercel (koreň domény).
// Lokálne ako na github.io: `npm run dev:pages` → otvorte http://localhost:3000/<repo>/

// Na Verceli musí byť plný `next build` (bez output: export), aby fungovali serverless funkcie
// vrátane natívneho FastAPI (main.py). Lokálne / CI bez VERCEL ostáva statický export do `out/`.
const isVercel = Boolean(process.env.VERCEL);

const basePath = process.env.BASE_PATH || "";

const nextConfig = {
  ...(isVercel ? {} : { output: "export" }),
  basePath: basePath || undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.akmotuzova.sk",
        pathname: "/**",
      },
    ],
  },
  trailingSlash: true,
};

module.exports = nextConfig;
