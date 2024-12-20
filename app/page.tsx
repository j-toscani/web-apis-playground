import { Layout } from "@components/Layout.tsx";

export default function Page() {
  return (
    <Layout>
      <header>
        <nav className="content">
          <a href="/web-push">To Web Push-API</a>
        </nav>
      </header>
      <main>
        <section className="content">
          <h1>Hi!</h1>
        </section>
      </main>
    </Layout>
  );
}
