
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { ProductReel } from "./ProductReel";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ProductDetailsModal } from "./ProductDetailsModal";
import { Search } from "lucide-react";

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await api.getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    result = result.filter(product =>
      product.discounted_price >= priceRange[0] &&
      product.discounted_price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.discounted_price - b.discounted_price);
        break;
      case "price-desc":
        result.sort((a, b) => b.discounted_price - a.discounted_price);
        break;
      case "newest":
        result.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default: // featured or any other value
        // No sorting, keep original order
        break;
    }

    setFilteredProducts(result);
  }, [products, searchTerm, sortBy, priceRange]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSortBy("featured");
    setPriceRange([0, 2000]);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  
  // Function to distribute products into columns for masonry layout
  const getColumnsData = (columnCount: number) => {
    const columns: Product[][] = Array.from({ length: columnCount }, () => []);
    
    filteredProducts.forEach((product, index) => {
      // Distribute products among columns
      columns[index % columnCount].push(product);
    });
    
    return columns;
  };
  



  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <div className="p-4 bg-card rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Filters & Search</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset button */}
          <Button variant="outline" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </div>

        {/* Price range */}
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">
            Price: ${priceRange[0]} - ${priceRange[1]}
          </h3>
          <Slider
            defaultValue={[0, 2000]}
            max={2000}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
          />
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex flex-wrap gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-[calc(50%-8px)] sm:w-[calc(33.333%-12px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-16px)] aspect-[1/1.5] rounded-lg bg-muted animate-pulse"></div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold">No products found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters or search term
          </p>
        </div>
      ) : (

        // Masonry layout - responsive grid with variable height cards
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {getColumnsData(4).map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-4">
              {column.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 

        <>
          {/* Featured Videos Section */}
          {filteredProducts.some(product => product.videoUrl) && (
            <div className="mb-12">
              <ProductReel
                products={filteredProducts}
                onSelect={handleProductSelect}
              />
            </div>
          )}

          {/* All Products Grid */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">All Products</h2>
            <div className="flex flex-wrap gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
(product_style_update)
                  onSelect={handleProductSelect}
                />
              ))}
            </div>

          ))}
        </div>

          </div>
        </>
 (product_style_update)
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
