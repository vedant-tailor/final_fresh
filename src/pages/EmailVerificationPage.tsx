import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { EmailVerification } from "@/components/auth/EmailVerification";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

const EmailVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  
  useEffect(() => {
    // If user is already logged in, redirect to home
    if (isAuthenticated) {
      navigate("/");
      return;
    }
    
    // Get email from location state or use a default
    const emailFromState = location.state?.email;
    if (emailFromState) {
      setEmail(emailFromState);
    } else {
      // If no email in state, redirect to signup
      navigate("/signup");
    }
  }, [isAuthenticated, navigate, location.state]);
  
  const handleResendEmail = async () => {
    if (!email) return;
    await api.resendVerificationEmail(email);
  };
  
  return (
    <MainLayout>
      <div className="max-w-md mx-auto py-8">
        <EmailVerification 
          email={email} 
          onResendEmail={handleResendEmail} 
        />
      </div>
    </MainLayout>
  );
};

export default EmailVerificationPage;
