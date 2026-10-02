import { useCategoryModel } from "./category.model";
import { CategoryView } from "./category.view";

const CategoryPage = () => {
  const methods = useCategoryModel();
  return <CategoryView {...methods} />;
};

export default CategoryPage;
