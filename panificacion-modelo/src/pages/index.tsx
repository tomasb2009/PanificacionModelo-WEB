import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import ErrorDetail from "./ErrorDetail";
import Home from "./Home";
import Products from "./Products";
import Info from "./Info";
import Login from "./Login";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminPanel from "./AgregarProducto/AdminPanel";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: (
      <Layout>
        <ErrorDetail />
      </Layout>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/productos",
        element: <Products />,
      },
      {
        path: "/informacion",
        element: <Info />,
      },
      {
        path: "/agregarProductos",
        element: (
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
