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
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
