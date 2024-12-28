/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ini akan mengabaikan error ESLint saat build
  },
}

module.exports = nextConfig 