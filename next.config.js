/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
    ],
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Transpile packages if needed
  transpilePackages: ['next-sanity'],
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  // Enable SWC minification (faster than Terser)
  swcMinify: true,
  // Optimize production builds
  productionBrowserSourceMaps: false,
  // Optimize chunk splitting
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
}

export default nextConfig
