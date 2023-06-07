import Layout from "../components/Layout";
import { Chat } from "../components/Chat";

function Home() {
  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <h1 className="text-5xl font-bold tracking-tight">
          OpenAI GPT-3 text model usage example
        </h1>
        <p className="text-base font-normal text-zinc-600">
          In this example, a simple chat bot is implemented using Next.js, API
          Routes, and OpenAI API.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-4xl font-semibold tracking-tight">AI Chat Bot:</h2>
        <div className="lg:w-2/3">
          <Chat />
        </div>
      </section>
    </div>
  );
}

Home.Layout = Layout;

export default Home;
