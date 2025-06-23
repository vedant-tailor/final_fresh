
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Play } from "lucide-react";

interface AdminProductFormProps {
  product?: Product;
  onSuccess: () => void;
}

export function AdminProductForm({ product, onSuccess }: AdminProductFormProps) {
  const isEditMode = !!product;
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    actual_price: product?.actual_price.toString() || "",
    discounted_price: product?.discounted_price.toString() || "",
    image: product?.image || "",
    videoUrl: product?.videoUrl || ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.image) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        actual_price: parseFloat(formData.actual_price),
        discounted_price: parseFloat(formData.discounted_price),
        image: formData.image,
        videoUrl: formData.videoUrl || undefined
      };

      if (isEditMode && product) {
        await api.updateProduct(product.id, productData);
        toast({
          title: "Success",
          description: "Product updated successfully"
        });
      } else {
        await api.addProduct(productData);
        toast({
          title: "Success",
          description: "Product created successfully"
        });
      }

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive"
      });
      console.error("Error saving product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          className="min-h-20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="actual_price">Regular Price *</Label>
          <Input
            id="actual_price"
            name="actual_price"
            type="number"
            step="0.01"
            min="0"
            value={formData.actual_price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discounted_price">Sale Price *</Label>
          <Input
            id="discounted_price"
            name="discounted_price"
            type="number"
            step="0.01"
            min="0"
            value={formData.discounted_price}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL *</Label>
        <Input
          id="image"
          name="image"
          type="url"
          value={formData.image}
          onChange={handleInputChange}
          required
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoUrl">Video URL (optional)</Label>
        <Input
          id="videoUrl"
          name="videoUrl"
          type="url"
          value={formData.videoUrl || ""}
          onChange={handleInputChange}
          placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Supports YouTube, Google Drive, and other video hosting platforms
        </p>
      </div>

      {formData.image && (
        <div className="border rounded-md p-2">
          <p className="text-sm font-medium mb-2">Image Preview:</p>
          <img
            src={formData.image}
            alt="Preview"
            className="max-h-40 rounded object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
            }}
          />
        </div>
      )}

      {formData.videoUrl && (
        <div className="border rounded-md p-2 mt-4">
          <p className="text-sm font-medium mb-2">Video Preview:</p>
          <div className="relative w-full pt-[56.25%] rounded-lg overflow-hidden bg-slate-100">
            <iframe
              className="absolute top-0 left-0 w-full h-full border-0"
              src={formData.videoUrl.includes('/embed/') ? formData.videoUrl :
                formData.videoUrl.includes('youtube.com') || formData.videoUrl.includes('youtu.be') ?
                  formData.videoUrl.replace(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/)?([^&?\/]+)/, 'https://www.youtube.com/embed/$1') :
                  formData.videoUrl}
              title="Video Preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditMode ? "Updating..." : "Creating..."}
            </>
          ) : (
            isEditMode ? "Update Product" : "Create Product"
          )}
        </Button>
      </div>
    </form>
  );
}
