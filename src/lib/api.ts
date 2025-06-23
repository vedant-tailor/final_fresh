import { Product, User } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// This is a mock API service for demonstration purposes
// In a real application, these would make actual HTTP requests to your backend

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    actual_price: 299.99,
    discounted_price: 249.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Smart Watch Series X",
    description: "Advanced smartwatch with health tracking features",
    actual_price: 399.99,
    discounted_price: 349.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    videoUrl: "https://www.youtube.com/watch?v=9Dg-Gd3QJbE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Ultra HD Camera",
    description: "Professional-grade camera for stunning photography",
    actual_price: 1299.99,
    discounted_price: 1099.99,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    name: "Portable Bluetooth Speaker",
    description: "Waterproof speaker with impressive sound quality",
    actual_price: 129.99,
    discounted_price: 99.99,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    videoUrl: "https://drive.google.com/file/d/1Ks8aKRvSZAjJlUUzlV5BLg9sEBXPVbEp/view",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "5",
    name: "Gaming Laptop Pro",
    description: "High-performance gaming laptop with RTX graphics",
    actual_price: 1999.99,
    discounted_price: 1799.99,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    videoUrl: "https://www.youtube.com/watch?v=9Dg-Gd3QJbE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "6",
    name: "Ergonomic Office Chair",
    description: "Comfortable chair designed for long work hours",
    actual_price: 299.99,
    discounted_price: 249.99,
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "7",
    name: "Fitness Tracker Band",
    description: "Track your workouts, sleep, and health metrics with this advanced fitness band",
    actual_price: 149.99,
    discounted_price: 129.99,
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    videoUrl: "https://www.youtube.com/watch?v=9Dg-Gd3QJbE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "8",
    name: "Professional DSLR Camera",
    description: "Capture stunning photos and videos with this professional-grade DSLR camera",
    actual_price: 1499.99,
    discounted_price: 1299.99,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    videoUrl: "https://drive.google.com/file/d/1Ks8aKRvSZAjJlUUzlV5BLg9sEBXPVbEp/view",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockUsers: Record<string, User> = {
  "user@example.com": {
    id: "1",
    username: "regularuser",
    email: "user@example.com",
    isAdmin: false
  },
  "admin@example.com": {
    id: "2",
    username: "adminuser",
    email: "admin@example.com",
    isAdmin: true
  }
};

// Local storage keys
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const api = {
  // Auth methods
  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (!data.session) {
        throw new Error("No session returned from login");
      }

      // Store session for persistence
      localStorage.setItem(TOKEN_KEY, data.session.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          username: data.user.user_metadata?.username || email.split('@')[0],
          isAdmin: data.user.email === "hello.freshtemps@gmail.com"
        },
        token: data.session.access_token
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  signup: async (username: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        throw error;
      }

      // Check if email confirmation is required
      if (!data.session) {
        // Return a special response indicating email verification is needed
        return {
          user: {
            id: data.user!.id,
            email: data.user!.email!,
            username: username,
            isAdmin: data.user!.email === "hello.freshtemps@gmail.com"
          },
          token: null,
          emailVerificationRequired: true
        };
      }

      // If auto-confirmed, store session for persistence
      localStorage.setItem(TOKEN_KEY, data.session.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      return {
        user: {
          id: data.user!.id,
          email: data.user!.email!,
          username: username,
          isAdmin: data.user!.email === "hello.freshtemps@gmail.com"
        },
        token: data.session.access_token,
        emailVerificationRequired: false
      };
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  resendVerificationEmail: async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Resend verification email error:", error);
      throw error;
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw error;
    }
  },

  updatePassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw error;
    }
  },

  getCurrentUser: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);

    if (!token || !userJson) {
      return { user: null, token: null };
    }

    try {
      const userData = JSON.parse(userJson);
      // Ensure the isAdmin flag is set correctly based on email
      const user: User = {
        id: userData.id,
        email: userData.email,
        username: userData.user_metadata?.username || userData.email.split('@')[0],
        isAdmin: userData.email === "hello.freshtemps@gmail.com"
      };
      return { user, token };
    } catch (e) {
      return { user: null, token: null };
    }
  },

  // Product methods
  getProducts: async (): Promise<Product[]> => {
    await delay(500);
    return [...mockProducts];
  },

  getProductById: async (id: string): Promise<Product> => {
    await delay(300);
    const product = mockProducts.find(p => p.id === id);
    if (!product) throw new Error("Product not found");
    return { ...product };
  },

  addProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    await delay(800);
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockProducts.push(newProduct);
    return newProduct;
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<Product> => {
    await delay(800);
    const index = mockProducts.findIndex(p => p.id === id);

    if (index === -1) throw new Error("Product not found");

    const updatedProduct = {
      ...mockProducts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    mockProducts[index] = updatedProduct;
    return { ...updatedProduct };
  },

  deleteProduct: async (id: string): Promise<void> => {
    await delay(800);
    const index = mockProducts.findIndex(p => p.id === id);

    if (index === -1) throw new Error("Product not found");

    mockProducts.splice(index, 1);
  }
};
