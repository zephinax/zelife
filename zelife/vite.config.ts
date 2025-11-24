import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const basePath = "/";

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "prompt",
      includeAssets: [
        "logo.svg",
        "robots.txt",
        "logo.png",
        "fonts/*.ttf",
        "icons/*.png",
      ],
      manifest: {
        name: "Zelife – Take Control of Your Life",
        short_name: "Zelife",
        description: "Take Control of Your Life",
        theme_color: "#121212",
        background_color: "#121212",
        display: "standalone",
        start_url: basePath,
        scope: basePath,
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
      srcDir: "public",
      filename: "sw.js",
      workbox: {
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        clientsClaim: true,
        skipWaiting: false,
        globPatterns: ["**/*.{js,css,html,woff2,png,svg,json}"],
        // Use an absolute path so Safari correctly serves the SPA shell on deep links
        navigateFallback: "/index.html",
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
