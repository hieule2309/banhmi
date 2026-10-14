/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Bật lại image optimization để Next.js tự format/compress ảnh
    // Trước đó unoptimized: true khiến ảnh không được nén -> tăng parse time
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
  // Tăng hiệu quả code splitting cho dynamic imports
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-sheet'],
  },
}

export default nextConfig
