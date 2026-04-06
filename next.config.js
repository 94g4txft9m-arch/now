/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
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
