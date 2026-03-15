import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "My App",
          short_name: "App",
          description: "My Progressive Web App",
          theme_color: "#ffffff",
          icons: [
            {
              src: "/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
    ],
    define: {},
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
