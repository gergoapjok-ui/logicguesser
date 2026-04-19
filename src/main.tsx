import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// PWA: register service worker only in production, outside iframes/preview hosts.
const isInIframe = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();

const host = window.location.hostname;
const isPreviewHost =
  host.includes("id-preview--") ||
  host.includes("lovableproject.com") ||
  host.includes("lovable.app");

if (isInIframe || isPreviewHost) {
  // Defensive cleanup: ensure no SW pollutes preview/iframe contexts.
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((r) => r.unregister());
    });
  }
} else if (import.meta.env.PROD && "serviceWorker" in navigator) {
  // Try the vite-plugin-pwa generated SW first; fall back to /sw.js.
  import("virtual:pwa-register")
    .then(({ registerSW }) => {
      registerSW({ immediate: true });
    })
    .catch(() => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* no-op */
      });
    });
}
