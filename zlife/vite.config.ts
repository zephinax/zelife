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
      includeAssets: ["favicon.svg", "robots.txt"],
      manifest: {
        name: "Zlife – Take Control of Your Life",
        short_name: "Zlife",
        description: "My awesome Vite + React PWA!",
        theme_color: "#000000",
        icons: [
          {
            src: "icons/icon-48.png",
            sizes: "48x48",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/icon-48.png",
            sizes: "48x48",
            type: "image/png",
            purpose: "maskable",
          },

          {
            src: "icons/icon-72.png",
            sizes: "72x72",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/icon-72.png",
            sizes: "72x72",
            type: "image/png",
            purpose: "maskable",
          },

          {
            src: "icons/icon-96.png",
            sizes: "96x96",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/icon-96.png",
            sizes: "96x96",
            type: "image/png",
            purpose: "maskable",
          },

          {
            src: "icons/icon-128.png",
            sizes: "128x128",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/icon-128.png",
            sizes: "128x128",
            type: "image/png",
            purpose: "maskable",
          },

          {
            src: "icons/icon-144.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/icon-144.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "maskable",
          },

          {
            src: "icons/icon-152.png",
            sizes: "152x152",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/icon-152.png",
            sizes: "152x152",
            type: "image/png",
            purpose: "maskable",
          },

          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },

          {
            src: "icons/icon-384.png",
            sizes: "384x384",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/icon-384.png",
            sizes: "384x384",
            type: "image/png",
            purpose: "maskable",
          },

          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
