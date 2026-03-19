import { useProductDetailModel } from "./product-detail.model";
import { ProductDetailView } from "./product-detail.view";

const ProductDetailPage = () => {
  const methods = useProductDetailModel();
  return <ProductDetailView {...methods} />;
};

export default ProductDetailPage;
