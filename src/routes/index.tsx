import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import LoginPage from "../pages/login";
import ForgetPasswordPage from "../pages/forget-password";
import PrivateRoute from "../provider/PrivateRoutes";
import { MENU_CONFIG } from "../constant/sidebarMenue";
import ProfilePage from "../pages/profile";
import NotificationPage from "../pages/notificationPage";
import ResetPassword from "../component/resetPassword";
import Editor from "react-simple-wysiwyg";


function extractRoutes(menu: typeof MENU_CONFIG = MENU_CONFIG) {
  const routes: Array<{ path: string; element: React.ReactNode }> = [];
  function recurse(items: any[]) {
    for (const item of items) {
      if (item.children && item.children.length > 0) {
        recurse(item.children);
      } else if (item.path && item.element) {
        routes.push({
          path: item.path.replace(/^\//, ""),
          element: item.element,
        });
      }
    }
  }
  // We will skip the root dashboard ("/") since it's handled as index
  recurse(menu.filter((item) => item.path !== "/"));
  return routes;
}

const dynamicChildren = extractRoutes(MENU_CONFIG);

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forget-password",
    element: <ForgetPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/test",
    element: (
      <Editor>
      </Editor>
    ),
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: MENU_CONFIG.find((item) => item.path === "/")?.element,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "notifications",
        element: <NotificationPage />,
      },
      ...dynamicChildren,
    ],
  },
]);
