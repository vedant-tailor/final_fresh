
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductGrid } from "@/components/products/ProductGrid";

const ProductsPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Our Products</h1>
        <ProductGrid />
      </div>
    </MainLayout>
  );
};

export default ProductsPage;
