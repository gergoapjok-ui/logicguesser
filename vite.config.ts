import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: null,
      devOptions: {
        enabled: false,
      },
      includeAssets: ["favicon.ico", "robots.txt", "pwa-192.png", "pwa-512.png", "screenshot-mobile.png", "screenshot-desktop.png"],
      manifest: {
        id: "logicguesser-pwa",
        name: "LogicGuesser",
        short_name: "LogicGuesser",
        description: "Train your brain with LogicGuesser - daily puzzles, battles, and more.",
        theme_color: "#10b981",
        background_color: "#0c0f1a",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        lang: "en",
        dir: "ltr",
        categories: ["games", "education", "entertainment"],
        prefer_related_applications: false,
        icons: [
          { src: "/pwa-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/pwa-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/pwa-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        screenshots: [
          { src: "/screenshot-mobile.png", sizes: "512x1024", type: "image/png", form_factor: "narrow", label: "LogicGuesser on mobile" },
          { src: "/screenshot-desktop.png", sizes: "1280x800", type: "image/png", form_factor: "wide", label: "LogicGuesser on desktop" },
        ],
        shortcuts: [
          { name: "Daily Challenge", short_name: "Daily", description: "Today's puzzles", url: "/daily-challenge", icons: [{ src: "/pwa-192.png", sizes: "192x192" }] },
          { name: "Practice", short_name: "Practice", description: "Free practice mode", url: "/practice", icons: [{ src: "/pwa-192.png", sizes: "192x192" }] },
        ],
      },
      workbox: {
        navigateFallbackDenylist: [/^\/~oauth/, /^\/api/, /supabase/],
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-stylesheets" },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core", "@vercel/speed-insights", "@vercel/analytics"],
  },
}));
