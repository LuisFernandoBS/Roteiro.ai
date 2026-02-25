export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/icon',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@formkit/auto-animate',
    '@vite-pwa/nuxt'
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
  },
  pwa: {
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
          src: '/favicon.ico',
          sizes: '64x64 32x32 24x24 16x16',
          type: 'image/x-icon'
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
})
