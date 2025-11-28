// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['docus'],
  
  // Override Google Fonts with Bunny Fonts (accessible in China)
  googleFonts: {
    families: {
      'DM Sans': [400, 500, 600, 700],
      'DM Mono': [400, 500],
    },
    display: 'swap',
    // Use Bunny Fonts as the provider instead of Google Fonts
    base64: false,
    useStylesheet: true,
    download: false,
    inject: true,
    // Override the default Google Fonts URL with Bunny Fonts
    fontsDir: 'fonts',
    overwriting: false,
  },

  // Alternative: Use app.head to inject Bunny Fonts directly
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/dj-docs/' : '/',
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.bunny.net/css?family=dm-sans:400,500,600,700|dm-mono:400,500&display=swap',
        },
      ],
    },
  },

  // 配置图片处理：禁用 IPX 对 markdown 中图片的自动处理
  // 这样可以避免 baseURL 导致的路径重复问题（/_ipx/_/dj-docs/img/...）
  // 静态图片将直接通过 Nitro 的静态文件服务提供
  image: {
    // 禁用 IPX，让静态图片直接通过 Nitro 服务，避免路径问题
    // 如果需要图片优化功能，可以手动使用 <NuxtImg> 组件
    ipx: false,
  },

  // 配置 Nitro 以正确处理 baseURL 下的静态资源
  nitro: {
    publicAssets: [
      {
        baseURL: process.env.NODE_ENV === 'production' ? '/dj-docs/' : '/',
        dir: 'public',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      },
    ],
  },
})
