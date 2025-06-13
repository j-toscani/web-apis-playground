import type { Route } from "jsr:@std/http/unstable-route";
import webpush from "npm:web-push"

const subscriptions = new Map<string, any>()
const VAPID_DETAILS = {
    publicKey: Deno.env.get('VAPID_PUBLIC_KEY'),
    privateKey: Deno.env.get('VAPID_PRIVATE_KEY'),
    mail: Deno.env.get('VAPID_SUBJECT')
}

async function addSubscription(req: Request) {
    console.log('/add-subscription');
    const body = await req.json();
    console.log(body);
    console.log(`Subscribing ${body.endpoint}`);

    subscriptions.set (body.endpoint, body)
    return Response.json({}, { status: 200 })
}

async function removeSubscription(req: Request) {
    console.log('/remove-subscription');
    const body = await req.json();
    console.log(body);

    subscriptions.delete(body.endpoint);
    console.log(`Remove subscription ${body.endpoint}`);

    return Response.json({}, { status: 200 })
}

async function notifyMe(req: Request) {
    console.log('/notify-me');
    const body = await req.json();
    console.log(body);

    console.log(`Notifying ${body.endpoint}`);
    const subscription = subscriptions.get(body.endpoint)
    sendNotifications([subscription]);
} 

async function notifyAll(req: Request) {

} 

const routes: Array<Route> = [
    {
        pattern: new URLPattern( {pathname: "/add-subscription"}),
        handler: addSubscription
    },
    {
        pattern: new URLPattern( {pathname: "/remove-subscription"}),
        handler: removeSubscription
    },
]

export default routes

function sendNotifications(subscriptions: Array<{ endpoint: string }>) {
    webpush.setVapidDetails(
        VAPID_DETAILS.mail,
        VAPID_DETAILS.publicKey,
        VAPID_DETAILS.privateKey
    )
    // Create the notification content.
    const notification = JSON.stringify({
      title: "Hello, Notifications!",
      options: {
        body: `ID: ${Math.floor(Math.random() * 100)}`
      }
    });
    // Customize how the push service should attempt to deliver the push message.
    // And provide authentication information.
    const options = {
      TTL: 10000,
    };

    // Send a push message to each client specified in the subscriptions array.
    subscriptions.forEach(subscription => {
      const endpoint = subscription.endpoint;
      const id = endpoint.substr((endpoint.length - 8), endpoint.length);
      webpush.sendNotification(subscription, notification, options)
        .then((result: any) => {
          console.log(`Endpoint ID: ${id}`);
          console.log(`Result: ${result.statusCode}`);
        })
        .catch((error: Error) => {
          console.log(`Endpoint ID: ${id}`);
          console.log(`Error: ${error} `);
        });
    });
  }