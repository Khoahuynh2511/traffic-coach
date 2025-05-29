module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,jpeg,svg,json,woff,woff2}'
  ],
  swDest: 'dist/sw.js',
  swSrc: 'src/sw.js',
  skipWaiting: true,
  clientsClaim: true,
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/cdn\.jsdelivr\.net/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'cdn-cache',
      },
    },
    {
      urlPattern: /^https:\/\/cdn\.tailwindcss\.com/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'tailwind-cache',
      },
    }
  ]
}; 