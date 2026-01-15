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
import { useClearNotificationsMutation, useGetNotificationCountQuery } from "../redux/apiSlices/notificationSlice";

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

/**
 * Recursively convert MENU_CONFIG into Antd Menu.items format, supporting submenus (children).
 */
function convertMenuConfigToMenuItems(config: any[]): MenuProps["items"] {
  return config.map((item) => {
    if (item.children && Array.isArray(item.children)) {
      return {
        key: item.key,
        icon: item.icon,
        label: item.label,
        children: convertMenuConfigToMenuItems(item.children),
      };
    }
    return {
      key: item.key,
      icon: item.icon,
      label: item.label,
    };
  });
}

// Key/path lookup helpers – flatten all menu items for easy lookup
function flattenMenuConfig(menuConfig: any[]): any[] {
  let flat: any[] = [];
  for (const item of menuConfig) {
    flat.push(item);
    if (item.children && Array.isArray(item.children))
      flat = flat.concat(flattenMenuConfig(item.children));
  }
  return flat;
}

const LOGOUT_ITEM = {
  key: "logout",
  label: <span>Logout</span>,
  icon: <LogoutOutlined style={{ color: "red" }} />,
};

const menuItems: MenuProps["items"] = convertMenuConfigToMenuItems(MENU_CONFIG);

const logoutMenuItem: MenuProps["items"] = [
  {
    key: LOGOUT_ITEM.key,
    label: LOGOUT_ITEM.label,
    icon: LOGOUT_ITEM.icon,
  },
];

// Build key-path lookup from all nested menu items
const allMenuItemsFlat = flattenMenuConfig(MENU_CONFIG);

// Build key-to-path mapping (only for items with 'path')
const keyToPath: Record<string, string | undefined> = {};
for (const item of allMenuItemsFlat) {
  if (item.path) keyToPath[item.key] = item.path;
}

const logoutKey = LOGOUT_ITEM.key;

const siderWidth = 240;


// Returns array of selected keys by finding the deepest match for current path
function findSelectedMenuKeys(menuConfig: any[], pathname: string): string[] {
  // Returns array of keys from root to matched menu (for openKeys/selectedKeys)
  let result: string[] = [];
  function dfs(items: any[], parents: string[]) {
    for (let item of items) {
      let p = [...parents, item.key];
      if (item.path && item.path === pathname) {
        result = p;
        return true;
      }
      if (item.children) {
        if (dfs(item.children, p)) return true;
      }
    }
    return false;
  }
  if (dfs(menuConfig, [])) return result;
  // Try prefix (non-root)
  function dfsPrefix(items: any[], parents: string[]) {
    for (let item of items) {
      let p = [...parents, item.key];
      if (item.path && item.path !== "/" && pathname.startsWith(item.path)) {
        result = p;
        return true;
      }
      if (item.children) {
        if (dfsPrefix(item.children, p)) return true;
      }
    }
    return false;
  }
  if (dfsPrefix(menuConfig, [])) return result;
  // Check root
  function dfsRoot(items: any[], parents: string[]) {
    for (let item of items) {
      let p = [...parents, item.key];
      if (item.path === "/" && pathname === "/") {
        result = p;
        return true;
      }
      if (item.children) {
        if (dfsRoot(item.children, p)) return true;
      }
    }
    return false;
  }
  if (dfsRoot(menuConfig, [])) return result;
  // Any prefix
  function dfsAnyPrefix(items: any[], parents: string[]) {
    for (let item of items) {
      let p = [...parents, item.key];
      if (item.path && pathname.startsWith(item.path)) {
        result = p;
        return true;
      }
      if (item.children) {
        if (dfsAnyPrefix(item.children, p)) return true;
      }
    }
    return false;
  }
  if (dfsAnyPrefix(menuConfig, [])) return result;
  // fallback: root level
  return [menuConfig[0]?.key ?? ""];
}

