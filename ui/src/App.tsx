import { Chat } from "./components/Chat";
import ChatWindow from "./components/ChatWindow";
import Guide from "./components/Guide";
import { useState } from "react";
import { FliptApiClient } from "@flipt-io/flipt";
import { useEffect } from "react";

function App() {
  let content = ["hello", "step1", "step2", "step3", "step4"];

  const [currentPage, setCurrentPage] = useState(0);

  const [chatEnabled, setChatEnabled] = useState(false);

  const client = new FliptApiClient({
    environment: "http://localhost:8080",
  });

  useEffect(() => {
    const checkChatEnabled = async () => {
      try {
        const flag = await client.flags.get("default", "chat-enabled");
        setChatEnabled(flag.enabled);
      } catch (e) {
        console.log(e);
      }
    };
    checkChatEnabled();
  }, [client.flags]);

  const next = () => {
    setCurrentPage(currentPage + 1);
  };

  const prev = () => {
    setCurrentPage(currentPage - 1);
  };

  let page = content[currentPage];
  console.log(currentPage);
  return (
    <div className="mx-auto flex h-screen flex-col">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-12 py-16">
        <div className="flex flex-col gap-12">
          <article className="prose text-gray-600 lg:prose-xl">
            <Guide
              stage="stage-1"
              page={page}
              hasNext={currentPage < content.length - 1}
              hasPrev={currentPage > 0}
              next={next}
              prev={prev}
            />
          </article>
          {chatEnabled && (
            <ChatWindow>
              <Chat />
            </ChatWindow>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
