/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/assets/:path*",
        destination: "/assets/:path*",
      },
    ];
  },
};

export default nextConfig;
