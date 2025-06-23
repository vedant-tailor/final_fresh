
import { Product } from "@/types";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogHeader,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import { useState, useEffect } from "react";


interface ProductDetailsModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailsModal({ product, isOpen, onClose }: ProductDetailsModalProps) {
  const discountPercentage = product.discounted_price < product.actual_price
    ? Math.round(((product.actual_price - product.discounted_price) / product.actual_price) * 100)
    : 0;

  // Function to determine if the video URL is from YouTube, Google Drive, or other sources
  const getVideoEmbedUrl = (url: string) => {
    if (!url) return null;

    // YouTube URL patterns
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/)?([^&?\/]+)/;
    const youtubeMatch = url.match(youtubeRegex);

    if (youtubeMatch && youtubeMatch[5]) {
      return `https://www.youtube.com/embed/${youtubeMatch[5]}?autoplay=1`;
    }

    // Google Drive URL pattern
    const driveRegex = /^https:\/\/drive\.google\.com\/file\/d\/([^/]+)\/view/;
    const driveMatch = url.match(driveRegex);

    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }

    // If it's already an embed URL, add autoplay for YouTube
    if (url.includes('youtube.com/embed/') && !url.includes('autoplay=1')) {
      return url + (url.includes('?') ? '&' : '?') + 'autoplay=1';
    }

    // If it's already an embed URL, return as is
    if (url.includes('/embed/')) {
      return url;
    }

    // Default: return the original URL
    return url;
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 mt-4">

          <div className="relative">
            <AspectRatio ratio={16/9}>
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full rounded-lg object-cover"
              />
            </AspectRatio>
            
            {discountPercentage > 0 && (
              <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                {discountPercentage}% OFF
              </Badge>
            )}
            
            {product.video && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" fill="white" />
                </div>
              </div>
            )}
          </div>
          

          {/* Show video as primary content if available, otherwise show image */}
          {product.videoUrl ? (
            <div>
              <h4 className="font-medium mb-2">Product Video</h4>
              <div className="relative w-full pt-[56.25%] rounded-lg overflow-hidden">
                <iframe
                  className="absolute top-0 left-0 w-full h-full border-0"
                  src={getVideoEmbedUrl(product.videoUrl)}
                  title={`${product.name} video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Show image as thumbnail below video */}
              <div className="mt-4">
                <h4 className="font-medium mb-2">Product Image</h4>
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                  {discountPercentage > 0 && (
                    <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                      {discountPercentage}% OFF
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto rounded-lg object-cover"
              />
              {discountPercentage > 0 && (
                <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                  {discountPercentage}% OFF
                </Badge>
              )}
            </div>
          )}

          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Price</h4>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-2xl font-semibold">${product.discounted_price.toFixed(2)}</span>
                {product.discounted_price < product.actual_price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.actual_price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            
            <Button>Add to Cart</Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <div>Added: {new Date(product.createdAt).toLocaleDateString()}</div>
            <div>Last updated: {new Date(product.updatedAt).toLocaleDateString()}</div>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
