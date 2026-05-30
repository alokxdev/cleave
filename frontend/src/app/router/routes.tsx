import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import GroupsPage from "../../features/groups/pages/GroupsPage";
import CreateGroupPage from "../../features/groups/pages/CreateGroupPage";
import GroupDetailsPage from "../../features/groups/pages/GroupDetailsPage";
import AppLayout from "../layout/AppLayout";

export const router = createBrowserRouter([
  // -------- Public Routes --------
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },

  // -------- Protected Routes --------
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <GroupsPage />,
      },
      {
        path: "groups/new",
        element: <CreateGroupPage />,
      },
      {
        path: "groups/:groupId",
        element: <GroupDetailsPage />,
      },
    ],
  },
]);
