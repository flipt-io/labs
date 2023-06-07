import Layout from "../components/Layout";
import { Chat } from "../components/Chat";

function Home() {
  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <h1 className="text-5xl font-bold tracking-tight">
          Flipt GPT text model usage example
        </h1>
        <p className="text-sm font-normal text-zinc-500">
          In this example, we use Flipt to switch between two different AI
          backends: a local, open-source, domain-specific vector embedding DB (
          <a
            className="text-sm text-violet-500 hover:text-violet-600"
            href="https://milvus.io/"
            target="_blank"
            rel="noreferrer"
          >
            Milvus
          </a>
          ), and OpenAI GPT-3.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <div className="lg:w-2/3 mx-auto">
          <Chat />
        </div>
      </section>
    </div>
  );
}

Home.Layout = Layout;

export default Home;
