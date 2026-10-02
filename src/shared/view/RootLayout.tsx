import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { queryClient } from "../libs/react-query";
import { useTheme } from "../hooks/useTheme";

/** Raiz da aplicação: providers, toasts e devtools (só em desenvolvimento). */
export const RootLayout = () => {
  const { resolved } = useTheme();
  return (
  <QueryClientProvider client={queryClient}>
    <Outlet />
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={resolved}
    />
    {import.meta.env.DEV && <TanStackRouterDevtools />}
  </QueryClientProvider>
  );
};
