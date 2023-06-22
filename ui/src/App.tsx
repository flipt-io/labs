import { Chat } from "components/Chat";
import ChatWindow from "components/ChatWindow";
import { useState } from "react";
import { FliptApiClient } from "@flipt-io/flipt";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import Module from "components/Module";
import Nav from "components/Nav";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Module path="basic" steps={5} />,
  },
  {
    path: "/advanced",
    element: <Module path="advanced" steps={5} />,
  },
]);

function App() {
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
  });

  return (
    <div>
      <Nav />
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col">
        <main className="mx-auto flex min-h-screen justify-between gap-12 py-16">
          <div className="max-w-2/3">
            <RouterProvider router={router} />
          </div>
          {chatEnabled && (
            <div className="w-1/3">
              <ChatWindow>
                <Chat />
              </ChatWindow>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
