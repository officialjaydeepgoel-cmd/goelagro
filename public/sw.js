const CACHE = "goel-agro-v1";
const API_CACHE = "goel-agro-api-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll([
      "/",
      "/manifest.json",
      "/icons/icon.svg",
    ]))
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request, API_CACHE));
  } else {
    event.respondWith(cacheFirst(request, CACHE));
  }
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return cached || new Response("Offline", { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    return cached || new Response(JSON.stringify({ success: false, message: "You are offline" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
}
