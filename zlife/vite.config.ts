import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "logo.svg",
        "robots.txt",
        "logo.png",
        "fonts/*.ttf",
        "icons/*.png",
      ],
      manifest: {
        name: "Zlife – Take Control of Your Life",
        short_name: "Zlife",
        description: "Take Control of Your Life",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        start_url: "/",
        icons: [
          ...[48, 72, 96, 128, 144, 152, 192, 384, 512].flatMap((size) => [
            {
              src: `icons/icon-${size}.png`,
              sizes: `${size}x${size}`,
              type: "image/png",
              purpose: "any",
            },
            {
              src: `icons/icon-${size}.png`,
              sizes: `${size}x${size}`,
              type: "image/png",
              purpose: "maskable",
            },
          ]),
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
        clientsClaim: true, // سرویس‌ورکر جدید بلافاصله روی کلاینت‌ها کنترل بگیرد
        skipWaiting: true,
        globPatterns: ["**/*.{js,css,html,woff2,png,svg,json}"],
        navigateFallback: "/offline.html",
        runtimeCaching: [
          {
            urlPattern: /\/fonts\/.*\.(?:woff2|woff|ttf)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "font-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /\/icons\/.*\.(?:png|svg)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "icon-cache",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
});
