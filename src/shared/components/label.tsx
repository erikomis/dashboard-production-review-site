interface LabelProps {
  value: string;
  htmlFor?: string;
}

export const Label = ({ value, htmlFor }: LabelProps) => {
  return (
    <label
      className="mb-2.5 block font-medium text-black dark:text-white"
      htmlFor={htmlFor}
    >
      {value}
    </label>
  );
};
