import { Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useMeQuery } from "@/shared/hooks/useMeQuery";
import { logoutService } from "@/shared/services/logout";
import { queryClient } from "@/shared/libs/react-query";
import { toast } from "react-toastify";

export const LayoutSite = () => {
  const { data: user } = useMeQuery();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutService();
      queryClient.clear();
      navigate({ to: "/login" });
      toast.info("Sessão encerrada");
    } catch {
      toast.error("Erro ao sair");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-boxdark-2">
      {/* Header */}
      <header className="bg-white dark:bg-boxdark border-b border-stroke dark:border-strokedark sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">⭐ ReviewStore</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-gray-600 hover:text-primary font-medium transition-colors dark:text-gray-400 dark:hover:text-white"
              >
                Início
              </Link>
              <Link
                to="/products"
                search={{ page: 0, q: "" }}
                className="text-gray-600 hover:text-primary font-medium transition-colors dark:text-gray-400 dark:hover:text-white"
              >
                Produtos
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-600 hidden sm:block dark:text-gray-400">
                    Olá, <span className="font-medium text-black dark:text-white">{user.name}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm bg-gray-100 hover:bg-gray-200 dark:bg-meta-4 dark:hover:bg-opacity-80 text-gray-700 dark:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-sm bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-boxdark border-t border-stroke dark:border-strokedark mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xl font-bold text-primary">⭐ ReviewStore</span>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} ReviewStore. Compartilhe sua opinião sobre produtos.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
