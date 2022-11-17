/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/r/:slug",
        destination: "/sub/:slug",
        permanent: true,
      },
      {
        source: "/u/:slug",
        destination: "/user/:slug",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
