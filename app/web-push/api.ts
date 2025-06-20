import type { Route } from "jsr:@std/http/unstable-route";
import webpush from "npm:web-push";
import z from "npm:zod";

const vapidDetailsSchema = z.object({
  publicKey: z.string(),
  privateKey: z.string(),
  mail: z.string(),
});

const endpointSchema = z.object({
  endpoint: z.string(),
});

const subscriptionSchema = endpointSchema.extend({
  expirationTime: z.string().or(z.null()).optional(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

const subscriptions = new Map<string, z.infer<typeof subscriptionSchema>>();
const VAPID_DETAILS = {
  publicKey: Deno.env.get("VAPID_PUBLIC_KEY"),
  privateKey: Deno.env.get("VAPID_PRIVATE_KEY"),
  mail: Deno.env.get("VAPID_SUBJECT"),
};

const details = vapidDetailsSchema.parse(VAPID_DETAILS);

webpush.setVapidDetails(
  details.mail,
  details.publicKey,
  details.privateKey,
);

async function addSubscription(req: Request) {
  const body = await req.json();
  const subscription = subscriptionSchema.parse(body);

  subscriptions.set(subscription.endpoint, subscription);
  return Response.json({}, { status: 200 });
}

async function removeSubscription(req: Request) {
  const body = await req.json();
  const { endpoint } = endpointSchema.parse(body);

  subscriptions.delete(endpoint);
  return Response.json({}, { status: 200 });
}

async function notifyMe(req: Request) {
  const body = await req.json();
  const { endpoint } = endpointSchema.parse(body);

  const subscription = subscriptions.get(endpoint);

  if (!subscription) {
    return Response.json({ error: "Subscription not found" }, { status: 404 });
  }

  sendNotifications([subscription]);
  return Response.json({}, { status: 200 });
}

function notifyAll() {
  sendNotifications([...subscriptions.values()]);
  return Response.json({}, { status: 200 });
}

const routes: Array<Route> = [
  {
    pattern: new URLPattern({ pathname: "/web-push/api/add-subscription" }),
    handler: addSubscription,
    method: "POST",
  },
  {
    pattern: new URLPattern({ pathname: "/web-push/api/remove-subscription" }),
    handler: removeSubscription,
    method: "POST",
  },
  {
    pattern: new URLPattern({ pathname: "/web-push/api/notify-me" }),
    handler: notifyMe,
    method: "POST",
  },
  {
    pattern: new URLPattern({ pathname: "/web-push/api/notify-all" }),
    handler: notifyAll,
    method: "POST",
  },
];

export default routes;

function sendNotifications(
  subscriptions: Array<z.infer<typeof subscriptionSchema>>,
) {
  // Create the notification content.
  const notification = JSON.stringify({
    type: "Info",
    message: "This is a test notification from the Web Push service.",
  });
  // Customize how the push service should attempt to deliver the push message.
  // And provide authentication information.
  const options = {
    TTL: 10000,
  };

  // Send a push message to each client specified in the subscriptions array.
  subscriptions.forEach((subscription) => {
    const endpoint = subscription.endpoint;
    const id = endpoint.slice(endpoint.length - 8, endpoint.length);
    webpush.sendNotification(subscription, notification, options)
      .then((result: { statusCode: number }) => {
        console.log(`Endpoint ID: ${id}`);
        console.log(`Result: ${result.statusCode}`);
      })
      .catch((error: Error) => {
        console.log(`Endpoint ID: ${id}`);
        console.log(`Error: ${error} `);
      });
  });
}
