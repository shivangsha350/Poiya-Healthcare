/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Turn off strict mode to prevent double rendering in dev if needed, or set to true
  images: {
    unoptimized: true, // Useful if static exports or normal hosting is used
  },
};

export default nextConfig;
