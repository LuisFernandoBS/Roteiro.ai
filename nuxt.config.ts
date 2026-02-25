export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
        { rel: 'manifest', href: '/favicon/site.webmanifest' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/icon',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@formkit/auto-animate',
    [
      '@vite-pwa/nuxt',
      {
        registerType: 'autoUpdate',
        manifest: {
          name: 'Roteiro.ai',
          short_name: 'Roteiro',
          theme_color: '#0f172a',
          background_color: '#f8fafc',
          display: 'standalone',
          start_url: '/',
          icons: [
            {
              src: '/favicon/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/favicon/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          navigateFallback: '/'
        },
        devOptions: {
          enabled: true,
          type: 'module'
        }
      }
    ]
  ],
  runtimeConfig: {
    public: {
      authUsers: [
        {
          login: process.env.NUXT_PUBLIC_USER1_LOGIN || process.env.VITE_USER1_LOGIN || '',
          pass: process.env.NUXT_PUBLIC_USER1_PASS || process.env.VITE_USER1_PASS || ''
        },
        {
          login: process.env.NUXT_PUBLIC_USER2_LOGIN || process.env.VITE_USER2_LOGIN || '',
          pass: process.env.NUXT_PUBLIC_USER2_PASS || process.env.VITE_USER2_PASS || ''
        }
      ]
    }
  }
})
