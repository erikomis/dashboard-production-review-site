import { Outlet } from "@tanstack/react-router";

export const LayoutAuth = () => {
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white border rounded-xl border-stroke shadow-lg w-full max-w-md mx-4">
        <div className="px-8 py-10">
          <div className="text-center mb-8">
            <span className="text-4xl">⭐</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">ReviewStore</h1>
            <p className="text-gray-500 text-sm mt-1">
              Avalie os produtos que você ama
            </p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
