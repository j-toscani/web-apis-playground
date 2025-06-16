
const worker = /** @type {ServiceWorkerGlobalScope} */ (self);

const SERVICE_WORKER_VERSION = "v4";

worker.addEventListener("install", () => {
  console.log("Installing: ", SERVICE_WORKER_VERSION);
});

worker.addEventListener("activate", () => {
  console.log("Aktivating: ", SERVICE_WORKER_VERSION);
});

worker.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    worker.skipWaiting();
  }
});

worker.addEventListener("push", (event) => {
  console.log("[Service Worker] Push Received.");
  console.log(`[Service Worker] Push had this data: "${event.data?.json()}"`);
  const data = event.data?.json();
  const title = `${data.type}: ${data.message}`;
  const options = {
    body: `${data.type}: ${data.message}`,
    icon: "/logo_small.png",
    badge: "/logo_small.png",
  };

  try {
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (error) {
    console.error("[Service Worker] Error showing notification:", error);
  }
});
