import { Chat } from "components/Chat";
import ChatWindow from "components/ChatWindow";
import { useState } from "react";
import { FliptApiClient } from "@flipt-io/flipt";
import { useEffect } from "react";
import { Outlet, RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import Module from "components/Module";
import Nav from "components/Nav";
import BasicModule from "components/modules/BasicModule";
import AdvancedModule from "components/modules/AdvancedModule";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/basic",
        element: <BasicModule />,
      },
      {
        path: "/advanced",
        element: <AdvancedModule />,
      },
    ],
  },
]);

function Layout() {
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
        <main className="mx-auto flex min-h-screen justify-between gap-12 px-6 py-8 lg:py-16">
          <div className="max-w-2/3">
            <Outlet />
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

function App() {
  return <RouterProvider router={router} />;
}
export default App;
