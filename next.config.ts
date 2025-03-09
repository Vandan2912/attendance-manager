// const nextConfig: NextConfig = {
//   /* config options here */
//   eslint: {
//     // dont check for eslink rules
//     ignoreDuringBuilds: true,
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // dont check for eslink rules
    ignoreDuringBuilds: true,
  },
  experimental: {
    turbo: {
      loaders: {
        ".tsx": {
          transpileOnly: false,
        },
      },
    },
  },
};

module.exports = nextConfig;
