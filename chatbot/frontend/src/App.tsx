import { Outlet, RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Page from "./components/Page";
import Guide from "./components/Guide";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import Notification from "./components/Notification";
import Banner from "./components/Banner";
import { Chat } from "./components/Chat";
import ChatWindow from "./components/ChatWindow";
import { FliptApiClient } from "@flipt-io/flipt";
import { useViewport } from "~/hooks/viewport";

const BasicGuide = () => <Guide module={"basic"} steps={5} next="advanced" />;
const AdvancedGuide = () => (
  <Guide module={"advanced"} steps={5} next="gitops" />
);
const GitOpsGuide = () => <Guide module={"gitops"} steps={8} />;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <>
            <article className="prose font-light text-gray-600">
              <Page path="intro" />
            </article>
          </>
        ),
      },
      {
        path: "/basic/:step",
        element: <BasicGuide />,
      },
      {
        path: "/basic",
        element: <BasicGuide />,
      },
      {
        path: "/advanced/:step",
        element: <AdvancedGuide />,
      },
      {
        path: "/advanced",
        element: <AdvancedGuide />,
      },
      {
        path: "/gitops/:step",
        element: <GitOpsGuide />,
      },
      {
        path: "/gitops",
        element: <GitOpsGuide />,
      },
    ],
  },
]);

function Layout() {
  const [missingOpenAIKey, setMissingAIKey] = useState(false);

  const { width } = useViewport();
  const sidebarBreakpoint = 1024;

  const [collapsedSidebar, setCollapsedSidebar] = useState(
    width < sidebarBreakpoint
  );

  const [chatEnabled, setChatEnabled] = useState(false);

  const client = new FliptApiClient({
    environment: "http://localhost:8080",
  });

  useEffect(() => {
    if (width < sidebarBreakpoint) {
      setCollapsedSidebar(true);
    }
  }, [width]);

  useEffect(() => {
    const checkChatEnabled = async () => {
      try {
        const flag = await client.flags.get("default", "chat-enabled");
        setChatEnabled(flag.enabled);
      } catch (e) {
        // ignore
      }
    };

    checkChatEnabled();
    const interval = setInterval(() => {
      checkChatEnabled();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // fetch from /config endpoint on backend to get config
    // and check if openai_api_key is set
    fetch("http://localhost:9000/config")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status}; ${response.text}`
          );
        }
        return response.json();
      })
      .then((data) => {
        if (!data.openai_api_key || data.openai_api_key === "") {
          setMissingAIKey(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="grid grid-flow-col">
      <Sidebar
        collapsed={collapsedSidebar}
        setCollapsed={setCollapsedSidebar}
      />

      <div className="flex h-screen flex-col">
        <Banner
          text="This application will not render correctly on small screens"
          className="lg:hidden"
        />
        <div className="overflow-y-scroll px-10">
          <main className="py-8">
            {missingOpenAIKey && (
              <Notification type="warning" title="Missing OpenAI API Key">
                <>
                  <code>OPENAI_API_KEY</code> environment variable not set. Set
                  before continuing for a better experience.
                </>
              </Notification>
            )}
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>

      {chatEnabled && (
        <ChatWindow>
          <Chat />
        </ChatWindow>
      )}
    </div>
  );
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
