import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index.tsx";
import { PrimeReactProvider } from "primereact/api";
// import "primereact/resources/themes/lara-light-cyan/theme.css";
import "quill/dist/quill.core.css";

const AppProviders = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2451A0", // a strong, professional blue
          colorPrimaryActive: "#14305e", // darker shade for active elements
          colorTextBase: "#293754", // refined, deeper text color
          colorBgContainer: "#fff",
        },
        components: {
          Menu: {
            colorItemBgSelected: "#e8eef9", // slim blue for selected
            colorItemBg: "#fff",
            colorItemText: "#4F6185",
            colorItemTextHover: "#233A66",
            colorItemTextSelected: "#1d335c",
            fontSize: 15,
            borderRadius: 8,
            itemMarginInline: 0,
            itemMarginBlock: 12, // increase vertical gap between menu items
          },

          Button: {
            colorPrimary: "#233A66", // primary blue color
            colorPrimaryHover: "#233A66", // match hover with primary
          },
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrimeReactProvider>
      <Provider store={store}>
        <AppProviders />
      </Provider>
    </PrimeReactProvider>
  </StrictMode>
);

// colorBgBase:  '#ffffff',
// colorTextBase:  '#020617',
// borderRadius: 12,
