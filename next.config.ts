import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['empty-state.ru', '*.empty-state.ru', '192.168.1.42'],
  output: 'standalone',
  images: {
    qualities: [90],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
          },
        ],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
