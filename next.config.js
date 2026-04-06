/** @type {import('next').NextConfig} */
// GitHub Pages project site: set BASE_PATH=/repo-name at build (e.g. /now). Leave unset for localhost and Vercel root.
const basePath = process.env.BASE_PATH || "";

const nextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
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
