/// <reference lib="DOM" />

function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = self.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function getPermissionStatus() {
  return navigator.permissions.query({ name: "notifications" }).then((p) =>
    p.state
  );
}

class RequestPushAccess extends HTMLElement {
  constructor() {
    super();
    this.disabled = true;
    getPermissionStatus().then((r) => {
      console.log(r);
      this.disabled = r !== "default";
    });

    this.getButton().addEventListener("click", () => this.onClick());
  }

  getButton() {
    return this.querySelector("button");
  }

  set disabled(value) {
    this.getButton().disabled = value;
  }

  get disabled() {
    return this.getButton().disabled;
  }

  async onClick() {
    this.disabled = true;

    const result = await getPermissionStatus();
    if (result === "denied") {
      alert("The user explicitly denied the permission request.");
      return;
    }

    if (result === "granted") {
      console.info("The user accepted the permission request.");
    }
  }
}

customElements.define("button-request-access", RequestPushAccess);

class SubscribeToPush extends HTMLElement {
  constructor() {
    super();

    this.disabled = true;
    this.checkCanSubscribe().then((result) => {
      this.disabled = !result;
    });
    this.getButtonText().then((t) => {
      this.getButton().innerText = t;
    });

    this.getButton().addEventListener("click", () => this.onClick());
  }

  getButton() {
    return this.querySelector("button");
  }

  set disabled(value) {
    this.getButton().disabled = value;
  }

  get disabled() {
    return this.getButton().disabled;
  }

  async getButtonText() {
    const registration = await navigator.serviceWorker.getRegistration();
    const subscribed = await registration.pushManager.getSubscription();

    return subscribed ? "Unsubscribe" : "Subscribe";
  }

  async checkCanSubscribe() {
    const result = await getPermissionStatus();
    return result === "granted";
  }

  async onClick() {
    this.getButton().disabled = true;

    const registration = await navigator.serviceWorker.getRegistration();
    const subscribed = await registration.pushManager.getSubscription();

    if (!subscribed) {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(
          "BIYTbJKTrlQQXyYYCtuKX-zvtFVJrFVc5drJ-bx8s7W4VpE5hrBlY1-5Zs7dIvdmK7ZdiZch67RFpnuR5ZGCtAk",
        ),
      });

      await fetch("/web-push/api/add-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });
      this.getButton().innerText = "Unsubscribe";
    } else {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(
          "BIYTbJKTrlQQXyYYCtuKX-zvtFVJrFVc5drJ-bx8s7W4VpE5hrBlY1-5Zs7dIvdmK7ZdiZch67RFpnuR5ZGCtAk",
        ),
      });
      await fetch("/web-push/api/remove-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });

      await subscription.unsubscribe();
      this.getButton().innerText = "Subscribe";
    }

    this.getButton().disabled = false;
  }
}

customElements.define("button-subscribe-to-push", SubscribeToPush);

class NotifyMe extends HTMLElement {
  constructor() {
    super();

    this.disabled = true;
    this.checkCanSubscribe().then((result) => {
      this.disabled = !result;
    });

    this.getButton().addEventListener("click", () => this.onClick());
  }

  getButton() {
    return this.querySelector("button");
  }

  set disabled(value) {
    this.getButton().disabled = value;
  }

  get disabled() {
    return this.getButton().disabled;
  }

  async checkCanSubscribe() {
    const result = await getPermissionStatus();
    const registration = await navigator.serviceWorker.getRegistration();
    const subscribed = await registration.pushManager.getSubscription();
    return result === "granted" && subscribed;
  }

  async onClick() {
    this.getButton().disabled = true;

    const registration = await navigator.serviceWorker.getRegistration();

    const subscription = await registration.pushManager.getSubscription();

    fetch("/web-push/api/notify-me", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });

    setTimeout(() => {
      this.getButton().disabled = false;
    }, 2000);
  }
}

customElements.define("button-notify-me", NotifyMe);

navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => {
    listenForWaitingServiceWorker(registration, promptUserToRefresh);
  })
})

function listenForWaitingServiceWorker(reg, callback) {
  function awaitStateChange() {
    reg.installing.addEventListener("statechange", function () {
      if (this.state === "installed") callback(reg);
    });
  }
  if (!reg) return;
  if (reg.waiting) return callback(reg);
  if (reg.installing) awaitStateChange();
  reg.addEventListener("updatefound", awaitStateChange);
}

function promptUserToRefresh(reg) {
  console.log("Prompting User")
  reg.waiting.postMessage("skipWaiting");
}