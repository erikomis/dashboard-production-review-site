import type { ReactNode } from "react";

interface AuthHeadingProps {
  title: string;
  description?: ReactNode;
}

export const AuthHeading = ({ title, description }: AuthHeadingProps) => (
  <div className="mb-7">
    <h1 className="text-3xl font-bold text-ink">{title}</h1>
    {description && <p className="mt-2 leading-relaxed text-muted">{description}</p>}
  </div>
);