// Responsive: helper hook
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

 const {data} = useGetNotificationCountQuery(null)
 const [clearNotifications] = useClearNotificationsMutation();
 const notificationCount = data?.data?.count;


  const navigate = useNavigate();
  const location = useLocation();
  const selectedMenuKeys = React.useMemo(
    () => findSelectedMenuKeys(MENU_CONFIG, location.pathname),
    [location.pathname]
  );
  const selectedKey = selectedMenuKeys.length
    ? selectedMenuKeys[selectedMenuKeys.length - 1]
    : "";

  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // OpenKeys state for submenu management
  // Use controlled openKeys with proper onOpenChange for Sider menu (desktop)
  // But NOT for Drawer/mobile, since closing the drawer resets everything anyway
  const [openKeys, setOpenKeys] = React.useState<string[]>(
    selectedMenuKeys.length > 1 ? selectedMenuKeys.slice(0, -1) : []
  );

  // Keep openKeys in sync with the current selected route (except for mobile/drawer)
  React.useEffect(() => {
    if (!isMobile) {
      setOpenKeys(selectedMenuKeys.length > 1 ? selectedMenuKeys.slice(0, -1) : []);
    }
  }, [selectedMenuKeys, isMobile]);

  // handle menu click (works with submenu too)
  const handleMenuClick: MenuProps["onClick"] = (info) => {
    const path = keyToPath[info.key];
    if (path !== undefined) {
      navigate(path);
      setDrawerOpen(false);
    }
    // For logout etc., handled separately
  };

  const handleLogoutClick: MenuProps["onClick"] = () => {
    handleLogout();
  };

  // Submenu open change handler for desktop (Sider), enables submenu toggling
  const onMenuOpenChange = (keys: string[]) => setOpenKeys(keys);

  // --- SIDER CONTENT FACTORY ---
  // For Drawer/mobile, fallback to auto-controlled openKeys (AntD default, so omit openKeys prop)
  const SidebarContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: `calc(100% - ${isMobile ? 175 : 165}px)`,
        overflow: "auto",
        minHeight: 0,
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
          selectedKeys={selectedMenuKeys}
          {...(isMobile
            ? {}
            : {
                openKeys: openKeys,
                onOpenChange: onMenuOpenChange,
              })}
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

  // Find the label for the header (by selected key, recursively)
  function getHeaderLabelByKey(menuConfig: any[], key: string): React.ReactNode {
    let result: React.ReactNode = "";
    function dfs(items: any[]) {
      for (let item of items) {
        if (item.key === key) {
          result = item.label;
          return true;
        }
        if (item.children) {
          if (dfs(item.children)) return true;
        }
      }
      return false;
    }
    dfs(menuConfig);
    return result;
  }

  // Call clearNotifications mutation (from notificationSlice) and await for completion
  // The correct usage in component:

  const handleClearNotification = async () => {
   await  clearNotifications(null)
   navigate('/notifications');
  }

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
                height: 100,
                display: "flex",
                alignItems: "center",
                paddingInline: 24,
                fontWeight: 600,
                fontSize: 18,
                letterSpacing: 1,
                flexShrink: 0,
                justifyContent: "center",
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
                    height: 80,
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
              height: 100,
              display: "flex",
              alignItems: "center",
              paddingInline: 24,
              flexShrink: 0,
              justifyContent: "center",
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
                  height: 80,
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
            background: "#fff",
            color: "black",
            zIndex: 101,
            paddingInline: isMobile ? 12 : 32,
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
                color: "#222",
                fontSize: isMobile ? 18 : 22,
                fontWeight: 600,
              }}
            >
              {getHeaderLabelByKey(MENU_CONFIG, selectedKey) ?? ""}
            </Text>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 12 : 24,
            }}
          >
            <Button
              type="text"
              style={{ boxShadow: "none" }}
              onClick={ handleClearNotification}
            >
              <Badge
                count={
                  typeof notificationCount === "number" && notificationCount !== 0
                    ? notificationCount
                    : undefined
                }
                size="small"
                color="red"
              >
                <BellOutlined style={{ color: "#64748b", fontSize: 18 }} />
              </Badge>
            </Button>
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
            marginTop: 60,
            backgroundColor: "#f9fafb",
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
