/// <reference lib="webworker" />

const worker = /** @type {ServiceWorkerGlobalScope} */ (self);

worker.addEventListener("install", (event) => {
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
  event.respondWith(cacheFirst(event.request));
});

/**
 * Responds either with cached result or fetched information
 * Fails if no cached result and no internet connection
 * The latter can be compensated for with a fallback URL
 *  
 * [MDN: Recovering failed Requests](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#recovering_failed_requests)
 * 
 * @param { Request } request
 * @returns {Promise<Response>}
 */
async function cacheFirst(request) {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  const response = fetch(request);
  event.waitUntil(addResponseToCache(request, response));
  return response;
}

/**
 * @param { Array<string> } resources
 */
async function addResourcesToCache(resources) {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
}

/**
 * @param { Request } request
 * @param { Response } response
 */
async function addResponseToCache(request, response) {
  const cache = await caches.open("v1");
  return cache.put(request.url, response.clone());
}
