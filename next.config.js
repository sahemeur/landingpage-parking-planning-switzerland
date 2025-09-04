/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // allow <Image /> with static export
  },
};

module.exports = nextConfig;

