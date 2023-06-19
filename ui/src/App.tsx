import { Chat } from "./components/Chat";
import ChatWindow from "./components/ChatWindow";

import Guide from "./components/Guide";
import { useState } from "react";

function App() {
  let content = new Map<string, string[]>();
  content.set("stage-1", ["hello", "step1"]);

  const [currentPage, setCurrentPage] = useState(0);
  const [stage, setStage] = useState("stage-1");

  let pages = content.get(stage);
  if (!pages) {
    pages = [];
  }

  const next = () => {
    setCurrentPage(currentPage + 1);
  };

  const prev = () => {
    setCurrentPage(currentPage - 1);
  };

  let page = pages[currentPage];
  return (
    <div className="mx-auto flex h-screen flex-col">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-12 py-16">
        <div className="flex flex-col gap-12">
          <article className="prose text-gray-600 lg:prose-xl">
            <Guide stage={stage} page={page} next={next} prev={prev} />
          </article>
          <ChatWindow>
            <Chat />
          </ChatWindow>
        </div>
      </main>
    </div>
  );
}

export default App;
