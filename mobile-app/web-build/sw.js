// The name of my cache
const cacheName = "lancer-scout-pwa-v1.06";
//The files I'm going to cache
const filesToCache = [
  "/",
  "./index.html",
  "./manifest.json",
  "./favicon.ico",
  "./static/media/OpenSans.071a1becc7f00e33cc5b.ttf",
  "./favicon-16.png",
  "./favicon-32.png",
  "./static/js/935.8f3d35a6.js",
  "./static/js/935.8f3d35a6.js.LICENSE.txt",
  "./static/js/935.8f3d35a6.js.map",
  "./static/js/main.f34735de.js",
  "./static/js/main.f34735de.js.map"
];

self.addEventListener("install", e => {
  console.log("[ServiceWorker] - Install");
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log("[ServiceWorker] - Caching app shell");
    await cache.addAll(filesToCache);
  })());
});

self.addEventListener('fetch', function (event) {
  if (!navigator.onLine) {

    event.respondWith(
      caches.match(event.request, { ignoreSearch: true, ignoreMethod: true, ignoreVary: true })
        .then(function (response) {
          response.headers.set("max-age", 60 * 60 * 24 * 365)
          if (response) return response;
        }))}})