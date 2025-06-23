
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { AdminProductList } from "@/components/admin/AdminProductList";
import { useAuth } from "@/contexts/AuthContext";

const AdminDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect non-admin users
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!user?.isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);
  
  if (!isAuthenticated || !user?.isAdmin) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <AdminProductList />
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
