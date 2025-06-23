
export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface Product {
  video: any;
  id: string;
  name: string;
  description: string;
  actual_price: number;
  discounted_price: number;
  image: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}
