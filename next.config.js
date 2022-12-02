/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "external-preview.redd.it",
      "preview.redd.it",
      "i.imgur.com",
      "i.redd.it",
      "emoji.redditmedia.com",
      "www.redditstatic.com",
    ],
  },
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
