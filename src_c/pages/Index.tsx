
import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <MainLayout>
      <div className="container mx-auto py-16">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Welcome to ShopVibe
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover premium products at unbeatable prices. Shop the latest trends in electronics, fashion, and more.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button asChild size="lg" className="text-base px-8">
              <Link to="/products">Browse Products</Link>
            </Button>
            
            {!isAuthenticated ? (
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <Link to="/login">Sign in to Shop</Link>
              </Button>
            ) : user?.isAdmin ? (
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <Link to="/admin">Admin Dashboard</Link>
              </Button>
            ) : null}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Secure Shopping</h2>
              <p className="text-gray-600">
                Shop with confidence using our secure authentication system with OTP verification.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Quality Products</h2>
              <p className="text-gray-600">
                Browse our curated selection of premium products with detailed information.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Best Deals</h2>
              <p className="text-gray-600">
                Get the best prices with our special discounts and exclusive offers.
              </p>
            </div>
          </div>
          
          <div className="mt-16 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Ready to dive in?</h2>
            <p className="text-gray-600 mb-6">
              Start exploring our wide range of products or sign in to manage your account.
            </p>
            <Button asChild size="lg">
              <Link to="/products">Explore Products</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
