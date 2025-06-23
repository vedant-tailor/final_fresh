import { useState } from "react";
import { Product } from "@/types";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductReelProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export function ProductReel({ products, onSelect }: ProductReelProps) {
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const hoverTimerRef = useState<NodeJS.Timeout | null>(null);

  // Filter products to only include those with videos
  const videoProducts = products.filter(product => product.videoUrl);

  // Calculate discount percentage
  const getDiscountPercentage = (product: Product) => {
    return product.discounted_price < product.actual_price
      ? Math.round(((product.actual_price - product.discounted_price) / product.actual_price) * 100)
      : 0;
  };

  // Function to determine if the video URL is from YouTube, Google Drive, or other sources
  const getVideoEmbedUrl = (url: string) => {
    if (!url) return null;

    // YouTube URL patterns
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/)?([^&?\/]+)/;
    const youtubeMatch = url.match(youtubeRegex);

    if (youtubeMatch && youtubeMatch[5]) {
      return `https://www.youtube.com/embed/${youtubeMatch[5]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeMatch[5]}&showinfo=0&rel=0&modestbranding=1`;
    }

    // Google Drive URL pattern
    const driveRegex = /^https:\/\/drive\.google\.com\/file\/d\/([^/]+)\/view/;
    const driveMatch = url.match(driveRegex);

    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }

    // If it's already an embed URL, add autoplay for YouTube
    if (url.includes('youtube.com/embed/') && !url.includes('autoplay=1')) {
      return url + (url.includes('?') ? '&' : '?') + 'autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1';
    }

    // If it's already an embed URL, return as is
    if (url.includes('/embed/')) {
      return url;
    }

    // Default: return the original URL
    return url;
  };

  const handleItemClick = (product: Product) => {
    onSelect(product);
  };

  const handleMouseEnter = (productId: string) => {
    // Clear any existing timer
    if (hoverTimerRef[0]) {
      clearTimeout(hoverTimerRef[0]);
    }

    // Set a small delay before showing the video to prevent accidental triggers
    hoverTimerRef[0] = setTimeout(() => {
      setHoveredProductId(productId);
    }, 300); // 300ms delay
  };

  const handleMouseLeave = () => {
    // Clear any pending timer
    if (hoverTimerRef[0]) {
      clearTimeout(hoverTimerRef[0]);
      hoverTimerRef[0] = null;
    }

    setHoveredProductId(null);
  };

  if (videoProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>

      <div className="flex flex-wrap gap-4">
        {videoProducts.map((product) => {
          const discountPercentage = getDiscountPercentage(product);

          return (
            <div
              key={product.id}
              className="cursor-pointer relative overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-[calc(50%-8px)] sm:w-[calc(33.333%-12px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-16px)]"
              onClick={() => handleItemClick(product)}
              onMouseEnter={() => handleMouseEnter(product.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative aspect-[1/1.5]">
                {hoveredProductId === product.id && product.videoUrl ? (
                  <div className="absolute inset-0 w-full h-full">
                    <iframe
                      src={getVideoEmbedUrl(product.videoUrl)}
                      className="w-full h-full object-cover"
                      style={{ border: 0 }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="eager"
                    ></iframe>
                  </div>
                ) : (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Discount badge */}
                {discountPercentage > 0 && (
                  <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 z-10">
                    {discountPercentage}% OFF
                  </Badge>
                )}

                {/* Play button - always show */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-white/80 p-3 flex items-center justify-center transform transition-transform hover:scale-110">
                    <Play className="h-6 w-6 text-blue-600 fill-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
