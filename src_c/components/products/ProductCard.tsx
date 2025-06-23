
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const discountPercentage = product.discounted_price < product.actual_price
    ? Math.round(((product.actual_price - product.discounted_price) / product.actual_price) * 100)
    : 0;

  const handleClick = () => {
    if (onSelect) onSelect(product);
  };

  return (
    <div
      className="cursor-pointer relative overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-[calc(50%-8px)] sm:w-[calc(33.333%-12px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-16px)]"
      onClick={handleClick}
    >
      <div className="relative aspect-[1/1.5]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {discountPercentage > 0 && (
          <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 z-10">
            {discountPercentage}% OFF
          </Badge>
        )}
        {product.videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-white/80 p-3 flex items-center justify-center transform transition-transform hover:scale-110">
              <Play className="h-6 w-6 text-blue-600 fill-blue-600" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
