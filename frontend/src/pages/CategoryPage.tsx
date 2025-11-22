import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";

const CategoryPage = () => {
  const { fetchProductByCategory, products } = useProductStore();
  useEffect(() => {
    fetchProductByCategory("shoes");
  }, [fetchProductByCategory]);
  console.log(products);
  return <div>categoryPage</div>;
};

export default CategoryPage;
