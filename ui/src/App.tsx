import { Chat } from "./components/Chat";

function App() {
  return (
    <div className="mx-auto flex h-screen flex-col">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-8 py-16">
        <div className="flex flex-col gap-12">
          <section className="flex flex-col gap-6">
            <h1 className="mx-auto text-5xl font-bold tracking-tight">
              Flipt Docs Bot
            </h1>
            <p className="font-normal leading-6 tracking-tight text-zinc-500">
              In this example, we're rolling out our own Flipt chatbot to help
              users find the answers they need without reading through all of
              our documentation.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <div className="mx-auto lg:w-2/3">
              <Chat />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
