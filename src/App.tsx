import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Layout from "./componnets/layout/layout";

function App() {
  const routes = createBrowserRouter(
    [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: ":id",
            element: <Layout />,
          },
        ],
      },
    ],
    { basename: "/portfolio-v4" }
  );
  return <RouterProvider router={routes} />;

  // return <Layout />;
}

export default App;
