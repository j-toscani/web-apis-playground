/// <reference lib="webworker" />

const worker = /** @type {ServiceWorkerGlobalScope} */ (self);

const CURRENT_KEY = "v1";

const urlExcludes = [
  "chrome-extension",
  "_events",
];
console.log("Ja Moin...");

worker.addEventListener("install", (event) => {
  console.log("Installing: ", CURRENT_KEY);

  event.waitUntil(
    addResourcesToCache([
      "/web-push/",
      "/web-push/script.js",
      "/web-push/style.css",
      "/web-push/api/hi",
      "/web-push/img.jpg",
    ]),
  );
});

worker.addEventListener("fetch", (event) => {
  event.respondWith(cacheFirst(event, event.request));
});

worker.addEventListener("activate", (event) => {
  console.log("Aktivating: ", CURRENT_KEY);

  event.waitUntil(deleteOldCaches());
});

const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const cacheKeepList = [CURRENT_KEY];
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

/**
 * Responds either with cached result or fetched information
 * Fails if no cached result and no internet connection
 * The latter can be compensated for with a fallback URL
 *
 * [MDN: Recovering failed Requests](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#recovering_failed_requests)
 *
 * @param { FetchEvent } event
 * @param { Request } request
 * @returns {Promise<Response>}
 */
async function cacheFirst(event, request) {
  if (urlExcludes.some((subString) => request.url.includes(subString))) {
    return fetch(request);
  }
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  const response = await fetch(request);
  event.waitUntil(addResponseToCache(request, response.clone()));
  return response;
}

/**
 * @param { Array<string> } resources
 */
async function addResourcesToCache(resources) {
  const cache = await caches.open(CURRENT_KEY);
  await cache.addAll(resources);
}

/**
 * @param { Request } request
 * @param { Response } response
 */
async function addResponseToCache(request, response) {
  const cache = await caches.open(CURRENT_KEY);
  return cache.put(request.url, response);
}
