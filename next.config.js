/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
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
      "b.thumbs.redditmedia.com",
      "styles.redditmedia.com",
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

module.exports = withBundleAnalyzer(nextConfig);
