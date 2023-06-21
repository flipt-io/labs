import { Chat } from "./components/Chat";
import ChatWindow from "./components/ChatWindow";
import { useState } from "react";
import { FliptApiClient } from "@flipt-io/flipt";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import BasicModule from "./components/modules/BasicModule";
import AdvancedModule from "./components/modules/AdvancedModule";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BasicModule />,
  },
  {
    path: "/advanced",
    element: <AdvancedModule />,
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
    <div className="mx-auto max-w-7xl flex min-h-screen flex-col">
      <main className="mx-auto flex justify-between min-h-screen gap-12 py-16">
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
  );
}

export default App;
