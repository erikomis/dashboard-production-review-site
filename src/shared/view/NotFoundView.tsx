import { Link } from "@tanstack/react-router";

interface NotFoundViewProps {
  path: string;
  message: string;
}

export const NotFoundView = ({ path, message }: NotFoundViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 gap-4">
      <span className="text-6xl">😕</span>
      <h2 className="text-2xl font-semibold text-gray-700">Página não encontrada</h2>
      <Link to={path} className="text-primary hover:underline font-medium">
        {message}
      </Link>
    </div>
  );
};
