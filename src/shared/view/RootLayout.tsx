import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { queryClient } from "../libs/react-query";

/** Raiz da aplicação: providers, toasts e devtools (só em desenvolvimento). */
export const RootLayout = () => (
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
      theme="light"
    />
    {import.meta.env.DEV && <TanStackRouterDevtools />}
  </QueryClientProvider>
);
