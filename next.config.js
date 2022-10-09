/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  experimental: {
    forceSwcTransforms: true,
  },
};

module.exports = nextConfig;
