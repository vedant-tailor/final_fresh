
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
  ];

  const userNavigation = user?.isAdmin
    ? [{ name: "Admin Dashboard", href: "/admin" }]
    : [];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-brand-700">
                  ShopVibe
                </h1>
              </Link>

              {/* Desktop navigation */}
              <nav className="hidden md:ml-8 md:flex md:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md",
                      location.pathname === item.href
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>

            {/* Desktop user menu */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Signed in as </span>
                    <span className="font-medium text-gray-900">
                      {user?.username}
                      {user?.isAdmin && (
                        <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                          Admin
                        </span>
                      )}
                    </span>
                  </div>

                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      {item.name}
                    </Link>
                  ))}

                  <Button variant="ghost" size="sm" onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <Link to="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </Button>

                  <Button
                    size="sm"
                    asChild
                  >
                    <Link to="/signup">
                      <User className="mr-2 h-4 w-4" />
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block px-3 py-2 text-base font-medium rounded-md",
                    location.pathname === item.href
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="inline-block mr-2 h-4 w-4" />
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="inline-block mr-2 h-4 w-4" />
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-900">ShopVibe</h3>
              <p className="text-sm text-gray-600">
                Your one-stop shop for premium products
              </p>
            </div>
            <div className="text-center md:text-right text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} ShopVibe. All rights reserved.</p>
              <p className="mt-1">
                <span className="text-xs">Admin account: hello.freshtemps@gmail.com / password123</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
