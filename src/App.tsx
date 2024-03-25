import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "./App.css";
import Layout from "./componnets/layout/layout";

function App() {
  const routeConfig = createBrowserRouter(
    [
      {
        path: "/",
        element: <Layout />,
        children: [{ path: "/:id", element: <Layout /> }],
      },
    ],
    {
      basename: "/alec-babala-remake",
    }
  );
  return <RouterProvider router={routeConfig} />;
}

export default App;
