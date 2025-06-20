const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/web-push/sw.js",
        {
          scope: "/web-push/",
        },
      );

      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
        setInterval(() => {
          registration.update();
        }, 1000 * 5);
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

let reloading = false;
navigator.serviceWorker.addEventListener("controllerchange", () => {
  if (reloading) return;
  reloading = true;
  location.reload();
}, { once: true });

registerServiceWorker();
