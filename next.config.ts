import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['empty-state.ru', '*.empty-state.ru', '192.168.1.42'],
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '1000MB',
    },
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
