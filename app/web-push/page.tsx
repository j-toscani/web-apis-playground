import { Layout } from "@components/Layout.tsx";

export default function Page() {
  return (
    <Layout styles={<link rel="stylesheet" href="/web-push/style.css"></link>} scripts={<>
      <script src="/web-push/script.js" />
      <script src="/web-push/registerSW.js" />
    </>}>
      <main>
        <section className="content">
          <h1>Hi, this is Webpush!</h1>
          <img src="/web-push/img.jpg" />
        </section>
      </main>
    </Layout>
  );
}
