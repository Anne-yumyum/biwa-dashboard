import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '琵琶湖ビワマスコンディション',
    short_name: '琵琶湖コンディション',
    description: '出船前チェック - 風・天気・水位・水温',
    start_url: '/',
    display: 'standalone',
    background_color: '#f0f7ff',
    theme_color: '#0a3358',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
