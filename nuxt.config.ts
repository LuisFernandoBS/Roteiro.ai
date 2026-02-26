export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/icon', '@pinia/nuxt', '@nuxtjs/tailwindcss', '@formkit/auto-animate', [
    '@vite-pwa/nuxt',
    {
      registerType: 'autoUpdate',
      manifest: {
        id: '/',
        name: 'Roteiro.ai',
        short_name: 'Roteiro',
        theme_color: '#0f172a',
        background_color: '#f8fafc',
        display: 'standalone',
        scope: '/',
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
      devOptions: {
        enabled: true,
        type: 'module'
      }
    }
  ], '@nuxtjs/supabase'],
  supabase: {
    redirect: false,
    url: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY
  },
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
