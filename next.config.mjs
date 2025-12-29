/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Pastikan semua route adalah dynamic (tidak di-static generate)
  // Ini akan memastikan semua halaman di-render secara dinamis
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Pastikan tidak ada static generation
  trailingSlash: false,
};

export default nextConfig;
