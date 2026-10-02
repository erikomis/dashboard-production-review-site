import { cn } from "../utils/utils";

interface LabelProps {
  value: string;
  htmlFor?: string;
  id?: string;
  optional?: boolean;
  className?: string;
}

export const Label = ({ value, htmlFor, id, optional, className }: LabelProps) => {
  return (
    <label
      id={id}
      htmlFor={htmlFor}
      className={cn("mb-1.5 block text-sm font-semibold text-ink", className)}
    >
      {value}
      {optional && <span className="ml-1 font-normal text-muted">(opcional)</span>}
    </label>
  );
};
