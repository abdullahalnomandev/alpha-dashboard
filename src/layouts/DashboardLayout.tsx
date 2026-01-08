import {
  Layout,
  Menu,
  Avatar,
  Typography,
  Badge,
  Drawer,
  Button,
} from "antd";
import { BellOutlined, LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import type { MenuProps } from "antd";
import React from "react";
import { MENU_CONFIG } from "../constant/sidebarMenue";
import { handleLogout } from "../services/auth.service";
import { useProfileQuery } from "../redux/apiSlices/authSlice";
import { imageUrl } from "../redux/api/baseApi";
import logo from '../assets/alpha_logo.svg'

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

function getMenuItem(
  label: React.ReactNode,
  key: string,
  icon?: React.ReactNode,
  children?: MenuProps["items"]
): Required<MenuProps>["items"][number] {
  return {
    key,
    icon,
    children,
    label,
  };
}

const LOGOUT_ITEM = {
  key: "logout",
  label: <span>Logout</span>,
  icon: <LogoutOutlined style={{ color: "red" }} />,
};

const menuItems: MenuProps["items"] = MENU_CONFIG.map((item) =>
  getMenuItem(item.label, item.key, item.icon)
);

const logoutMenuItem: MenuProps["items"] = [
  getMenuItem(LOGOUT_ITEM.label, LOGOUT_ITEM.key, LOGOUT_ITEM.icon),
];

// Dynamically generate the key to path mapping
const keyToPath: Record<string, string | undefined> = MENU_CONFIG.reduce(
  (acc, cur) => {
    if (cur.path) acc[cur.key] = cur.path;
    return acc;
  },
  {} as Record<string, string>
);

const logoutKey = LOGOUT_ITEM.key;

const siderWidth = 240;

const getSelectedKey = (pathname: string): string => {
  // Try to find an exact match
  let found = MENU_CONFIG.find((item) => item.path && item.path === pathname);
  if (found) return found.key;

  // Try to find a prefix match for non-root
  found = MENU_CONFIG.find(
    (item) => item.path && item.path !== "/" && pathname.startsWith(item.path)
  );
  if (found) return found.key;

  // If root and menu contains '/', use it
  found = MENU_CONFIG.find((item) => item.path === "/");
  if (pathname === "/" && found) return found.key;

  // Fallback: try to find the first defined path that matches at least leading slash
  found = MENU_CONFIG.find(
    (item) => item.path && pathname.startsWith(item.path)
  );
  if (found) return found.key;

  // Otherwise fallback to first entry
  return MENU_CONFIG[0]?.key ?? "";
};

// -- Responsive: helper hook --
function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  React.useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < breakpoint);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  return isMobile;
}

