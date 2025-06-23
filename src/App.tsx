
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProviderWithoutRouter } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProductsPage from "./pages/ProductsPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";

const queryClient = new QueryClient();

// Create a wrapper component that has access to the navigation
const AuthProviderWithRouter = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  return (
    <AuthProviderWithoutRouter navigate={navigate}>
      {children}
    </AuthProviderWithoutRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProviderWithRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProviderWithRouter>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
