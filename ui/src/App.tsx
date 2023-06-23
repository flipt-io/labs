import { Outlet, RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import Nav from "components/Nav";
import Page from "components/Page";
import BasicModule from "components/modules/BasicModule";
import AdvancedModule from "components/modules/AdvancedModule";
import GitOpsModule from "components/modules/GitOpsModule";
import Footer from "components/Footer";
import { useEffect, useState } from "react";
import Notification from "components/Notification";

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
        path: "/basic",
        element: <BasicModule />,
      },
      {
        path: "/advanced",
        element: <AdvancedModule />,
      },
      {
        path: "/gitops",
        element: <GitOpsModule />,
      },
    ],
  },
]);

function Layout() {
  const [missingOpenAIKey, setMissingAIKey] = useState(false);

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
        if (data.openai_api_key === "") {
          setMissingAIKey(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <Nav />
      <div className="flex min-h-screen flex-col py-8 md:pl-80 md:pr-96">
        <main className="px-6">
          <Outlet />
        </main>
        <Footer />
      </div>
      {missingOpenAIKey && (
        <Notification type="warning" title="Missing OpenAI API Key">
          <>
            <code>OPENAI_API_KEY</code> environment variable not set. Set before
            continuing for a better experience.
          </>
        </Notification>
      )}
    </>
  );
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