const DashboardLayout: React.FC = () => {
  const { data: profile } = useProfileQuery(undefined);

  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = React.useMemo(
    () => getSelectedKey(location.pathname),
    [location.pathname]
  );
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleMenuClick: MenuProps["onClick"] = (info) => {
    const path = keyToPath[info.key];
    if (path !== undefined) {
      navigate(path);
      setDrawerOpen(false);
    }
    // For logout and other actions, implement as needed here
  };

  const handleLogoutClick: MenuProps["onClick"] = () => {
    handleLogout();
  };

  // --- SIDER CONTENT FACTORY ---
  const SidebarContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: `calc(100% - ${isMobile ? 129 : 140}px)`,
        overflow: "auto",
        minHeight: 0,
        // background: "red",
        // background: "#FBFBFB",
        // marginTop: isMobile ? 0 : 10,
        // borderTopRightRadius: isMobile ? 0 : 10,
      }}
    >
      {/* Main navigation menu, grow to take up space */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{
            borderInline: 0,
            padding: 16,
            flex: 1,
            minHeight: 0,
          }}
          onClick={handleMenuClick}
          className="dashboard-menu more-y-gap-menu"
        />
      </div>
    </div>
  );

  return (
    <Layout
      style={{
        minHeight: "100vh",
        flexDirection: "row",
      }}
    >
      {/* Responsive Sidebar */}
      {isMobile ? (
        <>
          <Drawer
            placement="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            width={siderWidth}
            closable={false}
            bodyStyle={{
              padding: 0,
            }}
          >
            {/* Logo/Header */}
            <div
              style={{
                height: 64,
                display: "flex",
                alignItems: "center",
                paddingInline: 24,
                // borderBottom: "1px solid red",
                // color: "#e5e7eb",
                fontWeight: 600,
                fontSize: 18,
                letterSpacing: 1,
                flexShrink: 0,
                // borderBottomRightRadius: 10,
                justifyContent: "center", // Center the logo horizontally
              }}
            >
              <Link
                to="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  textDecoration: "none",
                }}
              >
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                    height: 40,
                    display: "block",
                  }}
                />
              </Link>
            </div>
            {SidebarContent}
            {/* Logout at the absolute bottom without scroll */}
            <div
              style={{
                flexShrink: 0,
                // no paddingBottom needed for mobile
              }}
            >
              <Menu
                mode="inline"
                selectedKeys={selectedKey === logoutKey ? [logoutKey] : []}
                items={logoutMenuItem}
                style={{
                  borderInline: 0,
                  paddingInline: 16,
                  flex: 1,
                }}
                onClick={handleLogoutClick}
              />
            </div>
          </Drawer>
        </>
      ) : (
        <Sider
          theme="light"
          width={siderWidth}
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            height: "100vh",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            transition: "width 0.2s",
          }}
        >
          {/* Logo/Header */}
          <div
            style={{
              height: 80,
              display: "flex",
              alignItems: "center",
              paddingInline: 24,
              // borderBottom: "1px solid red",
              flexShrink: 0,
              justifyContent: "center", // center the logo horizontally
            }}
          >
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                textDecoration: "none",
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{
                  height: 56,
                  display: "block",
                }}
              />
            </Link>
          </div>
          {SidebarContent}
          {/* Logout at the absolute bottom without scroll */}
          <div
            style={{
              flexShrink: 0,
              paddingBottom: isMobile ? 0 : 16,
            }}
          >
            <Menu
              mode="inline"
              selectedKeys={selectedKey === logoutKey ? [logoutKey] : []}
              items={logoutMenuItem}
              onClick={handleLogoutClick}
            />
          </div>
        </Sider>
      )}

      {/* Main Content Wrapper */}
      <Layout
        style={{
          marginLeft: isMobile ? 0 : siderWidth,
          minHeight: "100vh",
          transition: "margin-left 0.2s",
        }}
      >
        {/* Fixed/Header: with hamburger for mobile & responsive tweaks */}
        <Header
          style={{
            position: "fixed",
            left: isMobile ? 0 : siderWidth,
            right: 0,
            top: 0,
            background: "#fff", // Make header background light
            color: "black",
            zIndex: 101,
            paddingInline: isMobile ? 12 : 32,
            // borderBottom: "1px solid #e5e7eb", // Softer light border
            // borderBottom: "1px solid red", // Softer light border
            marginBottom: 10,
            display: "flex",
            height: 64,
            alignItems: "center",
            justifyContent: "space-between",
            width: isMobile ? "100%" : `calc(100% - ${siderWidth}px)`,
            transition: "left 0.2s,width 0.2s",
          }}
        >
          {/* Hamburger on mobile */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 10 : 20,
            }}
          >
            {isMobile && (
              <Button
                type="text"
                icon={<MenuOutlined style={{ color: "#222", fontSize: 22 }} />}
                onClick={() => setDrawerOpen(true)}
                style={{ marginRight: 8 }}
              />
            )}
            {/* Dynamically show selected menu label as header */}
            <Text
              style={{
                color: "#222", // Dark text for light bg
                fontSize: isMobile ? 18 : 22,
                fontWeight: 600,
              }}
            >
              {
                // Try to get selected item's label for header
                MENU_CONFIG.find((item) => item.key === selectedKey)?.label ??
                  ""
              }
            </Text>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 12 : 24,
            }}
          >
            <Link to="/notifications">
              <Badge count={0} size="small" color="#84cc16">
                <BellOutlined style={{ color: "#64748b", fontSize: 18 }} />
              </Badge>
            </Link>
            <div
              style={{
                display: isMobile ? "none" : "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
                onClick={() => navigate("/profile")}
              >
                <Avatar
                  src={
                    profile.data.profileImage.startsWith("http")
                      ? profile.data.profileImage
                      : `${imageUrl}/${profile.data.profileImage}`
                  }
                />
                <Text style={{ color: "#222", fontWeight: 500 }}>
                  {profile?.data?.name}
                </Text>
              </div>
            </div>
          </div>
        </Header>
        {/* Main Content Padding for fixed header */}
        <Content
          style={{
            // margin: 10,
            marginTop: 60, // 64px header + 10px margin
            backgroundColor: "#f9fafb",
            // borderRadius: 10,
            padding: isMobile ? 12 : 24,
            minHeight: `calc(100vh - 74px)`,
            transition: "padding 0.2s",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
      <style>
        {`
          /* Hide Sider on mobile (keep only Drawer version) */
          @media (max-width: 767px) {
            .ant-layout-sider {
              display: none !important;
            }
          }
        `}
      </style>
    </Layout>
  );
};

export default DashboardLayout;
