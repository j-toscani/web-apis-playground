import { Layout } from "@components/Layout.tsx";

export default function Page() {
  return (
    <Layout
      styles={<link rel="stylesheet" href="/web-push/style.css"></link>}
      scripts={
        <>
          <script src="/web-push/script.js" />
          <script src="/web-push/registerSW.js" />
        </>
      }
    >
      <main>
        <section className="content">
          <h1>Webpush API</h1>
          <h2>Handling Access</h2>
          <div className="flex gap-4">
            <button-request-access>
              <button type="button">Request Access</button>
            </button-request-access>
            <button-subscribe-to-push>
              <button type="button">Subscribe to Push.</button>
            </button-subscribe-to-push>
          </div>

          <h2>
            Sending Notifications
          </h2>
          <div>
            <button-notify-me>
              <button type="button">Notify Me.</button>
            </button-notify-me>
          </div>
        </section>
        <section>
          <button-get-registrations>
            <button type="button">
              Get Registrations
            </button>
          </button-get-registrations>
        </section>

        <dialog-handle-sw-update>
          <dialog>
            <h1>
              Do you want to update the App now?
            </h1>
            <div className="flex gap-4">
              <button type="button" data-confirm>Yes</button>
              <button type="button" data-deny>No</button>
            </div>
          </dialog>
        </dialog-handle-sw-update>
      </main>
    </Layout>
  );
}
