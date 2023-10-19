import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

let faviconUrl = '/favicon.svg'

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  plugins: [
    solid(),
    VitePWA({
      injectRegister: 'inline',
      includeAssets: [faviconUrl],
      manifest: {
        name: 'Grocermatic',
        theme_color: '#22C55E',
        icons: [
          {
            src: faviconUrl,
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: faviconUrl,
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
