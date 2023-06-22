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
    <>
      <Nav />
      <div className="flex min-h-screen py-8 md:pl-80">
        <main className="flex gap-12 px-6">
          <Outlet />
          {chatEnabled && (
            <ChatWindow>
              <Chat />
            </ChatWindow>
          )}
        </main>
      </div>
    </>
  );
}

function App() {
  return <RouterProvider router={router} />;
}
export default App;
