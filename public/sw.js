// ==== Monetag push service worker ====
// Must live at the site root so Monetag can register push subscriptions.
self.options = {
  domain: "3nbf4.com",
  zoneId: 11265930,
};
self.lary = "";
try {
  importScripts("https://3nbf4.com/act/files/service-worker.min.js?r=sw");
} catch (e) {
  // Monetag SW failed to load — continue with local PWA caching below.
}

// ==== LogicGuesser PWA offline cache ====
const CACHE_NAME = "logicguesser-v1";
const PRECACHE_URLS = [
  "/",
  "/manifest.webmanifest",
  "/pwa-192.png",
  "/pwa-512.png",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (
    url.pathname.startsWith("/~oauth") ||
    url.pathname.startsWith("/api") ||
    url.hostname.includes("supabase") ||
    url.hostname.includes("3nbf4.com")
  ) {
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("/").then((r) => r || Response.error()))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
