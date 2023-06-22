import { Outlet, RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import Nav from "components/Nav";
import Page from "components/Page";
import BasicModule from "components/modules/BasicModule";
import AdvancedModule from "components/modules/AdvancedModule";
import GitOpsModule from "components/modules/GitOpsModule";

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
  return (
    <>
      <Nav />
      <div className="flex min-h-screen py-8 md:pl-80">
        <main className="px-6">
          <Outlet />
        </main>
      </div>
    </>
  );
}

function App() {
  return <RouterProvider router={router} />;
}
export default App;
