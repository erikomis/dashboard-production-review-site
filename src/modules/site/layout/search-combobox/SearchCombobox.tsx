import { useSearchComboboxModel } from "./search-combobox.model";
import { SearchComboboxView } from "./search-combobox.view";
import type { SearchComboboxProps } from "./search-combobox.type";

/** Campo de busca com autocompletar (header e home). */
export const SearchCombobox = (props: SearchComboboxProps) => {
  const methods = useSearchComboboxModel(props);
  return <SearchComboboxView {...methods} />;
};
