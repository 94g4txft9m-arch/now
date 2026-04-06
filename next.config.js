/** @type {import('next').NextConfig} */
// BASE_PATH: GitHub Pages project sites need /repo-name. Omitted for `npm run dev` and Vercel (koreň domény).
// Lokálne ako na github.io: `npm run dev:pages` → otvorte http://localhost:3000/<repo>/
const basePath = process.env.BASE_PATH || "";

const nextConfig = {
  output: "export",
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
