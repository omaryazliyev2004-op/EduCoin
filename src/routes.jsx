import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Teachers from "./pages/Teachers";
import Students from "./pages/Students";
import Settings from "./pages/Settings";
import Class from "./pages/Class";
import Sovgalar from "./pages/Sovgalar";
import ProtectedRoute from "./components/ProtectRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "teachers", element: <Teachers /> },
      { path: "classes", element: <Class /> },
      { path: "groups", element: <Class /> },
      { path: "students", element: <Students /> },
      { path: "sovgalar", element: <Sovgalar /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);
